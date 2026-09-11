import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Paperclip, MoreHorizontal, User, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../assets/logogo.png';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isIdentified, setIsIdentified] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [sendError, setSendError] = useState('');
    const scrollRef = useRef(null);
    const isOpenRef = useRef(isOpen);
    const dragStateRef = useRef(null);
    const draggedRef = useRef(false);
    const [floatingPosition, setFloatingPosition] = useState(null);

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

        setLoading(true);
        setSendError('');
        try {
            const response = await fetch('/api/concierge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message: message.trim(), userId: user?.id || null })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Failed to send message.');

            setMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
            setSendError(err.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = () => {
        if (draggedRef.current) {
            draggedRef.current = false;
            return;
        }
        if (!isOpen) setUnreadCount(0);
        setIsOpen(!isOpen);
    };

    const handleFloatingPointerDown = (event) => {
        if (window.innerWidth > 768) return;
        const element = event.currentTarget;
        const bounds = element.parentElement.getBoundingClientRect();
        dragStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            left: bounds.left,
            top: bounds.top,
            moved: false
        };
        element.setPointerCapture?.(event.pointerId);
    };

    const handleFloatingPointerMove = (event) => {
        const drag = dragStateRef.current;
        if (!drag) return;
        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
            drag.moved = true;
            draggedRef.current = true;
        }
        if (!drag.moved) return;

        const size = 56;
        const padding = 8;
        const left = Math.max(padding, Math.min(window.innerWidth - size - padding, drag.left + deltaX));
        const top = Math.max(padding, Math.min(window.innerHeight - size - padding, drag.top + deltaY));
        setFloatingPosition({ left, top });
    };

    const handleFloatingPointerUp = () => {
        dragStateRef.current = null;
    };

    // Styling constants
    const brandColor = '#6A3E1F';
    const bgColor = '#FFFFFF';
    const cardColor = '#FBF9F5';
    const borderColor = '#EAE3D9';

    return (
        <div className={`chat-widget-root${isOpen ? ' chat-is-open' : ''}`} style={{
            position: 'fixed',
            ...(floatingPosition ? { left: floatingPosition.left, top: floatingPosition.top } : { bottom: '24px', right: '24px' }),
            zIndex: 10000,
            fontFamily: '"Inter", sans-serif'
        }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-window" role="dialog" aria-modal="true" aria-label="Unbley customer support" style={{
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
                    <div className="chat-widget-header" style={{ padding: '24px', backgroundColor: cardColor, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EAE3D9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <img src={logoImg} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="Unbley Support" />
                                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#221510' }}>Unbley Concierge</div>
                                <div style={{ fontSize: '10px', color: '#8D5B36', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Unbley Customer Support</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={toggleOpen} aria-label="Minimize support chat" style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer', padding: '8px' }}><Minus size={18} /></button>
                            <button onClick={toggleOpen} aria-label="Close support chat" style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer', padding: '8px' }}><X size={18} /></button>
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
                            <div ref={scrollRef} className="chat-widget-messages" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            <form onSubmit={handleSendMessage} className="chat-widget-composer" style={{ padding: '24px', backgroundColor: cardColor, borderTop: `1px solid ${borderColor}` }}>
                                {sendError && <div role="alert" style={{ color: '#B42318', fontSize: '11px', marginBottom: '8px', textAlign: 'center' }}>{sendError}</div>}
                                <div style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '30px', display: 'flex', alignItems: 'center', padding: '8px 12px 8px 20px', gap: '8px' }}>
                                    <input
                                        type="text"
                                        aria-label="Support message"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#221510', fontSize: '13px', outline: 'none' }}
                                    />
                                    <button type="button" aria-label="Attachments coming soon" title="Attachments coming soon" style={{ background: 'none', border: 'none', color: '#6B584C', cursor: 'not-allowed', padding: '8px' }}><Paperclip size={18} /></button>
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
                                        <Send size={16} color="#FFF" aria-hidden="true" />
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
                className="chat-widget-launcher"
                aria-label={isOpen ? 'Close support chat' : 'Open customer support chat'}
                onClick={toggleOpen}
                onPointerDown={handleFloatingPointerDown}
                onPointerMove={handleFloatingPointerMove}
                onPointerUp={handleFloatingPointerUp}
                onPointerCancel={handleFloatingPointerUp}
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
                    touchAction: 'none',
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
                .chat-widget-window { position: relative; }
                @media (max-width: 640px) {
                    .chat-widget-root { bottom: 12px !important; right: 12px !important; left: 12px !important; }
                    .chat-widget-root.chat-is-open { inset: 8px !important; width: auto !important; height: auto !important; }
                    .chat-widget-window { position: fixed !important; inset: 8px !important; width: auto !important; height: auto !important; max-height: none !important; margin: 0 !important; border-radius: 18px !important; }
                    .chat-widget-root.chat-is-open .chat-widget-launcher { display: none !important; }
                    .chat-widget-header { padding: 16px 18px !important; }
                    .chat-widget-messages { padding: 16px !important; gap: 12px !important; }
                    .chat-widget-composer { padding: 12px !important; padding-bottom: max(12px, env(safe-area-inset-bottom)) !important; }
                    .chat-widget-composer input { min-width: 0; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
