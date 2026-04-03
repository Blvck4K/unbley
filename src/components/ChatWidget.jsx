import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip, MoreHorizontal, User, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isIdentified, setIsIdentified] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef(null);

    // Initial load and Realtime setup
    useEffect(() => {
        // Auto-identify if user is logged in
        if (user?.email) {
            setEmail(user.email);
            setIsIdentified(true);
        }

        // Fetch history if identified
        if (isIdentified && email) {
            fetchChatHistory();
        }

        // Realtime subscription
        const channel = supabase
            .channel('concierge_messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'concierge_messages' },
                (payload) => {
                    if (payload.new.user_email === email) {
                        setChatHistory((prev) => [...prev, payload.new]);
                        if (!isOpen && payload.new.sender === 'admin') {
                            setUnreadCount((prev) => prev + 1);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, isIdentified, email, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen]);

    const fetchChatHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('concierge_messages')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: true });

            if (data) setChatHistory(data);
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    };

    const handleIdentify = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) {
            setIsIdentified(true);
            fetchChatHistory();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !email) return;

        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

        const newMessage = {
            user_email: email,
            sender: 'user',
            message: message.trim(),
            user_id: user?.id || null
        };

        setLoading(true);
        try {
            // 1. Save to Supabase (this triggers Realtime for other tabs)
            const { error: dbError } = await supabase
                .from('concierge_messages')
                .insert([newMessage]);

            if (dbError) throw dbError;

            // 2. Send to Telegram
            if (botToken && chatId) {
                const tgMsg = `
📬 *New Concierge Message*
*From:* ${email}
*Type:* ${user ? 'Logged User' : 'Guest'}

*Content:* 
${message.trim()}

---
_Reply to this message with 'Reply: <your message>' to send back to the user._
                `;

                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: tgMsg,
                        parse_mode: 'Markdown',
                        disable_notification: false
                    })
                });
            }

            setMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = () => {
        if (!isOpen) setUnreadCount(0);
        setIsOpen(!isOpen);
    };

    // Styling constants
    const brandColor = '#06acf8ff';
    const bgColor = '#0A0A0A';
    const cardColor = '#111111';

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 10000, fontFamily: '"Inter", sans-serif' }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{ 
                    width: '380px', 
                    maxHeight: '600px', 
                    height: '80vh', 
                    backgroundColor: bgColor, 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflow: 'hidden', 
                    border: '1px solid #1F1F1F',
                    marginBottom: '24px',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{ padding: '24px', backgroundColor: cardColor, borderBottom: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="Sarah" />
                                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '50%', border: '2px solid #111' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>Concierge Support</div>
                                <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sarah from Support</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={toggleOpen} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Minus size={18} /></button>
                            <button onClick={toggleOpen} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                    </div>

                    {/* Pre-Chat or Chat View */}
                    {!isIdentified ? (
                        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <MessageCircle size={32} color={brandColor} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFF', marginBottom: '8px' }}>Start a Conversation</h3>
                            <p style={{ fontSize: '12px', color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>Please provide your email address so we can reach back to you.</p>
                            <form onSubmit={handleIdentify}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '8px', padding: '12px 16px', color: '#FFF', fontSize: '14px', marginBottom: '16px', outline: 'none' }} 
                                />
                                <button type="submit" style={{ width: '100%', backgroundColor: brandColor, color: '#000', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>CONTINUE</button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Messages List */}
                            <div ref={scrollRef} style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', color: '#666' }}>
                                        <div style={{ width: '6px', height: '6px', backgroundColor: '#666', borderRadius: '50%' }} />
                                        Typically replies in minutes
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#333', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</div>
                                </div>

                                {chatHistory.length === 0 && (
                                    <div style={{ backgroundColor: '#111', padding: '16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', color: '#CCC', fontSize: '13px', lineHeight: '1.5' }}>
                                        Hi there! Welcome to Zizzystores Concierge. How can I assist you today? ✨
                                    </div>
                                )}

                                {chatHistory.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        style={{ 
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            backgroundColor: msg.sender === 'user' ? brandColor : '#111',
                                            color: msg.sender === 'user' ? '#000' : '#CCC',
                                            padding: '12px 16px',
                                            borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                            maxWidth: '85%',
                                            fontSize: '13px',
                                            lineHeight: '1.5',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {msg.message}
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} style={{ padding: '24px', backgroundColor: cardColor, borderTop: '1px solid #1F1F1F' }}>
                                <div style={{ backgroundColor: bgColor, border: '1px solid #1F1F1F', borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '8px 12px 8px 20px', gap: '8px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..." 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#FFF', fontSize: '13px', outline: 'none' }} 
                                    />
                                    <button type="button" style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Paperclip size={18} /></button>
                                    <button 
                                        type="submit" 
                                        disabled={loading || !message.trim()}
                                        style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            backgroundColor: brandColor, 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            border: 'none', 
                                            cursor: 'pointer',
                                            opacity: (loading || !message.trim()) ? 0.5 : 1
                                        }}
                                    >
                                        <Send size={16} color="#000" />
                                    </button>
                                </div>
                                <div style={{ fontSize: '9px', color: '#333', textAlign: 'center', marginTop: '12px', letterSpacing: '0.05em' }}>
                                    Powered by <span style={{ color: brandColor }}>Zizzy Support Core</span>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Floating Icon */}
            <button 
                onClick={toggleOpen}
                style={{ 
                    width: '56px', 
                    height: '56px', 
                    backgroundColor: brandColor, 
                    borderRadius: '50%', 
                    boxShadow: '0 8px 24px rgba(6,172,248,0.4)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: 'none', 
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X color="#000" size={24} /> : <MessageCircle color="#000" size={24} />}
                {unreadCount > 0 && !isOpen && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '-4px', 
                        right: '-4px', 
                        backgroundColor: '#EF4444', 
                        color: '#FFF', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '2px solid #0A0A0A'
                    }}>
                        {unreadCount}
                    </div>
                )}
            </button>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
