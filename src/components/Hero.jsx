import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#F3F4F6', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '24px', letterSpacing: '0.05em' }}>
            PREMIUM E-COMMERCE
          </div>
          <h1 className="hero-title">
            Launch Your Own Online Store in 24 Hours At Very Low Cost <span style={{ color: 'var(--text-muted)' }}>— Free Domain + Free Website Setup Included.</span>
          </h1>
          <p className="hero-subtitle">
            Offering brand owners the opportunity to get a full-stack e-commerce web platform and domain to themselves for just ₦50,000. Enjoy a 40% discount for your first payment.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary" style={{ padding: '18px 36px', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 14px 0 var(--bg-gray)' }}>
              Launch My Store Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center gap-2" style={{ fontSize: '16px', fontWeight: '800', color: '#E11D48' }}>
              🔥 40% OFF ends soon! <span style={{ color: 'var(--bg-dark)', fontWeight: '600' }}>Limited Time Offer.</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>₦30,000</strong> (First Year Only) — <span style={{ opacity: 0.8 }}>Renews at ₦50,000/year</span></span>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Integrated & Secured By
            </div>
            <div className="flex items-center gap-6" style={{ flexWrap: 'wrap' }}>
              {/* Paystack */}
              <div style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: '#09A5DB', borderRadius: '4px' }}></div>
                paystack
              </div>

              {/* Flutterwave */}
              <div style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.022 17.65c-.172-.345-.551-.551-.931-.551h-6.102L9.336 6.002c-.241-.482-.827-.724-1.344-.551-.517.172-.862.69-.862 1.206v11.514H1.378c-.655 0-1.206.517-1.206 1.171 0 .655.551 1.172 1.206 1.172h6.101l5.654-11.099c.241-.482.827-.723 1.344-.551.517-.172.862-.689.862-1.206V6.002h5.757c.655 0 1.206-.551 1.206-1.206 0-.655-.551-1.206-1.206-1.206h-5.067L22.953 16.96c.207.448.069 1.034-.379 1.241-.172.069-.379.069-.552 0v-.551z" fill="#FB923C" /></svg>
                flutterwave
              </div>

              {/* Secure Hosting Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '600', color: 'var(--bg-dark)' }}>
                <ShieldCheck size={20} color="#10B981" />
                Secure Hosting
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-white)', margin: '0 16px', borderRadius: '4px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>zizzystores.com/admin</div>
            </div>
            <div className="mockup-body">
              <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '16px' }}>
                <div style={{ height: '80px', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ height: '80px', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ height: '80px', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
              <div className="flex gap-4" style={{ height: '60px' }}>
                <div style={{ width: '60%', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ width: '40%', backgroundColor: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}></div>
              </div>
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-white)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '-40px',
            marginLeft: '-40px',
            position: 'relative',
            zIndex: 10,
            border: '1px solid var(--border-color)'
          }}>
            <CheckCircle2 size={24} color="var(--success)" />
            <div>
              <div className="font-bold" style={{ fontSize: '14px' }}>Domain Included</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Fully configured</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
