import React from 'react';
import { Rocket, Shield } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-grid">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Launch Your Venture?</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>
            We help founders achieve life-changing sales. Launch your business with the market's most vetted e-commerce platform structure.
          </p>
          <div className="cta-features">
            <div className="cta-feature">
              <div className="cta-icon-wrapper">
                <Rocket size={24} />
              </div>
              <div>
                <h4>Rapid Setup</h4>
                <p>Average launch time of 1 days from payment.</p>
              </div>
            </div>
            <div className="cta-feature">
              <div className="cta-icon-wrapper">
                <Shield size={24} />
              </div>
              <div>
                <h4>Secure Hosting</h4>
                <p>Protect your brand with enterprise-level security.</p>
              </div>
            </div>
          </div>
          <button className="btn" style={{ backgroundColor: 'white', color: 'black', marginTop: '40px', padding: '16px 32px' }}>
            Start Your Sandbox Let's Go
          </button>
        </div>
        <div className="cta-visual" style={{
          height: '400px',
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B5563'
        }}>
          [Placeholder: Professional Tech Visualization]
        </div>
      </div>
    </section>
  );
}
