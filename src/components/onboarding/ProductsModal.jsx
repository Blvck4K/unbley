import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, AlertCircle, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function ProductsModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);
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
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

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

      // Update image URL without submitting form! User can now enter description and click Add Product themselves
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (err) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset input value so same file could be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.price) {
      setError('Please fill in both product name and price');
      return;
    }

    if (uploadingImage) {
      setError('Please wait for the product image to finish uploading');
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            brand_id: user.id,
            title: formData.title.trim(),
            price: parseFloat(formData.price) || 0,
            description: formData.description?.trim() || '',
            image_url: formData.image_url || '',
            status: 'active'
          }
        ]);

      if (insertError) throw insertError;

      // Reset form on success
      setFormData({
        title: '',
        price: '',
        description: '',
        image_url: ''
      });

      onComplete?.();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
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
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Inter", sans-serif'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid #EAE3D9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#111827',
                margin: 0,
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Tag size={22} color="#6A3E1F" />
                Add New Product
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Enter your product details, upload photos, write your description and submit.
              </p>
            </div>
            <button
              type="button"
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

          {/* Scrollable Content Body */}
          <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  fontSize: '13px',
                  color: '#991B1B',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Prevent accidental form submission when pressing enter in single-line inputs
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Product Name & Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px' }}>
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
                    placeholder="e.g., Signature Trench Coat"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '13.5px',
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
                    placeholder="25,000"
                    step="any"
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '13.5px',
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
              </div>

              {/* Product Image Section */}
              <div>
                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  <span>Product Image</span>
                  {formData.image_url && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '0',
                        fontWeight: '600'
                      }}
                    >
                      Remove Image
                    </button>
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="product-photo-upload-input"
                />

                {formData.image_url ? (
                  <div style={{
                    border: '1px solid #EAE3D9',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    backgroundColor: '#FAFAF9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <img
                      src={formData.image_url}
                      alt="Product Preview"
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                        Image Uploaded Successfully
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        Ready for display on your storefront
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '7px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (!uploadingImage) {
                        fileInputRef.current?.click();
                      }
                    }}
                    style={{
                      border: '2px dashed #D1D5DB',
                      borderRadius: '10px',
                      padding: '24px 20px',
                      textAlign: 'center',
                      cursor: uploadingImage ? 'wait' : 'pointer',
                      backgroundColor: uploadingImage ? '#F9FAFB' : '#FAFAF9',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!uploadingImage) {
                        e.currentTarget.style.borderColor = '#6A3E1F';
                        e.currentTarget.style.backgroundColor = '#FFFBF8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!uploadingImage) {
                        e.currentTarget.style.borderColor = '#D1D5DB';
                        e.currentTarget.style.backgroundColor = '#FAFAF9';
                      }
                    }}
                  >
                    {uploadingImage ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          border: '3px solid #E5E7EB',
                          borderTopColor: '#6A3E1F',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: 0 }}>
                          Uploading image to storage...
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                          Your form will remain intact.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} color="#6B7280" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '4px 0 2px' }}>
                          Click to upload product image
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                          PNG, JPG, or WEBP up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product's craftsmanship, key details, materials, sizing, dimensions, and styling notes..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '11px',
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
                  disabled={loading || uploadingImage || !formData.title?.trim() || !formData.price}
                  style={{
                    flex: 2,
                    padding: '11px 20px',
                    backgroundColor: loading || uploadingImage || !formData.title?.trim() || !formData.price ? '#D1D5DB' : '#6A3E1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    cursor: loading || uploadingImage || !formData.title?.trim() || !formData.price ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(106, 62, 31, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !uploadingImage && formData.title?.trim() && formData.price) {
                      e.currentTarget.style.backgroundColor = '#5a3219';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !uploadingImage && formData.title?.trim() && formData.price) {
                      e.currentTarget.style.backgroundColor = '#6A3E1F';
                    }
                  }}
                >
                  {loading ? 'Adding Product...' : uploadingImage ? 'Uploading Image...' : 'Add Product'}
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
