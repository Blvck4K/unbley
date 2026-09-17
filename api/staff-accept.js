import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);
const hashToken = (token) => crypto.createHash('sha256').update(String(token || '')).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const invitationToken = req.body?.token;
  if (!token || !invitationToken) return json(res, 400, { error: 'Sign in and provide an invitation token.' });
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return json(res, 401, { error: 'Invalid session.' });

  const { data: invitation, error: invitationError } = await supabase.from('staff_invitations').select('id, store_id, email, full_name, role_id, status, expires_at').eq('token_hash', hashToken(invitationToken)).maybeSingle();
  if (invitationError) return json(res, 500, { error: 'Could not read invitation.' });
  if (!invitation || invitation.status !== 'invited' || new Date(invitation.expires_at) <= new Date()) return json(res, 400, { error: 'This invitation is invalid or has expired.' });
  if (String(authData.user.email || '').toLowerCase() !== String(invitation.email).toLowerCase()) return json(res, 403, { error: 'Sign in with the email address that received this invitation.' });

  const { data: existing } = await supabase.from('store_members').select('id, status').eq('store_id', invitation.store_id).eq('user_id', authData.user.id).maybeSingle();
  if (existing?.status === 'active') return json(res, 409, { error: 'You are already a member of this store.' });
  const { error: memberError } = existing
    ? await supabase.from('store_members').update({ role_id: invitation.role_id, status: 'active', joined_at: new Date().toISOString() }).eq('id', existing.id)
    : await supabase.from('store_members').insert({ store_id: invitation.store_id, user_id: authData.user.id, role_id: invitation.role_id, status: 'active' });
  if (memberError) return json(res, 500, { error: 'Could not activate store membership.' });
  await supabase.from('staff_invitations').update({ status: 'accepted', accepted_by: authData.user.id, accepted_at: new Date().toISOString() }).eq('id', invitation.id);
  await supabase.from('staff_activity_logs').insert({ store_id: invitation.store_id, actor_user_id: authData.user.id, action: 'staff.accepted_invitation', resource_type: 'staff_invitation', resource_id: invitation.id });
  return json(res, 200, { ok: true, storeId: invitation.store_id });
}
