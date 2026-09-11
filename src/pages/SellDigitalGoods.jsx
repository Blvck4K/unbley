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
      title: "Products & Services Storefront",
      description: "Create a professional storefront for physical products, digital goods, or services and give customers a clear way to order online."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Payment Processing",
      description: "Accept customer payments through trusted providers like Paystack and Flutterwave with a simple checkout experience."
    },
    {
      icon: <Globe size={24} />,
      title: "Built for Online Selling",
      description: "Present what your business offers online and make it easier for customers to discover your products and place orders."
    },
    {
      icon: <Download size={24} />,
      title: "Organized Product Management",
      description: "Add products, update prices, and keep your online catalog organized from one dashboard."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Order Management",
      description: "View customer orders and keep the important parts of your online business organized in one place."
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
        title="Sell Products and Services Online | Unbley"
        description="Create a professional online store for products, digital goods, or services. Accept payments, manage orders, and sell online with Unbley."
        keywords="sell digital products, sell ebooks online, digital downloads platform, ecommerce for digital creators, sell software online"
        canonical="https://unbley.com/sell-digital-goods"
      />
      
      <Navbar />
      <PageTransition>
        <main style={{ paddingTop: '100px' }}>
          <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '64px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>
                  Sell What Your Business Offers <span style={{ color: 'var(--primary)' }}>Online</span>
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Whether you sell physical products, digital goods, services, or creative work, Unbley gives you the tools to create a professional storefront, accept payments, and manage orders.
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
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Everything You Need to Sell Online</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Essential tools to turn what you create into a professional online business.</p>
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
                      backgroundColor: 'var(--accent-soft)', 
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
                  <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-light)' }}>Sell What Your Business Offers</h2>
                  <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px' }}>
                    From physical products and digital goods to services, Unbley gives your business a professional place to sell:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Fashion & Clothing
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Beauty & Cosmetics
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Electronics & Gadgets
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Food & Beverages
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Digital Products
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                      Services & More
                    </li>
                  </ul>
                </div>
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Your business deserves a professional online storefront that makes it easier for customers to discover and order from you.</h3>
                    <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Built for Nigerian businesses and creative entrepreneurs</p>
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
