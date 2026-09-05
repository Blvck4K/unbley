import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import CTASection from '../components/CTASection';
import { Rocket, Shield, Globe, Zap, Store, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CreateOnlineStore() {
  const steps = [
    {
      icon: <Store size={24} />,
      title: "1. Pick Your Brand Name",
      description: "Quickly sign up and secure your professional .store domain. No technical setup or DNS headache."
    },
    {
      icon: <Zap size={24} />,
      title: "2. Upload Your Products",
      description: "Use our mobile-friendly dashboard to add images, descriptions, and set your prices in seconds."
    },
    {
      icon: <Rocket size={24} />,
      title: "3. Launch & Sell",
      description: "Start accepting payments globally or in Nigeria via secure local gateways. No coding required."
    }
  ];

  return (
    <>
      <SEO 
        title="Create Online Store | Start Your Ecommerce Business in 5 Minutes"
        description="The easiest way to create an online store in Nigeria and beyond. Launch your boutique brand with a professional storefront for only ₦30,000 / $30 for the first year."
        keywords="create online store Nigeria, how to start ecommerce business, online store builder, ecommerce website Nigeria"
        canonical="https://unbley.com/create-online-store"
      />
      
      <Navbar />
      <PageTransition>
        <main style={{ paddingTop: '80px' }}>
          {/* Hero Section */}
          <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--bg-light)' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
                Create Your <span style={{ color: 'var(--primary)' }}>Online Store</span> in Under 5 Minutes
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
                The most affordable and powerful ecommerce platform built for Nigerian and global brand owners. Start selling today with yours truly, <strong>Unbley</strong>.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Get Started</Link>
                <Link to="/shopify-alternative" className="btn btn-outline" style={{ padding: '12px 32px' }}>Shopify vs Unbley</Link>
              </div>
            </div>
          </section>

          {/* Pricing & Value Section */}
          <section style={{ padding: '80px 20px' }}>
            <div className="container">
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                padding: '40px', 
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', 
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Transparent, Global Pricing</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nigeria Pricing</div>
                    <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--primary)' }}>₦30,000</div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>First Year (₦50k renewal)</div>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-color)', height: '60px', display: 'none' }} className="desktop-only"></div>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Global (USD)</div>
                    <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--primary)' }}>$30</div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>First Year ($60 renewal)</div>
                  </div>
                </div>
                <p style={{ maxWidth: '500px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                  Includes a pro .store domain, secure hosting, and unlimited product listings. No hidden transaction fees.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '48px' }}>How to Create an Online Store in Nigeria & Beyond</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                {steps.map((step, index) => (
                  <div key={index} style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ 
                      width: '64px', height: '64px', backgroundColor: 'var(--accent-soft)', 
                      color: 'var(--primary)', borderRadius: '20px', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
                    }}>
                      {step.icon}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section style={{ padding: '100px 20px' }}>
            <div className="container">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>Built Specifically for <span style={{ color: 'var(--primary)' }}>Small Businesses</span></h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Smartphone style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Mobile-First Dashboard</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage your entire shop from your smartphone. Perfect for busy entrepreneurs on the go.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Shield style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Secure Local & Global Payments</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Accept payments in Naira or Dollars seamlessly. Integrated with top-tier gateways.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Globe style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Launch Globally in Minutes</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Professional .store domain included to give your brand instant global credibility.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-gray)', padding: '40px', borderRadius: '32px' }}>
                  <Link to="/affordable-ecommerce-platform" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Looking for the Most Affordable Option?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Learn why thousands of Nigerian merchants choose Unbley as their affordable ecommerce partner.</p>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Learn more →</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <CTASection />
        </main>
        
        <Footer />
      </PageTransition>
    </>
  );
}
