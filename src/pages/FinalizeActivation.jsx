import React from 'react';
import { Shield, Lock, CreditCard, Sparkles, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinalizeActivation() {
  const brandColor = '#06acf8';
  const bgColorLeft = '#121212';
  const bgColorRight = '#080808';

  const s = {
    page: { display: 'flex', height: '100vh', width: '100%', fontFamily: '"Inter", sans-serif', color: '#FFF', overflow: 'hidden' },

    // Left Pane
    leftPane: {

      flex: 1,
      backgroundColor: bgColorLeft,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: '48px 64px',
      overflow: 'hidden',
      borderRight: '1px solid #1F1F1F'
    },
    // Background effect (Diagonal lines simulation)
    bgEffect: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.01) 75%, transparent 75%, transparent)',
      backgroundSize: '100px 100px',
      opacity: 0.5,
      zIndex: 0
    },
    logo: { position: 'relative', zIndex: 1, fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: '#FFF', textTransform: 'uppercase', fontWeight: 'bold' },
    leftContent: { marginTop: 'auto', marginBottom: '10vh', position: 'relative', zIndex: 1, maxWidth: '480px' },
    leftTitle: { fontFamily: '"Playfair Display", serif', fontSize: '48px', lineHeight: '1.2', marginBottom: '48px', fontWeight: '400' },
    featureItem: { display: 'flex', gap: '24px', marginBottom: '32px' },
    featureIconWrap: { color: brandColor, marginTop: '4px' },
    featureTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '8px' },
    featureDesc: { fontSize: '13px', color: '#888', lineHeight: '1.5' },
    secureBadge: {
      display: 'inline-flex', alignItems: 'center', backgroundColor: '#1A1A1A',
      padding: '8px 16px', borderRadius: '4px', fontSize: '10px',
      fontWeight: '600', letterSpacing: '0.05em', color: '#888', marginTop: '24px'
    },

    // Right Pane
    rightPane: {
      flex: 1,
      backgroundColor: bgColorRight,
      display: 'flex',
      flexDirection: 'column',
      padding: '48px 64px',
      position: 'relative',
      overflowY: 'auto'
    },
    supportLink: { alignSelf: 'flex-end', fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' },
    formWrapper: { display: 'flex', flexDirection: 'column', margin: 'auto', maxWidth: '480px', width: '100%', padding: '40px 0' },

    subTitle: { color: brandColor, fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    mainTitle: { fontFamily: '"Playfair Display", serif', fontSize: '44px', fontWeight: '400', marginBottom: '24px', lineHeight: '1.1' },
    mainDesc: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '48px' },

    checkoutBox: {
      backgroundColor: '#111',
      borderLeft: `2px solid ${brandColor}`,
      padding: '32px',
      position: 'relative',
      marginBottom: '40px',
      overflow: 'hidden'
    },
    boxOverlayIcon: { position: 'absolute', right: '-20px', top: '-10px', color: 'rgba(255,255,255,0.02)', opacity: 0.5 },
    totalLabel: { fontSize: '10px', fontWeight: '600', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
    priceRow: { display: 'flex', alignItems: 'center', gap: '16px' },
    price: { fontFamily: '"Playfair Display", serif', fontSize: '36px', fontWeight: '700' },
    oneTimeBadge: {
      backgroundColor: 'rgba(6, 172, 248, 0.1)',
      color: brandColor,
      padding: '4px 12px',
      borderRadius: '2px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.05em'
    },

    expressCheckoutLabel: { fontSize: '10px', fontWeight: '600', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    expressBtnsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
    expressBtn: {
      flex: 1, height: '48px', backgroundColor: '#1C1C1C', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #2A2A2A'
    },

    divider: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
    divLine: { flex: 1, height: '1px', backgroundColor: '#1F1F1F' },
    divText: { fontSize: '10px', color: '#555', fontStyle: 'italic', letterSpacing: '0.05em' },

    payBtn: {
      width: '100%', height: '56px', backgroundColor: brandColor, color: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', fontSize: '14px', fontWeight: 'bold', border: 'none',
      borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.05em', marginBottom: '48px'
    },

    footerIcons: { display: 'flex', gap: '24px', justifyContent: 'center', color: '#555', marginBottom: '16px' },
    footerText: { textAlign: 'center', color: '#555', fontSize: '11px', lineHeight: '1.5' },

    pagination: { position: 'absolute', bottom: '48px', right: '64px', display: 'flex', gap: '8px' },
    dot: (active) => ({ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: active ? brandColor : '#333' })
  };

  return (
    <div style={s.page}>

      {/* LEFT PANE */}
      <div style={s.leftPane}>
        <div style={s.bgEffect}></div>
        <div style={{ ...s.logo, position: 'absolute', top: '48px', left: '64px' }}>Zizzystores.</div>

        <div style={s.leftContent}>
          <h1 style={s.leftTitle}>
            Crafting <span style={{ fontStyle: 'italic' }}>distinction</span> in the digital marketplace.
          </h1>

          <div style={s.featureItem}>
            <div style={s.featureIconWrap}><Globe size={20} /></div>
            <div>
              <div style={s.featureTitle}>Custom Domain Inclusion</div>
              <div style={s.featureDesc}>Establish your authority with a .store domain tailored to your brand identity.</div>
            </div>
          </div>

          <div style={s.featureItem}>
            <div style={s.featureIconWrap}><Sparkles size={20} /></div>
            <div>
              <div style={s.featureTitle}>Atelier Engine Access</div>
              <div style={s.featureDesc}>A curated suite of professional tools designed for high-conversion retail experiences.</div>
            </div>
          </div>

          <div style={s.secureBadge}>SECURE CONNECTION VERIFIED</div>
        </div>
      </div>

      {/* RIGHT PANE */}
      <div style={s.rightPane}>
        <div style={s.supportLink}>SUPPORT</div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={s.formWrapper}>
            <div style={s.subTitle}>FINALIZE ACTIVATION</div>
            <h2 style={s.mainTitle}>Unlock Your Brand's<br />Potential</h2>
            <p style={s.mainDesc}>
              To activate your professional store and secure your complimentary domain, a yearly subscription fee is required. This grants you lifetime access to the Digital Atelier.
            </p>

            <div style={s.checkoutBox}>
              <CheckCircle2 size={120} style={s.boxOverlayIcon} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={s.totalLabel}>TOTAL DUE</div>
                <div style={s.priceRow}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <div style={s.price}>₦30,000</div>
                    <div style={{ fontSize: '18px', color: '#666', textDecoration: 'line-through' }}>₦50,000</div>
                  </div>
                  <div style={{ ...s.oneTimeBadge, whiteSpace: 'nowrap' }}>40% OFF – First Year</div>
                </div>
                <div style={{ fontSize: '13px', color: '#AAA', marginTop: '8px' }}>
                  Renews at ₦50,000/year after first year
                </div>
                <div style={{ marginTop: '24px', fontSize: '12px', color: '#888', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color={brandColor} /> First year discounted</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color={brandColor} /> Annual renewal applies</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color={brandColor} /> No hidden fees</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontWeight: 'bold' }}>⚡ Store setup completed within 24 hours</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={s.expressCheckoutLabel}>PAYMENT METHODS (NIGERIA)</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1C1C1C', borderRadius: '4px', border: '1px solid #2A2A2A', fontSize: '13px', color: '#CCC' }}>
                  <CreditCard size={16} color={brandColor} /> Card
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1C1C1C', borderRadius: '4px', border: '1px solid #2A2A2A', fontSize: '13px', color: '#CCC' }}>
                  <Globe size={16} color={brandColor} /> Transfer
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1C1C1C', borderRadius: '4px', border: '1px solid #2A2A2A', fontSize: '13px', color: '#CCC' }}>
                  <span style={{ fontWeight: 'bold', color: brandColor, fontSize: '14px' }}>#</span> USSD
                </div>
              </div>
            </div>

            <button style={{ ...s.payBtn, marginBottom: '16px' }}>
              Activate My Store (₦30,000 First Year)
              <ArrowRight size={20} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#AAA', marginBottom: '24px', lineHeight: '1.5' }}>
              After payment, our team will begin setting up your store immediately.
              <div style={{ fontSize: '11px', color: '#666', marginTop: '12px' }}>
                Billed annually. You’ll be notified before renewal. Cancel anytime before renewal.
              </div>
            </div>

            <div style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: brandColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>What happens next:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#CCC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#222', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>1</div>
                  <div>You complete payment</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#222', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>2</div>
                  <div>We set up your domain & store</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#222', color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>3</div>
                  <div><strong style={{ color: '#FFF' }}>Your store goes live within 24 hours</strong></div>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1F1F1F', fontSize: '11px', color: '#888' }}>
                <span style={{ color: brandColor }}>✦</span> We handle the technical setup so you can focus on your business.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Powered by</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontWeight: 'bold', fontSize: '14px' }}>
                <div style={{ backgroundColor: '#0BA4DB', color: '#FFF', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold' }}>P</div>
                Paystack
              </div>
            </div>

            <div style={s.footerText}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', color: '#555' }}>
                <Shield size={14} />
                <Lock size={14} />
              </div>
              Secure 256-bit encrypted transaction.<br />
              By proceeding, you agree to Zizzystores' digital service terms.
            </div>
          </div>
        </div>

        <div style={s.pagination}>
          <div style={s.dot(true)}></div>
          <div style={s.dot(false)}></div>
          <div style={s.dot(false)}></div>
        </div>
      </div>

    </div>
  );
}
