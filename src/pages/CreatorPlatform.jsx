import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import HowItWorks from '../components/HowItWorks';
import CTASection from '../components/CTASection';
import { Palette, Share2, Sparkles, Layout, Settings, Rocket } from 'lucide-react';
import SEO from '../components/SEO';

export default function CreatorPlatform() {
  const features = [
    {
      icon: <Palette size={24} />,
      title: "Your Brand, Your Identity",
      description: "Don't settle for a cookie-cutter store. Customize your layout, colors, and fonts to match your creative vision perfectly."
    },
    {
      icon: <Share2 size={24} />,
      title: "Built-In Social Growth",
      description: "Seamlessly integrate your Instagram, TikTok, and Pinterest feeds to build trust and show off your creative process."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Premium User Experience",
      description: "We provide an ultra-clean, high-end shopping experience that elevates your brand and delights your customers."
    },
    {
      icon: <Layout size={24} />,
      title: "Powerful Brand Dashboard",
      description: "Manage your inventory, track your orders, and communicate with your customers from one centralized, easy-to-use hub."
    },
    {
      icon: <Settings size={24} />,
      title: "Advanced Creator Tools",
      description: "From custom domains to automated email marketing, we give you the professional tools you need to grow."
    },
    {
      icon: <Rocket size={24} />,
      title: "Launch in Minutes",
      description: "Forget complex setups. Our intuitive onboarding process means you can have your brand live in under 5 minutes."
    }
  ];

  return (
    <>
      <SEO 
        title="Ecommerce for Creators & Creative Brands"
        description="Build a professional storefront for your creative brand. The most trusted platform for artisans, designers, and creative entrepreneurs to grow their business."
        keywords="ecommerce for creators, creative brand platform, launch online store, artist shop platform, boutique ecommerce builder"
        canonical="https://unbley.com/creator-platform"
      />
      
      <Navbar />
      <PageTransition>
        <main style={{ paddingTop: '100px' }}>
          <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '64px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '40px', backgroundColor: 'var(--accent-soft)', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
                  <Sparkles size={18} />
                  <span>The Future of Creative Commerce</span>
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2' }}>
                  Where <span style={{ color: 'var(--primary)' }}>Creative Passion</span> Meets Business Growth
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Unbley is designed for the modern artisan. We provide the professional tools you need to build your boutique brand and sell directly to your audience without the middleman.
                </p>
                <a href="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Build Your Brand Now</a>
              </div>
            </div>
          </section>

          <section id="creator-features" style={{ padding: '100px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Designed Specifically for Creative Brands</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Powerful tools that respect your brand's unique identity.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 32px' }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '20px', 
                      backgroundColor: 'white', 
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{feature.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <HowItWorks />

          <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-dark)', color: 'white' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '32px' }}>Join a Growing Community of 1,000+ Creators</h2>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>
                  Join the artists, designers, and creative entrepreneurs who have launched their high-value brands on Unbley. We've helped creators generate over $5M in revenue since our launch.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>$5M+</div>
                    <div style={{ fontSize: '14px', opacity: 0.6 }}>Sales Generated</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>1,200+</div>
                    <div style={{ fontSize: '14px', opacity: 0.6 }}>Active Creative Shops</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>250k+</div>
                    <div style={{ fontSize: '14px', opacity: 0.6 }}>Happy Customers</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>99.9%</div>
                    <div style={{ fontSize: '14px', opacity: 0.6 }}>Platform Uptime</div>
                  </div>
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
