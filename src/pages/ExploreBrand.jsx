import React from 'react';
import { Search, Globe, Camera, Share2, Mail, ArrowRight, ArrowLeft, Heart, Bookmark, ExternalLink, Bell, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const brandColor = '#06acf8ff';
  const navigate = useNavigate();

  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F', flexShrink: 0 },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '10px 16px', width: '320px', border: '1px solid #1F1F1F', borderRadius: '4px' },
    searchInput: { background: 'transparent', border: 'none', color: '#FFF', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '24px' },
    shopBtn: { backgroundColor: brandColor, color: '#000', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', padding: '10px 20px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px', textDecoration: 'none' },
    content: { padding: '80px', flex: 1, overflowY: 'auto' },

    // Components
    banner: { position: 'relative', height: '400px', backgroundColor: '#111', border: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', padding: '64px', overflow: 'hidden', marginBottom: '32px' },
    bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 },
    bannerContent: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '32px', marginTop: 'auto' },
    brandBadge: { width: '80px', height: '80px', border: `2px solid ${brandColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
    brandBadgeText: { fontFamily: '"Playfair Display", serif', fontSize: '24px', fontStyle: 'italic', color: brandColor },

    sectionTitleBase: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },

    narrativeBox: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '48px', position: 'relative', marginBottom: '64px' },
    narrativeTitle: { fontFamily: '"Playfair Display", serif', fontSize: '32px', fontStyle: 'italic', color: '#FFF', lineHeight: '1.2', marginBottom: '24px', maxWidth: '80%' },
    narrativeText: { color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '90%' },

    ctaContainer: { backgroundColor: '#111', border: `1px solid ${brandColor}`, padding: '64px', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' },
    ctaTitle: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF', fontStyle: 'italic', marginBottom: '32px' },
    ctaButton: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: brandColor, color: '#000', padding: '24px 48px', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', border: 'none', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    ctaBridgeMessage: { marginTop: '16px', color: '#888', fontSize: '14px', fontStyle: 'italic' },

    triggersTitle: { fontWeight: '700', fontSize: '14px', color: '#FFF', marginTop: '48px', marginBottom: '24px' },
    triggersGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    triggerItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#CCC' },

    productsSection: { marginBottom: '64px' },
    productsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
    productsTitle: { fontFamily: '"Playfair Display", serif', fontSize: '36px', fontStyle: 'italic', color: '#FFF' },
    exploreLink: { fontSize: '12px', color: '#FFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', cursor: 'pointer' },

    productGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    productMain: { backgroundColor: '#111', height: '500px', backgroundImage: 'url("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' },
    productSubGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px', height: '500px' },
    productItemCard: { backgroundColor: '#111', backgroundSize: 'cover', backgroundPosition: 'center' },

    similarSection: { marginBottom: '64px' },
    similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    similarCard: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s', },
    similarLogo: { width: '80px', height: '80px', backgroundColor: '#222', borderRadius: '50%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    similarName: { color: '#FFF', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' },
    similarCategory: { color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' },

    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1F1F1F', paddingTop: '32px', paddingBottom: '32px' },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase' },
  };

  return (
    <div style={s.page}>
      {/* Main Content */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', transition: 'color 0.2s' }}
              title="Go Back"
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={s.headerTitle}>Brand Profile</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={s.searchBar}>
              <Search size={14} color="#666" />
              <input type="text" placeholder="Search ..." style={s.searchInput} />
            </div>

            <button onClick={() => navigate('/shop-brand')} style={s.shopBtn}>Shop Zizzystores Now</button>
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
        <div style={s.content}>

          {/* Top: Brand Identity + Narrative */}
          <div style={s.banner}>
            <div style={s.bannerBg}></div>
            <div style={s.bannerContent}>
              <div style={s.brandBadge}>
                <span style={s.brandBadgeText}>Zs</span>
              </div>
              <div>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>Curated by ZizzyStores — premium digital ateliers only.</div>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '48px', color: '#FFF', margin: 0 }}>Zizzystores</h1>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px', marginBottom: '64px' }}>
            <div style={{ ...s.narrativeBox, marginBottom: 0 }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ ...s.sectionTitleBase, color: brandColor }}>The Brand Narrative</div>
                <h2 style={s.narrativeTitle}>Transcending the ordinary through the Digital Atelier experience.</h2>
                <p style={s.narrativeText}>
                  Zizzystores isn't just a marketplace. It's a curated ecosystem where digital craftsmanship meets commercial viability. We believe that every product carries a soul, and every store should be an architectural masterpiece. Our mission is to redefine luxury in the digital age by prioritizing breathing room and editorial excellence over sheer volume.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '32px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: brandColor, textTransform: 'uppercase', marginBottom: '32px' }}>Detailed Brand Info</div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Brand Name</div>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontStyle: 'italic', color: '#FFF' }}>Zizzystores</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Brand Owner</div>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontStyle: 'italic', color: '#FFF' }}>Alex Zizzy</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Email Inquiry</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' }}>INFO@ZIZZYSTORES.COM</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Phone Number</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' }}>1 (555) 012-3456</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Location</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: '#FFF' }}>New York, NY</div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Delivery Duration</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', color: '#FFF' }}>2-3 days</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '32px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: brandColor, textTransform: 'uppercase', marginBottom: '32px' }}>Quick Connectivity</div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <Globe size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <InstagramIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <TwitterIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <FacebookIcon size={18} color="currentColor" />
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FFF' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333' }}>
                    <TikTokIcon size={18} color="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: BIG CTA Section (Optimized for Conversion) */}
          <div style={s.ctaContainer}>
            <div style={{ ...s.sectionTitleBase, color: brandColor }}>Official Partner</div>
            <h2 style={s.ctaTitle}>Experience the Full Collection</h2>

            <a href="/shop-brand" style={s.ctaButton}>
              Visit Official Store
              <ExternalLink size={24} />
            </a>

            <div style={s.ctaBridgeMessage}>
              You'll be redirected to the brand's official store to complete your purchase.
            </div>

            <div style={s.triggersTitle}>Why Explore Zizzystores:</div>
            <div style={s.triggersGrid}>
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
            <div style={s.productsHeader}>
              <h2 style={s.productsTitle}>A Glimpse into the Collection</h2>
              <div
                onClick={() => navigate('/shop-brand')}
                style={s.exploreLink}
              >
                <a href='/shop-brand'>View full collection on store <ArrowRight size={14} /></a>
              </div>
            </div>

            <div style={s.productGrid}>
              <div style={s.productMain}></div>
              <div style={s.productSubGrid}>
                {/* Top Bag */}
                <div style={{ ...s.productItemCard, gridColumn: '1 / span 2', backgroundImage: 'url("https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80")', borderRadius: '4px' }}></div>
                {/* Bottom Left Face */}
                <div style={{ ...s.productItemCard, backgroundImage: 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80")', borderRadius: '4px', filter: 'grayscale(100%)' }}></div>
                {/* Bottom Right Mixer */}
                <div style={{ ...s.productItemCard, backgroundImage: 'url("https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80")', borderRadius: '4px', filter: 'grayscale(100%)' }}></div>
              </div>
            </div>
          </div>

          {/* Bottom: Similar Brands (Retention Strategy) */}
          <div style={s.similarSection}>
            <div style={{ ...s.sectionTitleBase, color: '#888' }}>Keep Exploring</div>
            <h2 style={{ ...s.productsTitle, marginBottom: '40px' }}>You may also like</h2>

            <div style={s.similarGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={s.similarCard} onMouseEnter={(e) => e.currentTarget.style.borderColor = brandColor} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F1F1F'}>
                  <div style={s.similarLogo}>
                    <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', fontStyle: 'italic', color: '#555' }}>B{i}</span>
                  </div>
                  <div style={s.similarName}>Oversight Brand {i}</div>
                  <div style={s.similarCategory}>Clothing</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Area */}
          <div style={s.footer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '14px', fontStyle: 'italic', fontWeight: 'bold', color: brandColor }}>Zizzystores</span>
              <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>© 2024 DIGITAL ATELIER</span>
            </div>
            <div style={s.footerLinks}>
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
