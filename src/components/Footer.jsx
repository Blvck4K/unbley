import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="font-bold" style={{ fontSize: '20px', letterSpacing: '-0.03em' }}>
              ZizzyStores.
            </div>
            <p>The world's most trusted marketplace for launching high-value digital storefronts. Backed by experts, powered by transparency.</p>
          </div>
          <div className="footer-col">
            <h4>Marketplace</h4>
            <ul>
              <li><a href="#">SaaS Platforms</a></li>
              <li><a href="#">E-commerce</a></li>
              <li><a href="#">Content Sites</a></li>
              <li><a href="#">Premium Domains</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Affiliate Program</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} ZIZZYSTORES MARKETPLACE. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-4" style={{ color: 'var(--bg-dark)' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
               <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.27-1.15 4.14-2.91 5.37-1.84 1.27-4.16 1.63-6.21.92-2-.68-3.46-2.22-3.95-4.32-.47-1.92-.1-3.83 1.15-5.36 1.22-1.47 3-2.3 4.88-2.3.11 0 .22 0 .34.01v4.03c-1.03-.02-2.07.25-2.82 1.01-.73.74-.94 1.83-.55 2.8.36.93 1.22 1.53 2.19 1.6 1.05.07 2.08-.29 2.76-1.07.72-.81 1.04-1.89 1.01-2.99.01-6.19.01-12.38.01-18.57z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
