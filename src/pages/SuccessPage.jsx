import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Download, LayoutDashboard, Globe, Settings } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state from Paystack success callback
  const { reference, amount, email, brandName } = location.state || {
    reference: 'TXN-' + Math.floor(Math.random() * 100000000).toString(),
    amount: 30000,
    email: 'admin@zizzystores.com',
    brandName: 'Premium Zizzystores Vendor'
  };

  const brandColor = '#06acf8';
  const successColor = '#10B981'; // Vibrant green for success
  const bgColor = '#050505';

  const s = {
    page: {
      backgroundColor: bgColor,
      color: '#FFF',
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '64px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 48px',
      borderBottom: '1px solid #1A1A1A'
    },
    logo: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '20px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      color: brandColor,
      textTransform: 'uppercase'
    },
    secureBadgeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.2em',
      color: '#666',
      textTransform: 'uppercase'
    },
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '64px 24px 0',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    },
    iconBox: {
      width: '64px',
      height: '64px',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '32px'
    },
    title: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '36px',
      fontWeight: '600',
      marginBottom: '16px',
      textAlign: 'center'
    },
    subtitle: {
      color: '#888',
      fontSize: '14px',
      lineHeight: '1.6',
      textAlign: 'center',
      maxWidth: '400px',
      marginBottom: '48px'
    },
    card: {
      backgroundColor: '#111',
      border: '1px solid #222',
      borderRadius: '8px',
      width: '100%',
      padding: '32px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '48px'
    },
    glowLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${successColor}, transparent)`
    },
    flexRow: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '24px'
    },
    infoBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#666',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    value: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#FFF'
    },
    valueLarge: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '28px',
      fontWeight: '700',
      color: '#FFF'
    },
    badge: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: successColor,
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    divider: {
      height: '1px',
      backgroundColor: '#222',
      margin: '32px 0'
    },
    
    // Action Cards
    actionsLabel: {
      alignSelf: 'flex-start',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '24px'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      width: '100%',
      marginBottom: '48px'
    },
    stepCard: {
      backgroundColor: '#0A0A0A',
      border: '1px solid #1A1A1A',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px'
    },
    stepIconBox: {
      width: '32px',
      height: '32px',
      backgroundColor: 'rgba(6, 172, 248, 0.1)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: brandColor
    },
    stepTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFF'
    },
    stepDesc: {
      fontSize: '12px',
      color: '#888',
      lineHeight: '1.5',
      marginBottom: '8px'
    },
    stepLink: {
      fontSize: '11px',
      fontWeight: '700',
      color: brandColor,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },

    // Bottom Action Row
    bottomActions: {
      display: 'flex',
      gap: '16px',
      width: '100%',
      justifyContent: 'center',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    btnPrimary: {
      backgroundColor: brandColor,
      color: '#000',
      border: 'none',
      borderRadius: '4px',
      padding: '16px 32px',
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'opacity 0.2s'
    },
    btnSecondary: {
      backgroundColor: '#111',
      color: '#FFF',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '16px 32px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
========================================
         ZIZZYSTORES RECEIPT
========================================

STORE NAME:   ${brandName}
EMAIL:        ${email}
STATUS:       ACTIVATION SUCCESSFUL
AMOUNT PAID:  NGN ${amount.toLocaleString()}
PAYMENT GATEWAY: Paystack

TRANSACTION:  ${reference}
DATE:         ${new Date().toLocaleString()}

----------------------------------------
Thank you for joining Zizzystores.
Your digital atelier is securely activated.
========================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zizzystores-Receipt-${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={s.page} className="success-page">
      <style>{`
        @media (max-width: 768px) {
          .success-page-header { padding: 20px 24px !important; }
          .success-page-container { padding: 40px 24px 0 !important; }
          .success-steps-grid { grid-template-columns: 1fr !important; }
          .success-flex-row { flex-direction: column !important; gap: 32px !important; }
          .success-bottom-actions { flex-direction: column !important; width: 100% !important; }
          .success-bottom-actions button { width: 100% !important; justify-content: center !important; }
        }
        .btn-hover:hover { opacity: 0.9; }
        .btn-sec-hover:hover { background-color: #222 !important; }
      `}</style>

      {/* Header */}
      <header style={s.header} className="success-page-header">
        <div style={s.logo}>Zizzystores.</div>
        <div style={s.secureBadgeHeader}>
          PAYMENT SECURE <ShieldCheck size={14} color={successColor} />
        </div>
      </header>

      {/* Main Content */}
      <main style={s.container} className="success-page-container">
        
        <div style={s.iconBox}>
          <Check size={32} color={successColor} strokeWidth={3} />
        </div>

        <h1 style={s.title}>Payment Successful</h1>
        <p style={s.subtitle}>
          Your store activation is complete. The digital capabilities have been securely unlocked and assigned to your account.
        </p>

        {/* Receipt / Details Card */}
        <div style={s.card}>
          <div style={s.glowLine}></div>
          
          <div style={s.flexRow} className="success-flex-row">
            <div style={{ ...s.infoBlock, flex: '1 1 auto' }}>
              <div style={s.label}>ACTIVATED STORE</div>
              <div style={s.value}>{brandName}</div>
            </div>
            <div style={{ alignSelf: 'center' }}>
              <div style={s.badge}>
                <Check size={12} strokeWidth={3} /> VERIFIED ASSET
              </div>
            </div>
          </div>

          <div style={s.divider}></div>

          <div style={s.flexRow} className="success-flex-row">
            <div style={{ ...s.infoBlock, minWidth: '150px' }}>
              <div style={s.label}>AMOUNT PAID</div>
              <div style={s.valueLarge}>₦{amount.toLocaleString()}</div>
              <div style={{ ...s.label, marginTop: '12px' }}>PAYMENT METHOD</div>
              <div style={{ ...s.value, fontSize: '13px', color: '#AAA' }}>Paystack Gateway</div>
            </div>

            <div style={{ ...s.infoBlock, backgroundColor: '#0A0A0A', padding: '20px', borderRadius: '6px', border: '1px solid #1A1A1A', flex: '1 1 auto', minWidth: '200px' }}>
              <div style={s.label}>TRANSACTION ID</div>
              <div style={{ ...s.value, fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.05em', color: '#CCC', margin: '4px 0 12px' }}>
                {reference}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: successColor, fontWeight: '600' }}>
                <ShieldCheck size={14} /> Immutable Ledger Confirmed
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={s.actionsLabel}>Next Steps</div>
        <div style={s.stepsGrid} className="success-steps-grid">
          
          <div style={s.stepCard}>
            <div style={{ ...s.stepIconBox, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: successColor }}><Settings size={16} /></div>
            <div style={s.stepTitle}>Configure Your Brand</div>
            <div style={s.stepDesc}>Customize your storefront aesthetic, manage product collections, and fine-tune your business settings.</div>
            <div style={s.stepLink} onClick={() => navigate('/dashboard')}>
              GO TO DASHBOARD <span>→</span>
            </div>
          </div>

          <div style={s.stepCard}>
            <div style={s.stepIconBox}><Globe size={16} /></div>
            <div style={s.stepTitle}>Connect Domain</div>
            <div style={s.stepDesc}>Link your custom .store domain or map an existing domain name to your newly activated workspace.</div>
            <div style={s.stepLink} onClick={() => navigate('/profile')}>
              OPEN SETTINGS <span>→</span>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div style={s.bottomActions} className="success-bottom-actions">
          <button style={s.btnPrimary} className="btn-hover" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={18} />
            Go to Dashboard
          </button>
          <button style={s.btnSecondary} className="btn-sec-hover" onClick={handleDownloadReceipt}>
            <Download size={18} />
            Download Receipt
          </button>
        </div>

        <div style={{ margin: '64px 0', fontSize: '11px', color: '#555', textAlign: 'center' }}>
          Having trouble? Contact our <span style={{ color: successColor, cursor: 'pointer' }}>concierge support team</span> for priority assistance.
        </div>

      </main>
    </div>
  );
}
