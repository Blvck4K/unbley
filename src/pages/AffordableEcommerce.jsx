import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import CTASection from '../components/CTASection';
import { BadgeCheck, Wallet, Zap, Settings, HelpCircle, Heart, Check, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AffordableEcommerce() {
  const values = [
    {
      icon: <Wallet size={24} />,
      title: "Lowest Entry Cost",
      description: "Start for just ₦30,000 / $30 for a whole year. That's less than ₦2,500 ($2.50) a month—the best value in Nigeria."
    },
    {
      icon: <BadgeCheck size={24} />,
      title: "All-Inclusive Features",
      description: "No 'Lite' plans here. You get everything: custom domain, hosting, unlimited products, and localized payments."
    },
    {
      icon: <Zap size={24} />,
      title: "No Hidden Fees",
      description: "Tired of transaction fees? ZizzyStores don't take a percentage of your sales. What you earn is yours."
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Affordable Ecommerce Website Nigeria & Global | Only ₦30,000 / $30 | ZizzyStores</title>
        <meta name="description" content="Looking for a cheap ecommerce website in Nigeria? ZizzyStores offers the most affordable way to launch a professional online store for ₦30,000 a year." />
        <meta name="keywords" content="cheap ecommerce website Nigeria, affordable online store builder, best value ecommerce platform, website for my business Nigeria" />
      </Helmet>

      <Navbar />

      <main style={{ paddingTop: '80px' }}>
        {/* Value Hero */}
        <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px' }}>
              The Most <span style={{ color: 'var(--primary)' }}>Affordable way</span> to Launch a Professional Store
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Why spend ₦100k+ on a custom developer when you can get a professional .store website for just <strong>₦30,000 / $30</strong> for your first year?
            </p>
            <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }}>Start Your Shop for ₦30,000</Link>
          </div>
        </section>

        {/* Why Value Matters */}
        <section style={{ padding: '80px 20px' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '48px' }}>The Best Value for Your Business</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {values.map((value, index) => (
                <div key={index} style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px', backgroundColor: 'rgba(8, 156, 255, 0.1)',
                    color: 'var(--primary)', borderRadius: '16px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                  }}>
                    {value.icon}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{value.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Breakdown Section */}
        <section style={{ padding: '100px 20px', backgroundColor: 'var(--bg-dark)', color: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>Everything Included. <br />No Hidden Costs.</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="white" />
                    </div>
                    <span>Professional .top Domain for 1 Year</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="white" />
                    </div>
                    <span>Unlimited Product Listings & Images</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="white" />
                    </div>
                    <span>Secure Local & Global Payments (Integrated)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="white" />
                    </div>
                    <span>Mobile Dashboard for Real-Time Management</span>
                  </li>
                </ul>
              </div>
              <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '48px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>ZizzyStores Bundle</h3>
                  <div style={{ fontSize: '64px', fontWeight: '800', color: '#ffffff50', marginBottom: '8px' }}>₦30k</div>
                  <div style={{ fontSize: '20px', opacity: 0.6, marginBottom: '24px' }}>Entire Year ($30)</div>
                  <p style={{ fontSize: '15px', color: '#ccc', marginBottom: '32px' }}>
                    Launch your business without breaking the bank. Professional, modern, and high-converting.
                  </p>
                  <Link to="/auth?mode=signup" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>Claim Your Promo Price</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Localized Appeal FAQ */}
        <section style={{ padding: '80px 20px' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '48px' }}>Common Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-gray)', borderRadius: '16px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>How is it so cheap?</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>We've optimized our infrastructure to offer the best price specifically for small brand owners. We focus on value, not inflated corporate margins.</p>
              </div>
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-gray)', borderRadius: '16px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Can I use my own domain?</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Yes! Every plan includes a NEW .top domain, but you can also connect your existing domain seamlessly.</p>
              </div>
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-gray)', borderRadius: '16px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Do you support Paystack/Flutterwave?</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Native support for top-tier gateways means you can accept payments from anyone in Nigeria or globally with ease.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Links Section */}
        <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Explore Other Solutions</h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/create-online-store" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'inherit' }}>
                <Rocket size={18} color="var(--primary)" />
                <span>How to Create a Store</span>
              </Link>
              <Link to="/shopify-alternative" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'inherit' }}>
                <Settings size={18} color="var(--primary)" />
                <span>Zizzy vs Shopify</span>
              </Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </PageTransition>
  );
}
