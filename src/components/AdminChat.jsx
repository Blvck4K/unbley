import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageCircle, Clock, Trash2, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef(null);

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
            const { data, error } = await supabase
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
            const { data, error } = await supabase
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
            alert("Failed to send reply. Please check your Supabase connection.");
        } finally {
            setLoading(false);
        }
    };

    // Styling constants
    const brandColor = '#06acf8ff';
    const bgColor = '#0A0A0A';
    const cardColor = '#111111';
    const borderColor = '#1F1F1F';

    const filteredConversations = conversations.filter(c => 
        c.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', height: '100%', backgroundColor: bgColor, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
            
            {/* Left Sidebar: Active Conversations */}
            <div style={{ width: '320px', borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: `1px solid ${borderColor}` }}>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontStyle: 'italic', color: '#FFF', marginBottom: '16px' }}>Concierge Inbox</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '8px 12px', border: `1px solid ${borderColor}` }}>
                        <Search size={14} color="#666" />
                        <input 
                            type="text" 
                            placeholder="Search email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '11px', outline: 'none', width: '100%' }} 
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredConversations.length === 0 ? (
                        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#444', fontSize: '12px' }}>No conversations yet.</div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div 
                                key={conv.user_email}
                                onClick={() => setSelectedEmail(conv.user_email)}
                                style={{ 
                                    padding: '20px 24px', 
                                    borderBottom: `1px solid ${borderColor}`, 
                                    cursor: 'pointer',
                                    backgroundColor: selectedEmail === conv.user_email ? '#111' : 'transparent',
                                    transition: 'all 0.2s',
                                    borderLeft: selectedEmail === conv.user_email ? `3px solid ${brandColor}` : '3px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: selectedEmail === conv.user_email ? '#FFF' : '#AAA', width: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conv.user_email.split('@')[0]}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#444' }}>{new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {conv.sender === 'admin' ? 'You: ' : ''}{conv.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            {selectedEmail ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Chat Header */}
                    <div style={{ padding: '24px 32px', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color={brandColor} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>{selectedEmail}</div>
                                <div style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10B981', borderRadius: '50%' }} /> Active Consumer
                                </div>
                            </div>
                        </div>
                        <div style={{ color: '#444', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Connection</div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '10px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Beginning of Conversation</div>
                        </div>

                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                style={{ 
                                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                    maxWidth: '60%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div 
                                    style={{ 
                                        backgroundColor: msg.sender === 'admin' ? '#FFF' : '#111',
                                        color: msg.sender === 'admin' ? '#000' : '#CCC',
                                        padding: '12px 20px',
                                        borderRadius: msg.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        fontSize: '13px',
                                        lineHeight: '1.6',
                                        border: msg.sender === 'admin' ? 'none' : `1px solid ${borderColor}`
                                    }}
                                >
                                    {msg.message}
                                </div>
                                <div style={{ fontSize: '9px', color: '#333', marginTop: '6px', textTransform: 'uppercase' }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSendReply} style={{ padding: '24px 32px', borderTop: `1px solid ${borderColor}` }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#111', border: `1px solid ${borderColor}`, padding: '12px 20px', borderRadius: '4px' }}>
                            <input 
                                type="text" 
                                placeholder={`Reply to ${selectedEmail.split('@')[0]}...`}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', fontSize: '13px', outline: 'none' }} 
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
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                        <MessageCircle size={32} color="#333" />
                    </div>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', color: '#FFF', fontStyle: 'italic', marginBottom: '16px' }}>Client Interactions</div>
                    <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', maxWidth: '400px', lineHeight: '1.8' }}>Select a conversation from the sidebar to begin interacting with your customers. All messages sent here appear instantly in their local store chat widget.</p>
                </div>
            )}
        </div>
    );
};

export default AdminChat;
