import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text" style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#F3F4F6', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '24px', letterSpacing: '0.05em' }}>
            PREMIUM E-COMMERCE
          </div>
          <h1 className="hero-title" style={{ fontSize: window.innerWidth <= 768 ? '36px' : '56px' }}>
            Launch Your Own Online Store in 24 Hours <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.6em', marginTop: '8px' }}>— Free Domain + Setup Included.</span>
          </h1>
          <p className="hero-subtitle" style={{ margin: window.innerWidth <= 768 ? '0 auto 40px' : '0 0 40px' }}>
            Get a full-stack e-commerce platform and your own domain for just ₦30,000 (First Year). Limited 40% discount applied.
          </p>
          <div className="flex gap-4" style={{ justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
            <Link to="/auth" style={{ textDecoration: 'none', width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
              <button className="btn btn-primary" style={{ padding: '18px 36px', fontSize: '16px', fontWeight: '700', width: '100%', boxShadow: '0 4px 14px 0 var(--bg-gray)' }}>
                Launch My Store Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
            </Link>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
            <div className="flex items-center gap-2" style={{ fontSize: '16px', fontWeight: '800', color: '#E11D48', justifyContent: 'center' }}>
              🔥 40% OFF ends soon!
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>₦30,000</strong> (First Year)</span>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-color)', textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Integrated & Secured By
            </div>
            <div className="flex items-center gap-8 justify-center" style={{ flexWrap: 'wrap', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
              <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: '#09A5DB', borderRadius: '4px' }}></div>
                paystack
              </div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={20} color="#10B981" />
                Secured
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ marginTop: window.innerWidth <= 768 ? '40px' : '0' }}>
          <div className="dashboard-mockup" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'none', boxShadow: 'none' }}>
            <img src="https://raw.githubusercontent.com/Blvck4K/Jss-png/refs/heads/main/replace.png" alt="Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', display: 'block' }} />
          </div>
          <div style={{
            backgroundColor: 'var(--bg-white)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '-20px',
            marginLeft: window.innerWidth <= 768 ? '0' : '-40px',
            position: 'relative',
            zIndex: 10,
            border: '1px solid var(--border-color)',
            transform: window.innerWidth <= 768 ? 'translateX(20px)' : 'none'
          }}>
            <CheckCircle2 size={20} color="#10B981" />
            <div>
              <div className="font-bold" style={{ fontSize: '13px' }}>Domain Included</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>Fully configured</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
