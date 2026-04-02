import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Heart, Bookmark, LogOut, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Storefront() {
  const brandColor = '#06acf8';
  const bgColor = '#050505';

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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
      color: '#E5E5E5',
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
      background: `radial-gradient(ellipse at 50% 20%, rgba(6, 172, 248, 0.15) 0%, rgba(6, 172, 248, 0.05) 30%, transparent 60%)`,
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
      borderBottom: '1px solid rgba(255,255,255,0.05)'
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
      color: active ? '#FFF' : '#888',
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
      fontFamily: '"Playfair Display", serif',
      fontStyle: 'italic',
      fontSize: '72px',
      fontWeight: '400',
      color: '#FFF',
      lineHeight: '1.1',
      marginBottom: '24px',
      letterSpacing: '-0.02em'
    },
    heroHighlight: {
      color: brandColor,
      fontWeight: '600'
    },
    heroDesc: {
      fontSize: '14px',
      color: '#A0A0A0',
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
      backgroundColor: '#0A0A0A',
      border: '1px solid #1A1A1A',
      padding: '12px 16px',
      width: '280px'
    },
    searchInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#FFF',
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.1em',
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
      backgroundColor: '#111',
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
      fontFamily: '"Playfair Display", serif',
      fontSize: '24px',
      color: '#FFF'
    },
    cardDesc: {
      fontSize: '12px',
      color: '#888',
      fontStyle: 'italic',
      fontFamily: '"Playfair Display", serif',
      lineHeight: '1.4',
      marginTop: '4px',
      maxWidth: '90%'
    },
    cardBadge: {
      width: '28px',
      height: '28px',
      border: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888',
      fontSize: '11px',
      fontFamily: '"Playfair Display", serif',
      fontStyle: 'italic'
    },

    // Newsletter Section
    newsletter: {
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid #111',
      padding: '120px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    newsletterTitle: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '32px',
      fontStyle: 'italic',
      color: '#FFF',
      marginBottom: '16px'
    },
    newsletterDesc: {
      fontSize: '12px',
      color: '#888',
      marginBottom: '40px'
    },
    newsletterForm: {
      display: 'flex',
      width: '100%',
      maxWidth: '480px',
      gap: '16px'
    },
    newsletterInput: {
      flex: 1,
      backgroundColor: '#111',
      border: '1px solid #222',
      padding: '16px 20px',
      color: '#FFF',
      fontSize: '11px',
      letterSpacing: '0.05em',
      outline: 'none',
      fontFamily: '"Inter", sans-serif'
    },
    newsletterBtn: {
      backgroundColor: brandColor,
      color: '#000',
      border: 'none',
      padding: '0 32px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
    },

    // Footer
    footer: {
      position: 'relative',
      zIndex: 10,
      padding: '40px 64px',
      borderTop: '1px solid #111',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    footerBrand: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '20px',
      fontStyle: 'italic',
      color: '#FFF',
      fontWeight: '600'
    },
    footerLinks: {
      display: 'flex',
      gap: '32px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)' // Perfectly centered
    },
    footerLink: {
      fontSize: '9px',
      fontWeight: '600',
      letterSpacing: '0.1em',
      color: '#666',
      textTransform: 'uppercase',
      cursor: 'pointer'
    },
    footerCopyright: {
      fontSize: '9px',
      letterSpacing: '0.05em',
      color: '#444',
      textTransform: 'uppercase'
    }
  };

  // No static products array here anymore

  return (
    <div style={s.page}>
      <div style={s.ambientGlow}></div>

      {/* Navbar */}
      <nav style={s.navbar} className="store-nav">
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '28px',
          color: brandColor,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: `0 0 12px ${brandColor}40`
        }} className="store-logo">ZIZZYSTORES.</div>

        <div style={s.navIcons}>
          <Link to="/" title="Log Out" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
            <LogOut size={20} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero} className="store-hero">
        <h1 style={s.heroTitle} className="store-hero-title">
          Discover the<br />
          <span style={s.heroHighlight}>Digital Ateliers.</span>
        </h1>
        <p style={s.heroDesc}>
          Independent designers and master craftspeople.<br />
          For the modern collector who values heritage over trends.
        </p>
      </section>

      {/* filters removed per request */}
      <div style={{...s.filterBar, justifyContent: 'center'}} className="store-filter-bar">
        <div style={s.searchBox}>
          <Search size={14} color="#666" />
          <input type="text" placeholder="SEARCH BRANDS..." style={s.searchInput} />
        </div>
      </div>

      {/* Product Grid */}
      <div style={s.grid} className="store-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#888' }}>
            Syncing Brand Matrix...
          </div>
        ) : brands.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#888' }}>
            No independent ateliers are currently broadcasting. Check back later.
          </div>
        ) : (
          brands.map((brand, idx) => (
            <Link key={brand.id || idx} to={`/explore-brand/${brand.id}`} style={{...s.card, textDecoration: 'none'}} className="product-card">
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
                  <div style={s.cardDesc}>{brand.tagline || brand.manifesto?.substring(0, 60) + '...' || 'Mastering the architecture of modern commerce.'}</div>
                </div>
                <div style={s.cardBadge}>{brand.brand_name?.charAt(0)?.toUpperCase() || 'O'}</div>
              </div>

              <div className="show-more-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Explore {brand.brand_name}</div>
            </Link>
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
        <div style={s.footerBrand}>Zizzystores</div>
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
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          color: #FFF;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background-color: ${brandColor};
          color: #000;
          border-color: ${brandColor};
        }
        .show-more-btn {
          background-color: transparent;
          border: 1px solid #333;
          color: #FFF;
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
          color: #000 !important;
        }
      `}</style>
    </div>
  );
}
