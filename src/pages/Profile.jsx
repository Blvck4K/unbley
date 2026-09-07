import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Mail, 
  ArrowRight, 
  Menu, 
  Sliders, 
  ExternalLink, 
  ShoppingBag,
  Share2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const FacebookIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.309h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
  </svg>
);
const TikTokIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const TwitterIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Profile() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  
  const [profileData, setProfileData] = useState({
    brand_name: 'Zizzystores',
    owner_name: 'Big Z',
    email_address: 'diorbaron2@gmail.com',
    phone_number: '09153625566',
    brand_narrative: 'Providing contemporary luxury streetwear and tailored essentials for the modern pioneer.',
    manifesto: 'Craftsmanship, authenticity, and enduring cultural resonance in every stitch.',
    primary_color: '#0A0A0A',
    secondary_color: '#111111',
    accent_color: '#06acf8',
    logo_url: '',
    banner_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    product_1_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    product_2_url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80',
    product_3_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    product_4_url: 'https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    tiktok_url: '',
    website_url: 'www.zizzystores.com'
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data) {
          setProfileData(prev => ({
            ...prev,
            ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v !== ''))
          }));
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.email) {
      setUserEmail(user.email);
    }
    fetchProfile();

    if (user) {
      const channel = supabase
        .channel(`profile_page_sync_${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'brand_profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            if (payload.new) {
              setProfileData(prev => ({
                ...prev,
                ...Object.fromEntries(Object.entries(payload.new).filter(([_, v]) => v != null && v !== ''))
              }));
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [user]);

  const ConnectivityIconWrapper = ({ url, children }) => {
    if (!url) return null;
    return (
      <a 
        href={url.startsWith('http') ? url : `https://${url}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="unbley-social-circle-btn"
      >
        {children}
      </a>
    );
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      setSubmitStatus('success');
      setFeedbackMsg('');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 4000);
      return;
    }

    const message = `
🌟 *New Feedback Received* 🌟

*Brand:* ${profileData.brand_name}
*Customer Email:* ${userEmail || 'Anonymous'}

*Message:*
${feedbackMsg}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFeedbackMsg('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error("Telegram Error:", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#6B7280] font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-[#1E40AF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="unbley-app-layout">
        
        {/* Reusable Collapsible Sidebar */}
        <Sidebar 
          profileData={profileData} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Main Workspace */}
        <div className="unbley-main-content">
          
          {/* Top Header */}
          <header className="unbley-top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="unbley-mobile-menu-btn"
                title="Open menu"
              >
                <Menu size={18} />
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 className="unbley-header-title">
                    Store Profile
                  </h1>
                  <span className="unbley-live-badge">
                    <CheckCircle2 size={11} /> VERIFIED
                  </span>
                </div>
                <p className="unbley-header-subtitle">
                  Your public brand identity, story, and digital atelier showcase.
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="unbley-header-actions">
              <Link
                to="/edit"
                className="unbley-btn-white"
              >
                <Sliders size={14} />
                <span>Edit Profile</span>
              </Link>

              <a
                href={profileData.website_url ? (profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`) : '#'}
                target="_blank"
                rel="noreferrer"
                className="unbley-btn-black"
              >
                <span>View Live Store</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </header>

          {/* Profile Content */}
          <main className="unbley-workspace-container">
            
            {/* Hero Brand Card with Banner */}
            <div className="unbley-profile-hero">
              {/* Banner Backdrop */}
              <div 
                className="unbley-profile-banner"
                style={{ backgroundImage: `url(${profileData.banner_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80'})` }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
              </div>

              {/* Profile Details Bar */}
              <div className="unbley-profile-info-bar">
                <div className="unbley-profile-details">
                  <div className="unbley-profile-avatar-box">
                    {profileData.logo_url ? (
                      <img src={profileData.logo_url} alt={profileData.brand_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '32px', fontWeight: '900' }}>
                        {profileData.brand_name?.charAt(0)?.toUpperCase() || 'Z'}
                      </span>
                    )}
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.14em', color: '#8D5B36', textTransform: 'uppercase', display: 'block' }}>
                      Brand Identity
                    </span>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#111827', margin: '2px 0 4px', letterSpacing: '-0.02em' }}>
                      {profileData.brand_name}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                      Managed by <strong style={{ color: '#111827' }}>{profileData.owner_name}</strong>
                    </p>
                  </div>
                </div>

                {/* Live Link Button */}
                <div>
                  <a
                    href={profileData.website_url ? (profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`) : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="unbley-btn-white"
                  >
                    <span>{profileData.website_url || 'www.zizzystores.com'}</span>
                    <ExternalLink size={14} color="#8D5B36" />
                  </a>
                </div>
              </div>
            </div>

            {/* Two-Column Info & Narrative Grid */}
            <div className="unbley-two-col-grid">
              
              {/* Left Column (Details & Socials) */}
              <div className="unbley-col-left">
                
                {/* Brand Details Card */}
                <div className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">
                        Detailed Information
                      </span>
                      <h3 className="unbley-card-title">
                        Brand Foundation
                      </h3>
                    </div>
                  </div>

                  <table className="unbley-profile-meta-table">
                    <tbody>
                      <tr>
                        <td style={{ color: '#6B7280', padding: '12px 0' }}>Brand Name</td>
                        <td style={{ fontWeight: '700', textAlign: 'right', color: '#111827', padding: '12px 0' }}>{profileData.brand_name}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#6B7280', padding: '12px 0' }}>Principal Director</td>
                        <td style={{ fontWeight: '700', textAlign: 'right', color: '#111827', padding: '12px 0' }}>{profileData.owner_name}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#6B7280', padding: '12px 0' }}>Inquiry Email</td>
                        <td style={{ fontWeight: '700', textAlign: 'right', color: '#111827', padding: '12px 0' }}>{profileData.email_address}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#6B7280', padding: '12px 0' }}>WhatsApp Orders</td>
                        <td style={{ fontWeight: '700', textAlign: 'right', color: '#111827', padding: '12px 0' }}>{profileData.phone_number}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Social Connectivity Card */}
                <div className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">
                        Brand Connectivity
                      </span>
                      <h3 className="unbley-card-title">
                        Connected Socials
                      </h3>
                    </div>
                  </div>

                  <div className="unbley-profile-socials-row">
                    <ConnectivityIconWrapper url={profileData.website_url}>
                      <Globe size={18} />
                    </ConnectivityIconWrapper>
                    <ConnectivityIconWrapper url={profileData.instagram_url}>
                      <InstagramIcon size={18} />
                    </ConnectivityIconWrapper>
                    <ConnectivityIconWrapper url={profileData.twitter_url}>
                      <TwitterIcon size={18} />
                    </ConnectivityIconWrapper>
                    <ConnectivityIconWrapper url={profileData.facebook_url}>
                      <FacebookIcon size={18} />
                    </ConnectivityIconWrapper>
                    <ConnectivityIconWrapper url={profileData.tiktok_url}>
                      <TikTokIcon size={18} />
                    </ConnectivityIconWrapper>

                    {!profileData.website_url && !profileData.instagram_url && !profileData.twitter_url && !profileData.facebook_url && !profileData.tiktok_url && (
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No social channels connected yet.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column (Narrative & Manifesto) */}
              <div className="unbley-col-right">
                
                <div className="unbley-card">
                  <div>
                    <span className="unbley-card-pretitle">
                      The Brand Narrative
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', letterSpacing: '-0.01em', margin: '4px 0 12px', lineHeight: '1.3' }}>
                      Transcending the ordinary through modern bespoke commerce.
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                      {profileData.brand_narrative || "No brand narrative specified. Add your story in Store Settings to communicate your unique value proposition to buyers."}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F0ECE4' }}>
                    <span className="unbley-card-pretitle">
                      Our Manifesto
                    </span>
                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', margin: '6px 0 0' }}>
                      {profileData.manifesto || "Every creation embodies intent, passion, and uncompromising quality."}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Showcase Selection Section */}
            <div className="unbley-card">
              <div className="unbley-card-title-row">
                <div>
                  <span className="unbley-card-pretitle">
                    Featured Inventory
                  </span>
                  <h3 className="unbley-card-title">
                    Showcase Catalog
                  </h3>
                </div>
                <Link
                  to={user?.id ? `/shop-brand/${user.id}` : '/store'}
                  className="unbley-view-all-link"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Product Visual Showcase Grid */}
              <div className="unbley-showcase-grid">
                {[
                  profileData.product_1_url || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
                  profileData.product_2_url || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80',
                  profileData.product_3_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
                  profileData.product_4_url || 'https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80'
                ].map((url, idx) => (
                  <div 
                    key={idx}
                    className="unbley-showcase-slot"
                    style={{ cursor: 'default' }}
                  >
                    <img src={url} alt={`Showcase ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback & Support Inquiry Card */}
            <div className="unbley-tip-box" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #EAE6DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8D5B36', margin: '0 auto 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#111827', margin: 0 }}>
                  Feedback & Brand Inquiries
                </h3>
                <p style={{ fontSize: '12.5px', color: '#6B7280', maxWidth: '440px', margin: '4px auto 14px' }}>
                  Have questions or suggestions regarding your brand profile or storefront experience? Send us a direct note.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder="Type your message or inquiry here..."
                  required
                  className="unbley-form-textarea"
                  rows={3}
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your Email Address (Optional)"
                  className="unbley-form-input"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="unbley-btn-black"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>

          </main>
        </div>

      </div>
    </PageTransition>
  );
}
