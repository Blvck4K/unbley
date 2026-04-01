import React, { useState, useEffect } from 'react';
import { ShoppingCart, Lock, ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePaystackPayment } from 'react-paystack';

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [brand, setBrand] = useState(null);

  useEffect(() => {
    async function fetchBrand() {
      if (cartItems.length > 0 && cartItems[0].brand_id) {
        if (!brand || brand.id !== cartItems[0].brand_id) {
          const { data } = await supabase.from('brand_profiles').select('*').eq('id', cartItems[0].brand_id).single();
          if (data) setBrand(data);
        }
      }
    }
    fetchBrand();
  }, [cartItems]);

  const accentColor = brand?.accent_color || '#0F2C59';
  const bgMain = brand?.primary_color || '#FAFAFA';
  const secondaryBg = brand?.secondary_color || '#FFFFFF';
  const textColor = brand ? '#FDFDFD' : '#111';
  const mutedColor = brand ? '#999' : '#666';
  const borderColor = brand?.secondary_color ? 'rgba(255,255,255,0.1)' : '#EAEAEA';
  const dangerColor = '#D83A3A';
  const inputBg = brand ? 'rgba(255,255,255,0.05)' : '#F4F4F5';

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal;

  const [formData, setFormData] = useState({
    firstName: 'Julianne',
    lastName: 'Moore',
    email: '',
    phone: '',
    address: 'Studio 42, 5th Avenue',
    city: 'New York',
    zip: '10001',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: total * 100, // Paystack amount is in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    ...(brand?.paystack_subaccount_code ? { subaccount: brand.paystack_subaccount_code } : {}),
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = (reference) => {
    setIsProcessing(false);
    localStorage.removeItem('cart');
    navigate('/checkout-success', { state: { reference } });
  };

  const onClose = () => {
    setIsProcessing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentSubmit = () => {
    // Validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Optional: scroll to first error
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!brand?.paystack_subaccount_code) {
      alert("This brand has not configured their payout setup yet. Checkout is temporarily disabled.");
      return;
    }

    setIsProcessing(true);
    initializePayment(onSuccess, onClose);
  };

  const s = {
    page: { backgroundColor: bgMain, color: textColor, minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden', display: 'flex', flexDirection: 'column' },
    
    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', backgroundColor: secondaryBg, borderBottom: `1px solid ${borderColor}` },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px', color: mutedColor, fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' },

    // Content Wrap
    contentWrap: { flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    // Stepper
    stepper: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' },
    step: { display: 'flex', alignItems: 'center', gap: '8px' },
    stepNumActive: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepNumIdle: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: secondaryBg, border: `1px solid ${borderColor}`, color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepTextActive: { fontSize: '13px', fontWeight: '700', color: accentColor },
    stepTextIdle: { fontSize: '13px', fontWeight: '500', color: mutedColor },
    stepLine: { width: '48px', height: '1px', backgroundColor: borderColor },

    // Main Layout
    layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '64px', maxWidth: '1200px', width: '100%' },

    // Left Col
    leftCol: { display: 'flex', flexDirection: 'column' },
    sectionTitle: { fontSize: '28px', fontWeight: '700', color: textColor, marginBottom: '32px' },
    sectionSubtitle: { fontSize: '14px', color: mutedColor, marginBottom: '24px', fontWeight: '500' },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    inputGroupFull: { display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' },
    label: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: textColor },
    input: { backgroundColor: inputBg, border: '1px solid transparent', padding: '16px', fontSize: '14px', color: textColor, borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s', width: '100%' },
    errorText: { color: dangerColor, fontSize: '11px', marginTop: '4px' },

    actionsCol: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' },
    continueBtn: { backgroundColor: accentColor, color: '#000', border: 'none', padding: '18px 32px', fontSize: '14px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'opacity 0.2s', width: '100%' },
    disclaimerText: { fontSize: '12px', color: mutedColor, textAlign: 'center' },
    backBtn: { background: 'none', border: 'none', color: mutedColor, fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '12px' },

    // Right Col
    rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    summaryBox: { backgroundColor: secondaryBg, padding: '32px', borderRadius: '4px', border: `1px solid ${borderColor}` },
    summaryTitle: { fontSize: '20px', fontWeight: '600', color: textColor, marginBottom: '32px' },
    
    summaryItem: { display: 'flex', gap: '16px', marginBottom: '24px' },
    summaryItemImg: { width: '64px', height: '64px', borderRadius: '4px', backgroundColor: '#111', overflow: 'hidden' },
    summaryItemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    summaryItemName: { fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '4px' },
    summaryItemVariant: { fontSize: '12px', color: mutedColor, marginBottom: '8px' },
    summaryItemPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    summaryItemQty: { fontSize: '12px', color: mutedColor },
    summaryItemPrice: { fontSize: '14px', fontWeight: '700', color: accentColor },

    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: mutedColor },
    summaryRowValue: { color: textColor, fontWeight: '500' },
    deliveryImportant: { fontSize: '11px', color: accentColor, fontWeight: '600', textAlign: 'right', marginTop: '-12px', marginBottom: '16px' },

    divider: { height: '1px', backgroundColor: borderColor, margin: '24px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    totalLabel: { fontSize: '16px', fontWeight: '700', color: textColor },
    totalValue: { fontSize: '24px', fontWeight: '800', color: accentColor },

    guaranteeBox: { backgroundColor: inputBg, padding: '16px', borderRadius: '4px', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'flex-start', gap: '12px' },
    guaranteeText: { fontSize: '9px', fontWeight: '700', color: mutedColor, letterSpacing: '0.05em', lineHeight: '1.5' },

    encryptionBox: { backgroundColor: secondaryBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' },
    encryptionIcons: { display: 'flex', gap: '16px', color: mutedColor },
    encryptionText: { fontSize: '10px', fontWeight: '700', color: textColor, letterSpacing: '0.05em' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px', marginTop: 'auto', backgroundColor: bgMain, borderTop: `1px solid ${borderColor}` },
    footerLogo: { fontSize: '14px', fontWeight: '700', color: textColor },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '11px', color: mutedColor },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none' },
    copyright: { fontSize: '11px', color: mutedColor },
  };

  const getInputStyle = (fieldName) => {
    return {
      ...s.input,
      borderColor: errors[fieldName] ? '#D83A3A' : 'transparent',
      backgroundColor: errors[fieldName] ? '#FFF5F5' : inputBg
    };
  };

  return (
    <div style={s.page}>
      
      <style>{`
        @media (max-width: 768px) {
          .checkout-header { padding: 16px 24px !important; }
          .checkout-content { padding: 32px 24px !important; }
          .checkout-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .actions-col { position: sticky; bottom: 0; background: #FFF; padding: 16px; margin: 0 -24px -32px -24px; box-shadow: 0 -10px 30px rgba(0,0,0,0.05); z-index: 10; border-top: 1px solid #EAEAEA; }
          .right-col { order: -1; } /* On mobile, usually show summary first then form */
          .footer-links { display: none !important; }
          .checkout-footer { padding: 24px !important; flex-direction: column; gap: 16px; align-items: flex-start !important; }
          .stepper-wrap { display: none !important; } /* Hide stepper on mobile to save space */
        }
      `}</style>

      {/* Header */}
      <div style={s.header} className="checkout-header">
        <div style={s.logo}>{brand ? brand.brand_name.toUpperCase() : 'DIGITAL ATELIER'}</div>
        <div style={s.headerRight}>
          <Lock size={14} />
          SECURE CHECKOUT
          <ShoppingCart size={18} style={{ marginLeft: '16px', color: '#111' }} cursor="pointer" onClick={() => navigate('/cart')} />
        </div>
      </div>

      {/* Content */}
      <div style={s.contentWrap} className="checkout-content">
        
        {/* Stepper */}
        <div style={s.stepper} className="stepper-wrap">
          <div style={s.step}>
            <div style={s.stepNumActive}>1</div>
            <div style={s.stepTextActive}>Details</div>
          </div>
          <div style={s.stepLine}></div>
          <div style={s.step}>
            <div style={s.stepNumIdle}>2</div>
            <div style={s.stepTextIdle}>Payment</div>
          </div>
        </div>

        {/* Layout Grid */}
        <div style={s.layout} className="checkout-layout">
          
          {/* Left Column (Forms) */}
          <div style={s.leftCol}>
            <h1 style={s.sectionTitle}>Contact & Shipping</h1>
            
            <div style={s.formGrid} className="form-grid">
              
              {/* Contact Info (New) */}
              <div style={s.inputGroupFull} className={errors.email ? 'has-error' : ''}>
                <label style={s.label}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={getInputStyle('email')} placeholder="For order confirmation" autoComplete="email" />
                {errors.email && <div style={s.errorText}>{errors.email}</div>}
              </div>
              
              <div style={s.inputGroupFull} className={errors.phone ? 'has-error' : ''}>
                <label style={s.label}>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={getInputStyle('phone')} placeholder="For delivery updates" autoComplete="tel" />
                {errors.phone && <div style={s.errorText}>{errors.phone}</div>}
              </div>

              {/* Shipping Details */}
              <div style={s.inputGroup} className={errors.firstName ? 'has-error' : ''}>
                <label style={s.label}>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={getInputStyle('firstName')} autoComplete="given-name" />
                {errors.firstName && <div style={s.errorText}>{errors.firstName}</div>}
              </div>
              
              <div style={s.inputGroup} className={errors.lastName ? 'has-error' : ''}>
                <label style={s.label}>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={getInputStyle('lastName')} autoComplete="family-name" />
                {errors.lastName && <div style={s.errorText}>{errors.lastName}</div>}
              </div>
              
              <div style={s.inputGroupFull} className={errors.address ? 'has-error' : ''}>
                <label style={s.label}>Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} style={getInputStyle('address')} autoComplete="street-address" />
                {errors.address && <div style={s.errorText}>{errors.address}</div>}
              </div>
              
              <div style={s.inputGroup} className={errors.city ? 'has-error' : ''}>
                <label style={s.label}>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={getInputStyle('city')} autoComplete="address-level2" />
                {errors.city && <div style={s.errorText}>{errors.city}</div>}
              </div>
              
              <div style={s.inputGroup}>
                <label style={s.label}>Postal / Zip Code</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} style={s.input} autoComplete="postal-code" />
              </div>
            </div>

            <div style={s.actionsCol} className="actions-col">
              <button style={{...s.continueBtn, opacity: isProcessing ? 0.7 : 1}} onClick={handlePaymentSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Proceed to Secure Payment
                  </>
                )}
              </button>
              
              <div style={s.disclaimerText}>
                You’ll review your order before final payment
              </div>

              <button style={s.backBtn} onClick={() => navigate('/cart')}>
                <ArrowLeft size={14} />
                Return to Cart
              </button>
            </div>
          </div>

          {/* Right Column (Summary) */}
          <div style={s.rightCol} className="right-col">
            <div style={s.summaryBox}>
              <h2 style={s.summaryTitle}>Order Summary</h2>
              
              {cartItems.map((item) => (
                <div key={item.id} style={s.summaryItem}>
                  <div style={s.summaryItemImg}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80' }} />
                  </div>
                  <div style={s.summaryItemDetails}>
                    <div style={s.summaryItemName}>{item.name}</div>
                    <div style={s.summaryItemVariant}>{item.variant}</div>
                    <div style={s.summaryItemPriceRow}>
                      <div style={s.summaryItemQty}>Qty: {item.qty}</div>
                      <div style={s.summaryItemPrice}>{formatCurrency(item.price * item.qty)}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={s.divider}></div>
              
              <div style={s.summaryRow}>
                <span>Subtotal</span>
                <span style={s.summaryRowValue}>{formatCurrency(subtotal)}</span>
              </div>
              
              <div style={s.summaryRow}>
                <span>Shipping</span>
                <span style={{color: textColor, fontWeight: '600'}}>Complimentary</span>
              </div>
              <div style={s.deliveryImportant}>
                Delivery: 2–5 business days
              </div>

              <div style={s.divider}></div>
              
              <div style={s.totalRow}>
                <span style={s.totalLabel}>Total</span>
                <span style={s.totalValue}>{formatCurrency(total)}</span>
              </div>

              <div style={s.guaranteeBox}>
                <CheckCircle2 size={16} color="#10503D" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={s.guaranteeText}>ATELIER GUARANTEE: AUTHENTICITY & SECURE LOCAL SHIPPING INCLUDED.</div>
              </div>
            </div>

            <div style={s.encryptionBox}>
              <div style={s.encryptionIcons}>
                <ShieldCheck size={20} />
                <CreditCard size={20} />
                <Lock size={20} />
              </div>
              <div style={s.encryptionText}>SECURED BY PAYSTACK & SSL ENCRYPTION</div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={s.footer} className="checkout-footer">
        <div style={s.footerLogo}>{brand ? brand.brand_name : 'Digital Atelier'}</div>
        
        <div style={s.footerLinks} className="footer-links">
          <a style={s.footerLinkItem}>Privacy Policy</a>
          <a style={s.footerLinkItem}>Terms of Service</a>
          <a style={s.footerLinkItem}>Shipping & Returns</a>
          <a style={s.footerLinkItem}>Sustainability</a>
        </div>
        
        <div style={s.copyright}>© {new Date().getFullYear()} {brand ? brand.brand_name : 'Digital Atelier'}. All rights reserved.</div>
      </div>
    </div>
  );
}
