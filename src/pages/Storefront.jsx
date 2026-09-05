import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Heart, Bookmark, LogOut, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Storefront() {
  const brandColor = '#6A3E1F';
  const bgColor = '#FBF9F5';

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadBrands() {
      try {
        setLoading(true);
        // Assuming all completely generated brands are valid, we just fetch them.
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .not('brand_name', 'is', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  const s = {
    page: {
      backgroundColor: bgColor,
      color: '#221510',
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    },

    // Ambient Background Glow mimicking the wavy neon gradient
    ambientGlow: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      height: '800px',
      background: `radial-gradient(ellipse at 50% 20%, rgba(106, 62, 31, 0.08) 0%, rgba(106, 62, 31, 0.03) 30%, transparent 60%)`,
      pointerEvents: 'none',
      zIndex: 0
    },

    // Navbar
    navbar: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 64px',
      borderBottom: '1px solid #EAE3D9',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)'
    },
    navCenter: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '40px',
      alignItems: 'center'
    },
    navLink: (active) => ({
      color: active ? '#221510' : '#6B584C',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      borderBottom: active ? `2px solid ${brandColor}` : '2px solid transparent',
      paddingBottom: '8px',
      cursor: 'pointer',
      transition: 'color 0.2s'
    }),
    navIcons: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    },

    // Hero Section
    hero: {
      position: 'relative',
      zIndex: 10,
      padding: '120px 64px 80px 64px',
      maxWidth: '900px'
    },
    heroTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: isMobile ? '38px' : '64px',
      fontWeight: '800',
      color: '#221510',
      lineHeight: '1.1',
      marginBottom: '24px',
      letterSpacing: '-0.03em'
    },
    heroHighlight: {
      color: brandColor,
      fontWeight: '600'
    },
    heroDesc: {
      fontSize: '14px',
      color: '#6B584C',
      lineHeight: '1.6',
      maxWidth: '460px'
    },

    // Filter & Search Bar
    filterBar: {
      position: 'relative',
      zIndex: 10,
      padding: '0 64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '64px'
    },
    filterLinks: {
      display: 'flex',
      gap: '32px'
    },
    filterLink: (active) => ({
      color: active ? '#FFF' : '#666',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      cursor: 'pointer'
    }),
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #DFCFC2',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(34, 21, 16, 0.04)',
      padding: '12px 16px',
      width: '280px'
    },
    searchInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#221510',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.05em',
      width: '100%',
      outline: 'none'
    },

    // Product Grid
    grid: {
      position: 'relative',
      zIndex: 10,
      padding: '0 64px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px',
      marginBottom: '120px'
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      cursor: 'pointer',
      group: 'card' // For target hover scale
    },
    cardImageWrap: {
      width: '100%',
      aspectRatio: '1',
      backgroundColor: '#F7F2EC',
      border: '1px solid #EAE3D9',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative'
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start' // Title on left, Badge on right
    },
    cardLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    cardCategory: {
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: brandColor
    },
    cardTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: '20px',
      color: '#221510',
      fontWeight: '700',
      letterSpacing: '-0.01em'
    },
    cardDesc: {
      fontSize: '13px',
      color: '#6B584C',
      lineHeight: '1.5',
      marginTop: '4px',
      maxWidth: '90%'
    },
    cardBadge: {
      width: '28px',
      height: '28px',
      border: '1px solid #DFCFC2',
      borderRadius: '6px',
      backgroundColor: '#F7F2EC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6A3E1F',
      fontSize: '11px',
      fontFamily: 'var(--font-heading)',
      fontWeight: '700'
    },

    // Newsletter Section
    newsletter: {
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid #EAE3D9',
      backgroundColor: '#F7F2EC',
      padding: '100px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    newsletterTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: '32px',
      fontWeight: '800',
      letterSpacing: '-0.02em',
      color: '#221510',
      marginBottom: '16px'
    },
    newsletterDesc: {
      fontSize: '13px',
      color: '#6B584C',
      marginBottom: '40px',
      maxWidth: '480px'
    },
    newsletterForm: {
      display: 'flex',
      width: '100%',
      maxWidth: '480px',
      gap: '12px'
    },
    newsletterInput: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      border: '1px solid #DFCFC2',
      borderRadius: '8px',
      padding: '14px 18px',
      color: '#221510',
      fontSize: '12px',
      letterSpacing: '0.02em',
      outline: 'none',
      fontFamily: '"Inter", sans-serif'
    },
    newsletterBtn: {
      backgroundColor: brandColor,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '0 32px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      boxShadow: '0 4px 12px rgba(106, 62, 31, 0.2)'
    },

    // Footer
    footer: {
      position: 'relative',
      zIndex: 10,
      padding: '40px 64px',
      borderTop: '1px solid #3D291E',
      backgroundColor: '#24160E',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    footerBrand: {
      fontFamily: 'var(--font-heading)',
      fontSize: '20px',
      color: '#FDFBF7',
      fontWeight: '800',
      letterSpacing: '-0.02em'
    },
    footerLinks: {
      display: 'flex',
      gap: '32px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)' // Perfectly centered
    },
    footerLink: {
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.1em',
      color: '#C9BFB5',
      textTransform: 'uppercase',
      cursor: 'pointer'
    },
    footerCopyright: {
      fontSize: '9px',
      letterSpacing: '0.05em',
      color: '#9C8E80',
      textTransform: 'uppercase'
    }
  };

  const filteredBrands = brands.filter((brand) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      brand.brand_name?.toLowerCase().includes(q) ||
      brand.tagline?.toLowerCase().includes(q) ||
      brand.subcategory?.toLowerCase().includes(q) ||
      brand.manifesto?.toLowerCase().includes(q)
    );
  });

  return (
    <PageTransition>
      <div style={s.page}>
      <div style={s.ambientGlow}></div>

      {/* Navbar */}
      <nav style={s.navbar} className="store-nav">
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '26px',
          color: brandColor,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em'
        }} className="store-logo">UNBLEY.</div>

        <div style={s.navIcons}>
          <Link to="/" title="Log Out" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B584C', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#221510'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B584C'}>
            <LogOut size={20} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero} className="store-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={s.heroTitle} 
          className="store-hero-title"
        >
          Discover the<br />
          <span style={s.heroHighlight}>Digital Ateliers.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={s.heroDesc}
        >
          Independent designers and master craftspeople.<br />
          For the modern collector who values heritage over trends.
        </motion.p>
      </section>

      {/* filters removed per request */}
      <div style={{...s.filterBar, justifyContent: 'center'}} className="store-filter-bar">
        <div style={s.searchBox}>
          <Search size={14} color="#6B584C" />
          <input 
            type="text" 
            placeholder="SEARCH BRANDS..." 
            style={s.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div style={s.grid} className="store-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#6B584C' }}>
            Syncing Brand Matrix...
          </div>
        ) : brands.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#6B584C' }}>
            No independent ateliers are currently broadcasting. Check back later.
          </div>
        ) : filteredBrands.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#6B584C' }}>
            No ateliers match "{searchQuery}".
          </div>
        ) : (
          filteredBrands.map((brand, idx) => (
            <motion.div 
              key={brand.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
            >
              <Link to={`/explore-brand/${brand.id}`} style={{...s.card, textDecoration: 'none'}} className="product-card">
                <div style={s.cardImageWrap}>
                  <img src={brand.banner_url || brand.logo_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'} alt={brand.brand_name} style={s.cardImage} />
                  <div className="card-hover-actions">
                    <div className="icon-btn" title="Follow Brand" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Heart size={16} /></div>
                    <div className="icon-btn" title="Save to Collections" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Bookmark size={16} /></div>
                  </div>
                </div>

                <div style={s.cardContent}>
                  <div style={s.cardLeft}>
                    <div style={{...s.cardCategory, color: brand.accent_color || brandColor}}>{brand.subcategory || 'INDEPENDENT'}</div>
                    <div style={s.cardTitle}>{brand.brand_name}</div>
                    <div style={s.cardDesc}>{brand.tagline || (brand.manifesto ? brand.manifesto.substring(0, 60) + '...' : 'Mastering the architecture of modern commerce.')}</div>
                  </div>
                  <div style={s.cardBadge}>{brand.brand_name?.charAt(0)?.toUpperCase() || 'O'}</div>
                </div>

                <div className="show-more-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Explore {brand.brand_name}</div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Newsletter */}
      <section style={s.newsletter} className="store-newsletter">
        <h2 style={s.newsletterTitle}>Join the inner circle.</h2>
        <p style={s.newsletterDesc}>
          Early access to limited releases and designer narratives, delivered monthly to your inbox.
        </p>
        <div style={s.newsletterForm} className="store-newsletter-form">
          <input type="email" placeholder="EMAIL ADDRESS" style={s.newsletterInput} />
          <button style={s.newsletterBtn}>Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer} className="store-footer">
        <div style={s.footerBrand}>Unbley</div>
        <div style={s.footerLinks} className="store-footer-links">
          <div style={s.footerLink}>Terms</div>
          <div style={s.footerLink}>Privacy</div>
          <div style={s.footerLink}>Instagram</div>
        </div>
        <div style={s.footerCopyright}>
          © 2026 THE GALLERY OF ATELIERS
        </div>
      </footer>

      {/* Simple global style for image hover */}
      <style>{`
        @media (max-width: 768px) {
          .store-nav { padding: 24px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; }
          .store-logo { font-size: 20px !important; }
          .store-hero { padding: 80px 24px 40px 24px !important; text-align: center; }
          .store-hero-title { font-size: 36px !important; line-height: 1.2 !important; }
          .store-filter-bar { padding: 0 24px !important; flex-direction: column; gap: 24px; align-items: center !important; margin-bottom: 32px !important; }
          .store-grid { padding: 0 20px !important; grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; margin-bottom: 64px !important; }
          .store-newsletter { padding: 80px 24px !important; }
          .store-newsletter-form { flex-direction: column; padding: 0 24px; box-sizing: border-box; width: 100% !important; }
          .store-footer { flex-direction: column; padding: 48px 24px !important; gap: 32px; text-align: center; align-items: center !important; }
          .store-footer-links { position: static !important; transform: none !important; flex-wrap: wrap; justify-content: center; gap: 16px !important; }
          .card-hover-actions { opacity: 1 !important; visibility: visible !important; }
          .show-more-btn { opacity: 1 !important; transform: none !important; border-color: ${brandColor} !important; color: ${brandColor} !important; visibility: visible !important; }
        }
        .product-card:hover img {
          transform: scale(1.05);
        }
        .card-hover-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          gap: 12px;
        }
        .product-card:hover .card-hover-actions {
          opacity: 1;
        }
        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid #DFCFC2;
          color: #221510;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background-color: ${brandColor};
          color: #FFF;
          border-color: ${brandColor};
        }
        .show-more-btn {
          background-color: #FFFFFF;
          border: 1px solid #DFCFC2;
          border-radius: 6px;
          color: #221510;
          padding: 12px 0;
          width: 100%;
          margin-top: 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
        }
        .product-card:hover .show-more-btn {
          opacity: 1;
          transform: translateY(0);
          border-color: ${brandColor};
          color: ${brandColor};
        }
        .show-more-btn:hover {
          background-color: ${brandColor} !important;
          color: #FFF !important;
        }
      `}</style>
      </div>
    </PageTransition>
  );
}
