import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import CTASection from '../components/CTASection';
import { CreditCard, PiggyBank, Smile, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function ShopifyAlternative() {
  const comparison = [
    { feature: "Online Store", shopify: "Yes", unbley: "Yes" },
    { feature: "Monthly Plan", shopify: "Available", unbley: "Available" },
    { feature: "Naira Pricing", shopify: "USD-based pricing", unbley: "₦5,000/month Starter" },
    { feature: "Yearly Starter Plan", shopify: "Varies by plan", unbley: "₦50,000/year" },
    { feature: "Growing Business Plan", shopify: "Multiple paid plans", unbley: "₦15,000/month Business or ₦120,000/year" },
    { feature: "Custom Domain", shopify: "Available", unbley: "Available" },
    { feature: "Online Payments", shopify: "Available through supported payment providers", unbley: "Paystack & Flutterwave" },
    { feature: "Product Management", shopify: "Yes", unbley: "Yes" },
    { feature: "Order Management", shopify: "Yes", unbley: "Yes" },
    { feature: "Merchant Payouts", shopify: "Payment provider dependent", unbley: "Unbley processes completed-order earnings for automatic settlement to the registered bank account within 24 hours" },
    { feature: "Technical Setup", shopify: "More configuration and third-party ecosystem", unbley: "Simple setup designed for businesses" }
  ];

  return (
    <>
      <SEO 
        title="Affordable Online Store Platform for Nigerian Businesses | Unbley"
        description="Create a professional online store with clear pricing, local payment support, product management, and order tools built for Nigerian businesses."
        canonical="https://unbley.com/shopify-alternative"
        keywords="Shopify alternative Nigeria, best ecommerce platform Nigeria, affordable shopify alternative, ecommerce for creators"
      />

      <Navbar />
      <PageTransition>
        <main style={{ paddingTop: '80px' }}>
          {/* Comparison Hero */}
          <section style={{ padding: 'clamp(40px, 8vw, 80px) 20px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'inline-block', padding: '8px 20px', backgroundColor: 'var(--accent-soft)', color: 'var(--primary)', borderRadius: '40px', fontWeight: '700', marginBottom: '24px' }}>
                THE SMARTER WAY TO SELL ONLINE
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 8vw, 56px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                A Simpler, More Affordable <span style={{ color: 'var(--primary)' }}>Alternative to Shopify</span>
              </h1>
              <p style={{ fontSize: 'clamp(16px, 4vw, 18px)', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Build a professional online store, accept payments, manage orders, and grow your business with Unbley — without paying for features and complexity you don't need.
              </p>
              <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Switch to Unbley</Link>
            </div>
          </section>

          {/* The Comparison Table */}
          <section style={{ padding: 'clamp(40px, 10vw, 80px) 20px' }}>
            <div className="container">
              <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: '700', marginBottom: '16px' }}>Shopify vs Unbley</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '48px' }}>See how Unbley gives businesses the essential tools to start and manage an online store with a simpler pricing structure.</p>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-gray)' }}>
                        <th style={{ padding: '20px', textAlign: 'left', fontWeight: '700' }}>Features</th>
                        <th style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Shopify</th>
                        <th style={{ padding: '20px', textAlign: 'center', color: 'var(--primary)' }}>Unbley</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '20px', fontWeight: '600' }}>{row.feature}</td>
                          <td style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>{row.shopify}</td>
                          <td style={{ padding: '20px', textAlign: 'center', fontWeight: '700', color: 'var(--primary)' }}>{row.unbley}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '900px', margin: '28px auto 0' }}>
                <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'var(--bg-light)' }}><h3 style={{ margin: '0 0 8px' }}>Starter</h3><strong style={{ fontSize: '28px', color: 'var(--primary)' }}>₦50,000/year</strong><div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Or ₦5,000/month</div><p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Everything you need to launch and run your online store.</p></div>
                <div style={{ padding: '24px', border: '1px solid var(--primary)', borderRadius: '16px', background: 'var(--bg-light)' }}><h3 style={{ margin: '0 0 8px' }}>Business</h3><strong style={{ fontSize: '28px', color: 'var(--primary)' }}>₦120,000/year</strong><div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Or ₦15,000/month</div><p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>More flexibility and capabilities for growing businesses.</p></div>
              </div>
            </div>
          </section>

          {/* Why Switch? */}
          <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Why Businesses Choose Unbley</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Lower complexity. Straightforward pricing. Built with businesses like yours in mind.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <PiggyBank style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Pay in Naira</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Choose a plan priced in Naira and avoid making your core store subscription dependent on foreign-currency pricing.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <Smile style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Start Monthly or Yearly</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Choose the payment schedule that works for your business. Start with a monthly plan or save by choosing an annual plan.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <ShieldCheck style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Everything You Need to Sell</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Create your store, add products, accept payments, manage orders, and build your online presence without having to piece together multiple tools.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <CreditCard style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Built for Nigerian Businesses</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Unbley is designed around the needs of businesses selling in Nigeria, including Naira pricing, local payment options, straightforward store management, and automatic merchant settlement.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <ShieldCheck style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Your Store, Your Brand</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Build a professional storefront for your business and give customers a direct place to discover your products and place orders.</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '80px 20px' }}>
            <div className="container">
              <div style={{
                backgroundColor: 'var(--bg-dark)',
                color: 'white',
                borderRadius: '32px',
                padding: '64px 40px',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-light)' }}>Ready for a Simpler Way to Sell Online?</h2>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                  Create your Unbley store and get the essential tools you need to start selling, accepting payments, and managing your business online.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Start Selling With Unbley</Link>
                  <Link to="/affordable-ecommerce-platform" className="btn btn-outline" style={{ padding: '12px 32px', color: 'white', borderColor: 'white' }}>Compare Pricing</Link>
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
