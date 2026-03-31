import React from 'react';
import { ShoppingBag, User, Search, Heart, Bookmark, LogOut, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Storefront() {
  const brandColor = '#06acf8';
  const bgColor = '#050505';

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

  const products = [
    {
      category: 'HOROLOGY',
      title: 'Obsidian',
      badge: 'O',
      desc: 'Mastering the architecture of time through monolithic design.',
      img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'ENGINEERING',
      title: 'Chronos',
      badge: 'C',
      desc: 'Precise mechanical movements for the modern explorer.',
      img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'FOOTWEAR',
      title: 'Zizzystores',
      badge: 'Z',
      desc: 'Conceptual silhouettes crafted from sustainable high-tech fabrics.',
      img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'SCENT',
      title: 'Essence',
      badge: 'E',
      desc: 'Olfactory journeys inspired by concrete jungles and ancient forests.',
      img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'APPAREL',
      title: 'Raw Silk',
      badge: 'R',
      desc: 'Unstructured tailoring for the intellectual wardrobe.',
      img: 'https://images.unsplash.com/photo-1584306240900-e79435f299c8?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'OBJECTS',
      title: 'Lumina',
      badge: 'L',
      desc: 'Illuminating spaces with sculptural purity and diffused light.',
      img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div style={s.page}>
      <div style={s.ambientGlow}></div>

      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '28px',
          color: brandColor,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: `0 0 12px ${brandColor}40`
        }}>ZIZZYSTORES.</div>

        <div style={s.navIcons}>
          <div title="Customer Service" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
            <Headphones size={20} />
          </div>
          <Link to="/" title="Log Out" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
            <LogOut size={20} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <h1 style={s.heroTitle}>
          Discover the<br />
          <span style={s.heroHighlight}>Digital Ateliers.</span>
        </h1>
        <p style={s.heroDesc}>
          Independent designers and master craftspeople.<br />
          For the modern collector who values heritage over trends.
        </p>
      </section>

      {/* Filters & Search */}
      <div style={s.filterBar}>
        <div style={s.filterLinks}>
          <div style={s.filterLink(true)}>ALL</div>
          <div style={s.filterLink(false)}>FOOTWEAR</div>
          <div style={s.filterLink(false)}>SCENT</div>
          <div style={s.filterLink(false)}>APPAREL</div>
        </div>
        <div style={s.searchBox}>
          <Search size={14} color="#666" />
          <input type="text" placeholder="SEARCH BRANDS..." style={s.searchInput} />
        </div>
      </div>

      {/* Product Grid */}
      <div style={s.grid}>
        {products.map((p, idx) => (
          <Link key={idx} to="/explore-brand" style={{...s.card, textDecoration: 'none'}} className="product-card">
            {/* Standard hover trick utilizing inline styles -> we will just use basic scaling for now */}
            <div style={s.cardImageWrap}>
              <img src={p.img} alt={p.title} style={s.cardImage} />
              <div className="card-hover-actions">
                <div className="icon-btn" title="Follow Brand" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Heart size={16} /></div>
                <div className="icon-btn" title="Save to Collections" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Bookmark size={16} /></div>
              </div>
            </div>

            <div style={s.cardContent}>
              <div style={s.cardLeft}>
                <div style={s.cardCategory}>{p.category}</div>
                <div style={s.cardTitle}>{p.title}</div>
                <div style={s.cardDesc}>{p.desc}</div>
              </div>
              <div style={s.cardBadge}>{p.badge}</div>
            </div>

            <div className="show-more-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Explore {p.category}</div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <section style={s.newsletter}>
        <h2 style={s.newsletterTitle}>Join the inner circle.</h2>
        <p style={s.newsletterDesc}>
          Early access to limited releases and designer narratives, delivered monthly to your inbox.
        </p>
        <div style={s.newsletterForm}>
          <input type="email" placeholder="EMAIL ADDRESS" style={s.newsletterInput} />
          <button style={s.newsletterBtn}>Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerBrand}>Zizzystores</div>
        <div style={s.footerLinks}>
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
