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
    { feature: "Starting Monthly Price", shopify: "$29 / mo", unbley: "₦2,500 / mo ($2.50 / mo)*" },
    { feature: "Yearly Cost (1st Year)", shopify: "$348+ / yr", unbley: "₦30,000 / $30 / yr" },
    { feature: "Renewal Price", shopify: "$348+ / yr", unbley: "₦50,000 / $60 / yr" },
    { feature: ".top Domain Included", shopify: "No ($15+ extra)", unbley: "Yes (FREE)" },
    { feature: "Accept Naira Locally", shopify: "Difficult", unbley: "Native Support" },
    { feature: "No Coding Required", shopify: "Yes", unbley: "Yes" },
    { feature: "Nigerian Support Team", shopify: "Global / English", unbley: "Local & Personalized" }
  ];

  return (
    <>
      <SEO 
        title="Shopify Alternative in Nigeria & Global | Best Value Ecommerce"
        description="Tired of paying Shopify in USD? Unbley is the best Shopify alternative for Nigerian and global brand owners. Start at only ₦30,000 / $30 for a full year."
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
                SAVINGS ALERT
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 8vw, 56px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                The #1 <span style={{ color: 'var(--primary)' }}>Shopify Alternative</span> for Global & Nigerian Brands
              </h1>
              <p style={{ fontSize: 'clamp(16px, 4vw, 18px)', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Why pay <strong>$29 a month</strong> (over ₦45,000 monthly) when you can launch your entire storefront for just <strong>₦30k / $30 a YEAR</strong>?
              </p>
              <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Switch to Unbley & Save Today</Link>
            </div>
          </section>

          {/* The Comparison Table */}
          <section style={{ padding: 'clamp(40px, 10vw, 80px) 20px' }}>
            <div className="container">
              <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: '700', marginBottom: '48px' }}>See the Massive Difference</h2>
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
              <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                *Based on Unbley (₦30,000 first year). Shopify prices exclude additional apps and transaction fees.
              </p>
            </div>
          </section>

          {/* Why Switch? */}
          <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Why Smart Brands are Switching</h2>
                <p style={{ color: 'var(--text-secondary)' }}>More than just a lower price. It's built for your specific needs.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <PiggyBank style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Pay in Naira, Save More</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Stop worrying about unstable dollar rates. Lock in your shop for an entire year with a single, affordable Naira payment.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <Smile style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>One-Time Yearly Payment</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Set it and forget it. No monthly deductions or surprise bills. One checkout and your shop is live for 12 months.</p>
                </div>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                  <ShieldCheck style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Zero Transaction Fees</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Keep 100% of your earnings. We don't take a cut of your sales, unlike major competitors.</p>
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
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>Ready for a Shopify Alternative That Actually Works?</h2>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                  Join over 1,000+ merchants who have switched and saved millions in monthly subscription fees.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Start Your 1st Year for ₦30,000</Link>
                  <Link to="/affordable-ecommerce-platform" className="btn btn-outline" style={{ padding: '12px 32px', color: 'white', borderColor: 'white' }}>See How Cheap it is</Link>
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
