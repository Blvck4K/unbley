import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import PageTransition from '../components/PageTransition';
import { Download, ShieldCheck, Zap, Globe, BarChart3, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';

export default function SellDigitalGoods() {
  const benefits = [
    {
      icon: <Zap size={24} />,
      title: "Instant Digital Delivery",
      description: "Automate your sales. Customers receive their downloads immediately after a successful payment, 24/7."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Payment Processing",
      description: "Accept payments globally with industry-standard security. We support major credit cards and digital wallets."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      description: "Sell to customers in any country. Your digital storefront is optimized for a worldwide audience."
    },
    {
      icon: <Download size={24} />,
      title: "Unlimited Storage",
      description: "Host your digital assets on our secure servers. No limits on file size or the number of products you can list."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Advanced Analytics",
      description: "Track your sales, customer behavior, and traffic sources with our intuitive dashboard."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Low Transaction Fees",
      description: "Keep more of what you earn. Our transparent pricing model is designed to help your business scale."
    }
  ];

  return (
    <>
      <SEO 
        title="Sell Digital Products Online | Best Platform for Digital Downloads"
        description="Launch your digital storefront in minutes. Sell ebooks, software, templates, and courses with secure payments and instant delivery. Join ZizzyStores today."
        keywords="sell digital products, sell ebooks online, digital downloads platform, ecommerce for digital creators, sell software online"
        canonical="https://zizzystores.com/sell-digital-goods"
      />
      
      <PageTransition>
        <Navbar />
        
        <main style={{ paddingTop: '100px' }}>
          <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '64px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>
                  The Ultimate Platform to <span style={{ color: 'var(--primary)' }}>Sell Digital Products</span> Online
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Whether you're selling professional software, creative templates, or educational ebooks, ZizzyStores provides the tools you need to launch, manage, and scale your digital empire.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <a href="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Start Selling Now</a>
                  <a href="#benefits" className="btn btn-outline" style={{ padding: '12px 32px' }}>Explore Features</a>
                </div>
              </div>
            </div>
          </section>

          <section id="benefits" style={{ padding: '100px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Built for Digital Success</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Everything you need to turn your digital assets into a thriving business.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ 
                    padding: '32px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  className="hover-card"
                  >
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(8, 156, 255, 0.1)', 
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px'
                    }}>
                      {benefit.icon}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{benefit.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-dark)', color: 'white' }}>
            <div className="container">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '64px' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px' }}>What Can You Sell on ZizzyStores?</h2>
                  <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px' }}>
                    Our platform is versatile enough to handle any digital file type. Creators around the world use us to sell:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Ebooks & PDFs
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Software & Scripts
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Design Assets
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Online Courses
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Stock Photography
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Audio & Music
                    </li>
                  </ul>
                </div>
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>"ZizzyStores has completely automated my ebook sales. I've sold to customers in over 30 countries without lifting a finger."</h3>
                  <p style={{ fontWeight: '600', color: 'var(--primary)' }}>— Marcus Chen, Digital Author</p>
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
