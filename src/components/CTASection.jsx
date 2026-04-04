import React from 'react';
import { Rocket, Shield } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-grid">
        <div className="cta-content" style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
          <h2 className="cta-title" style={{ fontSize: window.innerWidth <= 768 ? '32px' : '40px' }}>Ready to Launch Your Venture?</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6', margin: window.innerWidth <= 768 ? '0 auto 40px' : '0 0 40px', maxWidth: '500px' }}>
            We help founders achieve life-changing sales. Launch your business with the market's most vetted e-commerce infrastructure.
          </p>
          <div className="cta-features" style={{ alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
            <div className="cta-feature" style={{ textAlign: 'left' }}>
              <div className="cta-icon-wrapper">
                <Rocket size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px' }}>Rapid Setup</h4>
                <p style={{ fontSize: '12px' }}>Average launch time of 24 hours from payment.</p>
              </div>
            </div>
          </div>
          <button className="btn" style={{ backgroundColor: 'white', color: 'black', marginTop: '40px', padding: '16px 32px' }}>
            <a href="/auth">Start Your Sandbox Let's Go</a>
          </button>
        </div>
        <div className="cta-visual" style={{
          height: window.innerWidth <= 768 ? '200px' : '400px',
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #374151',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B5563',
          padding: '24px',
          textAlign: 'center',
          marginTop: window.innerWidth <= 768 ? '40px' : '0'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
          <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>High Speed Deployment</div>
        </div>
      </div>
    </section>
  );
}
