import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, Headphones, Camera, Globe, Link as LinkIcon, Plus, ArrowRight, Lock, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const FacebookIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.309h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
  </svg>
);
const TikTokIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
const InstagramIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const TwitterIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Edit() {
  const brandColor = '#06acf8ff';
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const width = window.innerWidth; // helpful for specific calculations if needed

  // Refs for hidden file inputs
  const logoRef = useRef(null);
  const bannerRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);
  const p4Ref = useRef(null);

  const [formData, setFormData] = useState({
    brand_name: '',
    owner_name: '',
    email_address: '',
    phone_number: '',
    brand_category: '',
    delivery_duration: '',
    brand_narrative: '',
    manifesto: '',
    country: '',
    state_province: '',
    city: '',
    postal_code: '',
    address_line_1: '',
    address_line_2: '',
    primary_color: '#0A0A0A',
    secondary_color: '#1A1A1A',
    accent_color: '#06acf8',
    logo_url: '',
    banner_url: '',
    product_1_url: '',
    product_2_url: '',
    product_3_url: '',
    product_4_url: '',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    tiktok_url: '',
    website_url: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    paystack_subaccount_code: ''
  });

  const [themeColors, setThemeColors] = useState({
    primary: '#0A0A0A',
    secondary: '#1A1A1A',
    accent: '#06acf8'
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
          setThemeColors({
            primary: data.primary_color || '#0A0A0A',
            secondary: data.secondary_color || '#1A1A1A',
            accent: data.accent_color || '#06acf8'
          });
        } else {
          // Fallback to auth metadata
          const md = user.user_metadata || {};
          setFormData(prev => ({
            ...prev,
            brand_name: md.full_name || '',
            owner_name: md.full_name || '',
            email_address: user.email || '',
            phone_number: md.phone || '',
            brand_category: md.category || ''
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchProfile();
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (colorName, value) => {
    setThemeColors(prev => ({ ...prev, [colorName]: value }));
    setFormData(prev => ({ ...prev, [`${colorName}_color`]: value }));
  };

  // Generalized upload handler for Supabase storage
  const handleFileUpload = async (e, fieldName) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${fieldName}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file directly to 'brand-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Automatically retrieve public URL after success
      const { data } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      // Inject the newly generated Supabase public URL right into the local form rendering state
      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) throw new Error("Not authenticated");
      
      // Exclude paystack_subaccount_code from the update payload so brand owners 
      // do not accidentally overwrite the code generated by the admin
      const { paystack_subaccount_code, ...updatableFormData } = formData;
      
      const payload = {
        ...updatableFormData,
        id: user.id,
        profile_completed: true,
        updated_at: new Date()
      };
      
      const { error: profileError } = await supabase
        .from('brand_profiles')
        .upsert(payload, { onConflict: 'id' });
        
      if (profileError) throw profileError;
      
      const { error: authError } = await supabase.auth.updateUser({
        data: { profile_completed: true }
      });
      
      if (authError) throw authError;

      alert("Profile updated successfully!");
      if (formData.profile_completed) {
        navigate('/dashboard');
      } else {
        navigate('/activation');
      }
      
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: isMobile ? 'auto' : '100vh', minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif', overflow: isMobile ? 'visible' : 'hidden' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 40px',
      color: active ? '#FFF' : '#888',
      backgroundColor: active ? '#111' : 'transparent',
      borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      letterSpacing: '0.05em',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      textDecoration: 'none'
    }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden', borderRadius: '50%' },

    // Main Area
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : '100vh', overflowY: isMobile ? 'visible' : 'auto' },

    // Custom Header for Edit Page
    editHeader: { padding: '60px 80px 40px', borderBottom: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF', fontWeight: 'bold' },
    headerSubtitle: { fontSize: '14px', color: '#888', marginTop: '12px', maxWidth: '500px', lineHeight: '1.6' },
    saveBtn: { backgroundColor: brandColor, color: '#000', padding: '16px 32px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s' },

    content: { padding: '60px 80px', display: 'flex', flexDirection: 'column', gap: '40px' },

    // Layout Grid
    twoColLayout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '40px' },

    // Components
    card: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '40px', borderRadius: '8px' },
    cardTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', marginBottom: '32px' },

    bannerBox: { position: 'relative', height: '300px', backgroundColor: '#1A1A1A', borderRadius: '8px', overflow: 'hidden', marginBottom: '40px', display: 'flex', alignItems: 'flex-end', padding: '24px', backgroundImage: formData.banner_url ? `url(${formData.banner_url})` : 'linear-gradient(to right bottom, #112, #0A0A0A)', backgroundSize: 'cover', backgroundPosition: 'center' },
    bannerText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '72px', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em', pointerEvents: 'none' },
    bannerBtn: { backgroundColor: '#000', border: '1px solid #333', color: '#FFF', padding: '10px 20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' },
    bannerInfo: { marginLeft: 'auto', fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.8)' },

    inputGroup: { marginBottom: '32px' },
    label: { display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '16px' },
    input: { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #333', padding: '8px 0', color: '#FFF', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', '&:focus': { borderBottom: `1px solid ${brandColor}` } },
    textarea: { width: '100%', backgroundColor: '#0A0A0A', border: '1px solid #1F1F1F', padding: '20px', color: '#CCC', fontSize: '14px', outline: 'none', minHeight: '120px', resize: 'vertical', lineHeight: '1.6', borderRadius: '4px' },

    logoPreview: { width: '120px', height: '120px', backgroundColor: brandColor, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', overflow: 'hidden' },
    logoInitial: { fontFamily: '"Playfair Display", serif', fontSize: '48px', color: '#000', fontStyle: 'italic' },
    uploadBtn: { width: '100%', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', padding: '16px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', marginTop: '24px' },

    socialRow: { display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #1F1F1F', paddingBottom: '16px', marginBottom: '24px' },
    socialIcon: { color: '#666' },
    socialInputContainer: { flex: 1 },
    socialNetworkLabel: { fontSize: '10px', color: '#555', marginBottom: '4px', textTransform: 'lowercase' },
    socialInput: { width: '100%', background: 'transparent', border: 'none', color: '#FFF', fontSize: '14px', outline: 'none' },

    assistanceBox: { border: '1px solid #1F1F1F', backgroundColor: '#0D1110', padding: '32px', borderRadius: '8px' },
    assistanceTitle: { fontSize: '10px', fontWeight: '700', color: brandColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    assistanceText: { color: '#888', fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' },
    assistanceLink: { color: '#FFF', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },

    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '32px' },
    productSquare: { aspectRatio: '1', backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'border-color 0.2s', '&:hover': { borderColor: '#666' } },
    productImage: { width: '100%', height: '100%', objectFit: 'cover', opacity: 1 },
    productEmpty: { aspectRatio: '1', border: '1px dashed #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', cursor: 'pointer', transition: 'border-color 0.2s', '&:hover': { borderColor: '#666' } }
  };

  return (
    <div style={s.page} className="edit-page">
      <style>{`
        @media (max-width: 768px) {
          .edit-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .edit-sidebar { 
            position: fixed !important; 
            top: 0 !important; 
            left: ${isSidebarOpen ? '0' : '-100%'} !important; 
            width: 280px !important; 
            height: 100vh !important; 
            z-index: 1000 !important; 
            background-color: #0A0A0A !important;
            transition: left 0.3s ease !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.5) !important;
          }
          .edit-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background-color: rgba(0,0,0,0.7) !important;
            z-index: 999 !important;
            display: ${isSidebarOpen ? 'block' : 'none'} !important;
          }
          .edit-logo-container { padding: 24px !important; }
          .edit-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
          .edit-nav a, .edit-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
          .edit-user-profile { display: flex !important; }
          
          .edit-header { padding: 20px 24px !important; flex-direction: column; gap: 24px; position: sticky; top: 0; background: #0A0A0A; z-index: 100; border-bottom: 1px solid #1F1F1F; }
          .edit-save-btn { width: 100%; }
          
          .edit-content { padding: 24px !important; }
          .edit-two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
          
          .edit-banner-box { padding: 24px !important; flex-direction: column; align-items: center; justify-content: center; gap: 16px; height: auto !important; min-height: 200px; }
          .edit-banner-text { font-size: 48px !important; }
          .edit-banner-info { margin-left: 0 !important; }
          
          .edit-card { padding: 24px !important; }
          .edit-input-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .edit-color-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          
          .edit-product-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* Hidden File Inputs mapped to standard refs */}
      <input type="file" ref={logoRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
      <input type="file" ref={bannerRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner_url')} />
      <input type="file" ref={p1Ref} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'product_1_url')} />
      <input type="file" ref={p2Ref} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'product_2_url')} />
      <input type="file" ref={p3Ref} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'product_3_url')} />
      <input type="file" ref={p4Ref} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'product_4_url')} />
      
      {/* Mobile Sidebar Overlay */}
      <div className="edit-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div style={s.sidebar} className="edit-sidebar">
        <div style={{ ...s.logoContainer, position: 'relative' }} className="edit-logo-container">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            className="mobile-only"
          >
            <X size={24} />
          </button>
          <Link to="/" style={{ textDecoration: 'none' }}><div style={s.logo}>Zizzystores.</div></Link>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
        </div>

        <div style={s.nav} className="edit-nav">
          {formData.profile_completed ? (
            <Link to="/dashboard" style={s.navItem(false)}><LayoutGrid size={16} /> Overview</Link>
          ) : (
            <div style={{...s.navItem(false), opacity: 0.5, cursor: 'not-allowed'}} title="Complete your profile first"><LayoutGrid size={16} /> Overview <Lock size={12} style={{marginLeft: 'auto'}}/></div>
          )}
          
          {formData.profile_completed ? (
            <Link to="/profile" style={s.navItem(false)}><User size={16} /> Profile</Link>
          ) : (
            <div style={{...s.navItem(false), opacity: 0.5, cursor: 'not-allowed'}} title="Complete your profile first"><User size={16} /> Profile <Lock size={12} style={{marginLeft: 'auto'}}/></div>
          )}
          
          <Link to="/edit" style={s.navItem(true)}><Settings size={16} /> Edit</Link>
        </div>

        <div style={s.userProfile} className="edit-user-profile">
          <div style={s.userAvatar}>
            {formData.logo_url ? (
              <img src={formData.logo_url} alt={formData.owner_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{formData.owner_name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{formData.owner_name || 'User'}</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Principal Curator</div>
          </div>
        </div>
      </div>

      {/* Main Content Form */}
      <form style={s.main} onSubmit={handleSubmit}>
        {/* Header Special for Edit Page */}
        <div style={s.editHeader} className="edit-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              className="mobile-only"
              type="button"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 style={s.headerTitle}>Brand Profile</h1>
              <p style={s.headerSubtitle}>Curate your digital atelier. The narrative you build here defines the prestige of your collections.</p>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }} className="edit-save-btn">
            {loading ? 'SAVING...' : 'Save Changes'}
          </button>
        </div>

        {/* Form Content Area */}
        <div style={s.content} className="edit-content">
          <div style={s.twoColLayout} className="edit-two-col">

            {/* Left Column: Core Identity */}
            <div>
              {/* Banner Upload */}
              <div style={s.bannerBox} className="edit-banner-box">
                <div style={s.bannerText} className="edit-banner-text">BRAND</div>
                <button type="button" style={s.bannerBtn} onClick={() => bannerRef.current?.click()}>
                  {loading ? 'UPLOADING...' : 'Change Banner'}
                </button>
                <div style={s.bannerInfo} className="edit-banner-info">Recommended: 2400x800px</div>
              </div>

              {/* Core Identity Form */}
              <div style={s.card} className="edit-card">
                <h2 style={s.cardTitle}>Core Identity</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px', marginBottom: '40px' }} className="edit-input-grid">
                  <div style={s.inputGroup}>
                    <label style={s.label}>Brand Name</label>
                    <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Owner Name</label>
                    <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Email Address</label>
                    <input type="email" name="email_address" value={formData.email_address} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Phone Number</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Brand Category</label>
                    <input type="text" name="brand_category" value={formData.brand_category} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Delivery Duration</label>
                    <input type="text" name="delivery_duration" value={formData.delivery_duration} onChange={handleChange} style={s.input} required />
                  </div>
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Brand Narrative</label>
                  <textarea name="brand_narrative" value={formData.brand_narrative} onChange={handleChange} style={s.textarea} required />
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Manifesto</label>
                  <textarea name="manifesto" value={formData.manifesto} onChange={handleChange} style={s.textarea} required />
                </div>
              </div>

              {/* Geography Section */}
              <div style={{ ...s.card, marginTop: '40px' }} className="edit-card">
                <h2 style={s.cardTitle}>Geography & Location</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px', marginBottom: '32px' }} className="edit-input-grid">
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>State / Province</label>
                    <input type="text" name="state_province" value={formData.state_province} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} style={s.input} required />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>Postal Code</label>
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} style={s.input} required />
                  </div>
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Address Line 1</label>
                  <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} style={s.input} required />
                </div>
                <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                  <label style={s.label}>Address Line 2 (Optional)</label>
                  <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} style={s.input} />
                </div>
              </div>

              {/* Store Theme Colors */}
              <div style={{ ...s.card, marginTop: '40px' }} className="edit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ ...s.cardTitle, marginBottom: 0 }}>Brand Aesthetics</h2>
                  <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 'bold', border: '1px solid #F59E0B', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                    🔒 Can only be changed three times a year
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>
                  Define the chromatic signature of your storefront. Pick your 3 core brand colors using the gradient sliders below. Click the blocks to open the picker.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="edit-color-grid">

                  {/* Primary Background */}
                  <div>
                    <label style={s.label}>Primary Base</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.primary }}>
                      <input
                        type="color"
                        value={themeColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.primary.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Secondary Card Color */}
                  <div>
                    <label style={s.label}>Surface / Cards</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.secondary }}>
                      <input
                        type="color"
                        value={themeColors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.secondary.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Brand Accent */}
                  <div>
                    <label style={s.label}>Brand Accent</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.accent }}>
                      <input
                        type="color"
                        value={themeColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.accent.toUpperCase()}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Assets & Social */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

              {/* Logo Upload Box */}
              <div style={s.card} className="edit-card">
                <label style={{ ...s.label, marginBottom: '40px' }}>Brand Logo</label>
                <div style={s.logoPreview}>
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={s.logoInitial}>{formData.brand_name?.charAt(0)?.toUpperCase() || 'Z'}</span>
                  )}
                </div>
                <p style={{ fontSize: '10px', color: '#888', textAlign: 'center', lineHeight: '1.6', padding: '0 20px' }}>
                  Upload a high-resolution SVG or PNG. 1:1 ratio required.
                </p>
                <button type="button" style={s.uploadBtn} onClick={() => logoRef.current?.click()}>
                  {loading ? 'UPLOADING...' : 'Upload New Logo'}
                </button>
              </div>

              {/* Social Handles Box */}
              <div style={s.card} className="edit-card">
                <label style={{ ...s.label, marginBottom: '32px' }}>Social Handles</label>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><InstagramIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>instagram profile url</div>
                    <input type="text" name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><TwitterIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>x (twitter) profile url</div>
                    <input type="text" name="twitter_url" value={formData.twitter_url} onChange={handleChange} placeholder="https://x.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><FacebookIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>facebook page url</div>
                    <input type="text" name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><TikTokIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>tiktok profile url</div>
                    <input type="text" name="tiktok_url" value={formData.tiktok_url} onChange={handleChange} placeholder="https://tiktok.com/@zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={{ ...s.socialRow, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                  <div style={s.socialIcon}><LinkIcon size={14} /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>website</div>
                    <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="www.zizzystores.com" style={s.socialInput} />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div style={s.card} className="edit-card">
                <h2 style={{ ...s.cardTitle, marginBottom: '24px' }}>Payout Details & Integration</h2>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>Provide your bank account details. The platform admin will use these to generate your automated settlement subaccount.</div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Bank Name</label>
                  <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="Guaranty Trust Bank" style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Account Number</label>
                  <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} placeholder="0123456789" style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Account Name</label>
                  <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} placeholder="Zizzy Wears" style={s.input} />
                </div>

                <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                  <label style={s.label}>Paystack Subaccount Code <span style={{color: '#888', textTransform: 'none', marginLeft: '8px'}}>(Generated by Admin)</span></label>
                  <input type="text" value={formData.paystack_subaccount_code || ''} placeholder="Pending Generation..." style={{ ...s.input, color: '#888', cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.02)', paddingLeft: '16px' }} readOnly />
                </div>
              </div>


              {/* Assistance Box */}
              <div style={s.assistanceBox}>
                <div style={s.assistanceTitle}>Need Assistance?</div>
                <p style={s.assistanceText}>
                  Our concierge team can help you personalize your brand narrative or assist with high-fidelity asset uploads.
                </p>
                <a href="#" style={s.assistanceLink}>Speak with a Curator <ArrowRight size={14} color={brandColor} /></a>
              </div>

            </div>
          </div>

          {/* Bottom Area: Product Showcase */}
          <div>
            <div style={{ borderTop: '1px solid #1F1F1F', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', marginBottom: '8px' }}>Product Showcase</h2>
                <p style={{ fontSize: '12px', color: '#888' }}>Select 4 primary items for your landing gallery.</p>
              </div>
            </div>

            <div style={s.productGrid} className="edit-product-grid">
              
              {/* Product 1 */}
              <div style={formData.product_1_url ? s.productSquare : s.productEmpty} onClick={() => p1Ref.current?.click()}>
                {formData.product_1_url ? (
                  <img src={formData.product_1_url} alt="Product 1" style={s.productImage} />
                ) : (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} color="#000000" />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase' }}>Select Item</div>
                  </>
                )}
              </div>

              {/* Product 2 */}
              <div style={formData.product_2_url ? s.productSquare : s.productEmpty} onClick={() => p2Ref.current?.click()}>
                {formData.product_2_url ? (
                  <img src={formData.product_2_url} alt="Product 2" style={s.productImage} />
                ) : (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} color="#000000" />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase' }}>Select Item</div>
                  </>
                )}
              </div>

              {/* Product 3 */}
              <div style={formData.product_3_url ? s.productSquare : s.productEmpty} onClick={() => p3Ref.current?.click()}>
                {formData.product_3_url ? (
                  <img src={formData.product_3_url} alt="Product 3" style={s.productImage} />
                ) : (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} color="#000000" />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase' }}>Select Item</div>
                  </>
                )}
              </div>

              {/* Product 4 */}
              <div style={formData.product_4_url ? s.productSquare : s.productEmpty} onClick={() => p4Ref.current?.click()}>
                {formData.product_4_url ? (
                  <img src={formData.product_4_url} alt="Product 4" style={s.productImage} />
                ) : (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} color="#000000" />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase' }}>Select Item</div>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
