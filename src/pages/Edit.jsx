import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Save, 
  HelpCircle, 
  Menu, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  ExternalLink,
  Store,
  Palette,
  Truck,
  Globe,
  Plus,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import EditTour from '../components/EditTour';
import { storeFontOptions } from '../lib/storeFonts';

const customDomainRequestUrl = 'https://wa.me/2348078399410?text=Hello%20Unbley%2C%20I%20would%20like%20to%20request%20a%20custom%20domain%20for%20my%20store.';

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

export default function Edit() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEditTour, setShowEditTour] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  // Refs for hidden file inputs
  const logoRef = useRef(null);
  const bannerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [formData, setFormData] = useState({
    brand_name: '',
    owner_name: '',
    email_address: '',
    phone_number: '',
    brand_category: '',
    delivery_duration: '',
    refund_policy: '',
    shipping_policy: '',
    same_city_delivery_fee: '',
    same_state_delivery_fee: '',
    outside_state_delivery_fee: '',
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
    store_font: 'inter',
    brand_name_font: 'inter',
    logo_url: '',
    banner_url: '',
    banner_url_2: '',
    banner_url_3: '',
    banner_url_4: '',
    product_1_url: '',
    product_2_url: '',
    product_3_url: '',
    product_4_url: '',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    tiktok_url: '',
    website_url: '',
    unbley_domain: '',
    custom_domain: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    paystack_subaccount_code: '',
    flutterwave_subaccount_code: ''
  });

  const isBusinessPlan = Boolean(
    user?.plan_id === 'business' &&
    user?.plan_ends_at &&
    new Date(user.plan_ends_at) > new Date()
  );

  const [themeColors, setThemeColors] = useState({
    primary: '#0A0A0A',
    secondary: '#1A1A1A',
    accent: '#06acf8'
  });

  // Calculate profile completion percentage
  const calcProgress = () => {
    const fields = [
      formData.brand_name,
      formData.owner_name,
      formData.email_address,
      formData.phone_number,
      formData.brand_category,
      formData.delivery_duration,
      formData.brand_narrative,
      formData.logo_url,
      formData.banner_url
    ];
    const filled = fields.filter(f => Boolean(f && f !== 'Your Brand' && f !== 'Brand Owner')).length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calcProgress();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) console.error('Error fetching profile:', error);

        let baseData = {};
        if (data) {
          baseData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != null && v !== '')
          );
        } else {
          const savedDraft = localStorage.getItem(`unbley_edit_draft_${user.id}`);
          if (savedDraft) {
            try {
              baseData = { ...baseData, ...JSON.parse(savedDraft) };
            } catch {
              console.warn('Could not restore the saved edit draft.');
            }
          }
        }

        setFormData(prev => ({ ...prev, ...baseData }));
        setThemeColors({
          primary: baseData.primary_color || '#0A0A0A',
          secondary: baseData.secondary_color || '#1A1A1A',
          accent: baseData.accent_color || '#06acf8'
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }

    fetchProfile();

    const channel = supabase
      .channel(`edit_profile_sync_${user?.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brand_profiles', filter: `id=eq.${user?.id}` },
        (payload) => {
          if (payload.new) {
            const d = payload.new;
            setFormData(prev => ({ ...prev, ...d }));
            if (d.primary_color || d.secondary_color || d.accent_color) {
              setThemeColors(prev => ({
                primary: d.primary_color || prev.primary,
                secondary: d.secondary_color || prev.secondary,
                accent: d.accent_color || prev.accent
              }));
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Auto-save debounced
  const autoSave = useCallback(async (data) => {
    if (!user?.id || !data.brand_name) return;
    setSaveStatus('saving');
    try {
      const clean = { ...data };
      delete clean.paystack_subaccount_code;
      delete clean.flutterwave_subaccount_code;
      delete clean.is_admin;
      const { error: saveErr } = await supabase
        .from('brand_profiles')
        .upsert({ ...clean, id: user.id, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      
      if (saveErr) {
        setSaveStatus('idle');
        return;
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user || !formData.brand_name) return;
    const timeout = setTimeout(() => autoSave(formData), 1500);
    return () => clearTimeout(timeout);
  }, [formData, user, autoSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (colorName, value) => {
    setThemeColors(prev => ({ ...prev, [colorName]: value }));
    setFormData(prev => ({ ...prev, [`${colorName}_color`]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${fieldName}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      if (toast) toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error.message);
      if (toast) toast.error('Error uploading image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) throw new Error("Not authenticated");
      
      const updatableFormData = { ...formData };
      delete updatableFormData.paystack_subaccount_code;
      delete updatableFormData.flutterwave_subaccount_code;
      delete updatableFormData.is_admin;
      
      const payload = {
        ...updatableFormData,
        id: user.id,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('brand_profiles')
        .upsert(payload, { onConflict: 'id' });
        
      if (profileError) throw profileError;
      
      await supabase.auth.updateUser({
        data: { profile_completed: true }
      });
      
      localStorage.removeItem(`unbley_edit_draft_${user.id}`);
      await refreshUser();

      if (toast) toast.success("Store settings updated successfully!");
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      if (toast) toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="unbley-app-layout">
        
        {/* Hidden inputs for uploads */}
        <input type="file" ref={logoRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
        {['banner_url', 'banner_url_2', 'banner_url_3', 'banner_url_4'].map((fieldName, index) => (
          <input key={fieldName} type="file" ref={bannerRefs[index]} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, fieldName)} />
        ))}

        {/* Unified Collapsible Sidebar */}
        <Sidebar 
          profileData={formData} 
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
                    Store Settings & Customization
                  </h1>
                  {saveStatus === 'saving' && (
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#8D5B36', letterSpacing: '0.05em' }}>
                      Saving...
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="unbley-live-badge">
                      <CheckCircle2 size={12} /> SAVED
                    </span>
                  )}
                </div>
                <p className="unbley-header-subtitle">
                  Update your brand visuals, storefront copy, delivery settings, and inventory.
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="unbley-header-actions">
              <button
                onClick={() => setShowEditTour(true)}
                className="unbley-btn-white"
              >
                <HelpCircle size={14} />
                <span>Tour Guide</span>
              </button>

              <button
                id="tour-edit-save-btn"
                onClick={handleSubmit}
                disabled={loading}
                className="unbley-btn-black"
              >
                <Save size={14} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </header>

          {/* Edit Form Area */}
          <main className="unbley-workspace-container">
            
            {/* Completion Meter Card */}
            <div id="tour-edit-progress" className="unbley-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="unbley-icon-box-cream">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Store Readiness Checklist ({progress}%)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                    Complete all basic info to optimize conversion and buyer trust.
                  </p>
                </div>
              </div>

              <div style={{ width: '260px', maxWidth: '100%' }}>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${progress}%`, 
                      height: '100%', 
                      backgroundColor: '#16A34A', 
                      borderRadius: '9999px', 
                      transition: 'width 0.5s ease' 
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Storefront Hero Banner Box */}
            <div id="tour-edit-banner" className="unbley-card">
              <div className="unbley-card-title-row">
                <div>
                  <span className="unbley-card-pretitle">
                    Storefront Appearance
                  </span>
                  <h3 className="unbley-card-title">
                    Hero Banner Image
                  </h3>
                </div>
                <button
                  onClick={() => bannerRefs[0].current?.click()}
                  className="unbley-btn-black"
                  style={{ padding: '6px 14px' }}
                >
                  <Upload size={13} />
                  <span>{formData.banner_url ? 'Change Banner' : 'Upload Banner'}</span>
                </button>
              </div>

              {!isBusinessPlan && <p style={{ color: '#8C827A', fontSize: '12px', margin: '0 0 16px' }}>Your plan includes one hero banner. Upgrade to Business to add up to four rotating hero banners.</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {['banner_url', ...(isBusinessPlan ? ['banner_url_2', 'banner_url_3', 'banner_url_4'] : [])].map((fieldName, index) => (
                  <div key={fieldName}>
                    <div
                      className="unbley-banner-dropzone"
                      style={{ minHeight: '120px', backgroundImage: formData[fieldName] ? `url(${formData[fieldName]})` : 'none' }}
                      onClick={() => bannerRefs[index].current?.click()}
                    >
                      {!formData[fieldName] && <div style={{ textAlign: 'center', color: '#8C827A', padding: '16px' }}><ImageIcon size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} /><p style={{ fontSize: '11px', fontWeight: '700', margin: 0 }}>Banner {index + 1}</p></div>}
                      {formData[fieldName] && <div className="unbley-dropzone-overlay">Change Banner {index + 1}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Column Grid: Core Details vs Logo & Colors */}
            <div className="unbley-edit-grid">
              
              {/* Left Form Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Core Brand Identity */}
                <div id="tour-edit-core-identity" className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">
                        Brand Foundation
                      </span>
                      <h3 className="unbley-card-title">
                        Core Identity & Contacts
                      </h3>
                    </div>
                  </div>

                  <div className="unbley-form-grid-2">
                    <div className="unbley-form-group">
                      <label className="unbley-form-label">
                        Brand Name
                      </label>
                      <input 
                        type="text" 
                        name="brand_name"
                        value={formData.brand_name}
                        onChange={handleChange}
                        placeholder="e.g. Zizzystores"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">
                        Principal Director / Owner
                      </label>
                      <input 
                        type="text" 
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleChange}
                        placeholder="e.g. Big Z"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">
                        Business Email
                      </label>
                      <input 
                        type="email" 
                        name="email_address"
                        value={formData.email_address}
                        onChange={handleChange}
                        placeholder="business@example.com"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">
                        WhatsApp / Phone Hotline
                      </label>
                      <input 
                        type="text" 
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="e.g. 09153625566"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">
                        Brand Category
                      </label>
                      <input 
                        type="text" 
                        name="brand_category"
                        value={formData.brand_category}
                        onChange={handleChange}
                        placeholder="e.g. Streetwear & Fashion"
                        className="unbley-form-input"
                      />
                    </div>

                    <div id="tour-edit-delivery" className="unbley-form-group">
                      <label className="unbley-form-label">
                        Standard Delivery Duration
                      </label>
                      <input 
                        type="text" 
                        name="delivery_duration"
                        value={formData.delivery_duration}
                        onChange={handleChange}
                        placeholder="e.g. 1-3 Business Days"
                        className="unbley-form-input"
                      />
                    </div>

                  </div>

                  <div className="unbley-form-group" style={{ marginTop: '8px' }}>
                    <label className="unbley-form-label">
                      Brand Narrative & Bio
                    </label>
                    <textarea 
                      name="brand_narrative"
                      rows={3}
                      value={formData.brand_narrative}
                      onChange={handleChange}
                      placeholder="Brief story highlighting your brand ethos and offering..."
                      className="unbley-form-textarea"
                    />
                  </div>

                  <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                    <label className="unbley-form-label">
                      Brand Manifesto
                    </label>
                    <textarea 
                      name="manifesto"
                      rows={2}
                      value={formData.manifesto}
                      onChange={handleChange}
                      placeholder="Our core guiding statement..."
                      className="unbley-form-textarea"
                    />
                  </div>

                  <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                    <label className="unbley-form-label">
                      Refund Policy
                    </label>
                    <textarea
                      name="refund_policy"
                      rows={4}
                      value={formData.refund_policy}
                      onChange={handleChange}
                      placeholder="Explain your return and refund terms for customers..."
                      className="unbley-form-textarea"
                    />
                  </div>

                  <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                    <label className="unbley-form-label">
                      Shipping Policy
                    </label>
                    <textarea
                      name="shipping_policy"
                      rows={4}
                      value={formData.shipping_policy}
                      onChange={handleChange}
                      placeholder="Explain your delivery timelines, fees, and shipping process..."
                      className="unbley-form-textarea"
                    />
                  </div>
                </div>

                {/* Store Domains */}
                <div id="tour-edit-domains" className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">Store Address</span>
                      <h3 className="unbley-card-title">Your Store Domains</h3>
                    </div>
                    <Globe size={20} color="#8D5B36" />
                  </div>

                  <div className="unbley-form-group">
                    <label className="unbley-form-label">Your Unbley Store URL</label>
                    <div className="unbley-domain-readonly">
                      <Globe size={16} />
                      <a href={formData.unbley_domain ? `https://${formData.unbley_domain}` : '#'} target="_blank" rel="noreferrer">
                        {formData.unbley_domain || 'Your store URL will appear after setup'}
                      </a>
                      {formData.unbley_domain && <ExternalLink size={14} />}
                    </div>
                  </div>

                  {isBusinessPlan && (
                    <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                      <label className="unbley-form-label">Custom Domain</label>
                      <input
                        type="text"
                        name="custom_domain"
                        value={formData.custom_domain}
                        onChange={handleChange}
                        placeholder="e.g. shop.yourbrand.com"
                        className="unbley-form-input"
                      />
                      <p className="unbley-domain-help">Enter the domain you want to use, then request setup so our team can connect and verify it. Your Unbley URL will keep working as a backup.</p>
                      <a
                        href={customDomainRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="unbley-button unbley-button-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', padding: '11px 16px', backgroundColor: '#111827', color: '#FFFFFF', border: '1px solid #111827', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 5px rgba(17, 24, 39, 0.18)' }}
                      >
                        <MessageCircle size={16} />
                        Request Custom Domain
                      </a>
                    </div>
                  )}
                  {!isBusinessPlan && (
                    <div style={{ marginTop: '16px', padding: '14px 16px', border: '1px solid #E8D8C8', borderRadius: '6px', backgroundColor: '#FFF9F2' }}>
                      <p style={{ margin: '0 0 10px', color: '#6B4A35', fontSize: '12px', lineHeight: 1.5 }}>
                        Upgrade to the Business Plan to connect a custom domain to your store.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/activation', { state: { upgradeTo: 'business' } })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: 'none', borderRadius: '6px', backgroundColor: '#6A3E1F', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Upgrade to Business
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Channels */}
                <div id="tour-edit-socials" className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">
                        Social Presence
                      </span>
                      <h3 className="unbley-card-title">
                        Social Links & Handles
                      </h3>
                    </div>
                  </div>

                  <div className="unbley-form-grid-2">
                    <div className="unbley-social-input-row">
                      <InstagramIcon size={18} color="#E1306C" />
                      <input 
                        type="text" 
                        name="instagram_url"
                        value={formData.instagram_url}
                        onChange={handleChange}
                        placeholder="Instagram URL"
                      />
                    </div>

                    <div className="unbley-social-input-row">
                      <TwitterIcon size={16} color="#18181B" />
                      <input 
                        type="text" 
                        name="twitter_url"
                        value={formData.twitter_url}
                        onChange={handleChange}
                        placeholder="X / Twitter URL"
                      />
                    </div>

                    <div className="unbley-social-input-row">
                      <TikTokIcon size={18} color="#18181B" />
                      <input 
                        type="text" 
                        name="tiktok_url"
                        value={formData.tiktok_url}
                        onChange={handleChange}
                        placeholder="TikTok URL"
                      />
                    </div>

                    <div className="unbley-social-input-row">
                      <FacebookIcon size={18} color="#1877F2" />
                      <input 
                        type="text" 
                        name="facebook_url"
                        value={formData.facebook_url}
                        onChange={handleChange}
                        placeholder="Facebook URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Geography & Location */}
                <div className="unbley-card">
                  <div className="unbley-card-title-row">
                    <div>
                      <span className="unbley-card-pretitle">
                        Shipping Origin
                      </span>
                      <h3 className="unbley-card-title">
                        Geography &amp; Location
                      </h3>
                    </div>
                  </div>

                  <div className="unbley-form-grid-2">
                    <div className="unbley-form-group">
                      <label className="unbley-form-label">Country</label>
                      <input 
                        type="text" 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. Nigeria"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">State / Province</label>
                      <input 
                        type="text" 
                        name="state_province"
                        value={formData.state_province}
                        onChange={handleChange}
                        placeholder="e.g. Lagos"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Ikeja"
                        className="unbley-form-input"
                      />
                    </div>

                    <div className="unbley-form-group">
                      <label className="unbley-form-label">Postal Code</label>
                      <input 
                        type="text" 
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="e.g. 100001"
                        className="unbley-form-input"
                      />
                    </div>
                  </div>

                  <div className="unbley-form-group">
                    <label className="unbley-form-label">Address Line 1</label>
                    <input 
                      type="text" 
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleChange}
                      placeholder="Street number & name"
                      className="unbley-form-input"
                    />
                  </div>

                  <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                    <label className="unbley-form-label">Address Line 2 (Optional)</label>
                    <input 
                      type="text" 
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleChange}
                      placeholder="Apartment, suite, unit, etc."
                      className="unbley-form-input"
                    />
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #EAE3D9' }}>
                    <div style={{ marginBottom: '14px' }}>
                      <span className="unbley-card-pretitle">Delivery Fees</span>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>
                        Fees are selected automatically from the buyer's city and state at checkout.
                      </p>
                    </div>

                    <div className="unbley-form-grid-2">
                      <div className="unbley-form-group">
                        <label className="unbley-form-label">Within {formData.city || 'your city'}</label>
                        <input type="number" name="same_city_delivery_fee" value={formData.same_city_delivery_fee} onChange={handleChange} min="0" step="0.01" placeholder="e.g. 1500" className="unbley-form-input" />
                      </div>

                      <div className="unbley-form-group">
                        <label className="unbley-form-label">Within {formData.state_province || 'your state'} (outside your city)</label>
                        <input type="number" name="same_state_delivery_fee" value={formData.same_state_delivery_fee} onChange={handleChange} min="0" step="0.01" placeholder="e.g. 2500" className="unbley-form-input" />
                      </div>

                      <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                        <label className="unbley-form-label">Outside {formData.state_province || 'your state'}</label>
                        <input type="number" name="outside_state_delivery_fee" value={formData.outside_state_delivery_fee} onChange={handleChange} min="0" step="0.01" placeholder="e.g. 4000" className="unbley-form-input" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Logo & Color Palette */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Logo Upload Card */}
                <div id="tour-edit-logo" className="unbley-card" style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <span className="unbley-card-pretitle">
                      Identity Glyph
                    </span>
                    <h3 className="unbley-card-title">
                      Brand Logo
                    </h3>
                  </div>

                  <div 
                    onClick={() => logoRef.current?.click()}
                    className="unbley-logo-dropzone"
                  >
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#8C827A' }}>
                        <ImageIcon size={28} style={{ margin: '0 auto 4px', opacity: 0.5 }} />
                        <span style={{ fontSize: '11px', fontWeight: '700' }}>1:1 Square</span>
                      </div>
                    )}
                    <div className="unbley-dropzone-overlay">
                      Upload
                    </div>
                  </div>

                  <button
                    onClick={() => logoRef.current?.click()}
                    className="unbley-btn-white"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Change Logo
                  </button>
                </div>

                {/* Color Palette Card */}
                <div id="tour-edit-colors" className="unbley-card">
                  <div style={{ marginBottom: '16px' }}>
                    <span className="unbley-card-pretitle">
                      Theme System
                    </span>
                    <h3 className="unbley-card-title">
                      Brand Color Palette
                    </h3>
                  </div>

                  <div>
                    <div className="unbley-color-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: themeColors.primary }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>Primary Base</span>
                      </div>
                      <input 
                        type="color" 
                        value={themeColors.primary} 
                        onChange={(e) => handleColorChange('primary', e.target.value)} 
                        style={{ width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                      />
                    </div>

                    <div className="unbley-color-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: themeColors.secondary }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>Secondary Accent</span>
                      </div>
                      <input 
                        type="color" 
                        value={themeColors.secondary} 
                        onChange={(e) => handleColorChange('secondary', e.target.value)} 
                        style={{ width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                      />
                    </div>

                    <div className="unbley-color-row" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: themeColors.accent }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>Vibrant Highlight</span>
                      </div>
                      <input 
                        type="color" 
                        value={themeColors.accent} 
                        onChange={(e) => handleColorChange('accent', e.target.value)} 
                        style={{ width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #EAE3D9' }}>
                    <label className="unbley-form-label" htmlFor="store-font">Store Font</label>
                    <select
                      id="store-font"
                      name="store_font"
                      value={formData.store_font}
                      onChange={handleChange}
                      className="unbley-form-input"
                      style={{ fontFamily: storeFontOptions.find(font => font.value === formData.store_font)?.family || 'inherit' }}
                    >
                      {storeFontOptions.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.family }}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0' }}>
                      This font will be used across your public storefront.
                    </p>
                    {isBusinessPlan && (
                      <div style={{ marginTop: '18px' }}>
                        <label className="unbley-form-label" htmlFor="brand-name-font">Brand Name Font</label>
                        <select
                          id="brand-name-font"
                          name="brand_name_font"
                          value={formData.brand_name_font || formData.store_font}
                          onChange={handleChange}
                          className="unbley-form-input"
                          style={{ fontFamily: storeFontOptions.find(font => font.value === (formData.brand_name_font || formData.store_font))?.family || 'inherit' }}
                        >
                          {storeFontOptions.map(font => (
                            <option key={font.value} value={font.value} style={{ fontFamily: font.family }}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0' }}>
                          Used for your brand name in the public store.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Personal Settlement Account */}
            <div className="unbley-card">
              <div className="unbley-card-title-row">
                <div>
                  <span className="unbley-card-pretitle">
                    Financial Details
                  </span>
                  <h3 className="unbley-card-title">
                    Personal Settlement Account
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '20px', marginTop: '-8px' }}>
                Backup account for manual payouts and internal reference.
              </p>

              <div className="unbley-form-grid-2">
                <div className="unbley-form-group">
                  <label className="unbley-form-label">Bank Name</label>
                  <input 
                    type="text" 
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    placeholder="e.g. First Bank"
                    className="unbley-form-input"
                  />
                </div>

                <div className="unbley-form-group">
                  <label className="unbley-form-label">Account Number</label>
                  <input 
                    type="text" 
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    placeholder="10-digit account number"
                    className="unbley-form-input"
                  />
                </div>
              </div>

              <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                <label className="unbley-form-label">Account Name</label>
                <input 
                  type="text" 
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  placeholder="e.g. JOHN DOE"
                  className="unbley-form-input"
                />
              </div>
            </div>

            {/* Payout Configuration — Read Only */}
            <div className="unbley-tip-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="unbley-tip-header">🔒 Payout Configuration</span>
              </div>
              <p className="unbley-tip-body" style={{ marginBottom: '16px' }}>
                These identifiers are managed by the platform administrator to ensure secure revenue routing. Contact support to update your payout destination.
              </p>
              <div className="unbley-form-grid-2">
                <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                  <label className="unbley-form-label">Paystack Subaccount (Local)</label>
                  <input 
                    type="text" 
                    value={formData.paystack_subaccount_code || 'Not Configured'} 
                    readOnly
                    className="unbley-form-input"
                    style={{ 
                      cursor: 'not-allowed', 
                      color: formData.paystack_subaccount_code ? '#111827' : '#9CA3AF',
                      backgroundColor: '#F3F4F6'
                    }}
                  />
                </div>
                <div className="unbley-form-group" style={{ marginBottom: 0 }}>
                  <label className="unbley-form-label">Flutterwave Subaccount (International)</label>
                  <input 
                    type="text" 
                    value={formData.flutterwave_subaccount_code || 'Not Configured'} 
                    readOnly
                    className="unbley-form-input"
                    style={{ 
                      cursor: 'not-allowed', 
                      color: formData.flutterwave_subaccount_code ? '#111827' : '#9CA3AF',
                      backgroundColor: '#F3F4F6'
                    }}
                  />
                </div>
              </div>
            </div>

          </main>
        </div>

        {/* Edit Tour */}
        <EditTour 
          isActive={showEditTour} 
          onClose={() => setShowEditTour(false)} 
          userId={user?.id}
          onSidebarToggle={(open) => setIsSidebarOpen(open)}
        />

      </div>
    </PageTransition>
  );
}
