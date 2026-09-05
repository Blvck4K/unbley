import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, AlertCircle, Upload, Image as ImageIcon, Globe } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function StoreInfoModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingProducts, setUploadingProducts] = useState({ p1: false, p2: false, p3: false, p4: false });
  const [error, setError] = useState(null);
  const bannerRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);
  const p4Ref = useRef(null);
  const [formData, setFormData] = useState({
    brand_name: '',
    owner_name: '',
    email_address: '',
    brand_category: '',
    primary_color: '#6A3E1F',
    secondary_color: '#FFFFFF',
    accent_color: '#10B981',
    logo_url: '',
    banner_url: '',
    brand_narrative: '',
    manifesto: '',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    tiktok_url: '',
    website_url: '',
    product_1_url: '',
    product_2_url: '',
    product_3_url: '',
    product_4_url: ''
  });

  const fetchStoreInfo = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.warn("StoreInfoModal fetch warning:", fetchError.message);
      }

      if (data) {
        setFormData(prev => ({
          ...prev,
          brand_name: data.brand_name || '',
          owner_name: data.owner_name || '',
          email_address: data.email_address || '',
          brand_category: data.brand_category || '',
          primary_color: data.primary_color || '#6A3E1F',
          secondary_color: data.secondary_color || '#FFFFFF',
          accent_color: data.accent_color || '#10B981',
          logo_url: data.logo_url || '',
          banner_url: data.banner_url || '',
          brand_narrative: data.brand_narrative || '',
          manifesto: data.manifesto || '',
          instagram_url: data.instagram_url || '',
          twitter_url: data.twitter_url || '',
          facebook_url: data.facebook_url || '',
          tiktok_url: data.tiktok_url || '',
          website_url: data.website_url || '',
          product_1_url: data.product_1_url || '',
          product_2_url: data.product_2_url || '',
          product_3_url: data.product_3_url || '',
          product_4_url: data.product_4_url || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching store info:', err);
    }
  }, [user]);

  React.useEffect(() => {
    if (isOpen && user) {
      fetchStoreInfo();
    }
  }, [isOpen, user, fetchStoreInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generic image upload helper
  const uploadImage = async (file, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${path}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('brand-assets')
      .upload(`${path}/${fileName}`, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('brand-assets').getPublicUrl(`${path}/${fileName}`);
    return data.publicUrl;
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file, 'logos');
      setFormData(prev => ({ ...prev, logo_url: url }));
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setUploadingBanner(true);
    try {
      const url = await uploadImage(file, 'banners');
      setFormData(prev => ({ ...prev, banner_url: url }));
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setUploadingBanner(false); }
  };

  const handleProductImageUpload = async (e, slot) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setUploadingProducts(prev => ({ ...prev, [slot]: true }));
    try {
      const url = await uploadImage(file, 'products');
      setFormData(prev => ({ ...prev, [`product_${slot}_url`]: url }));
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setUploadingProducts(prev => ({ ...prev, [slot]: false })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.brand_name || !formData.owner_name || !formData.brand_category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error: upsertError } = await supabase
        .from('brand_profiles')
        .upsert({
          id: user.id,
          brand_name: formData.brand_name,
          owner_name: formData.owner_name,
          email_address: formData.email_address,
          brand_category: formData.brand_category,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          logo_url: formData.logo_url,
          banner_url: formData.banner_url,
          brand_narrative: formData.brand_narrative,
          manifesto: formData.manifesto,
          instagram_url: formData.instagram_url,
          twitter_url: formData.twitter_url,
          facebook_url: formData.facebook_url,
          tiktok_url: formData.tiktok_url,
          website_url: formData.website_url,
          product_1_url: formData.product_1_url,
          product_2_url: formData.product_2_url,
          product_3_url: formData.product_3_url,
          product_4_url: formData.product_4_url,
          profile_completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (upsertError) throw upsertError;

      try {
        await supabase.auth.updateUser({
          data: {
            profile_completed: true,
            brand_name: formData.brand_name,
            full_name: formData.owner_name
          }
        });
      } catch (authErr) {
        console.warn("Auth metadata sync warning:", authErr);
      }

      onComplete?.();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="store-info-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D9',
            boxShadow: '0 20px 50px rgba(34, 21, 16, 0.2)',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            fontFamily: '"Inter", sans-serif'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '28px 28px 20px',
            borderBottom: '1px solid #EAE3D9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#111827',
                margin: 0,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Store size={24} color="#6A3E1F" />
                Complete Store Information
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Set up your brand identity and store details
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                color: '#6B7280',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  fontSize: '13px',
                  color: '#991B1B',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Logo Upload */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '10px'
                }}>
                  Store Logo
                </label>
                <div style={{
                  border: '2px dashed #D1D5DB',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#FAFAF9',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6A3E1F';
                  e.currentTarget.style.backgroundColor = '#FFFBF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.backgroundColor = '#FAFAF9';
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                    id="logo-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                    {formData.logo_url ? (
                      <div>
                        <img src={formData.logo_url} alt="Logo" style={{
                          maxWidth: '80px',
                          maxHeight: '80px',
                          margin: '0 auto 10px',
                          borderRadius: '4px'
                        }} />
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Click to change logo</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} color="#6B7280" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '8px 0 4px' }}>
                          {uploading ? 'Uploading...' : 'Upload logo'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  placeholder="Your brand name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Owner Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleInputChange}
                  placeholder="contact@yourbrand.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Brand Category */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Brand Category *
                </label>
                <select
                  name="brand_category"
                  value={formData.brand_category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Books & Media">Books & Media</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Primary Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleColorChange}
                      style={{
                        width: '44px',
                        height: '44px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{formData.primary_color}</span>
                  </div>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Secondary Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleColorChange}
                      style={{
                        width: '44px',
                        height: '44px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{formData.secondary_color}</span>
                  </div>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Accent Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="accent_color"
                      value={formData.accent_color}
                      onChange={handleColorChange}
                      style={{
                        width: '44px',
                        height: '44px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{formData.accent_color}</span>
                  </div>
                </div>
              </div>

              {/* Banner Image Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '10px' }}>
                  Store Banner <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span>
                </label>
                <div
                  style={{ border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#FAFAF9', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6A3E1F'; e.currentTarget.style.backgroundColor = '#FFFBF8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#FAFAF9'; }}
                  onClick={() => bannerRef.current?.click()}
                >
                  <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} disabled={uploadingBanner} />
                  {formData.banner_url ? (
                    <div>
                      <img src={formData.banner_url} alt="Banner" style={{ maxWidth: '100%', maxHeight: '80px', margin: '0 auto 8px', borderRadius: '4px', objectFit: 'cover' }} />
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Click to change banner</p>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={22} color="#6B7280" style={{ margin: '0 auto 6px' }} />
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '6px 0 3px' }}>{uploadingBanner ? 'Uploading...' : 'Upload store banner'}</p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Recommended: 1200×400px, PNG/JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Narrative */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                  Brand Story / Narrative <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span>
                </label>
                <textarea
                  name="brand_narrative"
                  value={formData.brand_narrative}
                  onChange={handleInputChange}
                  placeholder="Tell your brand's story — where you started, what drives you..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', transition: 'all 0.15s ease' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Manifesto */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                  Brand Manifesto / Tagline <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span>
                </label>
                <textarea
                  name="manifesto"
                  value={formData.manifesto}
                  onChange={handleInputChange}
                  placeholder="Your brand's core belief or mission statement..."
                  rows={2}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', transition: 'all 0.15s ease' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Social Links */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  🌐 Social Links &amp; Website <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'instagram_url', placeholder: 'https://instagram.com/yourbrand', label: 'Instagram' },
                    { name: 'twitter_url', placeholder: 'https://twitter.com/yourbrand', label: 'Twitter / X' },
                    { name: 'facebook_url', placeholder: 'https://facebook.com/yourbrand', label: 'Facebook' },
                    { name: 'tiktok_url', placeholder: 'https://tiktok.com/@yourbrand', label: 'TikTok' },
                    { name: 'website_url', placeholder: 'https://yourbrand.com', label: 'Website' }
                  ].map(({ name, placeholder, label }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', minWidth: '80px' }}>{label}</span>
                      <input
                        type="url"
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        style={{ flex: 1, padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '12px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                        onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Showcase Images */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  🛍️ Product Showcase Images <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional — up to 4)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[1, 2, 3, 4].map((n) => {
                    const slot = `p${n}`;
                    const key = `product_${n}_url`;
                    const refs = { p1: p1Ref, p2: p2Ref, p3: p3Ref, p4: p4Ref };
                    return (
                      <div
                        key={n}
                        style={{ border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#FAFAF9', transition: 'all 0.15s ease', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6A3E1F'; e.currentTarget.style.backgroundColor = '#FFFBF8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#FAFAF9'; }}
                        onClick={() => refs[slot].current?.click()}
                      >
                        <input ref={refs[slot]} type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, n)} style={{ display: 'none' }} disabled={uploadingProducts[slot]} />
                        {formData[key] ? (
                          <>
                            <img src={formData[key]} alt={`Product ${n}`} style={{ maxWidth: '100%', maxHeight: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                            <p style={{ fontSize: '10px', color: '#6B7280', margin: 0 }}>Click to change</p>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={18} color="#9CA3AF" />
                            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{uploadingProducts[slot] ? 'Uploading...' : `Product ${n}`}</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading || uploading ? '#D1D5DB' : '#6A3E1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: loading || uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !uploading) {
                      e.currentTarget.style.backgroundColor = '#5a3219';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !uploading) {
                      e.currentTarget.style.backgroundColor = '#6A3E1F';
                    }
                  }}
                >
                  {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
