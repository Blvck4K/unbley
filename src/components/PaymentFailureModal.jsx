import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function PaymentFailureModal({ error, canRetryConfirmation, onRetry, onClose, onReturnToCart, styles }) {
  if (!error) return null;

  const { secondaryBg, textColor, borderColor, mutedColor, dangerColor } = styles;
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="payment-error-title" style={{ position: 'fixed', inset: 0, zIndex: 12000, backgroundColor: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: secondaryBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <button type="button" aria-label="Close payment error" onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', border: 'none', background: 'transparent', color: mutedColor, cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(216,58,58,0.12)', color: dangerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}><AlertCircle size={28} /></div>
        <h2 id="payment-error-title" style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 12px', color: textColor }}>Payment failed</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: mutedColor, margin: '0 0 24px', overflowWrap: 'anywhere' }}>{error}</p>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button type="button" onClick={onRetry} style={{ ...styles.continueBtn, padding: '14px 20px' }}>{canRetryConfirmation ? 'Retry Order Confirmation' : 'Try Payment Again'}</button>
          <button type="button" onClick={onReturnToCart} style={{ ...styles.backBtn, marginTop: 0 }}>Return to Cart</button>
        </div>
      </div>
    </div>
  );
}