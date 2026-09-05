import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Globe, CheckCircle2, Send, Rocket, Building, User, Edit3 } from 'lucide-react';

const contactStyles = `
  .contact-hero {
    padding: 180px 0 100px;
    background-color: var(--bg-surface);
    background-image:
      radial-gradient(at 0% 0%, rgba(247, 242, 236, 0.9) 0, transparent 55%),
      radial-gradient(at 100% 0%, rgba(234, 227, 217, 0.6) 0, transparent 55%);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .contact-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
  }
  .contact-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(40px, 6vw, 64px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 24px;
    line-height: 1.1;
  }
  .contact-section {
    padding: 100px 0;
  }
  .contact-section-alt {
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
    font-family: var(--font-heading);
    font-size: clamp(32px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  .grid-2-contact {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 64px;
    align-items: flex-start;
  }
  .contact-card {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    padding: 32px;
    border-radius: var(--radius-xl);
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    transition: var(--transition);
  }
  .contact-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-sm);
    border-color: rgba(106, 62, 31, 0.25);
  }
  .contact-icon {
    width: 48px;
    height: 48px;
    background: var(--accent-soft);
    color: var(--accent);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .contact-card h4 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .contact-card p, .contact-card a {
    color: var(--text-secondary);
    font-size: 15px;
    line-height: 1.6;
    text-decoration: none;
  }
  .contact-card a {
    color: var(--accent);
    font-weight: 600;
  }
  
  /* Form Styles */
  .contact-form-wrapper {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: 48px;
    box-shadow: var(--shadow-lg);
  }
  .form-group {
    margin-bottom: 24px;
  }
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  .input-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  .input-icon {
    position: absolute;
    left: 16px;
    color: #6B584C;
  }
  .form-control {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-light);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 15px;
    transition: var(--transition);
    outline: none;
  }
  .form-control:focus {
    background: var(--bg-white);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }
  textarea.form-control {
    padding: 16px;
    min-height: 150px;
    resize: vertical;
  }
  .btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 16px;
    background: var(--primary);
    color: white;
    font-weight: 600;
    font-size: 16px;
    border-radius: var(--radius-lg);
    border: none;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: 0 4px 14px rgba(106, 62, 31, 0.25);
  }
  .btn-submit:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(106, 62, 31, 0.35);
  }
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .why-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
  }
  .why-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    color: var(--text-secondary);
  }
  .why-item svg {
    color: #6A3E1F;
    flex-shrink: 0;
  }

  .cta-banner {
    background: linear-gradient(135deg, #261710, #3D291E);
    color: #FDFBF7;
    text-align: center;
    padding: 80px 24px;
    border-radius: var(--radius-2xl);
    margin: 80px auto;
    box-shadow: 0 12px 36px rgba(38, 23, 16, 0.15);
  }
  .cta-banner h2 {
    color: #FDFBF7;
  }
  .cta-banner p {
    color: #C9BFB5;
  }
  .cta-button {
    display: inline-block;
    background: #FFFFFF;
    color: #6A3E1F;
    padding: 16px 40px;
    border-radius: var(--radius-md);
    font-weight: 700;
    text-decoration: none;
    margin-top: 24px;
    transition: var(--transition);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  }
  .cta-button:hover {
    background: #F7F2EC;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 768px) {
    .grid-2-contact {
      grid-template-columns: 1fr;
      gap: 48px;
    }
    .contact-form-wrapper {
      padding: 32px 24px;
    }
    .contact-hero {
      padding: 140px 0 60px;
    }
  }
`;

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', businessName: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.error("Telegram bot config is missing.");
        toast.error("Contact form configuration is incomplete, but our team is reachable via WhatsApp!");
        setLoading(false);
        return;
      }

      const tgMsg = `
📬 *New Contact Form Submission*
*Name:* ${formData.name}
*Email:* ${formData.email}
*Business Name:* ${formData.businessName || 'N/A'}

*Message:* 
${formData.message}
        `;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: tgMsg,
          parse_mode: 'Markdown',
          disable_notification: false
        })
      });

      if (!response.ok) throw new Error("Failed to send message to Telegram");

      setSuccess(true);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: '', email: '', businessName: '', message: '' });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again or reach out on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Unbley"
        description="Get in touch with Unbley. We're here to help you build your ecommerce website, get a custom domain, and manage your online store in Nigeria."
      />
      <Navbar />
      <PageTransition>
        <style dangerouslySetInnerHTML={{ __html: contactStyles }} />

        <main>
          {/* Hero Section */}
          <section className="contact-hero">
            <div className="container">
              <div className="hero-badge mx-auto" style={{ margin: '0 auto 24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span role="img" aria-label="telephone" style={{ marginRight: '8px' }}>📞</span> Contact Us — Unbley
              </div>
              <h1 className="contact-hero-title">
                Get in Touch
              </h1>
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                Have questions about creating your online store? Need help setting up your domain or ecommerce website? We're here to help you every step of the way.
              </p>
            </div>
          </section>

          {/* Contact Methods & Form */}
          <section className="contact-section">
            <div className="container">
              <div className="grid-2-contact">
                {/* Left Column: Contact Details */}
                <div>
                  <span className="section-label">Talk to Us Directly</span>
                  <h2 className="section-title">We're always ready to assist you.</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
                    At Unbley, we make it easy for brands to create an online store in Nigeria, and our support team is always ready to assist you.
                  </p>

                  <div className="contact-card">
                    <div className="contact-icon"><MessageCircle size={24} /></div>
                    <div>
                      <h4>WhatsApp Support</h4>
                      <p style={{ marginBottom: '12px' }}>Need quick help? Chat with us instantly on WhatsApp.</p>
                      <a href="https://wa.link/bg2bpg" target="_blank" rel="noopener noreferrer">👉 Click here to chat with Support</a>
                    </div>
                  </div>

                  <div className="contact-card">
                    <div className="contact-icon"><Mail size={24} /></div>
                    <div>
                      <h4>Email Support</h4>
                      <p style={{ marginBottom: '12px' }}>For detailed inquiries, partnerships, or business discussions. We typically respond within 24 hours.</p>
                      <a href="mailto:support@unbley.com">👉 support@unbley.com</a>
                    </div>
                  </div>

                  <div className="contact-card">
                    <div className="contact-icon"><Globe size={24} /></div>
                    <div>
                      <h4>Website</h4>
                      <p style={{ marginBottom: '12px' }}>Explore our platform and see how it works.</p>
                      <Link to="/">👉 www.unbley.com</Link>
                    </div>
                  </div>

                  <div style={{ marginTop: '48px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>Why Contact Unbley?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>We're not just support — we're your growth partner.</p>

                    <div className="why-list">
                      <div className="why-item"><CheckCircle2 size={20} /> Fast and friendly responses</div>
                      <div className="why-item"><CheckCircle2 size={20} /> Guidance tailored for Nigerian businesses 🇳🇬</div>
                      <div className="why-item"><CheckCircle2 size={20} /> Simple explanations (no tech confusion)</div>
                      <div className="why-item"><CheckCircle2 size={20} /> Real solutions to help you sell online</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Contact Form */}
                <div>
                  <div className="contact-form-wrapper">
                    <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Send us a Message</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Fill out the form below and we'll get back to you shortly.</p>

                    {success && (
                      <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle2 size={20} />
                        Your message has been sent successfully!
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Name</label>
                        <div className="input-icon-wrapper">
                          <User size={18} className="input-icon" />
                          <input type="text" name="name" className="form-control" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <div className="input-icon-wrapper">
                          <Mail size={18} className="input-icon" />
                          <input type="email" name="email" className="form-control" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Business Name (Optional)</label>
                        <div className="input-icon-wrapper">
                          <Building size={18} className="input-icon" />
                          <input type="text" name="businessName" className="form-control" placeholder="Your Brand Name" value={formData.businessName} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Message</label>
                        <div className="input-icon-wrapper" style={{ alignItems: 'flex-start' }}>
                          <Edit3 size={18} className="input-icon" style={{ top: '16px' }} />
                          <textarea name="message" className="form-control" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required style={{ paddingLeft: '48px' }}></textarea>
                        </div>
                      </div>

                      <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Sending...' : <>Send Message <Send size={18} /></>}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Info / SEO Section */}
          <section className="contact-section-alt">
            <div className="container">
              <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <span className="section-label" style={{ background: 'var(--bg-white)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--border-color)' }}>What We Can Help You With</span>
                <h2 className="section-title">Reach out to us if you need help with:</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>🛒 Creating your online store in Nigeria</div>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>🌐 Getting a custom domain for your brand</div>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>💻 Setting up your ecommerce website</div>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>💳 Payment integration (Paystack)</div>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>📦 Managing your store</div>
                  <div style={{ background: 'var(--bg-white)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '500' }}>🤝 General support and guidance</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="container">
            <div className="cta-banner">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>Ready to Build Your Store?</h2>
              <p style={{ fontSize: '18px', opacity: '0.9', maxWidth: '600px', margin: '0 auto 8px' }}>
                Don't let customers miss out because you don't have a proper website.
              </p>
              <p style={{ fontSize: '18px', opacity: '0.9', fontWeight: 'bold' }}>Own your domain. Sell like a real brand.</p>

              <Link to="/auth" className="cta-button">
                👉 Start your journey today with Unbley
              </Link>
            </div>
          </section>

          {/* SEO Hidden Elements - Helper for crawlers based on user request */}
          <div style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            <p>Unbley helps businesses: Create online store in Nigeria, Build ecommerce websites easily, Get affordable online store solutions, Find a Shopify alternative in Nigeria. If you're searching for: "create online store Nigeria", "ecommerce website Nigeria", "cheap online store builder Nigeria" 👉 You're in the right place.</p>
          </div>

        </main>

        <Footer />
      </PageTransition>
    </>
  );
}
