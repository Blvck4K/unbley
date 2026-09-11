import React from 'react';
import { Rocket } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-grid">
        <div className="cta-content" style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
          <h2 className="cta-title" style={{ fontSize: window.innerWidth <= 768 ? '32px' : '40px' }}>Ready to Take Your Business Online?</h2>
          <p style={{ color: '#D4C8BE', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6', margin: window.innerWidth <= 768 ? '0 auto 40px' : '0 0 40px', maxWidth: '500px' }}>
            Create your Unbley store and give your customers a simple way to discover your products, place orders, and pay online.
          </p>
          <div className="cta-features" style={{ alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
            <div className="cta-feature" style={{ textAlign: 'left' }}>
              <div className="cta-icon-wrapper" style={{ color: '#E8A87C' }}>
                <Rocket size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', color: '#FDFBF7' }}>Your business, online</h4>
                <p style={{ fontSize: '12px', color: '#D4C8BE' }}>No complicated setup. No website development required.</p>
              </div>
            </div>
          </div>
          <button className="btn" style={{ backgroundColor: '#FFFFFF', color: '#6A3E1F', fontWeight: '700', marginTop: '40px', padding: '16px 32px', borderRadius: 'var(--radius-md)' }}>
            <a href="/auth" style={{ color: '#6A3E1F' }}>Get Started With Unbley</a>
          </button>
          <a href="/create-online-store" style={{ display: 'block', marginTop: '16px', color: '#FDFBF7', fontSize: '14px' }}>View Pricing</a>
        </div>
        <div className="cta-visual" style={{
          height: window.innerWidth <= 768 ? '200px' : '400px',
          backgroundColor: '#352117',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #4A3326',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4C8BE',
          padding: '24px',
          textAlign: 'center',
          marginTop: window.innerWidth <= 768 ? '40px' : '0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#FDFBF7' }}>Your Business Deserves to Be Online</div>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#D4C8BE' }}>Give your brand a professional online store that customers can access anytime, anywhere.</div>
          <a href="/auth" style={{ display: 'inline-block', marginTop: '20px', color: '#FFFFFF', fontWeight: '700' }}>Launch Your Store →</a>
        </div>
      </div>
    </section>
  );
}
