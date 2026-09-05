import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function ShippingModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    delivery_duration: '',
    local_shipping: '',
    international_shipping: '',
    shipping_description: '',
    country: '',
    state_province: '',
    city: '',
    postal_code: '',
    address_line_1: '',
    address_line_2: ''
  });

  React.useEffect(() => {
    async function fetchShippingInfo() {
      if (!user || !isOpen) return;
      try {
        const { data, error: fetchErr } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchErr) {
          console.warn("ShippingModal: fetch warning:", fetchErr.message);
        }
        if (data) {
          setFormData(prev => ({
            ...prev,
            delivery_duration: data.delivery_duration || '',
            shipping_description: data.shipping_description || '',
            country: data.country || '',
            state_province: data.state_province || '',
            city: data.city || '',
            postal_code: data.postal_code || '',
            address_line_1: data.address_line_1 || '',
            address_line_2: data.address_line_2 || ''
          }));
        }
      } catch (e) {
        console.error("Error fetching shipping info:", e);
      }
    }
    fetchShippingInfo();
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.delivery_duration) {
      setError('Please specify delivery duration');
      return;
    }

    setLoading(true);
    try {
      const basePayload = {
        id: user.id,
        email_address: user.email || '',
        brand_name: user.user_metadata?.brand_name || user.user_metadata?.full_name || 'Your Brand',
        owner_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        delivery_duration: formData.delivery_duration,
        country: formData.country || '',
        state_province: formData.state_province || '',
        city: formData.city || '',
        postal_code: formData.postal_code || '',
        address_line_1: formData.address_line_1 || '',
        address_line_2: formData.address_line_2 || '',
        updated_at: new Date().toISOString()
      };

      // Try upserting with shipping_description if present; fallback to basePayload if column not in DB
      let saveError = null;
      if (formData.shipping_description) {
        const res = await supabase
          .from('brand_profiles')
          .upsert({ ...basePayload, shipping_description: formData.shipping_description }, { onConflict: 'id' });
        saveError = res.error;
      }

      if (!formData.shipping_description || saveError) {
        const baseRes = await supabase
          .from('brand_profiles')
          .upsert(basePayload, { onConflict: 'id' });
        if (baseRes.error) throw baseRes.error;
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

  const deliveryOptions = [
    { value: '1-2 days', label: '1-2 days (Express)' },
    { value: '2-3 days', label: '2-3 days (Standard)' },
    { value: '3-5 days', label: '3-5 days (Regular)' },
    { value: '5-7 days', label: '5-7 days (Economy)' },
    { value: '7-14 days', label: '7-14 days (International)' },
    { value: 'Custom', label: 'Custom (Specify below)' }
  ];

  const modalContent = (
    <AnimatePresence>
      <div
        className="shipping-overlay"
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
                <Truck size={24} color="#6A3E1F" />
                Setup Shipping & Delivery
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Configure delivery times and shipping options
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
              {/* Delivery Duration */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '10px'
                }}>
                  Delivery Duration *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {deliveryOptions.map((option) => (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      border: formData.delivery_duration === option.value ? '2px solid #6A3E1F' : '1px solid #D1D5DB',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: formData.delivery_duration === option.value ? '#FFFBF8' : '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.delivery_duration !== option.value) {
                        e.currentTarget.style.borderColor = '#9CA3AF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.delivery_duration !== option.value) {
                        e.currentTarget.style.borderColor = '#D1D5DB';
                      }
                    }}>
                      <input
                        type="radio"
                        name="delivery_duration"
                        value={option.value}
                        checked={formData.delivery_duration === option.value}
                        onChange={handleInputChange}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#6A3E1F'
                        }}
                      />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Duration Input */}
              {formData.delivery_duration === 'Custom' && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Custom Delivery Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10-15 business days"
                    value={formData.shipping_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, shipping_description: e.target.value }))}
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
              )}

              {/* Shipping Methods Info */}
              <div style={{
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '14px',
                marginTop: '8px'
              }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 10px 0'
                }}>
                  Shipping Methods
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10B981'
                    }}>
                      ✓
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>Local Shipping</p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Orders within your country</p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#EDE9FE',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#7C3AED'
                    }}>
                      ✓
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>International Shipping</p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Orders to international addresses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Fields */}
              <div style={{ marginTop: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📍 Business / Pickup Address
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="e.g., Nigeria"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                        onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>State / Province</label>
                      <input
                        type="text"
                        name="state_province"
                        value={formData.state_province}
                        onChange={handleInputChange}
                        placeholder="e.g., Lagos"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                        onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Ikeja"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                        onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="e.g., 100001"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                        onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Address Line 1</label>
                    <input
                      type="text"
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                      onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Address Line 2 <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span></label>
                    <input
                      type="text"
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, building, floor, etc."
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.15s ease' }}
                      onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBEF63',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#15803D',
                  margin: 0
                }}>
                  💡 Set realistic delivery times to maintain customer satisfaction and reduce disputes.
                </p>
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
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading ? '#D1D5DB' : '#6A3E1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#5a3219';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#6A3E1F';
                    }
                  }}
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
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
