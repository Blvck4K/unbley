import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, UserRoundCog } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AccountManagement({ storeActive, onStatusChange }) {
  const [targetEmail, setTargetEmail] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const request = async (body) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` }, body: JSON.stringify(body) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Account action failed.');
      return payload;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleStore = async () => {
    const nextActive = !storeActive;
    if (!window.confirm(nextActive ? 'Activate this store for customers?' : 'Deactivate this store? Customers will not be able to shop while it is inactive.')) return;
    const result = await request({ action: 'setActive', active: nextActive });
    if (result) { onStatusChange?.(result.store_active); setMessage(nextActive ? 'Store activated.' : 'Store deactivated.'); }
  };

  const transferOwnership = async (event) => {
    event.preventDefault();
    if (!window.confirm(`Request ownership transfer to ${targetEmail}? The recipient must accept the request.`)) return;
    const result = await request({ action: 'requestOwnershipTransfer', targetEmail });
    if (result) { setTargetEmail(''); setMessage('Ownership transfer request created.'); }
  };

  const deleteStore = async () => {
    if (confirmation !== 'DELETE STORE') { setError('Type DELETE STORE before deleting the store.'); return; }
    if (!window.confirm('This permanently deletes the store and cannot be undone. Continue?')) return;
    const result = await request({ action: 'deleteStore', confirmation });
    if (result?.deleted) window.location.assign('/');
  };

  return (
    <div className="account-management-panel">
      {message && <p className="account-management-message"><CheckCircle2 size={15} /> {message}</p>}
      {error && <p className="account-management-error"><AlertTriangle size={15} /> {error}</p>}
      <div className="account-management-row">
        <div><strong>Store status</strong><p>{storeActive ? 'Your store is visible and accepting customers.' : 'Your store is inactive and hidden from customers.'}</p></div>
        <button type="button" className={storeActive ? 'unbley-btn-white account-danger-button' : 'unbley-btn-black'} onClick={toggleStore} disabled={loading}>{storeActive ? 'Deactivate store' : 'Activate store'}</button>
      </div>
      <div className="account-management-row">
        <div><strong>Change store owner</strong><p>Send an ownership transfer request to another Unbley account. Your current account remains owner until it is accepted.</p></div>
        <form className="account-transfer-form" onSubmit={transferOwnership}><input type="email" className="unbley-form-input" placeholder="New owner email" value={targetEmail} onChange={(event) => setTargetEmail(event.target.value)} required /><button type="submit" className="unbley-btn-white" disabled={loading}><UserRoundCog size={14} /> Request transfer</button></form>
      </div>
      <div className="account-management-row account-management-row--danger">
        <div><strong>Delete store</strong><p>This permanently removes the store and its associated data. This action cannot be undone.</p></div>
        <div className="account-delete-form"><input className="unbley-form-input" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Type DELETE STORE" aria-label="Delete store confirmation" /><button type="button" className="account-danger-button" onClick={deleteStore} disabled={loading}>Delete store</button></div>
      </div>
    </div>
  );
}
