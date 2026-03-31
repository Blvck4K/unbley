import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center" style={{ width: '100%' }}>
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold" style={{ fontSize: '20px', letterSpacing: '-0.03em', color: 'inherit', textDecoration: 'none' }}>
            ZizzyStores.
          </Link>
          <div className="nav-links">
            <a href="#marketplace">Marketplace</a>
            <a href="#solutions">Solutions</a>
            <a href="#resources">Resources</a>
            <a href="#sell">Sell</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2" style={{ background: 'var(--bg-gray)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search stores..." 
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '150px' }}
            />
          </div>
          <Link to="/auth" className="font-semibold" style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit' }}>Sign In</Link>
          <Link to="/auth" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
