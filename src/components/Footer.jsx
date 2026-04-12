import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer" style={{ padding: '80px 0 30px', backgroundColor: '#000000', color: '#ffffff', borderTop: 'none' }}>
      <style>{`
        .footer-brand p {
            color: #a3a3a3 !important;
        }
        .footer-col h4 {
            color: #ffffff !important;
        }
        .footer a {
            color: #a3a3a3 !important;
        }
        .footer-content-wrapper {
            position: relative;
            z-index: 10;
        }
        .footer-link {
          color: #a3a3a3 !important;
          text-decoration: none;
          transition: color 0.2s ease !important;
          font-size: 15px !important;
          display: inline-block;
        }
        .footer-link:hover {
          color: var(--accent) !important; /* light blue */
        }
        .footer-social {
          color: #a3a3a3 !important;
          transition: color 0.2s ease, transform 0.2s ease !important;
          display: inline-flex;
        }
        .footer-social:hover {
          color: var(--accent) !important;
          transform: translateY(-2px);
        }
        .footer-brand-title {
          font-size: 32px;
          letter-spacing: -0.03em;
          color: #ffffff;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
        }
        .footer-cta {
          display: inline-flex;
          align-items: center;
          margin-top: 24px;
          padding: 14px 28px;
          background-color: var(--accent);
          color: #ffffff !important;
          border-radius: 8px;
          font-size: 15px !important;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease !important;
        }
        .footer-cta:hover {
          background-color: #0052cc;
          transform: translateY(-2px);
        }
        .footer-bottom-divider {
          border-top: 1px solid #1a1a1a !important;
        }
        .footer-bottom-text {
          color: #737373 !important;
        }
        .footer-bottom-link {
          color: #737373 !important;
          text-decoration: none;
          font-size: 13px !important;
          transition: color 0.2s ease !important;
        }
        .footer-bottom-link:hover {
          color: var(--accent) !important;
        }
        .footer-heading {
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 20px !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ffffff;
        }
      `}</style>

      <div className="container footer-content-wrapper">
        <div className="footer-grid">
          <div className="footer-brand" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="footer-brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0px', justifyContent: 'center' }}>
              <img src="https://raw.githubusercontent.com/Blvck4K/Jss-png/main/Untitled%20design.png" alt="ZizzyStores Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '-16px' }} />
              <span>ZizzyStores.</span>
            </div>
            <p style={{ maxWidth: '320px', margin: '16px auto 0', lineHeight: '1.6', fontSize: '15px' }}>
              Build your brand’s online store, own your domain, and sell professionally.
            </p>
            <Link to="/create-online-store" className="footer-cta">Get Your Store Today</Link>
          </div>

          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4 className="footer-heading">Solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}><Link to="/create-online-store" className="footer-link">Create Online Store</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/#domains" className="footer-link">Custom Domain Setup</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/creator-platform" className="footer-link">Ecommerce for Brands</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/#payments" className="footer-link">Payment Integration</Link></li>
              <li style={{ marginBottom: '12px' }}><Link to="/dashboard" className="footer-link">Store Management</Link></li>
            </ul>
          </div>

          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4 className="footer-heading">Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}><Link to="/about" className="footer-link">About Us</Link></li>
              <li style={{ marginBottom: '12px' }}><a href="#" className="footer-link">Success Stories</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openChatWidget')); }} className="footer-link">Customer Service</a></li>
              <li style={{ marginBottom: '12px' }}><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4 className="footer-heading">Socials</h4>
            <div className="flex justify-center" style={{ marginTop: '16px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, }}>
                <li className="flex" style={{ gap: '18px' }}>
                  <a href="https://wa.link/bg2bpg" className="footer-social"><FaWhatsapp size={22} /></a>
                  <a href="#" className="footer-social"><FaInstagram size={22} /></a>
                  <a href="#" className="footer-social"><FaTwitter size={22} /></a>
                  <a href="#" className="footer-social"><FaFacebook size={22} /></a>
                  <a href="#" className="footer-social"><FaYoutube size={22} /></a>
                  <a href="#" className="footer-social"><FaPinterest size={22} /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom footer-bottom-divider" style={{ flexDirection: 'column', gap: '8px', textAlign: 'center', paddingTop: '24px', marginTop: '16px' }}>
          <div className="footer-bottom-text" style={{ fontSize: '12px' }}>© {new Date().getFullYear()} ZIZZYSTORES. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6 justify-center">
            <a href="#" className="footer-bottom-link">Privacy</a>
            <a href="#" className="footer-bottom-link">Terms</a>
            <a href="#" className="footer-bottom-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
