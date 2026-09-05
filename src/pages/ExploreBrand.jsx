import React, { useState, useEffect } from 'react';
import { Search, Globe, Camera, Share2, Mail, ArrowRight, ArrowLeft, Heart, Bookmark, ExternalLink, Bell, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const FacebookIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.309h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
  </svg>
);
const TikTokIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
const InstagramIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const TwitterIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ExploreBrand() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [similarBrands, setSimilarBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrand() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data: bData, error: bErr } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (bErr || !bData) throw bErr || new Error("Brand not found");
        setBrand(bData);

        const { data: sData } = await supabase
          .from('brand_profiles')
          .select('*')
          .neq('id', id)
          .eq('profile_completed', true)
          .limit(4);
          
        if (sData) setSimilarBrands(sData);
      } catch (err) {
        console.error("Error loading brand details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrand();
  }, [id]);

  const brandColor = brand?.accent_color || '#6A3E1F';

  const s = {
    page: { backgroundColor: '#FBF9F5', color: '#221510', height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE3D9', backgroundColor: '#FFFFFF', flexShrink: 0 },
    headerTitle: { fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F7F2EC', padding: '10px 16px', width: '320px', border: '1px solid #DFCFC2', borderRadius: '8px' },
    searchInput: { background: 'transparent', border: 'none', color: '#221510', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '24px' },
    shopBtn: { backgroundColor: brandColor, color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', padding: '12px 24px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(106,62,31,0.2)' },
    content: { padding: '64px 80px', flex: 1, overflowY: 'auto' },

    // Components
    banner: { position: 'relative', height: '400px', backgroundColor: '#261710', border: '1px solid #3D291E', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '64px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 8px 30px rgba(38,23,16,0.15)' },
    bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url("${brand?.banner_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 },
    bannerContent: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '32px', marginTop: 'auto' },
    brandBadge: { width: '88px', height: '88px', border: `2px solid #DFCFC2`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
    brandBadgeText: { fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: brandColor },

    sectionTitleBase: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },

    narrativeBox: { backgroundColor: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: '16px', padding: '48px', position: 'relative', marginBottom: '64px', boxShadow: '0 4px 20px rgba(34,21,16,0.03)' },
    narrativeTitle: { fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', color: '#221510', lineHeight: '1.2', marginBottom: '24px', maxWidth: '80%' },
    narrativeText: { color: '#6B584C', fontSize: '15px', lineHeight: '1.7', maxWidth: '90%' },

    ctaContainer: { backgroundColor: '#F7F2EC', border: '1px solid #DFCFC2', borderRadius: '16px', padding: '64px', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' },
    ctaTitle: { fontFamily: 'var(--font-heading)', fontSize: '36px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '32px' },
    ctaButton: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: brandColor, color: '#FFFFFF', padding: '20px 40px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', border: 'none', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 16px rgba(106,62,31,0.25)' },
    ctaBridgeMessage: { marginTop: '16px', color: '#6B584C', fontSize: '14px', fontStyle: 'italic' },

    triggersTitle: { fontWeight: '700', fontSize: '15px', color: '#221510', marginTop: '48px', marginBottom: '24px' },
    triggersGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    triggerItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4A3B32', fontWeight: '500' },

    productsSection: { marginBottom: '64px' },
    productsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
    productsTitle: { fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', color: '#221510' },
    exploreLink: { fontSize: '13px', color: '#6A3E1F', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', cursor: 'pointer' },

    productGrid: { display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(200px, 0.8fr)', gap: '16px' },
    productMain: { backgroundColor: '#F7F2EC', minHeight: '500px', backgroundImage: `url("${brand?.product_1_url || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', cursor: 'pointer', border: '1px solid #EAE3D9' },
    productSubGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px', minHeight: '500px' },
    productItemCard: { backgroundColor: '#F7F2EC', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', cursor: 'pointer', border: '1px solid #EAE3D9' },

    similarSection: { marginBottom: '64px' },
    similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    similarCard: { backgroundColor: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(34,21,16,0.03)' },
    similarLogo: { width: '80px', height: '80px', backgroundColor: '#F7F2EC', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAE3D9' },
    similarName: { color: '#221510', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' },
    similarCategory: { color: '#6B584C', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' },

    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAE3D9', paddingTop: '32px', paddingBottom: '32px' },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', color: '#6B584C', textTransform: 'uppercase' },
  };

  return (
    <PageTransition>
      <div style={s.page} className="explore-page">
      <style>{`
        @media (max-width: 768px) {
          .explore-page { 
            height: auto !important; 
            min-height: 100vh !important;
            overflow: visible !important; 
            display: block !important;
          }
          .explore-header { 
            padding: 16px 20px !important; 
            flex-wrap: wrap; 
            height: auto !important; 
            gap: 16px; 
            justify-content: center !important; 
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #FFFFFF;
            border-bottom: 1px solid #EAE3D9 !important;
          }
          .header-right { flex-direction: column; width: 100%; gap: 16px !important; }
          .search-bar { display: none !important; }
          .shop-btn { width: 100%; text-align: center; order: 2; }
          .explore-content { 
            padding: 32px 20px !important; 
            overflow: visible !important; 
            flex: none !important; 
            height: auto !important; 
          }
          .hero-banner { padding: 48px 24px !important; height: auto !important; min-height: 280px; }
          .brand-badge { width: 64px !important; height: 64px !important; }
          .hero-title { font-size: 32px !important; text-align: center; }
          .banner-content { flex-direction: column !important; text-align: center; gap: 24px !important; }
          .split-layout { display: flex !important; flex-direction: column !important; gap: 32px !important; }
          .narrative-box { padding: 32px 24px !important; text-align: center; }
          .narrative-title { font-size: 24px !important; max-width: 100% !important; margin-bottom: 24px !important; }
          .cta-container { padding: 48px 24px !important; align-items: center !important; text-align: center; }
          .cta-title { font-size: 28px !important; }
          .cta-btn { width: 100%; justify-content: center; font-size: 16px !important; padding: 18px !important; }
          .triggers-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .products-header { flex-direction: column; align-items: center !important; text-align: center; gap: 16px; }
          .product-grid { grid-template-columns: 1fr !important; }
          .product-main { height: 300px !important; }
          .product-sub-grid { height: auto !important; grid-template-columns: 1fr !important; grid-template-rows: repeat(3, 220px) !important; }
          .similar-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .footer { flex-direction: column; gap: 24px; text-align: center; padding: 32px 0 !important; }
          .footer-links { flex-wrap: wrap; justify-content: center; gap: 16px !important; }
        }
      `}</style>
      
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          Syncing Brand Data...
        </div>
      ) : !brand ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          <h2>Brand Not Found</h2>
          <button style={s.shopBtn} onClick={() => navigate('/store')}>Return to Storefront</button>
        </div>
      ) : (
      <div style={s.main}>
        {/* Header */}
        <div style={s.header} className="explore-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'transparent', border: 'none', color: '#6B584C', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', transition: 'color 0.2s' }}
              title="Go Back"
              onMouseEnter={(e) => e.currentTarget.style.color = '#221510'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B584C'}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={s.headerTitle}>Brand Profile</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="header-right">
            <div style={s.searchBar} className="search-bar">
              <Search size={14} color="#6B584C" />
              <input type="text" placeholder="Search ..." style={s.searchInput} />
            </div>

            <button onClick={() => navigate(`/shop-brand/${id}`)} style={s.shopBtn} className="shop-btn">Shop {brand.brand_name} Now</button>
            <div style={s.headerActions}>
              <div title="Like Brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B584C', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#221510'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B584C'}>
                <Heart size={18} />
              </div>
              <div title="Save Brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B584C', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#221510'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B584C'}>
                <Bookmark size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={s.content} className="explore-content">

          {/* Top: Brand Identity + Narrative */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={s.banner} 
            className="hero-banner"
          >
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              style={s.bannerBg}
            ></motion.div>
            <div style={s.bannerContent}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={s.brandBadge} 
                className="brand-badge"
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt="Brand Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={s.brandBadgeText}>{brand.brand_name?.charAt(0)?.toUpperCase()}s</span>
                )}
              </motion.div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ ...s.sectionTitleBase, color: brandColor }}
                >
                  Curated by Unbley — premium digital ateliers only.
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', color: '#FFF', margin: 0 }} 
                  className="hero-title"
                >
                  {brand.brand_name}
                </motion.h1>
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px', marginBottom: '64px' }} className="split-layout">
            <div style={{ ...s.narrativeBox, marginBottom: 0 }} className="narrative-box">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>The Brand Narrative</div>
                <h2 style={s.narrativeTitle} className="narrative-title">Transcending the ordinary through the Digital Atelier experience.</h2>
                <p style={s.narrativeText}>
                  {brand.brand_narrative || "Unbley isn't just a marketplace. It's a curated ecosystem where digital craftsmanship meets commercial viability. We believe that every product carries a soul, and every store should be an architectural masterpiece. Our mission is to redefine luxury in the digital age by prioritizing breathing room and editorial excellence over sheer volume."}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(34,21,16,0.03)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: brandColor, textTransform: 'uppercase', marginBottom: '32px' }}>Detailed Brand Info</div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Brand Name</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#221510', fontWeight: '700' }}>{brand.brand_name}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Brand Owner</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#221510', fontWeight: '700' }}>{brand.owner_name || 'Anonymous Artisan'}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Email Inquiry</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' }}>{brand.email_address || 'INFO@BRAND.COM'}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Phone Number</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' }}>{brand.phone_number || '1 (555) 012-3456'}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Location</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: '#221510' }}>{brand.location || 'Undisclosed Studio'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '8px' }}>Delivery Duration</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: '#221510' }}>{brand.delivery_info || '2-3 days standard'}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(34,21,16,0.03)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: brandColor, textTransform: 'uppercase', marginBottom: '32px' }}>Quick Connectivity</div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #DFCFC2', backgroundColor: '#F7F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.borderColor = '#DFCFC2'; }}>
                    <Globe size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #DFCFC2', backgroundColor: '#F7F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.borderColor = '#DFCFC2'; }}>
                    <InstagramIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #DFCFC2', backgroundColor: '#F7F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.borderColor = '#DFCFC2'; }}>
                    <TwitterIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #DFCFC2', backgroundColor: '#F7F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.borderColor = '#DFCFC2'; }}>
                    <FacebookIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #DFCFC2', backgroundColor: '#F7F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.borderColor = '#DFCFC2'; }}>
                    <TikTokIcon size={18} color="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: BIG CTA Section (Optimized for Conversion) */}
          <div style={s.ctaContainer} className="cta-container">
            <div style={{ ...s.sectionTitleBase, color: brandColor }}>Official Partner</div>
            <h2 style={s.ctaTitle} className="cta-title">Experience the Full Collection</h2>

            <button onClick={() => navigate(`/shop-brand/${id}`)} style={s.ctaButton} className="cta-btn">
              Visit Official Store
              <ExternalLink size={24} />
            </button>

            <div style={s.ctaBridgeMessage}>
              You'll be redirected to the brand's official store to complete your purchase.
            </div>

            <div style={s.triggersTitle} className="triggers-title">Why Explore Unbley:</div>
            <div style={s.triggersGrid} className="triggers-grid">
              <div style={s.triggerItem}>
                <ShieldCheck size={20} color={brandColor} />
                <span>Unique handcrafted designs</span>
              </div>
              <div style={s.triggerItem}>
                <Bell size={20} color={brandColor} />
                <span>Limited collections</span>
              </div>
              <div style={s.triggerItem}>
                <Globe size={20} color={brandColor} />
                <span>Direct from the brand</span>
              </div>
            </div>
          </div>

          {/* Below: Featured Pieces (Preview) */}
          <div style={s.productsSection}>
            <div style={{ ...s.sectionTitleBase, color: brandColor }}>Featured Pieces</div>
            <div style={s.productsHeader} className="products-header">
              <h2 style={s.productsTitle}>A Glimpse into the Collection</h2>
              <div
                onClick={() => navigate(`/shop-brand/${id}`)}
                style={s.exploreLink}
              >
                View full collection on store <ArrowRight size={14} />
              </div>
            </div>

            <div style={s.productGrid} className="product-grid">
              <div 
                style={s.productMain} 
                className="product-main"
                onClick={() => navigate(`/shop-brand/${id}`)}
              ></div>
              <div style={s.productSubGrid} className="product-sub-grid">
                <div 
                  style={{ ...s.productItemCard, gridColumn: '1 / span 2', backgroundImage: `url("${brand?.product_2_url || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80'}")` }} 
                  className="product-item-card"
                  onClick={() => navigate(`/shop-brand/${id}`)}
                ></div>
                <div 
                  style={{ ...s.productItemCard, backgroundImage: `url("${brand?.product_3_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}")` }} 
                  className="product-item-card"
                  onClick={() => navigate(`/shop-brand/${id}`)}
                ></div>
                <div 
                  style={{ ...s.productItemCard, backgroundImage: `url("${brand?.product_4_url || 'https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80'}")` }} 
                  className="product-item-card"
                  onClick={() => navigate(`/shop-brand/${id}`)}
                ></div>
              </div>
            </div>
          </div>

          {/* Bottom: Similar Brands (Retention Strategy) */}
          <div style={s.similarSection}>
            <div style={{ ...s.sectionTitleBase, color: '#888' }}>Keep Exploring</div>
            <h2 style={{ ...s.productsTitle, marginBottom: '40px' }}>You may also like</h2>

            <div style={s.similarGrid} className="similar-grid">
              {similarBrands.length > 0 ? similarBrands.map((b) => (
                <div key={b.id} style={s.similarCard} onClick={() => navigate(`/explore-brand/${b.id}`)} onMouseEnter={(e) => e.currentTarget.style.borderColor = brandColor} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F1F1F'}>
                  <div style={{...s.similarLogo, backgroundImage: b.logo_url ? `url(${b.logo_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    {!b.logo_url && <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#555' }}>{b.brand_name?.charAt(0)?.toUpperCase() || 'B'}</span>}
                  </div>
                  <div style={s.similarName}>{b.brand_name || 'Curated Selection'}</div>
                  <div style={s.similarCategory}>{b.brand_category || 'View Directory'}</div>
                </div>
              )) : (
                 <div style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>More brands joining soon...</div>
              )}
            </div>
          </div>

          {/* Footer Area */}
          <div style={s.footer} className="footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '800', letterSpacing: '-0.02em', color: brandColor }}>{brand.brand_name}</span>
              <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>© {new Date().getFullYear()} DIGITAL ATELIER</span>
            </div>
            <div style={s.footerLinks} className="footer-links">
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }}>Terms of Curation</span>
              <span style={{ cursor: 'pointer' }}>Legal Information</span>
            </div>
          </div>

        </div>
      </div>
      )}
      </div>
    </PageTransition>
  );
}
