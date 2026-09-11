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
      title: "1. Create Your Unbley Account",
      description: "Sign up for Unbley and provide your business details to get your online store started."
    },
    {
      icon: <Zap size={24} />,
      title: "2. Set Up Your Store",
      description: "Add your products, images, descriptions, prices, and other important store information. Customize your storefront to represent your brand."
    },
    {
      icon: <Rocket size={24} />,
      title: "3. Start Selling",
      description: "Share your store with customers, accept online payments, manage your orders, and grow your business online."
    }
  ];

  return (
    <>
      <SEO 
        title="Create Your Online Store in Minutes | Unbley"
        description="Launch a professional online store with Unbley. Add products, accept payments, manage orders, and give customers a simple way to shop online."
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
                Create Your Online Store <span style={{ color: 'var(--primary)' }}>in Minutes</span>
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
                Launch a professional online store with Unbley. Add your products, accept payments, manage orders, and give your customers a simple way to shop online — without needing to build a website from scratch.
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
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Simple Pricing. Everything You Need to Start Selling.</h2>
                <p style={{ maxWidth: '620px', margin: '0 auto 28px', color: 'var(--text-secondary)' }}>Choose the Unbley plan that fits your business and start building your online store without complicated setup.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', textAlign: 'left' }}>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '22px' }}>Starter</h3>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>₦50,000</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Or ₦5,000/month</div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Everything you need to launch and run your online store.</p>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Free Unbley domain</li><li>Store for your products</li><li>Secure online payments</li><li>Customer ordering system</li><li>Store management tools</li><li>Product management</li><li>Order management</li>
                    </ul>
                  </div>
                  <div style={{ border: '1px solid var(--primary)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '22px' }}>Business</h3>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>₦120,000</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Or ₦15,000/month</div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>More flexibility and a stronger setup for growing businesses.</p>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Everything in Starter</li><li>Custom business domain option</li><li>Enhanced business features</li><li>More advanced store capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>How to Create an Online Store With Unbley</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '48px' }}>Getting your business online doesn't need to be complicated. Create your store, add your products, and start selling.</p>
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
                  <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>Everything You Need to Run Your Online Store</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Unbley brings the essential tools for running an online business into one simple platform.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Smartphone style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Easy Store Management</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage your products, prices, orders, and store information from one convenient dashboard.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Shield style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Secure Online Payments</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Give your customers a simple checkout experience with secure payment options powered by trusted payment providers.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Globe style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: '600' }}>Automatic Merchant Payouts</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Your earnings from completed orders are automatically processed and sent to your registered bank account within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-gray)', padding: '40px', borderRadius: '32px' }}>
                  <Link to="/affordable-ecommerce-platform" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Looking for an Affordable Ecommerce Platform?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Unbley gives Nigerian businesses a practical way to start selling online without the cost and complexity of building an ecommerce platform from scratch.</p>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Learn More →</span>
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
