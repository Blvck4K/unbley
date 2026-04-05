import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" style={{ padding: '60px 0 30px' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="font-bold" style={{ fontSize: '24px', letterSpacing: '-0.03em' }}>
              ZizzyStores.
            </div>
            <p style={{ maxWidth: '400px', margin: '16px auto 0' }}>The world's most trusted marketplace for launching high-value digital storefronts.</p>
          </div>
          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4>Solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="/sell-digital-products" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Sell Digital Products</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/creator-platform" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Creative Brands</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/create-online-store" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Create Online Store</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/shopify-alternative" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Shopify Alternative</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/affordable-ecommerce-platform" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>Affordable Ecommerce</Link></li>
            </ul>
          </div>
          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-col" style={{ textAlign: 'center' }}>
            <h4>Social</h4>
            <div className="flex gap-6 justify-center" style={{ marginTop: '16px' }}>
              <a href="#" className="text-secondary"><svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg></a>
              <a href="#" className="text-secondary"><svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{ flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <div>© {new Date().getFullYear()} ZIZZYSTORES. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6" style={{ fontSize: '12px' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
