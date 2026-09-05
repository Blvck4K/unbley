import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Paperclip, MoreHorizontal, User, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

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
    const isOpenRef = useRef(isOpen);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Expose open function via custom event
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('openChatWidget', handleOpenChat);
        return () => window.removeEventListener('openChatWidget', handleOpenChat);
    }, []);

    const fetchChatHistory = useCallback(async (targetEmail) => {
        const queryEmail = targetEmail || email;
        if (!queryEmail) return;
        try {
            const { data } = await supabase
                .from('concierge_messages')
                .select('*')
                .eq('user_email', queryEmail)
                .order('created_at', { ascending: true });

            if (data) setChatHistory(data);
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    }, [email]);

    // Initial load and Realtime setup
    useEffect(() => {
        // Auto-identify if user is logged in
        if (user?.email) {
            setEmail(user.email);
            setIsIdentified(true);
            fetchChatHistory(user.email);
        } else if (isIdentified && email) {
            fetchChatHistory(email);
        }
    }, [user, isIdentified, email, fetchChatHistory]);

    // Dedicated Realtime subscription
    useEffect(() => {
        if (!email) return;

        const channel = supabase
            .channel(`concierge_messages_${email}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'concierge_messages' },
                (payload) => {
                    if (payload.new.user_email === email) {
                        setChatHistory((prev) => [...prev, payload.new]);
                        if (!isOpenRef.current && payload.new.sender === 'admin') {
                            setUnreadCount((prev) => prev + 1);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [email]);

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
    const brandColor = '#6A3E1F';
    const bgColor = '#FFFFFF';
    const cardColor = '#FBF9F5';
    const borderColor = '#EAE3D9';

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, fontFamily: '"Inter", sans-serif' }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: 'min(380px, calc(100vw - 48px))',
                    maxHeight: '600px',
                    height: '80vh',
                    backgroundColor: bgColor,
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(34,21,16,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: `1px solid ${borderColor}`,
                    marginBottom: '24px',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{ padding: '24px', backgroundColor: cardColor, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EAE3D9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13HUAnJxZA_NhkLvR_U0Ce2SuRjAXdfQ7RA&s" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="Sarah" />
                                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#221510' }}>Unbley Concierge</div>
                                <div style={{ fontSize: '10px', color: '#8D5B36', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Isaac from Support</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={toggleOpen} style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer' }}><Minus size={18} /></button>
                            <button onClick={toggleOpen} style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                    </div>

                    {/* Pre-Chat or Chat View */}
                    {!isIdentified ? (
                        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#F7F2EC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <MessageCircle size={32} color={brandColor} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#221510', marginBottom: '8px' }}>Start a Conversation</h3>
                            <p style={{ fontSize: '12px', color: '#6B584C', marginBottom: '32px', lineHeight: '1.6' }}>Please provide your email address so we can reach back to you.</p>
                            <form onSubmit={handleIdentify}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#FFFFFF', border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '12px 16px', color: '#221510', fontSize: '14px', marginBottom: '16px', outline: 'none' }}
                                />
                                <button type="submit" style={{ width: '100%', backgroundColor: brandColor, color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>CONTINUE</button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Messages List */}
                            <div ref={scrollRef} style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#F7F2EC', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', color: '#6B584C' }}>
                                        <div style={{ width: '6px', height: '6px', backgroundColor: '#8D5B36', borderRadius: '50%' }} />
                                        Typically replies in minutes
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#8D5B36', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</div>
                                </div>

                                {chatHistory.length === 0 && (
                                    <div style={{ backgroundColor: '#F7F2EC', border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', color: '#221510', fontSize: '13px', lineHeight: '1.5' }}>
                                        Hi there! Welcome to Unbley Concierge. How can I assist you today? ✨
                                    </div>
                                )}

                                {chatHistory.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            backgroundColor: msg.sender === 'user' ? brandColor : '#F7F2EC',
                                            color: msg.sender === 'user' ? '#FFFFFF' : '#221510',
                                            border: msg.sender === 'user' ? 'none' : `1px solid ${borderColor}`,
                                            padding: '12px 16px',
                                            borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                            maxWidth: '85%',
                                            fontSize: '13px',
                                            lineHeight: '1.5',
                                            boxShadow: '0 2px 4px rgba(34,21,16,0.04)'
                                        }}
                                    >
                                        {msg.message}
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} style={{ padding: '24px', backgroundColor: cardColor, borderTop: `1px solid ${borderColor}` }}>
                                <div style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '8px 12px 8px 20px', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#221510', fontSize: '13px', outline: 'none' }}
                                    />
                                    <button type="button" style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer' }}><Paperclip size={18} /></button>
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
                                        <Send size={16} color="#FFF" />
                                    </button>
                                </div>
                                <div style={{ fontSize: '9px', color: '#8D5B36', textAlign: 'center', marginTop: '12px', letterSpacing: '0.05em' }}>
                                    Powered by <span style={{ color: brandColor, fontWeight: '600' }}>Unbley Support Core</span>
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
                    boxShadow: '0 8px 24px rgba(106, 62, 31, 0.35)',
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
                {isOpen ? <X color="#FFF" size={24} /> : <MessageCircle color="#FFF" size={24} />}
                {unreadCount > 0 && !isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: '#8D5B36',
                        color: '#FFF',
                        fontSize: '10px',
                        fontWeight: '700',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #FFF'
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
