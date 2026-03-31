import React from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, HeadphonesIcon, Globe, Camera, Share2, Mail, ArrowRight, Edit, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function Profile() {
  const brandColor = '#06acf8ff';

  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column' },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 40px',
      color: active ? '#FFF' : '#888',
      backgroundColor: active ? '#111' : 'transparent',
      borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      letterSpacing: '0.05em',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      textDecoration: 'none'
    }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden', borderRadius: '50%' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F' },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '10px 16px', width: '320px', border: '1px solid #1F1F1F', borderRadius: '4px' },
    searchInput: { background: 'transparent', border: 'none', color: '#FFF', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '24px' },
    shopBtn: { backgroundColor: brandColor, color: '#000', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', padding: '10px 20px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    content: { padding: '80px', flex: 1, overflowY: 'auto' },

    // Components
    banner: { position: 'relative', height: '400px', backgroundColor: '#111', border: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', padding: '64px', overflow: 'hidden', marginBottom: '32px' },
    bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 },
    bannerContent: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '32px', marginTop: 'auto' },
    brandBadge: { width: '80px', height: '80px', border: `2px solid ${brandColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
    brandBadgeText: { fontFamily: '"Playfair Display", serif', fontSize: '24px', fontStyle: 'italic', color: brandColor },

    sectionTitleBase: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },

    gridContainer: { display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px', marginBottom: '64px' },
    infoBox: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '32px', marginBottom: '24px' },
    infoItem: { marginBottom: '24px' },
    infoLabel: { fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' },
    infoValue: { fontSize: '14px', color: '#FFF', fontFamily: '"Playfair Display", serif', fontStyle: 'italic' },

    narrativeBox: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '48px', position: 'relative' },
    narrativeTitle: { fontFamily: '"Playfair Display", serif', fontSize: '32px', fontStyle: 'italic', color: '#FFF', lineHeight: '1.2', marginBottom: '24px', maxWidth: '80%' },
    narrativeText: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '90%' },

    subGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },
    subTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#FFF', textTransform: 'uppercase', marginBottom: '12px' },
    subText: { color: '#888', fontSize: '12px', lineHeight: '1.6' },

    productsSection: { marginBottom: '64px' },
    productsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
    productsTitle: { fontFamily: '"Playfair Display", serif', fontSize: '36px', fontStyle: 'italic', color: '#FFF' },
    exploreLink: { fontSize: '12px', color: '#FFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' },

    productGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    productMain: { backgroundColor: '#111', height: '500px', backgroundImage: 'url("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' },
    productSubGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px', height: '500px' },
    productItemCard: { backgroundColor: '#111', backgroundSize: 'cover', backgroundPosition: 'center' },

    newsletterBox: { border: `2px solid ${brandColor}`, padding: '64px', textAlign: 'center', backgroundColor: '#0A0A0A', marginBottom: '64px' },
    newsletterTitle: { fontFamily: '"Playfair Display", serif', fontSize: '32px', fontStyle: 'italic', color: '#FFF', marginBottom: '16px', marginTop: '24px' },
    newsletterDesc: { color: '#888', fontSize: '14px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' },
    newsletterForm: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', borderBottom: '1px solid #333', maxWidth: '400px', margin: '0 auto', paddingBottom: '16px' },
    newsletterInput: { background: 'transparent', border: 'none', color: '#FFF', fontSize: '12px', outline: 'none', flex: 1, letterSpacing: '0.05em' },
    newsletterBtn: { background: 'transparent', border: 'none', color: brandColor, fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },

    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1F1F1F', paddingTop: '32px' },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase' },
  };

  return (
    <div style={s.page} className="prof-page">
      <style>{`
        @media (max-width: 768px) {
          .prof-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .prof-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #1F1F1F; }
          .prof-logo-container { padding: 24px !important; flex-direction: row !important; justify-content: space-between; align-items: center; }
          .prof-nav { display: flex; overflow-x: auto; padding-bottom: 8px !important; white-space: nowrap; }
          .prof-nav a, .prof-nav div { border-left: none !important; border-bottom: 3px solid transparent; padding: 12px 24px !important; margin-top: 0 !important; }
          .prof-nav a[style*="border-left"] { border-bottom: 3px solid #06acf8ff !important; }
          .prof-user-profile { display: none !important; }
          
          .prof-header { height: auto !important; padding: 24px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; }
          .prof-search { width: 100% !important; order: 3; }
          
          .prof-content { padding: 24px !important; overflow: visible !important; }
          .prof-banner { padding: 32px 24px !important; height: auto !important; min-height: 300px; }
          .prof-banner-content { flex-direction: column; align-items: flex-start !important; text-align: left; }
          .prof-grid-container { grid-template-columns: 1fr !important; gap: 32px !important; }
          .prof-narrative-box { padding: 32px 24px !important; }
          .prof-narrative-title { font-size: 24px !important; max-width: 100% !important; }
          .prof-narrative-text { max-width: 100% !important; }
          .prof-sub-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          
          .prof-products-header { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .prof-product-grid { grid-template-columns: 1fr !important; }
          .prof-product-main { height: 300px !important; }
          .prof-product-sub-grid { height: auto !important; grid-template-columns: 1fr !important; grid-template-rows: repeat(3, 200px) !important; }
          .prof-product-item-card { grid-column: auto !important; }
          
          .prof-newsletter { padding: 32px 24px !important; }
          .prof-newsletter-form { flex-direction: column; padding-bottom: 0 !important; border-bottom: none !important; }
          .prof-newsletter-input { width: 100%; border-bottom: 1px solid #333; padding-bottom: 16px; margin-bottom: 16px; }
          .prof-newsletter-btn { width: 100%; }
          
          .prof-footer { flex-direction: column; gap: 24px; text-align: center; }
          .prof-footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
      {/* Sidebar */}
      <div style={s.sidebar} className="prof-sidebar">
        <div style={s.logoContainer} className="prof-logo-container">
          <div style={s.logo}>Zizzystores.</div>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
        </div>

        <div style={s.nav} className="prof-nav">
          <Link to="/dashboard" style={s.navItem(false)}><LayoutGrid size={16} /> Overview</Link>
          <Link to="/profile" style={s.navItem(true)}><User size={16} /> Profile</Link>
          <Link to="/edit" style={s.navItem(false)}><Edit size={16} /> Edit</Link>
          <div style={{ ...s.navItem(false), marginTop: '48px' }}><HeadphonesIcon size={16} /> Customer Service</div>
        </div>

        <div style={s.userProfile} className="prof-user-profile">
          <div style={s.userAvatar}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Alex Zizzy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Alex Zizzy</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Principal Curator</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header} className="prof-header">
          <div style={s.headerTitle}>Brand Profile</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="prof-search">
            <div style={s.searchBar} className="prof-search">
              <Search size={14} color="#666" />
              <input type="text" placeholder="Search ..." style={s.searchInput} />
            </div>
            <div style={s.headerActions}>
              <div title="Like Brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
                <Heart size={18} />
              </div>
              <div title="Save Brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
                <Bookmark size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={s.content} className="prof-content">

          {/* Hero Banner */}
          <div style={s.banner} className="prof-banner">
            <div style={s.bannerBg}></div>
            <div style={s.bannerContent} className="prof-banner-content">
              <div style={s.brandBadge}>
                <span style={s.brandBadgeText}>Zs</span>
              </div>
              <div>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>Brand Identity</div>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '48px', color: '#FFF', margin: 0 }}>Zizzystores</h1>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div style={s.gridContainer} className="prof-grid-container">
            {/* Left Column */}
            <div>
              <div style={s.infoBox}>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>Detailed Brand Info</div>

                <div style={s.infoItem}>
                  <div style={s.infoLabel}>Brand Name</div>
                  <div style={s.infoValue}>Zizzystores</div>
                </div>

                <div style={s.infoItem}>
                  <div style={s.infoLabel}>Brand Owner</div>
                  <div style={{ ...s.infoValue, color: '#CCC' }}>Alex Zizzy</div>
                </div>

                <div style={s.infoItem}>
                  <div style={s.infoLabel}>Email Inquiry</div>
                  <div style={{ fontSize: '12px', color: brandColor, fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>info@zizzystores.com</div>
                </div>

                <div style={{ ...s.infoItem, marginBottom: 0 }}>
                  <div style={s.infoLabel}>Concierge Line</div>
                  <div style={{ fontSize: '12px', color: '#FFF', fontWeight: '500', letterSpacing: '0.05em' }}>+1 888 ATELIER</div>
                </div>
              </div>

              <div style={s.infoBox}>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>Quick Connectivity</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <Globe size={16} color="currentColor" />
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <InstagramIcon size={16} color="currentColor" />
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <TwitterIcon size={16} color="currentColor" />
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <FacebookIcon size={16} color="currentColor" />
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <TikTokIcon size={16} color="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={s.narrativeBox} className="prof-narrative-box">
              <div style={s.narrativeBg}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>The Brand Narrative</div>
                <h2 style={s.narrativeTitle} className="prof-narrative-title">Transcending the ordinary through the Digital Atelier experience.</h2>
                <p style={s.narrativeText} className="prof-narrative-text">
                  Zizzystores isn't just a marketplace. It's a curated ecosystem where digital craftsmanship meets commercial viability. We believe that every product carries a soul, and every store should be an architectural masterpiece. Our mission is to redefine luxury in the digital age by prioritizing breathing room and editorial excellence over sheer volume.
                </p>

                <div style={s.subGrid} className="prof-sub-grid">
                  <div>
                    <div style={s.subTitle}>Our Manifesto</div>
                    <p style={s.subText}>
                      Designing the future of digital commerce through high-fidelity aesthetics and surgical precision in brand narrative. We are curators first, sellers second.
                    </p>
                  </div>
                  <div>
                    <div style={s.subTitle}>Architectura Lethos</div>
                    <p style={s.subText}>
                      A proprietary aesthetic engine that ensures every touchpoint feels like a high-end physical boutique in the digital realm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Selection */}
          <div style={s.productsSection}>
            <div style={{ ...s.sectionTitleBase, color: brandColor }}>The Selection</div>
            <div style={s.productsHeader} className="prof-products-header">
              <h2 style={s.productsTitle}>List of Items</h2>
              <a href="/shop-brand" style={s.exploreLink}>Explore Full Inventory <ArrowRight size={14} /></a>
            </div>

            <div style={s.productGrid} className="prof-product-grid">
              <div style={s.productMain} className="prof-product-main"></div>
              <div style={s.productSubGrid} className="prof-product-sub-grid">
                {/* Top Bag */}
                <div style={{ ...s.productItemCard, gridColumn: '1 / span 2', backgroundImage: 'url("https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80")', borderRadius: '4px' }} className="prof-product-item-card"></div>
                {/* Bottom Left Face */}
                <div style={{ ...s.productItemCard, backgroundImage: 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80")', borderRadius: '4px', filter: 'grayscale(100%)' }} className="prof-product-item-card"></div>
                {/* Bottom Right Mixer */}
                <div style={{ ...s.productItemCard, backgroundImage: 'url("https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80")', borderRadius: '4px', filter: 'grayscale(100%)' }} className="prof-product-item-card"></div>
              </div>
            </div>
          </div>

          {/* Newsletter / Footer Box */}
          <div style={s.newsletterBox} className="prof-newsletter">
            <div style={{ display: 'inline-block', backgroundColor: '#111', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
              <Mail size={24} color={brandColor} />
            </div>
            <h2 style={s.newsletterTitle}>Join the Atelier Inner Circle</h2>
            <p style={s.newsletterDesc}>
              Receive early access to seasonal collections and insights into the digital curation process.
            </p>
            <div style={s.newsletterForm} className="prof-newsletter-form">
              <input type="email" placeholder="Email Address" style={s.newsletterInput} className="prof-newsletter-input" />
              <button style={s.newsletterBtn} className="prof-newsletter-btn">Subscribe</button>
            </div>
          </div>

          {/* Footer Area */}
          <div style={s.footer} className="prof-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '14px', fontStyle: 'italic', fontWeight: 'bold', color: brandColor }}>Zizzystores</span>
              <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>© 2024 DIGITAL ATELIER</span>
            </div>
            <div style={s.footerLinks} className="prof-footer-links">
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }}>Terms of Curation</span>
              <span style={{ cursor: 'pointer' }}>Legal Information</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
