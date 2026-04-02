import React from 'react';
import { Search, ShoppingCart, Menu, X, User as UserIcon, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && search.trim()) {
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('id')
          .ilike('brand_name', `%${search}%`)
          .limit(1)
          .single();

        if (data) {
          navigate(`/shop-brand/${data.id}`);
          setIsMenuOpen(false);
        } else {
          alert("Brand not found. Try searching by their exact name or domain!");
        }
      } catch (err) {
        console.error("Search failed:", err);
        alert("Brand not found.");
      }
    }
  };

  return (
    <nav className="navbar" style={{ height: isMenuOpen && isMobile ? 'auto' : '72px', padding: isMenuOpen && isMobile ? '20px 0' : '0' }}>
      <div className="container flex justify-between items-center" style={{ width: '100%', flexDirection: isMenuOpen && isMobile ? 'column' : 'row', gap: isMenuOpen && isMobile ? '20px' : '0' }}>
        <div className="flex items-center justify-between" style={{ width: isMobile ? '100%' : 'auto', gap: isMobile ? '0' : '32px' }}>
          <Link to="/" className="font-bold" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '20px', letterSpacing: '-0.03em', color: 'inherit', textDecoration: 'none' }}>
            ZizzyStores.
          </Link>

          {isMobile ? (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', color: 'inherit' }}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <div className="nav-links">
              <a href="#marketplace">Marketplace</a>
              <a href="#solutions">Solutions</a>
              <a href="#resources">Resources</a>
              <a href="#sell">Sell</a>
            </div>
          )}
        </div>

        {(isMenuOpen || !isMobile) && (
          <div className="flex items-center gap-4 mobile-nav-content" style={{ flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
            <div className="flex items-center gap-2" style={{ background: 'var(--bg-gray)', padding: '8px 16px', borderRadius: 'var(--radius-md)', width: isMobile ? '100%' : 'auto' }}>
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: isMobile ? '100%' : '150px' }}
              />
            </div>

            <div className="flex items-center gap-4" style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="font-semibold flex items-center gap-2" style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit' }}>
                {isMobile ? <LogIn size={18} /> : null}
                <span>Sign In</span>
              </Link>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                Get Started
              </Link>
            </div>

            {isMobile && isMenuOpen && (
              <div className="flex flex-col gap-4 text-center" style={{ width: '100%', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <a href="#marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</a>
                <a href="#solutions" onClick={() => setIsMenuOpen(false)}>Solutions</a>
                <a href="#resources" onClick={() => setIsMenuOpen(false)}>Resources</a>
                <a href="#sell" onClick={() => setIsMenuOpen(false)}>Sell</a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
