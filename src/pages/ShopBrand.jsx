import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, ChevronDown, ShieldCheck, Truck, Headphones, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const storeConfig = {
  template: 'A', // 'A' (Minimal), 'B' (Street/Fashion), 'C' (Luxury)
  brandName: 'Digital Atelier',
  logoText: 'Digital Atelier',
  tagline: 'Curating timeless pieces from global artisans.',
  heroBanner: {
    imageUrl: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1600&q=80',
    headline: 'The Permanent Collection',
    subHeadline: '124 Curated Essentials for the Modern Home'
  },
  colors: {
    primary: '#111',
    accent: '#11224D',
    background: '#FDFDFD'
  },
  products: [
    {
      id: 1,
      name: 'Sculptural Oak Armchair',
      price: '$890.00',
      maker: 'Herman Miller Collection',
      tag: null,
      reviews: 42,
      img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    },
    {
      id: 2,
      name: 'Astral Brass Desk Lamp',
      price: '$420.00',
      maker: 'Vitra Design Studio',
      tag: 'LIMITED EDITION',
      reviews: 18,
      img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    },
    {
      id: 3,
      name: 'Earthen Vessel Trio',
      price: '$185.00',
      maker: 'Muuto Ceramics',
      tag: null,
      reviews: 86,
      img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    },
    {
      id: 4,
      name: 'Atelier Drafting Table',
      price: '$1,250.00',
      maker: 'Professional Series',
      tag: null,
      reviews: 12,
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    },
    {
      id: 5,
      name: 'Merino Wool Throw',
      price: '$210.00',
      maker: 'Kvadrat Textiles',
      tag: 'SOLD OUT',
      reviews: 114,
      img: 'https://images.unsplash.com/photo-1580828369019-223455b8feab?w=800&q=80',
    },
    {
      id: 6,
      name: 'Matte Arch Kitchen Mixer',
      price: '$675.00',
      maker: 'Bauhaus Series',
      tag: null,
      reviews: 33,
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    }
  ]
};

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

