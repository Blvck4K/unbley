import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);
const db = () => createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const getUser = async (supabase, req) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error ? null : data.user;
};

const logAccountAction = (supabase, userId, action, newValue = {}) => supabase.from('staff_activity_logs').insert({ store_id: userId, actor_user_id: userId, action, resource_type: 'account', resource_id: userId, new_value: newValue });

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(res, 503, { error: 'Account service is not configured.' });
  const supabase = db();
  const user = await getUser(supabase, req);
  if (!user) return json(res, 401, { error: 'Authentication required.' });
  const action = req.body?.action;
  const confirmation = String(req.body?.confirmation || '');
  const { data: profile, error: profileError } = await supabase.from('brand_profiles').select('id, brand_name, owner_name, email_address, store_active').eq('id', user.id).maybeSingle();
  if (profileError || !profile) return json(res, 404, { error: 'Store account not found.' });

  if (action === 'setActive') {
    const active = Boolean(req.body?.active);
    const { error } = await supabase.from('brand_profiles').update({ store_active: active, deactivated_at: active ? null : new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', user.id);
    if (error) return json(res, 500, { error: 'Could not update store status.' });
    await logAccountAction(supabase, user.id, active ? 'account.store_activated' : 'account.store_deactivated', { active });
    return json(res, 200, { ok: true, store_active: active });
  }

  if (action === 'requestOwnershipTransfer') {
    const targetEmail = normalizeEmail(req.body?.targetEmail);
    if (!/^\S+@\S+\.\S+$/.test(targetEmail) || targetEmail === normalizeEmail(user.email)) return json(res, 400, { error: 'Enter a valid different owner email.' });
    const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const target = (users?.users || []).find((candidate) => normalizeEmail(candidate.email) === targetEmail);
    const { data: transfer, error } = await supabase.from('store_ownership_transfers').insert({ store_id: user.id, current_owner_id: user.id, target_email: targetEmail, target_user_id: target?.id || null, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }).select('id, target_email, expires_at').single();
    if (error) return json(res, 500, { error: 'Could not create ownership transfer request.' });
    await supabase.from('brand_profiles').update({ ownership_transfer_email: targetEmail, updated_at: new Date().toISOString() }).eq('id', user.id);
    await logAccountAction(supabase, user.id, 'account.ownership_transfer_requested', { targetEmail, transferId: transfer.id });
    return json(res, 200, { ok: true, transfer });
  }

  if (action === 'deleteStore') {
    if (confirmation !== 'DELETE STORE') return json(res, 400, { error: 'Type DELETE STORE to confirm permanent deletion.' });
    const { error } = await supabase.from('brand_profiles').delete().eq('id', user.id);
    if (error) return json(res, 500, { error: `Store deletion failed: ${error.message}` });
    await supabase.auth.admin.deleteUser(user.id);
    return json(res, 200, { ok: true, deleted: true });
  }

  return json(res, 400, { error: 'Unsupported account action.' });
}
