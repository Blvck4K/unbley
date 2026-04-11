import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { Rocket, Target, Globe, PhoneOff, CheckCircle2, ShoppingBag, CreditCard, LayoutDashboard, Store, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const aboutStyles = `
  .about-hero {
    padding: 180px 0 100px;
    background-color: #ffffff;
    background-image:
      radial-gradient(at 0% 0%, hsla(210, 100%, 98%, 1) 0, transparent 50%),
      radial-gradient(at 100% 0%, hsla(190, 100%, 98%, 1) 0, transparent 50%);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .about-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
  }
  .about-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 6vw, 64px);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 24px;
    line-height: 1.1;
  }
  .about-hero-subtitle {
    font-size: 20px;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .about-section {
    padding: 100px 0;
  }
  .about-section-alt {
    padding: 100px 0;
    background-color: var(--bg-light);
  }
  .section-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
    display: inline-block;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  .section-body {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 24px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
    margin-top: 48px;
  }
  .feature-box {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    padding: 32px;
    border-radius: var(--radius-xl);
    transition: var(--transition);
  }
  .feature-box:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(9, 98, 252, 0.2);
  }
  .feature-icon-wrapper {
    width: 56px;
    height: 56px;
    background: var(--accent-soft);
    color: var(--accent);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  .feature-box h4 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .feature-box p {
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .why-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .why-item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .why-icon {
    color: #10b981;
    flex-shrink: 0;
    background: #f0fdf4;
    padding: 8px;
    border-radius: 50%;
  }
  .why-content h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .why-content p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .vision-box {
    background: linear-gradient(135deg, var(--text-primary), #1a1a1a);
    color: white;
    padding: 80px 64px;
    border-radius: var(--radius-2xl);
    margin-bottom: 64px;
    position: relative;
    overflow: hidden;
  }
  .vision-box::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    background: radial-gradient(circle at top right, rgba(9, 98, 252, 0.15), transparent 70%);
  }
  .vision-box .section-title {
    color: white;
  }
  .vision-box .section-body {
    color: #a3a3a3;
  }
  .audience-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 40px;
  }
  .audience-tag {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 24px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    backdrop-filter: blur(10px);
  }
  .cta-banner {
    background: var(--bg-light);
    border: 1px solid var(--border-color);
    text-align: center;
    padding: 80px 24px;
    border-radius: var(--radius-2xl);
    margin: 100px auto;
    max-width: 900px;
  }
  .cta-banner h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 4vw, 42px);
    font-weight: 700;
    margin-bottom: 16px;
  }
  .cta-banner p {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 32px;
  }
  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--primary);
    color: white;
    padding: 18px 40px;
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: 16px;
    transition: var(--transition);
    border: none;
    cursor: pointer;
    text-decoration: none;
  }
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.4);
    background: var(--primary-hover);
  }
  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
      gap: 48px;
    }
    .vision-box {
      padding: 40px 24px;
    }
    .about-hero {
      padding: 140px 0 60px;
    }
  }
`;

export default function About() {
  return (
    <>
      <SEO 
        title="About Us | Zizzystores"
        description="Zizzystores is a modern e-commerce solution built for brands that want to own their identity, build trust, and sell smarter online."
      />
      <PageTransition>
        <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />
        <Navbar />
        
        <main>
          {/* Hero Section */}
          <section className="about-hero">
            <div className="container">
              <div className="hero-badge mx-auto" style={{ margin: '0 auto 24px', display: 'inline-flex' }}>
                <span role="img" aria-label="rocket">🚀</span> About Zizzystores
              </div>
              <h1 className="about-hero-title">
                Who We Are
              </h1>
              <p className="about-hero-subtitle">
                Zizzystores is a modern e-commerce solution built for brands that want to own their identity, build trust, and sell smarter online.
              </p>
            </div>
          </section>

          {/* Intro / Who We Are */}
          <section className="about-section">
            <div className="container">
              <div className="grid-2">
                <div>
                  <span className="section-label">Our Identity</span>
                  <h2 className="section-title">Beyond Basic Social Media Selling</h2>
                  <p className="section-body">
                    We help businesses move beyond basic social media selling by giving them something more powerful — a fully functional online store + a custom domain (like <em className="font-normal" style={{color: 'var(--text-primary)', fontWeight: '600'}}>yourbrand.store</em>).
                  </p>
                  <p className="section-body">
                    No confusion. No stress. Just a clean, professional store that actually converts visitors into customers.
                  </p>
                </div>
                <div style={{ position: 'relative' }}>
                   {/* Aesthetic Mockup abstract replacement for visual */}
                   <div style={{ background: 'var(--bg-light)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-color)', padding: '40px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--accent-soft)', borderRadius: '50%', zIndex: 0 }} />
                    <div style={{ position: 'relative', zIndex: 1, background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                      <Store size={48} color="var(--accent)" style={{ marginBottom: 16 }} />
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Your Online Store</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Professional, fast, and secure checkout experiences for your customers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="about-section-alt">
            <div className="container">
              <div className="grid-2" style={{ direction: 'rtl' }}>
                <div style={{ direction: 'ltr' }}>
                  <span className="section-label">Our Mission</span>
                  <h2 className="section-title">Affordable & Accessible</h2>
                  <p className="section-body">
                    Our mission is simple: <strong>To make owning a professional online store affordable and accessible for every brand in Nigeria and beyond.</strong>
                  </p>
                  <p className="section-body" style={{ marginBottom: '16px' }}>Too many brands lose customers because:</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                     <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                       <PhoneOff size={20} color="#ef4444" /> Their website isn't working
                     </li>
                     <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                       <ShieldCheck size={20} color="#ef4444" /> They use untrusted links
                     </li>
                     <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                       <Globe size={20} color="#ef4444" /> They rely only on Instagram or WhatsApp
                     </li>
                  </ul>
                  <p className="section-body" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    We're here to fix that.
                  </p>
                </div>
                <div style={{ direction: 'ltr', paddingRight: '48px' }}>
                  <div style={{ aspectRatio: '1/1', background: 'var(--bg-white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                     <Target size={80} color="var(--accent)" opacity={0.2} style={{ position: 'absolute' }} />
                     <h3 style={{ fontFamily: 'Playfair Display', fontSize: '32px', fontWeight: 'bold', zIndex: 1, textAlign: 'center' }}>Building<br />Trust</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="about-section">
            <div className="container">
              <div className="text-center mx-auto" style={{ maxWidth: '700px', marginBottom: '64px' }}>
                <span className="section-label">What We Do</span>
                <h2 className="section-title text-center">Complete Selling Systems</h2>
                <p className="section-body">
                  At Zizzystores, we don't just "build websites" — we create complete selling systems. Everything is designed to help your brand look legit, premium, and trustworthy.
                </p>
              </div>

              <div className="card-grid">
                <div className="feature-box">
                  <div className="feature-icon-wrapper">
                    <Globe size={28} />
                  </div>
                  <h4>Custom Domain</h4>
                  <p>Get your own professional web address (yourbrand.store) that builds instant trust.</p>
                </div>
                <div className="feature-box">
                  <div className="feature-icon-wrapper">
                    <LayoutDashboard size={28} />
                  </div>
                  <h4>Modern Online Store</h4>
                  <p>A clean, beautifully designed storefront that turns your visitors into paying customers.</p>
                </div>
                <div className="feature-box">
                  <div className="feature-icon-wrapper">
                    <CreditCard size={28} />
                  </div>
                  <h4>Payment Integration</h4>
                  <p>Built-in payment links and Paystack-ready solutions to collect money seamlessly.</p>
                </div>
                <div className="feature-box">
                  <div className="feature-icon-wrapper">
                    <ShoppingBag size={28} />
                  </div>
                  <h4>Order Management</h4>
                  <p>Easily track, manage, and fulfill all your store orders from one simplified dashboard.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Zizzystores */}
          <section className="about-section-alt">
            <div className="container">
              <div className="grid-2">
                <div>
                  <span className="section-label">Why Choose Us</span>
                  <h2 className="section-title">Built Differently.<br />And It Shows.</h2>
                  <p className="section-body">
                    We understand the challenges of running a business in Africa. That's why we tailored every feature specifically for your success.
                  </p>
                </div>
                <div>
                  <div className="why-list">
                    <div className="why-item">
                      <div className="why-icon"><CheckCircle2 size={24} /></div>
                      <div className="why-content">
                        <h4>Affordable</h4>
                        <p>We offer a pricing model designed for real brands — not overpriced foreign platforms.</p>
                      </div>
                    </div>
                    <div className="why-item">
                      <div className="why-icon"><CheckCircle2 size={24} /></div>
                      <div className="why-content">
                        <h4>Simple</h4>
                        <p>No complicated setup. No tech stress. We handle everything.</p>
                      </div>
                    </div>
                    <div className="why-item">
                      <div className="why-icon"><CheckCircle2 size={24} /></div>
                      <div className="why-content">
                        <h4>Professional</h4>
                        <p>Your store looks like a real business — not a trial link or unfinished page.</p>
                      </div>
                    </div>
                    <div className="why-item">
                      <div className="why-icon"><CheckCircle2 size={24} /></div>
                      <div className="why-content">
                        <h4>Built for Nigeria 🇳🇬</h4>
                        <p>We understand how Nigerian brands operate: Payment systems, delivery challenges, and customer behavior. Zizzystores is built with all of that in mind.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision & Audience */}
          <section className="about-section">
            <div className="container">
              <div className="vision-box">
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                  <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Our Vision</span>
                  <h2 className="section-title">Empowering Across Africa</h2>
                  <p className="section-body">
                    We are building more than just a service. We are building a future where every brand owns its platform, every business looks trustworthy online, and selling online becomes easy and scalable.
                  </p>
                  <p className="section-body" style={{ color: 'white', fontWeight: 'bold' }}>
                    Zizzystores aims to become the go-to platform for brand owners across Africa.
                  </p>

                  <div className="audience-tags">
                    <span className="audience-tag">👕 Fashion Brands</span>
                    <span className="audience-tag">👖 Clothing Stores</span>
                    <span className="audience-tag">👟 Sneaker Sellers</span>
                    <span className="audience-tag">🛍️ Small Businesses</span>
                    <span className="audience-tag">💼 Personal Brands</span>
                  </div>
                  
                  <p style={{ marginTop: '32px', fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>
                    Whether you're just starting or already selling — we help you level up.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="container">
            <div className="cta-banner">
              <h2>Let's Build Your Store</h2>
              <p>Your brand deserves more than just a social media page. It deserves a real online store.</p>
              <a href="/create-online-store" className="cta-button">
                Get Your Store Today <ArrowRight size={20} />
              </a>
              <p style={{ marginTop: '20px', fontSize: '14px', marginBottom: 0 }}>
                Own Your Domain. Sell Like a Brand.
              </p>
            </div>
          </div>

        </main>
        
        <Footer />
      </PageTransition>
    </>
  );
}
