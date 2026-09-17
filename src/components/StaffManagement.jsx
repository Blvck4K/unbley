import React, { useEffect, useState } from 'react';
import { MoreVertical, RefreshCw, ShieldCheck, UserPlus, Trash2, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PERMISSION_GROUPS } from '../lib/staffPermissions';

const emptyForm = { fullName: '', email: '', roleId: '' };

export default function StaffManagement({ isBusinessPlan }) {
  const [staff, setStaff] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadStaff = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch('/api/staff', { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load staff.');
      setStaff(payload.members || []);
      setInvitations(payload.invitations || []);
      setRoles(payload.roles || []);
      setForm((current) => ({ ...current, roleId: current.roleId || payload.roles?.[0]?.id || '' }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isBusinessPlan) loadStaff();
  }, [isBusinessPlan]);

  const submitInvitation = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token}` },
        body: JSON.stringify(form)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not send invitation.');
      setForm(emptyForm);
      setShowAdd(false);
      setNotice('Invitation sent successfully.');
      await loadStaff();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateMember = async (memberId, changes) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch('/api/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token}` }, body: JSON.stringify({ memberId, ...changes }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not update staff member.');
      await loadStaff();
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const resendInvitation = async (invitationId) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token}` }, body: JSON.stringify({ action: 'resendInvitation', invitationId }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not resend invitation.');
      setNotice('Invitation resent successfully.');
      await loadStaff();
    } catch (resendError) { setError(resendError.message); }
  };

  const createRole = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token}` }, body: JSON.stringify({ action: 'createRole', ...roleForm }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not create role.');
      setRoleForm({ name: '', description: '', permissions: [] });
      setShowRole(false);
      await loadStaff();
    } catch (roleError) {
      setError(roleError.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permission) => setRoleForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));

  if (!isBusinessPlan) return null;

  return (
    <div className="staff-management-panel">
      <div className="staff-management-panel__toolbar">
        <div>
          <p className="staff-management-panel__eyebrow"><ShieldCheck size={14} /> Business workspace</p>
          <p className="staff-management-panel__hint">Invite teammates with store-scoped roles. The owner account is protected and is not listed as removable staff.</p>
        </div>
        <div className="staff-management-panel__actions">
          <button type="button" className="unbley-btn-white" onClick={loadStaff} disabled={loading} title="Refresh staff"><RefreshCw size={14} className={loading ? 'staff-spin' : ''} /> Refresh</button>
          <button type="button" className="unbley-btn-white" onClick={() => setShowRole((open) => !open)}>Create role</button>
          <button type="button" className="unbley-btn-black" onClick={() => setShowAdd((open) => !open)}><UserPlus size={14} /> Add Staff</button>
        </div>
      </div>

      {notice && <p className="staff-management-notice">{notice}</p>}
      {error && <p className="staff-management-error">{error}</p>}

      {showAdd && (
        <form className="staff-invite-form" onSubmit={submitInvitation}>
          <div className="unbley-form-grid-2">
            <div className="unbley-form-group"><label className="unbley-form-label" htmlFor="staff-full-name">Full name</label><input id="staff-full-name" className="unbley-form-input" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></div>
            <div className="unbley-form-group"><label className="unbley-form-label" htmlFor="staff-email">Email address</label><input id="staff-email" type="email" className="unbley-form-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
          </div>
          <div className="unbley-form-group"><label className="unbley-form-label" htmlFor="staff-role">Role</label><select id="staff-role" className="unbley-form-input" value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })} required><option value="">Select a role</option>{roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></div>
          <div className="staff-invite-form__actions"><button type="button" className="unbley-btn-white" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="unbley-btn-black" disabled={saving}>{saving ? 'Sending...' : 'Send invitation'}</button></div>
        </form>
      )}

      {showRole && (
        <form className="staff-invite-form" onSubmit={createRole}>
          <div className="unbley-form-grid-2">
            <div className="unbley-form-group"><label className="unbley-form-label" htmlFor="staff-role-name">Role name</label><input id="staff-role-name" className="unbley-form-input" value={roleForm.name} onChange={(event) => setRoleForm({ ...roleForm, name: event.target.value })} required /></div>
            <div className="unbley-form-group"><label className="unbley-form-label" htmlFor="staff-role-description">Description</label><input id="staff-role-description" className="unbley-form-input" value={roleForm.description} onChange={(event) => setRoleForm({ ...roleForm, description: event.target.value })} /></div>
          </div>
          <div className="staff-permission-groups">{PERMISSION_GROUPS.map((group) => <fieldset key={group.label}><legend>{group.label}</legend>{group.permissions.map((permission) => <label key={permission}><input type="checkbox" checked={roleForm.permissions.includes(permission)} onChange={() => togglePermission(permission)} /> {permission}</label>)}</fieldset>)}</div>
          <div className="staff-invite-form__actions"><button type="button" className="unbley-btn-white" onClick={() => setShowRole(false)}>Cancel</button><button type="submit" className="unbley-btn-black" disabled={saving}>{saving ? 'Saving...' : 'Save role'}</button></div>
        </form>
      )}

      <div className="staff-table-wrap">
        <table className="staff-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th aria-label="Actions" /></tr></thead><tbody>
          {staff.map((member) => <tr key={member.id}><td>{member.user?.name || 'Unnamed staff'}</td><td>{member.user?.email || 'No email'}</td><td><select className="staff-role-select" value={member.role_id} onChange={(event) => updateMember(member.id, { roleId: event.target.value })}>{roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></td><td><span className={`staff-status staff-status--${member.status}`}>{member.status}</span></td><td>{member.joined_at ? new Date(member.joined_at).toLocaleDateString() : '-'}</td><td className="staff-table-actions"><button type="button" className="staff-action-button" title={member.status === 'suspended' ? 'Reactivate staff' : 'Suspend staff'} onClick={() => updateMember(member.id, { status: member.status === 'suspended' ? 'active' : 'suspended' })}><MoreVertical size={16} /></button><button type="button" className="staff-action-button staff-action-button--danger" title="Remove staff" onClick={() => updateMember(member.id, { status: 'removed' })}><Trash2 size={14} /></button></td></tr>)}
          {invitations.map((invitation) => <tr key={invitation.id}><td>{invitation.full_name}</td><td>{invitation.email}</td><td>{invitation.store_roles?.name || 'Staff'}</td><td><span className="staff-status staff-status--invited">invited</span></td><td>{invitation.expires_at ? `Expires ${new Date(invitation.expires_at).toLocaleDateString()}` : '-'}</td><td><button type="button" className="staff-action-button" title="Resend invitation" onClick={() => resendInvitation(invitation.id)}><Mail size={14} /></button></td></tr>)}
          {!staff.length && !invitations.length && <tr><td colSpan="6" className="staff-table-empty">No staff members or pending invitations yet.</td></tr>}
        </tbody></table>
      </div>
    </div>
  );
}
