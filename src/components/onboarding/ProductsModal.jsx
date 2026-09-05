import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, AlertCircle, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function ProductsModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // Step 1: Quick add, Step 2: Detailed add
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-product-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(`products/${fileName}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(`products/${fileName}`);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      setError('Please fill in product name and price');
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            brand_id: user.id,
            title: formData.title,
            price: parseFloat(formData.price) || 0,
            description: formData.description || '',
            image_url: formData.image_url || '',
            status: 'active'
          }
        ]);

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        title: '',
        price: '',
        description: '',
        image_url: ''
      });
      setStep(1);

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
    setStep(1);
    setFormData({
      title: '',
      price: '',
      description: '',
      image_url: ''
    });
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="products-overlay"
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
                <Tag size={24} color="#6A3E1F" />
                Add Your First Product
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Get started by adding your first product (step {step} of 2)
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
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  {/* Product Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Premium Leather Handbag"
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

                  {/* Price */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="15,000"
                      step="0.01"
                      min="0"
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

                  {/* Quick Actions */}
                  <div style={{
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '14px',
                    marginTop: '8px'
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 10px 0'
                    }}>
                      Quick Start Tips
                    </p>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <li style={{ fontSize: '12px', color: '#6B7280' }}>Use clear, descriptive product names</li>
                      <li style={{ fontSize: '12px', color: '#6B7280' }}>Set competitive prices for your market</li>
                      <li style={{ fontSize: '12px', color: '#6B7280' }}>You can add more details later</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Step 2: Detailed Info */}
              {step === 2 && (
                <>
                  {/* Product Image */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '10px'
                    }}>
                      Product Image
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
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="product-image-upload"
                      />
                      <label htmlFor="product-image-upload" style={{ cursor: 'pointer' }}>
                        {formData.image_url ? (
                          <div>
                            <img src={formData.image_url} alt="Product" style={{
                              maxWidth: '100px',
                              maxHeight: '100px',
                              margin: '0 auto 10px',
                              borderRadius: '4px'
                            }} />
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Click to change image</p>
                          </div>
                        ) : (
                          <div>
                            <Upload size={24} color="#6B7280" style={{ margin: '0 auto 8px' }} />
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '8px 0 4px' }}>
                              Upload product image
                            </p>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      Product Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product, materials, sizes, colors, etc."
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        resize: 'vertical',
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
                      ✓ You're almost done! Complete this step and you'll be ready to start selling.
                    </p>
                  </div>
                </>
              )}

              {/* Step Progress */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px'
              }}>
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: step >= s ? '#6A3E1F' : '#E5E7EB',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => step === 2 ? setStep(1) : handleClose()}
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
                  {step === 2 ? 'Back' : 'Cancel'}
                </button>
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.title || !formData.price}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: (!formData.title || !formData.price) ? '#D1D5DB' : '#6A3E1F',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      cursor: (!formData.title || !formData.price) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.title && formData.price) {
                        e.currentTarget.style.backgroundColor = '#5a3219';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.title && formData.price) {
                        e.currentTarget.style.backgroundColor = '#6A3E1F';
                      }
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !formData.title || !formData.price}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: loading || !formData.title || !formData.price ? '#D1D5DB' : '#6A3E1F',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      cursor: loading || !formData.title || !formData.price ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && formData.title && formData.price) {
                        e.currentTarget.style.backgroundColor = '#5a3219';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && formData.title && formData.price) {
                        e.currentTarget.style.backgroundColor = '#6A3E1F';
                      }
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                )}
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
