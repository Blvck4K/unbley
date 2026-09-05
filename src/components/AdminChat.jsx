import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageCircle, Clock, Trash2, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const AdminChat = () => {
    const { toast } = useToast();
    const [conversations, setConversations] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'chat'
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initial load: Fetch unique user emails
    useEffect(() => {
        fetchConversations();

        // Subscribe to new messages globally to update the conversation list in real-time
        const channel = supabase
            .channel('admin_concierge_list')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'concierge_messages' },
                () => {
                    fetchConversations();
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // Fetch conversation history when a user is selected
    useEffect(() => {
        if (selectedEmail) {
            fetchMessages(selectedEmail);

            // Subscribe to specific user's chat
            const channel = supabase
                .channel(`admin_chat_${selectedEmail}`)
                .on(
                    'postgres_changes',
                    { 
                        event: 'INSERT', 
                        schema: 'public', 
                        table: 'concierge_messages',
                        filter: `user_email=eq.${selectedEmail}`
                    },
                    (payload) => {
                        setMessages((prev) => {
                            // Avoid duplicates
                            if (prev.find(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new];
                        });
                    }
                )
                .subscribe();

            return () => supabase.removeChannel(channel);
        }
    }, [selectedEmail]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            // Get unique emails and their last message time
            const { data } = await supabase
                .from('concierge_messages')
                .select('user_email, message, created_at, sender')
                .order('created_at', { ascending: false });

            if (data) {
                // Manually deduplicate to keep latest message
                const unique = [];
                const seen = new Set();
                for (const item of data) {
                    if (!seen.has(item.user_email)) {
                        seen.add(item.user_email);
                        unique.push(item);
                    }
                }
                setConversations(unique);
            }
        } catch (err) {
            console.error("Error fetching conversations:", err);
        }
    };

    const fetchMessages = async (email) => {
        try {
            const { data } = await supabase
                .from('concierge_messages')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedEmail) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('concierge_messages')
                .insert([
                    {
                        user_email: selectedEmail,
                        sender: 'admin',
                        message: reply.trim()
                    }
                ]);

            if (error) throw error;
            setReply('');
        } catch (err) {
            console.error("Error sending reply:", err);
            toast.error("Failed to send reply. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    // Styling constants
    const brandColor = '#6A3E1F';
    const bgColor = '#FBF9F5';
    const borderColor = '#EAE3D9';

    const filteredConversations = conversations.filter(c => 
        c.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', height: '100%', backgroundColor: bgColor, border: isMobile ? 'none' : `1px solid ${borderColor}`, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            
            {/* Left Sidebar: Active Conversations */}
            <div style={{ 
                width: isMobile ? '100%' : '320px', 
                borderRight: isMobile ? 'none' : `1px solid ${borderColor}`, 
                display: (isMobile && viewMode === 'chat') ? 'none' : 'flex', 
                flexDirection: 'column',
                height: '100%',
                backgroundColor: '#FFFFFF'
            }}>
                <div style={{ padding: '24px', borderBottom: `1px solid ${borderColor}` }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>Concierge Inbox</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F7F2EC', padding: '10px 14px', border: `1px solid #DFCFC2`, borderRadius: '8px' }}>
                        <Search size={14} color="#6B584C" />
                        <input 
                            type="text" 
                            placeholder="Search email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#221510', fontSize: '12px', outline: 'none', width: '100%' }} 
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredConversations.length === 0 ? (
                        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6B584C', fontSize: '13px' }}>No conversations yet.</div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div 
                                key={conv.user_email}
                                onClick={() => {
                                    setSelectedEmail(conv.user_email);
                                    if (isMobile) setViewMode('chat');
                                }}
                                style={{ 
                                    padding: '20px 24px', 
                                    borderBottom: `1px solid ${borderColor}`, 
                                    cursor: 'pointer',
                                    backgroundColor: selectedEmail === conv.user_email ? '#F7F2EC' : 'transparent',
                                    transition: 'all 0.2s',
                                    borderLeft: selectedEmail === conv.user_email ? `4px solid ${brandColor}` : '4px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: selectedEmail === conv.user_email ? '#221510' : '#4A3B32', width: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conv.user_email.split('@')[0]}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6B584C' }}>{new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6B584C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {conv.sender === 'admin' ? 'You: ' : ''}{conv.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            {selectedEmail ? (
                <div style={{ 
                    flex: 1, 
                    display: (isMobile && viewMode === 'list') ? 'none' : 'flex', 
                    flexDirection: 'column',
                    position: isMobile ? 'absolute' : 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: bgColor,
                    zIndex: 20
                }}>
                    {/* Chat Header */}
                    <div style={{ padding: isMobile ? '16px' : '20px 32px', borderBottom: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
                            {isMobile && (
                                <button 
                                    onClick={() => setViewMode('list')}
                                    style={{ background: 'none', border: 'none', color: '#6B584C', padding: '4px', cursor: 'pointer' }}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                            <div style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', backgroundColor: '#F7F2EC', border: '1px solid #DFCFC2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color={brandColor} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#221510' }}>{selectedEmail}</div>
                                <div style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                    <div style={{ width: '6px', height: '6px', backgroundColor: '#16A34A', borderRadius: '50%' }} /> Active Consumer
                                </div>
                            </div>
                        </div>
                        <div style={{ color: '#6B584C', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', display: isMobile ? 'none' : 'block' }}>Live Connection</div>
                    </div>

                    <div ref={scrollRef} style={{ flex: 1, padding: isMobile ? '20px' : '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '32px' }}>
                            <div style={{ fontSize: '11px', color: '#8D5B36', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Beginning of Conversation</div>
                        </div>

                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                style={{ 
                                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                    maxWidth: isMobile ? '85%' : '65%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div 
                                    style={{ 
                                        backgroundColor: msg.sender === 'admin' ? brandColor : '#FFFFFF',
                                        color: msg.sender === 'admin' ? '#FFFFFF' : '#221510',
                                        padding: '12px 20px',
                                        borderRadius: msg.sender === 'admin' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        border: msg.sender === 'admin' ? 'none' : `1px solid ${borderColor}`,
                                        boxShadow: '0 2px 8px rgba(34,21,16,0.04)'
                                    }}
                                >
                                    {msg.message}
                                </div>
                                <div style={{ fontSize: '10px', color: '#6B584C', marginTop: '6px', textTransform: 'uppercase' }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSendReply} style={{ padding: isMobile ? '16px' : '20px 32px', borderTop: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#F7F2EC', border: `1px solid #DFCFC2`, padding: isMobile ? '8px 16px' : '10px 18px', borderRadius: '8px' }}>
                            <input 
                                type="text" 
                                placeholder={isMobile ? "Reply..." : `Reply to ${selectedEmail.split('@')[0]}...`}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: 'none', color: '#221510', fontSize: isMobile ? '14px' : '13px', outline: 'none' }} 
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !reply.trim()}
                                style={{ background: 'none', border: 'none', color: brandColor, cursor: 'pointer', opacity: (loading || !reply.trim()) ? 0.4 : 1 }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#F7F2EC', border: '1px solid #DFCFC2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                        <MessageCircle size={32} color={brandColor} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>Client Interactions</div>
                    <p style={{ fontSize: '14px', color: '#6B584C', textAlign: 'center', maxWidth: '400px', lineHeight: '1.8' }}>Select a conversation from the sidebar to begin interacting with your customers. All messages sent here appear instantly in their local store chat widget.</p>
                </div>
            )}
        </div>
    );
};

export default AdminChat;
