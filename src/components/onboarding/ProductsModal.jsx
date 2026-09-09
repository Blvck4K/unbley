import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, AlertCircle, Upload, Pencil } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const createEmptyForm = () => ({ title: '', price: '', description: '', image_urls: ['', '', '', '', ''] });

export default function ProductsModal({ isOpen = false, onClose, onComplete, editProduct = null }) {
  const { user } = useAuth();
  const isEditMode = Boolean(editProduct);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRefs = React.useRef(Array(5).fill(null).map(() => React.createRef()));

  const [formData, setFormData] = useState(createEmptyForm);

  // When editProduct changes (modal opened for a specific product), pre-fill the form
  useEffect(() => {
    if (editProduct) {
      const imageUrlsArray = ['', '', '', '', ''];
      if (editProduct.image_url) {
        const urls = editProduct.image_url.split(',').map(url => url.trim()).filter(url => url);
        urls.forEach((url, idx) => {
          if (idx < 5) imageUrlsArray[idx] = url;
        });
      }
      setFormData({
        title: editProduct.title || editProduct.name || '',
        price: editProduct.price !== undefined ? String(editProduct.price) : '',
        description: editProduct.description || '',
        image_urls: imageUrlsArray
      });
      setError(null);
    } else {
      setFormData(createEmptyForm());
      setError(null);
    }
  }, [editProduct, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleImageUpload = async (e, slotIndex) => {
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
      const fileName = `${user.id}-product-${Date.now()}-${slotIndex}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(`products/${fileName}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(`products/${fileName}`);

      setFormData(prev => {
        const newUrls = [...prev.image_urls];
        newUrls[slotIndex] = data.publicUrl;
        return { ...prev, image_urls: newUrls };
      });
    } catch (err) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRefs.current[slotIndex]) {
        fileInputRefs.current[slotIndex].value = '';
      }
    }
  };

  const handleRemoveImage = (e, slotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => {
      const newUrls = [...prev.image_urls];
      newUrls[slotIndex] = '';
      return { ...prev, image_urls: newUrls };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedPrice = Number(formData.price);
    if (!formData.title?.trim() || !formData.price || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Please fill in both product name and price');
      return;
    }

    if (uploadingImage) {
      setError('Please wait for the product image to finish uploading');
      return;
    }

    setLoading(true);
    try {
      // Join image URLs - first is cover, rest are comma-separated extras
      const image_url = formData.image_urls.filter(url => url).join(',');

      if (isEditMode) {
        // UPDATE existing product
        const { error: updateError } = await supabase
          .from('products')
          .update({
            title: formData.title.trim(),
            price: parsedPrice,
            description: formData.description?.trim() || '',
            image_url: image_url
          })
          .eq('id', editProduct.id)
          .eq('brand_id', user.id);

        if (updateError) throw updateError;
      } else {
        // INSERT new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([
            {
              brand_id: user.id,
              title: formData.title.trim(),
              price: parsedPrice,
              description: formData.description?.trim() || '',
              image_url: image_url,
              status: 'active'
            }
          ]);

        if (insertError) throw insertError;
      }

      onComplete?.();
      handleClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData(createEmptyForm());
    onClose?.();
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease'
  };

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
                {isEditMode ? <Pencil size={22} color="#6A3E1F" /> : <Tag size={22} color="#6A3E1F" />}
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                {isEditMode
                  ? 'Update your product details below and save when done.'
                  : 'Enter your product details, upload photos, write your description and submit.'}
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
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.color = '#111827'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.color = '#6B7280'; }}
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
                <p style={{ fontSize: '13px', color: '#991B1B', margin: 0, fontWeight: '500' }}>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Product Name & Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Signature Trench Coat"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
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
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Product Images Grid */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  Product Images (up to 5)
                </label>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px 0' }}>First image will be the cover photo</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {formData.image_urls.map((imageUrl, idx) => (
                    <div key={idx}>
                      <input
                        ref={el => fileInputRefs.current[idx] = el}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => handleImageUpload(e, idx)}
                        style={{ display: 'none' }}
                      />
                      
                      {imageUrl ? (
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '100%',
                            backgroundColor: '#FAFAF9',
                            borderRadius: '10px',
                            border: '1px solid #EAE3D9',
                            overflow: 'hidden',
                            cursor: 'pointer'
                          }}
                          onClick={() => fileInputRefs.current[idx]?.click()}
                        >
                          <img
                            src={imageUrl}
                            alt={`Product ${idx + 1}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            className="image-overlay"
                          >
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '8px', borderRadius: '6px', textAlign: 'center', color: 'white', fontSize: '11px', fontWeight: '600' }}>
                              Click to change
                            </div>
                          </div>
                          {idx === 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              backgroundColor: '#6A3E1F',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '700'
                            }}>
                              COVER
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(e, idx);
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              left: '4px',
                              backgroundColor: 'rgba(220, 38, 38, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '10px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '100%',
                            backgroundColor: '#FAFAF9',
                            border: '2px dashed #D1D5DB',
                            borderRadius: '10px',
                            cursor: uploadingImage ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { if (!uploadingImage) { e.currentTarget.style.borderColor = '#6A3E1F'; e.currentTarget.style.backgroundColor = '#FFFBF8'; } }}
                          onMouseLeave={(e) => { if (!uploadingImage) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#FAFAF9'; } }}
                        >
                          <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <Upload size={16} color="#9CA3AF" style={{ margin: '0 auto 4px' }} />
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280' }}>
                              {idx === 0 ? 'Cover' : `Image ${idx + 1}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
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
                  onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
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
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
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
                  onMouseEnter={(e) => { if (!loading && !uploadingImage && formData.title?.trim() && formData.price) e.currentTarget.style.backgroundColor = '#5a3219'; }}
                  onMouseLeave={(e) => { if (!loading && !uploadingImage && formData.title?.trim() && formData.price) e.currentTarget.style.backgroundColor = '#6A3E1F'; }}
                >
                  {loading
                    ? (isEditMode ? 'Saving Changes...' : 'Adding Product...')
                    : uploadingImage
                    ? 'Uploading Image...'
                    : (isEditMode ? 'Save Changes' : 'Add Product')}
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
