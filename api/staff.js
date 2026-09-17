import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../lib/notifications/resend.js';
import { SYSTEM_ROLE_DEFINITIONS } from '../src/lib/staffPermissions.js';

const json = (res, status, body) => res.status(status).json(body);
const db = () => createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cleanName = (value) => String(value || '').trim().replace(/[^a-zA-Z0-9 .'-]/g, '').slice(0, 120);

const getAuthUser = async (supabase, req) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error ? null : data.user;
};

const ensureSystemRoles = async (supabase, storeId) => {
  const { data: existing, error } = await supabase.from('store_roles').select('*').eq('store_id', storeId);
  if (error) throw error;
  if ((existing || []).length) return existing;
  const { data, error: insertError } = await supabase.from('store_roles').insert(
    SYSTEM_ROLE_DEFINITIONS.map((role) => ({ store_id: storeId, name: role.name, description: role.description, permissions: role.permissions, is_system: true }))
  ).select('*');
  if (insertError) throw insertError;
  return data || [];
};

const requireOwner = async (supabase, user, storeId) => {
  if (!user || user.id !== storeId) return false;
  const { data, error } = await supabase.from('brand_profiles').select('id, brand_name, plan_id, plan_ends_at').eq('id', storeId).maybeSingle();
  if (error || !data) return false;
  return Boolean(data.plan_id === 'business' && data.plan_ends_at && new Date(data.plan_ends_at) > new Date());
};

const logActivity = async (supabase, values) => {
  await supabase.from('staff_activity_logs').insert(values);
};

export default async function handler(req, res) {
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(res, 503, { error: 'Staff service is not configured.' });
  const supabase = db();
  const user = await getAuthUser(supabase, req);
  const storeId = req.query?.storeId || req.body?.storeId || user?.id;
  if (!user || !storeId || !(await requireOwner(supabase, user, storeId))) return json(res, 403, { error: 'Only an active Business store owner can manage staff.' });

  try {
    const roles = await ensureSystemRoles(supabase, storeId);
    if (req.method === 'GET') {
      const [{ data: members, error: memberError }, { data: invitations, error: inviteError }] = await Promise.all([
        supabase.from('store_members').select('id, user_id, role_id, status, joined_at, last_activity_at, store_roles(id, name, description, permissions)').eq('store_id', storeId).neq('status', 'removed').order('joined_at', { ascending: false }),
        supabase.from('staff_invitations').select('id, email, full_name, role_id, status, expires_at, created_at, store_roles(name)').eq('store_id', storeId).in('status', ['invited', 'accepted']).order('created_at', { ascending: false })
      ]);
      if (memberError || inviteError) throw memberError || inviteError;
      const userIds = (members || []).map((member) => member.user_id);
      const profiles = await Promise.all(userIds.map(async (id) => {
        const { data } = await supabase.auth.admin.getUserById(id);
        return data?.user ? { id, email: data.user.email, name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '' } : { id };
      }));
      return json(res, 200, { roles, members: (members || []).map((member) => ({ ...member, user: profiles.find((profile) => profile.id === member.user_id) || { id: member.user_id } })), invitations: invitations || [] });
    }

    if (req.method === 'POST') {
      if (req.body?.action === 'resendInvitation') {
        const invitationId = String(req.body?.invitationId || '');
        const token = crypto.randomBytes(32).toString('hex');
        const { data: invitation, error: invitationError } = await supabase.from('staff_invitations').select('id, email, full_name, role_id, store_roles(name)').eq('id', invitationId).eq('store_id', storeId).eq('status', 'invited').maybeSingle();
        if (invitationError || !invitation) return json(res, 404, { error: 'Invitation not found.' });
        const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
        const { error: updateError } = await supabase.from('staff_invitations').update({ token_hash: hashToken(token), expires_at: expiresAt }).eq('id', invitationId).eq('store_id', storeId);
        if (updateError) throw updateError;
        const origin = process.env.APP_URL || process.env.VITE_APP_URL || 'https://unbley.com';
        const acceptUrl = `${origin}/staff-invite?token=${token}`;
        await sendEmail({ to: invitation.email, subject: 'Your Unbley staff invitation was resent', html: `<p>Hi ${invitation.full_name},</p><p>Your invitation to join a Unbley store as ${invitation.store_roles?.name || 'staff'} is ready.</p><p><a href="${acceptUrl}">Accept invitation</a></p><p>This invitation expires in 7 days.</p>`, text: `Accept your Unbley staff invitation here: ${acceptUrl}. This invitation expires in 7 days.` }).catch(() => null);
        await logActivity(supabase, { store_id: storeId, actor_user_id: user.id, action: 'staff.invitation_resent', resource_type: 'staff_invitation', resource_id: invitationId });
        return json(res, 200, { ok: true, expiresAt });
      }
      if (req.body?.action === 'createRole') {
        const name = cleanName(req.body?.name);
        const description = cleanName(req.body?.description);
        const requestedPermissions = Array.isArray(req.body?.permissions) ? req.body.permissions.map(String) : [];
        const forbiddenPermissions = ['ownership.transfer', 'store.delete', 'payout.manage', 'subscription.manage', 'security.manage'];
        const permissions = requestedPermissions.filter((permission) => !forbiddenPermissions.includes(permission));
        if (!name || !permissions.length) return json(res, 400, { error: 'Role name and at least one safe permission are required.' });
        const { data: role, error } = await supabase.from('store_roles').insert({ store_id: storeId, name, description, permissions, is_system: false }).select('*').single();
        if (error) return json(res, error.code === '23505' ? 409 : 500, { error: error.code === '23505' ? 'A role with this name already exists.' : error.message });
        await logActivity(supabase, { store_id: storeId, actor_user_id: user.id, action: 'staff.role_created', resource_type: 'store_role', resource_id: role.id, new_value: { name, permissions } });
        return json(res, 201, { role });
      }
      const email = normalizeEmail(req.body?.email);
      const fullName = cleanName(req.body?.fullName);
      const roleId = String(req.body?.roleId || '');
      const role = roles.find((item) => item.id === roleId);
      if (!email || !/^\S+@\S+\.\S+$/.test(email) || !fullName || !role) return json(res, 400, { error: 'Name, valid email, and role are required.' });
      const { data: authUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const invitedUser = (authUsers?.users || []).find((candidate) => normalizeEmail(candidate.email) === email);
      if (invitedUser) {
        const { data: existingMember } = await supabase.from('store_members').select('id, status').eq('store_id', storeId).eq('user_id', invitedUser.id).maybeSingle();
        if (existingMember?.status === 'active') return json(res, 409, { error: 'This staff member already has an active membership.' });
      }
      const { data: existingInvite } = await supabase.from('staff_invitations').select('id').eq('store_id', storeId).eq('email', email).eq('status', 'invited').gt('expires_at', new Date().toISOString()).maybeSingle();
      if (existingInvite) return json(res, 409, { error: 'An active invitation already exists for this email.' });
      const token = crypto.randomBytes(32).toString('hex');
      const { data: invitation, error } = await supabase.from('staff_invitations').insert({ store_id: storeId, email, full_name: fullName, role_id: role.id, token_hash: hashToken(token), expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), invited_by: user.id }).select('id, email, full_name, expires_at').single();
      if (error) throw error;
      const origin = process.env.APP_URL || process.env.VITE_APP_URL || 'https://unbley.com';
      const acceptUrl = `${origin}/staff-invite?token=${token}`;
      await sendEmail({ to: email, subject: 'You have been invited to join a Unbley store', html: `<p>Hi ${fullName},</p><p>You have been invited to join a Unbley store as ${role.name}.</p><p><a href="${acceptUrl}">Accept invitation</a></p><p>This invitation expires in 7 days.</p>`, text: `You have been invited to join a Unbley store as ${role.name}. Accept here: ${acceptUrl}. This invitation expires in 7 days.` }).catch(() => null);
      await logActivity(supabase, { store_id: storeId, actor_user_id: user.id, action: 'staff.invited', resource_type: 'staff_invitation', resource_id: invitation.id, new_value: { email, fullName, role: role.name } });
      return json(res, 201, { invitation });
    }

    const memberId = req.body?.memberId;
    if (!memberId) return json(res, 400, { error: 'Staff member is required.' });
    const { data: member, error: memberError } = await supabase.from('store_members').select('id, user_id, role_id, status').eq('id', memberId).eq('store_id', storeId).maybeSingle();
    if (memberError || !member) return json(res, 404, { error: 'Staff member not found.' });
    if (req.method === 'PATCH') {
      const nextStatus = req.body?.status;
      const updates = {};
      if (['active', 'suspended', 'removed'].includes(nextStatus)) updates.status = nextStatus;
      if (req.body?.roleId && roles.some((role) => role.id === req.body.roleId)) updates.role_id = req.body.roleId;
      if (!Object.keys(updates).length) return json(res, 400, { error: 'No valid staff changes supplied.' });
      const { data: updated, error } = await supabase.from('store_members').update(updates).eq('id', memberId).eq('store_id', storeId).select('id, user_id, role_id, status, joined_at, last_activity_at').single();
      if (error) throw error;
      await logActivity(supabase, { store_id: storeId, actor_user_id: user.id, action: 'staff.updated', resource_type: 'store_member', resource_id: memberId, previous_value: member, new_value: updates });
      return json(res, 200, { member: updated });
    }
    await supabase.from('store_members').update({ status: 'removed' }).eq('id', memberId).eq('store_id', storeId);
    await logActivity(supabase, { store_id: storeId, actor_user_id: user.id, action: 'staff.removed', resource_type: 'store_member', resource_id: memberId, previous_value: member, new_value: { status: 'removed' } });
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Staff request failed.' });
  }
}
