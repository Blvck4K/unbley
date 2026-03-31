import React, { useState } from 'react';
import { ShoppingCart, Lock, ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const accentColor = '#0F2C59'; // Deep luxury blue
  const bgMain = '#FAFAFA'; // Light grey page bg
  const inputBg = '#F4F4F5';

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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

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

    // Process payment simulation
    setIsProcessing(true);
    setTimeout(() => {
      // In a real flow, this could trigger Paystack popup instead of navigating immediately.
      // E.g., const paystack = new PaystackPop(); paystack.newTransaction({...});
      setIsProcessing(false);
      navigate('/checkout-success'); // Placeholder route
    }, 2500);
  };

  const s = {
    page: { backgroundColor: bgMain, color: '#111', minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden', display: 'flex', flexDirection: 'column' },
    
    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', backgroundColor: '#FFF', borderBottom: '1px solid #EAEAEA' },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#10503D' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px', color: '#666', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' },

    // Content Wrap
    contentWrap: { flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    // Stepper
    stepper: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' },
    step: { display: 'flex', alignItems: 'center', gap: '8px' },
    stepNumActive: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepNumIdle: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EAEAEA', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepTextActive: { fontSize: '13px', fontWeight: '700', color: accentColor },
    stepTextIdle: { fontSize: '13px', fontWeight: '500', color: '#888' },
    stepLine: { width: '48px', height: '1px', backgroundColor: '#EAEAEA' },

    // Main Layout
    layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '64px', maxWidth: '1200px', width: '100%' },

    // Left Col
    leftCol: { display: 'flex', flexDirection: 'column' },
    sectionTitle: { fontSize: '28px', fontWeight: '700', color: '#111', marginBottom: '32px' },
    sectionSubtitle: { fontSize: '14px', color: '#555', marginBottom: '24px', fontWeight: '500' },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    inputGroupFull: { display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' },
    label: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333' },
    input: { backgroundColor: inputBg, border: '1px solid transparent', padding: '16px', fontSize: '14px', color: '#333', borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s', width: '100%' },
    errorText: { color: '#D83A3A', fontSize: '11px', marginTop: '4px' },

    paymentMethodsWrap: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' },
    paymentOption: { border: '1px solid #EAEAEA', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#FFF' },
    paymentOptionActive: { border: `2px solid ${accentColor}`, backgroundColor: '#F9FAFC' },
    paymentLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    radioCircle: { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #CCC', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: accentColor },
    paymentIconWrap: { width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' },
    paymentTitle: { fontSize: '15px', fontWeight: '600', color: '#111' },
    paymentDesc: { fontSize: '12px', color: '#666', marginTop: '2px' },

    actionsCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
    continueBtn: { backgroundColor: accentColor, color: '#FFF', border: 'none', padding: '18px 32px', fontSize: '14px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(15, 44, 89, 0.2)', transition: 'opacity 0.2s', width: '100%' },
    disclaimerText: { fontSize: '12px', color: '#666', textAlign: 'center' },
    backBtn: { background: 'none', border: 'none', color: '#666', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '12px' },

    // Right Col
    rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    summaryBox: { backgroundColor: '#FFF', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    summaryTitle: { fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '32px' },
    
    summaryItem: { display: 'flex', gap: '16px', marginBottom: '24px' },
    summaryItemImg: { width: '64px', height: '64px', borderRadius: '4px', backgroundColor: '#F5F5F5', overflow: 'hidden' },
    summaryItemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    summaryItemName: { fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '4px' },
    summaryItemVariant: { fontSize: '12px', color: '#666', marginBottom: '8px' },
    summaryItemPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    summaryItemQty: { fontSize: '12px', color: '#555' },
    summaryItemPrice: { fontSize: '14px', fontWeight: '700', color: accentColor },

    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#555' },
    summaryRowValue: { color: '#111', fontWeight: '500' },
    deliveryImportant: { fontSize: '11px', color: '#10503D', fontWeight: '600', textAlign: 'right', marginTop: '-12px', marginBottom: '16px' },

    divider: { height: '1px', backgroundColor: '#EAEAEA', margin: '24px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    totalLabel: { fontSize: '16px', fontWeight: '700', color: '#111' },
    totalValue: { fontSize: '24px', fontWeight: '800', color: accentColor },

    guaranteeBox: { backgroundColor: '#F9F9FB', padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'flex-start', gap: '12px' },
    guaranteeText: { fontSize: '9px', fontWeight: '700', color: '#555', letterSpacing: '0.05em', lineHeight: '1.5' },

    encryptionBox: { backgroundColor: '#F9F9F9', border: '1px solid #EAEAEA', padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' },
    encryptionIcons: { display: 'flex', gap: '16px', color: '#666' },
    encryptionText: { fontSize: '10px', fontWeight: '700', color: '#333', letterSpacing: '0.05em' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px', marginTop: 'auto', backgroundColor: bgMain },
    footerLogo: { fontSize: '14px', fontWeight: '700', color: '#10503D' },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '11px', color: '#666' },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none' },
    copyright: { fontSize: '11px', color: '#888' },
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
        <div style={s.logo}>Digital Atelier</div>
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

            <h2 style={{...s.sectionTitle, fontSize: '24px', marginBottom: '8px'}}>Payment Method</h2>
            <p style={s.sectionSubtitle}>All transactions are secure and encrypted.</p>

            <div style={s.paymentMethodsWrap}>
              
              {/* Option 1: Card */}
              <div style={{...s.paymentOption, ...(paymentMethod === 'card' ? s.paymentOptionActive : {})}} onClick={() => setPaymentMethod('card')}>
                <div style={s.paymentLeft}>
                  <div style={s.radioCircle}>
                    {paymentMethod === 'card' && <div style={s.radioInner}></div>}
                  </div>
                  <div style={s.paymentIconWrap}><CreditCard size={20} /></div>
                  <div>
                    <div style={s.paymentTitle}>Debit / Credit Card</div>
                    <div style={s.paymentDesc}>Pay securely with your card via Paystack</div>
                  </div>
                </div>
              </div>

              {/* Option 2: Bank Transfer */}
              <div style={{...s.paymentOption, ...(paymentMethod === 'transfer' ? s.paymentOptionActive : {})}} onClick={() => setPaymentMethod('transfer')}>
                <div style={s.paymentLeft}>
                  <div style={s.radioCircle}>
                    {paymentMethod === 'transfer' && <div style={s.radioInner}></div>}
                  </div>
                  <div style={s.paymentIconWrap}><Banknote size={20} /></div>
                  <div>
                    <div style={s.paymentTitle}>Bank Transfer</div>
                    <div style={s.paymentDesc}>Direct transfer to provided account</div>
                  </div>
                </div>
              </div>

              {/* Option 3: USSD */}
              <div style={{...s.paymentOption, ...(paymentMethod === 'ussd' ? s.paymentOptionActive : {})}} onClick={() => setPaymentMethod('ussd')}>
                <div style={s.paymentLeft}>
                  <div style={s.radioCircle}>
                    {paymentMethod === 'ussd' && <div style={s.radioInner}></div>}
                  </div>
                  <div style={s.paymentIconWrap}><Smartphone size={20} /></div>
                  <div>
                    <div style={s.paymentTitle}>USSD</div>
                    <div style={s.paymentDesc}>Pay offline using secure USSD codes</div>
                  </div>
                </div>
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
              
              <div style={s.summaryItem}>
                <div style={s.summaryItemImg}>
                  <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80" alt="Cashmere Knit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={s.summaryItemDetails}>
                  <div style={s.summaryItemName}>Artisan Cashmere Knit</div>
                  <div style={s.summaryItemVariant}>Oatmeal / Medium</div>
                  <div style={s.summaryItemPriceRow}>
                    <div style={s.summaryItemQty}>Qty: 1</div>
                    <div style={s.summaryItemPrice}>{formatCurrency(420000)}</div>
                  </div>
                </div>
              </div>

              <div style={s.summaryItem}>
                <div style={s.summaryItemImg}>
                  <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&q=80" alt="Leather Runner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={s.summaryItemDetails}>
                  <div style={s.summaryItemName}>Heritage Leather Runner</div>
                  <div style={s.summaryItemVariant}>Midnight Blue / 42</div>
                  <div style={s.summaryItemPriceRow}>
                    <div style={s.summaryItemQty}>Qty: 1</div>
                    <div style={s.summaryItemPrice}>{formatCurrency(350000)}</div>
                  </div>
                </div>
              </div>

              <div style={s.divider}></div>
              
              <div style={s.summaryRow}>
                <span>Subtotal</span>
                <span style={s.summaryRowValue}>{formatCurrency(770000)}</span>
              </div>
              
              <div style={s.summaryRow}>
                <span>Shipping</span>
                <span style={{color: '#111', fontWeight: '600'}}>Complimentary</span>
              </div>
              <div style={s.deliveryImportant}>
                Delivery: 2–5 business days
              </div>

              <div style={s.summaryRow}>
                <span>Estimated Tax (7.5%)</span>
                <span style={s.summaryRowValue}>{formatCurrency(62400)}</span>
              </div>

              <div style={s.divider}></div>
              
              <div style={s.totalRow}>
                <span style={s.totalLabel}>Total</span>
                <span style={s.totalValue}>{formatCurrency(832400)}</span>
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
        <div style={s.footerLogo}>Digital Atelier</div>
        
        <div style={s.footerLinks} className="footer-links">
          <a style={s.footerLinkItem}>Privacy Policy</a>
          <a style={s.footerLinkItem}>Terms of Service</a>
          <a style={s.footerLinkItem}>Shipping & Returns</a>
          <a style={s.footerLinkItem}>Sustainability</a>
        </div>
        
        <div style={s.copyright}>© 2024 Digital Atelier. All rights reserved.</div>
      </div>
    </div>
  );
}