export default function ShopBrand() {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const { template, colors } = storeConfig;

  // Determine dynamic styling based on template
  const isDark = template === 'C';
  const isStreet = template === 'B';

  const bgColor = isDark ? '#0A0A0A' : colors.background;
  const textColor = isDark ? '#FDFDFD' : colors.primary;
  const mutedColor = isDark ? '#999' : '#666';
  const borderColor = isDark ? '#222' : '#EAEAEA';
  const accentColor = isDark ? '#D4AF37' : (isStreet ? '#FF0055' : colors.accent); // C=Gold, B=Neon, A=Navy
  
  const labelFontFamily = isDark ? '"Playfair Display", serif' : (isStreet ? '"Space Grotesk", "Helvetica Neue", sans-serif' : '"Inter", sans-serif');
  const headingFontFamily = isDark ? '"Playfair Display", serif' : (isStreet ? '"Space Grotesk", "Helvetica Neue", sans-serif' : '"Inter", sans-serif');
  const bodyFontFamily = isDark ? '"Inter", sans-serif' : (isStreet ? '"Inter", sans-serif' : '"Inter", sans-serif');

  const getGridCols = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    if (isStreet) return 'repeat(2, 1fr)'; // Street has larger, editorial images
    return 'repeat(3, 1fr)';
  };

  const s = {
    page: { backgroundColor: bgColor, color: textColor, minHeight: '100vh', fontFamily: bodyFontFamily, overflowX: 'hidden' },

    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 24px' : '24px 48px', borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontFamily: headingFontFamily, fontSize: isStreet ? '24px' : '18px', fontWeight: 'bold', letterSpacing: isStreet ? '-0.05em' : '0.05em', color: textColor, cursor: 'pointer' },
    headerRight: { display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '24px' },
    searchBox: { display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '8px', backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5', padding: '10px 16px', borderRadius: '4px', width: '240px' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%', color: textColor },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor },

    // Hero Section
    hero: { position: 'relative', width: '100%', height: isMobile ? '50vh' : '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', overflow: 'hidden' },
    heroImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: isDark ? 0.6 : 0.8 },
    heroContent: { position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' },
    heroTitle: { fontFamily: headingFontFamily, fontSize: isMobile ? '36px' : (isStreet ? '72px' : '56px'), fontWeight: '800', textTransform: isStreet ? 'uppercase' : 'none', color: '#FFF', marginBottom: '16px', textShadow: '0 4px 20px rgba(0,0,0,0.3)', letterSpacing: isStreet ? '-0.02em' : '0' },
    heroSubtitle: { fontFamily: bodyFontFamily, fontSize: isMobile ? '14px' : '18px', color: '#FFF', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.3)' },

    // Trust Signals
    trustSignals: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isMobile ? '24px' : '64px', padding: '32px 24px', backgroundColor: isDark ? '#111' : '#F9F9F9', borderBottom: `1px solid ${borderColor}` },
    trustItem: { display: 'flex', alignItems: 'center', gap: '12px' },
    trustIcon: { color: accentColor },
    trustText: { fontSize: '12px', fontWeight: '600', color: textColor, letterSpacing: '0.05em', textTransform: 'uppercase' },

    // Main Content
    mainContainer: { display: 'flex', flexDirection: 'column', padding: isMobile ? '32px 24px 80px 24px' : '64px 48px 80px 48px', maxWidth: '1440px', margin: '0 auto' },
    mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '0', width: '100%' },
    mainTitle: { fontFamily: headingFontFamily, fontSize: isMobile ? '28px' : '32px', fontWeight: '700', color: textColor },
    
    // Sort & Filter
    filtersBar: { display: 'flex', alignItems: 'center', gap: '16px', width: isMobile ? '100%' : 'auto', overflowX: 'auto', paddingBottom: isMobile ? '8px' : '0' },
    filterBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: isStreet ? '0' : '4px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },

    // Grid
    productGrid: { display: 'grid', gridTemplateColumns: getGridCols(), gap: isMobile ? '24px' : (isStreet ? '48px' : '32px'), width: '100%' },
    productCard: { display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', transition: 'transform 0.3s ease' },
    productImageWrap: { width: '100%', aspectRatio: isStreet ? '3/4' : '4/5', backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5', position: 'relative', overflow: 'hidden', marginBottom: '16px', borderRadius: isStreet ? '0' : '4px' },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },

    tagBase: { position: 'absolute', top: '12px', left: '12px', padding: '4px 8px', fontSize: '9px', fontWeight: '800', fontFamily: labelFontFamily, letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 10 },

    productInfo: { display: 'flex', flexDirection: 'column', alignItems: isStreet ? 'center' : 'flex-start', textAlign: isStreet ? 'center' : 'left' },
    productName: { fontFamily: labelFontFamily, fontSize: isStreet ? '18px' : '15px', fontWeight: isStreet ? '800' : '600', color: textColor, textTransform: isStreet ? 'uppercase' : 'none', marginBottom: '4px' },
    productPrice: { fontSize: '14px', fontWeight: '600', color: accentColor, marginBottom: '8px' },
    
    // Core E-Commerce Buttons
    buttonGroup: { display: 'flex', gap: '8px', width: '100%', marginTop: '12px' },
    addToCartBtn: { flex: 1, backgroundColor: textColor, color: bgColor, padding: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', borderRadius: isStreet ? '0' : '4px', cursor: 'pointer', transition: 'opacity 0.2s', fontFamily: labelFontFamily },
    viewBtn: { flex: 1, backgroundColor: 'transparent', color: textColor, padding: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${borderColor}`, borderRadius: isStreet ? '0' : '4px', cursor: 'pointer', transition: 'background-color 0.2s', fontFamily: labelFontFamily },

    // Empty State
    emptyState: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#111' : '#F9F9F9', border: `1px dashed ${borderColor}`, borderRadius: '8px', padding: isMobile ? '48px 24px' : '80px 24px', textAlign: 'center' },
    emptyTitle: { fontFamily: headingFontFamily, fontSize: '24px', fontWeight: '700', color: textColor, marginBottom: '12px' },
    emptyDesc: { fontSize: '14px', color: mutedColor, maxWidth: '400px', marginBottom: '24px', lineHeight: '1.6' },
    emptyBtn: { padding: '12px 24px', backgroundColor: accentColor, color: '#FFF', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: 'pointer' },

    // Footer
    footer: { borderTop: `1px solid ${borderColor}`, paddingTop: '64px', paddingBottom: '32px', backgroundColor: isDark ? '#0A0A0A' : '#FFF' },
    footerTop: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', padding: isMobile ? '0 24px' : '0 48px', marginBottom: '64px', gap: isMobile ? '48px' : '0' },
    footerLeft: { maxWidth: '300px' },
    footerLogo: { fontFamily: headingFontFamily, fontSize: '18px', fontWeight: '700', color: textColor, marginBottom: '24px' },
    footerDesc: { fontSize: '12px', color: mutedColor, lineHeight: '1.6' },

    footerMenus: { display: 'flex', flexWrap: 'wrap', gap: isMobile ? '48px' : '80px' },
    footerCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
    footerColTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: textColor, textTransform: 'uppercase', marginBottom: '8px' },
    footerLink: { fontSize: '12px', color: mutedColor, textDecoration: 'none', cursor: 'pointer' },

    newsletterCol: { width: isMobile ? '100%' : '280px' },
    newsletterInputGroup: { display: 'flex', borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px', marginTop: '16px' },
    newsletterInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', color: textColor },
    newsletterBtn: { background: 'none', border: 'none', fontSize: '10px', fontWeight: '700', cursor: 'pointer', color: textColor, letterSpacing: '0.1em' },
    
    footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '0 24px' : '0 48px', borderTop: `1px solid ${borderColor}`, paddingTop: '24px' },
    copyright: { fontSize: '10px', color: mutedColor }
  };

  const getTagStyle = (tagText) => {
    if (tagText === 'SOLD OUT') return { ...s.tagBase, backgroundColor: '#D44040', color: '#FFF' };
    if (tagText === 'LIMITED EDITION') return { ...s.tagBase, backgroundColor: textColor, color: bgColor };
    return { ...s.tagBase, backgroundColor: '#FFF', color: '#111' };
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo} onClick={() => navigate('/')}>{storeConfig.logoText}</div>
        <div style={s.headerRight}>
          <div style={s.searchBox}>
            <Search size={14} color={mutedColor} />
            <input type="text" placeholder="Search curated goods..." style={s.searchInput} />
          </div>
          <div style={s.iconButton} onClick={() => navigate('/cart')}>
            <ShoppingCart size={isMobile ? 20 : 18} />
          </div>
          <div style={s.iconButton} onClick={() => navigate('/profile')}>
            <User size={isMobile ? 20 : 18} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={s.hero}>
        <img src={storeConfig.heroBanner.imageUrl} alt="Hero Banner" style={s.heroImage} />
        <div style={s.heroContent}>
          <h1 style={s.heroTitle}>{storeConfig.heroBanner.headline}</h1>
          <p style={s.heroSubtitle}>{storeConfig.heroBanner.subHeadline}</p>
        </div>
      </div>

      {/* Trust Signals */}
      <div style={s.trustSignals}>
        <div style={s.trustItem}>
          <ShieldCheck size={20} style={s.trustIcon} />
          <span style={s.trustText}>Secure Checkout</span>
        </div>
        <div style={s.trustItem}>
          <Truck size={20} style={s.trustIcon} />
          <span style={s.trustText}>Free Global Shipping</span>
        </div>
        <div style={s.trustItem}>
          <Headphones size={20} style={s.trustIcon} />
          <span style={s.trustText}>24/7 Active Support</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.mainContainer}>
        <div style={s.mainHeader}>
          <h2 style={s.mainTitle}>All Products</h2>
          <div style={s.filtersBar}>
            <button style={s.filterBtn}>
              <Filter size={14} /> Filter
            </button>
            <button style={s.filterBtn}>
              Sort by: Featured <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {storeConfig.products.length === 0 ? (
          <div style={s.emptyState}>
            <h3 style={s.emptyTitle}>Your Storefront is Empty</h3>
            <p style={s.emptyDesc}>Add your first product to start selling. Customize categories and layout in your dashboard.</p>
            <button style={s.emptyBtn}>Add Product</button>
          </div>
        ) : (
          <div style={s.productGrid}>
            {storeConfig.products.map((product) => (
              <div 
                key={product.id} 
                style={s.productCard} 
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={s.productImageWrap}>
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    style={{ ...s.image, transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)' }} 
                  />
                  {product.tag && (
                    <div style={getTagStyle(product.tag)}>{product.tag}</div>
                  )}
                </div>

                <div style={s.productInfo}>
                  <div style={s.productName}>{product.name}</div>
                  <div style={{...s.productPrice, color: isStreet ? textColor : s.productPrice.color }}>{product.price}</div>
                  
                  {/* Action Buttons */}
                  <div style={{ ...s.buttonGroup, opacity: (isStreet || hoveredProduct === product.id || isMobile) ? 1 : 0, transition: 'opacity 0.2s' }}>
                    <button style={s.addToCartBtn} onClick={(e) => { e.stopPropagation(); console.log('Add to cart', product.id); }}>Add to Cart</button>
                    <button style={s.viewBtn} onClick={(e) => { e.stopPropagation(); navigate('/product'); }}>View Product</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerLeft}>
            <div style={s.footerLogo}>{storeConfig.brandName}</div>
            <p style={s.footerDesc}>{storeConfig.tagline}</p>
          </div>

          <div style={s.footerMenus}>
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Socials</div>
              <a style={s.footerLink}>Instagram</a>
              <a style={s.footerLink}>X(Twitter)</a>
              <a style={s.footerLink}>Facebook</a>
              <a style={s.footerLink}>Tiktok</a>
            </div>

            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Service</div>
              <a style={s.footerLink}>Shipping & Returns</a>
              <a style={s.footerLink}>Terms of Service</a>
              <a style={{ ...s.footerLink, textDecoration: 'underline' }}>Privacy Policy</a>
            </div>

            <div style={s.newsletterCol}>
              <div style={s.footerColTitle}>Newsletter</div>
              <div style={s.newsletterInputGroup}>
                <input type="email" placeholder="Email address" style={s.newsletterInput} />
                <button style={s.newsletterBtn}>JOIN</button>
              </div>
            </div>
          </div>
        </div>
        
        <div style={s.footerBottom}>
          <div style={s.copyright}>© {new Date().getFullYear()} {storeConfig.brandName}. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
