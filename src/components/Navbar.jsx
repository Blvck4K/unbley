import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User as UserIcon, LogIn, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logogo.png';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();
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
        const { data } = await supabase
          .from('brand_profiles')
          .select('id')
          .ilike('brand_name', `%${search}%`)
          .limit(1)
          .single();

        if (data) {
          navigate(`/shop-brand/${data.id}`);
          setIsMenuOpen(false);
        } else {
          toast.info("Brand not found. Try searching by their exact name or domain!");
        }
      } catch (err) {
        console.error("Search failed:", err);
        toast.info("Brand not found.");
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
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.98)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(34, 21, 16, 0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container flex justify-between items-center" style={{ width: '100%', height: '100%' }}>
        <div className="flex items-center justify-between" style={{ width: isMobile ? '100%' : 'auto', gap: isMobile ? '0' : '32px' }}>
          <Link to="/" className="font-bold flex items-center gap-0" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '30px', fontFamily: 'var(--font-heading)', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--primary)', textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="flex items-center" style={{ gap: '6px' }}>
              <img src={logoImg} alt="Unbley Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }} />
              <span>Unbley.</span>
            </motion.div>
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
                      <div className="font-bold">Products & Services</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Sell products, digital goods, and services.</p>
                    </Link>
                    <Link to="/creator-platform" className="solutions-item">
                      <div className="font-bold">Creators & Brands</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>For makers and creative businesses.</p>
                    </Link>
                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }}></div>
                    <Link to="/create-online-store" className="solutions-item">
                      <div className="font-bold">Create Store</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Build a professional storefront.</p>
                    </Link>
                    <Link to="/shopify-alternative" className="solutions-item">
                      <div className="font-bold">Affordable Commerce</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Simple tools for growing businesses.</p>
                    </Link>
                    <Link to="/affordable-ecommerce-platform" className="solutions-item">
                      <div className="font-bold">Plans & Value</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Clear pricing for your business.</p>
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

            <Link
              to="/all-blogs"
              className="font-semibold transition-colors duration-200 hover:text-primary"
              style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit', padding: '12px 0' }}
            >
              Blog
            </Link>

            <Link
              to="/about"
              className="font-semibold transition-colors duration-200 hover:text-primary"
              style={{ fontSize: '14px', textDecoration: 'none', color: 'inherit', padding: '12px 0' }}
            >
              About
            </Link>


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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '72px',
              left: 12,
              right: 12,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,245,240,0.98) 100%)',
              border: '1px solid rgba(106, 62, 31, 0.08)',
              borderRadius: '22px',
              boxShadow: '0 24px 60px rgba(34, 21, 16, 0.12)',
              overflow: 'hidden',
              zIndex: 99,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="container flex flex-col gap-5" style={{ padding: '18px 16px 16px' }}>
              <div style={{ padding: '6px 8px 0' }}>
                <div className="font-bold" style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Solutions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    ['/sell-digital-products', 'Products & Services'],
                    ['/creator-platform', 'Creators & Brands'],
                    ['/create-online-store', 'Create Online Store'],
                    ['/shopify-alternative', 'Affordable Commerce'],
                    ['/affordable-ecommerce-platform', 'Plans & Value'],
                    ['/all-blogs', 'Blog'],
                    ['/about', 'About']
                  ].map(([to, label]) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        textDecoration: 'none',
                        color: '#1f2937',
                        fontSize: '15px',
                        fontWeight: 600,
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(106, 62, 31, 0.06)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2" style={{ background: 'rgba(106, 62, 31, 0.04)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(106, 62, 31, 0.08)' }}>
                <Search size={18} style={{ color: '#6B7280' }} />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', width: '100%', color: '#111827' }}
                />
              </div>

              <div className="flex flex-col gap-3" style={{ paddingTop: '2px' }}>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#1f2937', fontSize: '16px', fontWeight: 700, padding: '14px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(106, 62, 31, 0.06)' }}>
                      <LayoutGrid size={18} />
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=signin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#1f2937', fontSize: '16px', fontWeight: 700, padding: '14px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(106, 62, 31, 0.06)' }}>
                      <LogIn size={18} />
                      Sign In
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none', padding: '15px 16px', borderRadius: '14px', background: 'linear-gradient(135deg, #6A3E1F 0%, #8A5A37 100%)', color: '#fff', fontWeight: 800, boxShadow: '0 12px 24px rgba(106, 62, 31, 0.2)' }}>
                      Get Started
                    </Link>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none', padding: '14px 16px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(106, 62, 31, 0.08)', color: '#6A3E1F', fontWeight: 700 }}>
                      Explore Unbley
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

