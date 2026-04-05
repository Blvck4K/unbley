import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User as UserIcon, LogIn, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar" 
      style={{ 
        height: '72px',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container flex justify-between items-center" style={{ width: '100%', height: '100%' }}>
        <div className="flex items-center justify-between" style={{ width: isMobile ? '100%' : 'auto', gap: isMobile ? '0' : '32px' }}>
          <Link to="/" className="font-bold flex items-center gap-2" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '20px', letterSpacing: '-0.03em', color: 'inherit', textDecoration: 'none' }}>
            <motion.span whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              ZizzyStores.
            </motion.span>
          </Link>

          {isMobile && (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', color: 'inherit', cursor: 'pointer', padding: '8px' }}>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Desktop Nav */}
        {!isMobile && (
          <div className="flex items-center gap-8">
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button 
                className="flex items-center gap-1 font-semibold" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0' }}
              >
                Solutions
                <motion.span animate={{ rotate: isSolutionsOpen ? 180 : 0 }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.span>
              </button>
              
              <AnimatePresence>
                {isSolutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '-20px',
                      width: '260px',
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                      padding: '16px',
                      border: '1px solid var(--border-color)',
                      zIndex: 1000
                    }}
                  >
                    <Link to="/sell-digital-products" className="solutions-item">
                      <div className="font-bold">Digital Products</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Ebooks, software, and courses.</p>
                    </Link>
                    <Link to="/creator-platform" className="solutions-item">
                      <div className="font-bold">Creative Brands</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Artisans and boutique shops.</p>
                    </Link>
                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }}></div>
                    <Link to="/create-online-store" className="solutions-item">
                      <div className="font-bold">Create Store</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Launch in under 5 minutes.</p>
                    </Link>
                    <Link to="/shopify-alternative" className="solutions-item">
                      <div className="font-bold">Shopify Alternative</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Save thousands in yearly fees.</p>
                    </Link>
                    <Link to="/affordable-ecommerce-platform" className="solutions-item">
                      <div className="font-bold">Price & Value</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>High value for any budget.</p>
                    </Link>
                    <style>{`
                      .solutions-item {
                        display: block;
                        padding: 12px;
                        border-radius: var(--radius-md);
                        transition: background 0.2s ease;
                        text-decoration: none;
                        color: inherit;
                      }
                      .solutions-item:hover {
                        background-color: var(--bg-gray);
                      }
                    `}</style>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2" style={{ background: 'var(--bg-gray)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '160px' }}
              />
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="font-semibold" style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit' }}>
                    Dashboard
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout} 
                    className="btn btn-outline" 
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=signin" className="font-semibold" style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit' }}>
                    Sign In
                  </Link>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Link to="/auth?mode=signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              position: 'absolute', 
              top: '72px', 
              left: 0, 
              right: 0, 
              backgroundColor: '#FFF', 
              borderBottom: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 99
            }}
          >
            <div className="container flex flex-col gap-6" style={{ padding: '24px 20px' }}>
              <div className="flex flex-col gap-2">
                <div className="font-bold" style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Solutions</div>
                <Link to="/sell-digital-products" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ fontSize: '15px' }}>Sell Digital Products</Link>
                <Link to="/creator-platform" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ fontSize: '15px' }}>Creative Brands</Link>
                <Link to="/create-online-store" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ fontSize: '15px' }}>Create Online Store</Link>
                <Link to="/shopify-alternative" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ fontSize: '15px' }}>Shopify Alternative</Link>
                <Link to="/affordable-ecommerce-platform" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ fontSize: '15px' }}>Affordable Ecommerce</Link>
              </div>

              <div className="flex items-center gap-2" style={{ background: 'var(--bg-gray)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                <Search size={18} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '16px', width: '100%' }}
                />
              </div>

              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="font-semibold flex items-center gap-3" style={{ fontSize: '16px', padding: '12px 0' }}>
                      <LayoutGrid size={20} />
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', padding: '12px' }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=signin" onClick={() => setIsMenuOpen(false)} className="font-semibold flex items-center gap-3" style={{ fontSize: '16px', padding: '12px 0' }}>
                      <LogIn size={20} />
                      Sign In
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

