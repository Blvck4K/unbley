import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Menu,
  MessageSquare,
  Search,
  ChevronLeft,
  User,
  Headphones,
  CreditCard
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Link, useLocation } from 'react-router-dom';

export default function Support() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profileData, setProfileData] = useState({ brand_name: '', owner_name: '', logo_url: '' });

  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEmail, setActiveEmail] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('brand_profiles').select('brand_name, owner_name, logo_url').eq('id', user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfileData(p => ({ ...p, ...data })); });
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!isAdmin) return;
    const { data, error } = await supabase
      .from('concierge_messages')
      .select('user_email, sender, message, created_at, read_at')
      .order('created_at', { ascending: false });
    if (error || !data) return;
    const grouped = {};
    data.forEach(msg => {
      if (!grouped[msg.user_email]) {
        grouped[msg.user_email] = { email: msg.user_email, lastMessage: msg.message, lastTime: msg.created_at, unread: 0 };
      }
      if (msg.sender === 'user' && !msg.read_at) grouped[msg.user_email].unread++;
    });
    setConversations(Object.values(grouped).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime)));
  }, [isAdmin]);

  useEffect(() => {
    fetchConversations();
    if (!isAdmin) return;
    const channel = supabase.channel('admin_inbox_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'concierge_messages' }, () => fetchConversations())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [isAdmin, fetchConversations]);

  const fetchThread = useCallback(async (email) => {
    if (!email) return;
    const { data } = await supabase.from('concierge_messages').select('*').eq('user_email', email).order('created_at', { ascending: true });
    setThreadMessages(data || []);
    if (isAdmin) {
      // Optimistically clear the sidebar badge right away
      window.dispatchEvent(new CustomEvent('unbley:messages-read', { detail: { zeroAll: true } }));
      // Update read_at — log full response so we can debug if it fails
      const updateResult = await supabase.from('concierge_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('user_email', email)
        .eq('sender', 'user')
        .is('read_at', null)
        .select();
      console.log('[Support] mark-read result:', JSON.stringify(updateResult));
      fetchConversations();
    }
  }, [isAdmin, fetchConversations]);

  useEffect(() => {
    if (!activeEmail) return;
    fetchThread(activeEmail);
    const channel = supabase.channel(`admin_thread_${activeEmail}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'concierge_messages', filter: `user_email=eq.${activeEmail}` },
        (payload) => {
          setThreadMessages(prev => [...prev, payload.new]);
          if (isAdmin && payload.new.sender === 'user') {
            supabase.from('concierge_messages').update({ read_at: new Date().toISOString() }).eq('id', payload.new.id).then(() => fetchConversations());
          }
        }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeEmail, isAdmin, fetchConversations, fetchThread]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [threadMessages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeEmail) return;
    setSending(true);
    const text = replyText.trim();
    setReplyText('');
    try {
      await supabase.from('concierge_messages').insert([{ user_email: activeEmail, sender: 'admin', message: text, created_at: new Date().toISOString() }]);
      if (toast) toast('Reply sent', 'success');
    } catch {
      if (toast) toast('Failed to send reply', 'error');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const diffMins = Math.floor((new Date() - d) / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(c => c.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeConvo = conversations.find(c => c.email === activeEmail);

  return (
    <PageTransition>
      <div className="unbley-app-layout">
        <Sidebar profileData={profileData} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <aside className="unbley-secondary-admin-nav" style={{
          width: '190px',
          minWidth: '190px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FAFAF9',
          borderRight: '1px solid #EAE6DF',
          padding: '88px 12px 20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ padding: '0 10px 10px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: '#9A7252' }}>
            ADMIN TOOLS
          </div>
          <Link
            to="/support"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 10px',
              borderRadius: '8px',
              color: '#111827',
              backgroundColor: location.pathname === '/support' ? '#F0ECE4' : 'transparent',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <MessageSquare size={17} />
            <span style={{ flex: 1 }}>Support Chat</span>
            {conversations.reduce((total, conversation) => total + conversation.unread, 0) > 0 && (
              <span style={{
                background: '#DC2626',
                color: '#FFFFFF',
                borderRadius: '9999px',
                minWidth: '18px',
                padding: '2px 5px',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: '800'
              }}>
                {conversations.reduce((total, conversation) => total + conversation.unread, 0) > 99
                  ? '99+'
                  : conversations.reduce((total, conversation) => total + conversation.unread, 0)}
              </span>
            )}
          </Link>
          <Link
            to="/admin/payments"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 10px',
              marginTop: '4px',
              borderRadius: '8px',
              color: '#111827',
              backgroundColor: location.pathname === '/admin/payments' ? '#F0ECE4' : 'transparent',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <CreditCard size={17} />
            Payments
          </Link>
        </aside>
        <div className="unbley-main-content">
          <header className="unbley-top-header">
            <div className="unbley-header-left">
              <button onClick={() => setIsSidebarOpen(true)} className="unbley-mobile-menu-btn mobile-menu-trigger" title="Open menu"><Menu size={18} /></button>
              <div>
                <div className="unbley-header-title-row">
                  <h1 className="unbley-header-title">Support Inbox</h1>
                  <span className="unbley-live-badge"><span className="unbley-live-dot" />LIVE</span>
                </div>
                <p className="unbley-header-subtitle">All merchant conversations in one place.</p>
              </div>
            </div>
            <div className="unbley-header-actions">
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', background: '#F4F2EE', padding: '5px 12px', borderRadius: '9999px' }}>
                {conversations.filter(c => c.unread > 0).length} unread threads
              </span>
            </div>
          </header>

          <main style={{ display: 'flex', height: 'calc(100vh - 73px)', overflow: 'hidden' }}>

            {/* Left: Conversation List */}
            <div style={{ width: '320px', minWidth: '320px', borderRight: '1px solid #F0ECE4', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0ECE4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F9F8F6', borderRadius: '10px', padding: '8px 12px', border: '1px solid #EAE6DF' }}>
                  <Search size={14} color="#9CA3AF" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by email..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#374151', width: '100%' }} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredConversations.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9CA3AF' }}>
                    <MessageSquare size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>No conversations yet</div>
                  </div>
                ) : (
                  filteredConversations.map(convo => (
                    <button key={convo.email} onClick={() => setActiveEmail(convo.email)} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', background: activeEmail === convo.email ? '#F4F2EE' : 'transparent', border: 'none', borderBottom: '1px solid #F9F8F6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s' }}>
                      <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '50%', backgroundColor: '#6A3E1F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 }}>
                        {convo.email.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{convo.email}</span>
                          <span style={{ fontSize: '10px', color: '#9CA3AF', flexShrink: 0 }}>{formatTime(convo.lastTime)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{convo.lastMessage}</span>
                          {convo.unread > 0 && (
                            <span style={{ background: '#6A3E1F', color: '#fff', borderRadius: '9999px', fontSize: '9px', fontWeight: '800', padding: '2px 6px', minWidth: '18px', textAlign: 'center', flexShrink: 0, marginLeft: '6px' }}>{convo.unread}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: Chat Thread */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FAFAF9' }}>
              {!activeEmail ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                  <Headphones size={48} style={{ marginBottom: '14px', opacity: 0.3 }} />
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Select a conversation</div>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Click a thread on the left to view and reply.</p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0ECE4', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveEmail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6B7280', display: 'flex', alignItems: 'center' }} title="Back"><ChevronLeft size={18} /></button>
                    <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', backgroundColor: '#6A3E1F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>{activeEmail.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827' }}>{activeEmail}</div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{activeConvo?.unread > 0 ? `${activeConvo.unread} unread` : 'All read'}</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {threadMessages.map((msg, idx) => {
                      const isAdminMsg = msg.sender === 'admin';
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: isAdminMsg ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', backgroundColor: isAdminMsg ? '#1E40AF' : '#F0ECE4', color: isAdminMsg ? '#fff' : '#6A3E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', flexShrink: 0 }}>
                            {isAdminMsg ? 'U' : <User size={12} />}
                          </div>
                          <div style={{ maxWidth: '65%' }}>
                            <div style={{ padding: '10px 14px', borderRadius: isAdminMsg ? '16px 4px 16px 16px' : '4px 16px 16px 16px', backgroundColor: isAdminMsg ? '#1E40AF' : '#FFFFFF', color: isAdminMsg ? '#FFFFFF' : '#111827', fontSize: '13px', lineHeight: '1.5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: isAdminMsg ? 'none' : '1px solid #F0ECE4' }}>
                              {msg.message}
                            </div>
                            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', textAlign: isAdminMsg ? 'right' : 'left' }}>
                              {formatTime(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendReply} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', borderTop: '1px solid #F0ECE4', backgroundColor: '#FFFFFF' }}>
                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type a reply..." style={{ flex: 1, border: '1px solid #EAE6DF', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', backgroundColor: '#FAFAF9', color: '#111827' }} />
                    <button type="submit" disabled={sending || !replyText.trim()} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 16px', cursor: sending || !replyText.trim() ? 'not-allowed' : 'pointer', opacity: sending || !replyText.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                      <Send size={14} />Send
                    </button>
                  </form>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
