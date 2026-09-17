import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';

export default function StaffInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? 'Checking your invitation...' : 'Invitation token is missing.');

  useEffect(() => {
    let active = true;
    const accept = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (active) {
          setStatus('signin');
          setMessage('Sign in with the invited email address to accept this invitation.');
        }
        return;
      }
      const response = await fetch('/api/staff-accept', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify({ token }) });
      const payload = await response.json().catch(() => ({}));
      if (!active) return;
      if (!response.ok) { setStatus('error'); setMessage(payload.error || 'This invitation could not be accepted.'); return; }
      setStatus('success');
      setMessage('You are now connected to the store.');
      setTimeout(() => navigate('/dashboard'), 900);
    };
    if (!token) return undefined;
    accept().catch(() => { if (active) { setStatus('error'); setMessage('This invitation could not be accepted.'); } });
    return () => { active = false; };
  }, [navigate, token]);

  return (
    <PageTransition>
      <main className="staff-invite-page">
        <div className="staff-invite-card">
          {status === 'success' ? <CheckCircle2 size={42} color="#16A34A" /> : <ShieldCheck size={42} color="#6A3E1F" />}
          <h1>{status === 'success' ? 'Invitation accepted' : 'Store invitation'}</h1>
          <p>{message}</p>
          {status === 'signin' && <button type="button" className="unbley-btn-black" onClick={() => navigate('/auth', { state: { returnTo: `/staff-invite?token=${encodeURIComponent(token)}` } })}>Sign in to continue</button>}
          {status === 'error' && <button type="button" className="unbley-btn-white" onClick={() => navigate('/')}>Return home</button>}
        </div>
      </main>
    </PageTransition>
  );
}
