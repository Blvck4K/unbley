import React from 'react';
import { ShoppingCart, User, Star, Plus, Minus, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const navigate = useNavigate();
  const accentColor = '#0F2C59'; // Deep luxury blue
  const bgMain = '#FAFAFA'; // Light grey page bg
  const inputBg = '#F4F4F5';

  const s = {
    page: { backgroundColor: bgMain, color: '#111', minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' },

    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', backgroundColor: '#FFF', borderBottom: '1px solid #EAEAEA' },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em' },
    navCenter: { display: 'flex', gap: '32px', fontSize: '13px', color: '#555' },
    navItemText: { cursor: 'pointer', textDecoration: 'none', color: '#555', transition: 'color 0.2s' },
    navItemTextActive: { cursor: 'pointer', textDecoration: 'none', color: '#111', borderBottom: '2px solid #111', paddingBottom: '4px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' },

    // Main Content wrapper
    contentWrap: { padding: '48px 80px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' },

    // Hero Section
    heroLayout: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px' },

    // Hero Left (Images)
    imageGallery: { display: 'flex', flexDirection: 'column', gap: '16px' },
    mainImageWrap: { width: '100%', height: '600px', backgroundColor: '#F0F0F0', overflow: 'hidden' },
    mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
    thumbnailsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', height: '160px' },
    thumbnail: { backgroundColor: '#F0F0F0', width: '100%', height: '100%', overflow: 'hidden', cursor: 'pointer' },
    thumbnailMore: { backgroundColor: '#F0F0F0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#666', cursor: 'pointer' },

    // Hero Right (Details)
    productDetails: { display: 'flex', flexDirection: 'column', paddingTop: '24px' },
    tag: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' },
    title: { fontSize: '40px', fontWeight: '700', color: '#111', lineHeight: '1.2', marginBottom: '16px' },
    ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
    stars: { display: 'flex', color: accentColor },
    reviewCount: { fontSize: '12px', color: '#666' },
    price: { fontSize: '24px', fontWeight: '700', color: accentColor, marginBottom: '24px' },
    description: { fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '40px' },

    sectionLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '16px' },
    swatchRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
    swatch: (color, active) => ({ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: color, border: active ? '2px solid #111' : '1px solid #EAEAEA', cursor: 'pointer', padding: '2px', backgroundClip: 'content-box' }),

    qtyRow: { display: 'flex', gap: '16px', marginBottom: '16px' },
    qtyControl: { display: 'flex', alignItems: 'center', backgroundColor: inputBg, borderRadius: '4px' },
    qtyBtn: { width: '40px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'transparent', color: '#555' },
    qtyValue: { fontSize: '14px', fontWeight: '600', width: '32px', textAlign: 'center' },
    addBtn: { flex: 1, backgroundColor: accentColor, color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' },
    buyBtn: { width: '100%', backgroundColor: '#FFF', color: '#111', border: '1px solid #EAEAEA', borderRadius: '4px', padding: '16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '32px' },

    trustRow: { display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid #EAEAEA' },
    trustItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#666' },

    // Technical Artistry block
    techBlock: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', backgroundColor: '#F4F4F5' },
    techLeft: { padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    techTitle: { fontSize: '28px', fontWeight: '700', color: '#111', marginBottom: '48px' },
    techRow: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #EAEAEA' },
    techLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#555', textTransform: 'uppercase' },
    techValue: { fontSize: '12px', color: '#111' },
    techRight: { backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    techImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 },

    // Community Stories
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
    sectionTitleText: { fontSize: '28px', fontWeight: '700', color: '#111' },
    sectionSubtitleText: { fontSize: '12px', color: '#666', marginTop: '8px' },
    linkText: { fontSize: '12px', fontWeight: '600', color: accentColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },

    storiesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    storyCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    reviewCard: { backgroundColor: '#FFF', padding: '32px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' },
    reviewTitle: { fontSize: '16px', fontWeight: '700', color: '#111', marginTop: '16px', marginBottom: '16px' },
    reviewText: { fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '32px', fontStyle: 'italic' },
    reviewerRow: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' },
    reviewerAvatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: accentColor },
    reviewerDetails: { display: 'flex', flexDirection: 'column' },
    reviewerName: { fontSize: '11px', fontWeight: '700', color: '#111' },
    reviewerTag: { fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },

    // Recommendations
    recGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    recCard: { display: 'flex', flexDirection: 'column', cursor: 'pointer' },
    recImgWrap: { width: '100%', aspectRatio: '1', backgroundColor: '#F5F5F5', overflow: 'hidden', marginBottom: '16px' },
    recImg: { width: '100%', height: '100%', objectFit: 'cover' },
    recTitle: { fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '4px' },
    recPrice: { fontSize: '12px', color: '#555' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px', backgroundColor: '#FFF', borderTop: '1px solid #EAEAEA' },
    footerLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
    footerLogo: { fontSize: '12px', fontWeight: '700', color: '#111' },
    copyright: { fontSize: '10px', color: '#888' },
    footerLinks: { display: 'flex', gap: '24px', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none' },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>Digital Atelier</div>

        <div style={s.headerRight}>
          <div style={s.iconButton} onClick={() => navigate('/cart')}><ShoppingCart size={18} /></div>
        </div>
      </div>

      <div style={s.contentWrap}>

        {/* Hero Section */}
        <div style={s.heroLayout}>
          <div style={s.imageGallery}>
            <div style={s.mainImageWrap}>
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80" alt="Vessel" style={s.mainImage} />
            </div>
            <div style={s.thumbnailsRow}>
              <div style={s.thumbnail}>
                <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" alt="Detail 1" style={s.mainImage} />
              </div>
              <div style={s.thumbnail}>
                <img src="https://images.unsplash.com/photo-1587836374828-eb416f60c486?w=400&q=80" alt="Detail 2" style={s.mainImage} />
              </div>
              <div style={s.thumbnailMore}>
                +4 VIEWS
              </div>
            </div>
          </div>

          <div style={s.productDetails}>
            <div style={s.tag}>LIMITED EDITION</div>
            <h1 style={s.title}>Lunar Series 01: The Mono-Chrono</h1>

            <div style={s.ratingRow}>
              <div style={s.stars}>
                <Star size={14} fill={accentColor} color={accentColor} />
                <Star size={14} fill={accentColor} color={accentColor} />
                <Star size={14} fill={accentColor} color={accentColor} />
                <Star size={14} fill={accentColor} color={accentColor} />
                <Star size={14} fill={accentColor} color={accentColor} />
              </div>
              <div style={s.reviewCount}>(124 verified reviews)</div>
            </div>

            <div style={s.price}>$1,250.00</div>

            <p style={s.description}>
              Designed at our Stockholm atelier, the Lunar Series 01 combines architectural minimalism with Swiss-made precision. Features a monolithic ceramic case and sapphire glass.
            </p>

            <div style={s.sectionLabel}>Select Material</div>
            <div style={s.swatchRow}>
              <div style={s.swatch('#1A1C23', true)}></div>
              <div style={s.swatch('#D8E1E8', false)}></div>
              <div style={s.swatch('#FDF4D9', false)}></div>
            </div>

            <div style={s.sectionLabel}>Quantity</div>
            <div style={s.qtyRow}>
              <div style={s.qtyControl}>
                <button style={s.qtyBtn}><Minus size={14} /></button>
                <div style={s.qtyValue}>1</div>
                <button style={s.qtyBtn}><Plus size={14} /></button>
              </div>
              <button style={s.addBtn} onClick={() => navigate('#')}>Add to Cart</button>
            </div>

            <button style={s.buyBtn} onClick={() => navigate('/cart')}>Buy it Now</button>

            <div style={s.trustRow}>
              <div style={s.trustItem}><Truck size={14} /> Free Global Shipping</div>
              <div style={s.trustItem}><ShieldCheck size={14} /> 2 Year Warranty</div>
            </div>
          </div>
        </div>

        {/* Community Stories */}
        <div>
          <div style={s.sectionHeader}>
            <div>
              <h2 style={s.sectionTitleText}>Reviews</h2>
              <div style={s.sectionSubtitleText}>Hear from other customers.</div>
            </div>
            <div style={s.linkText}>View all reviews <ArrowRight size={14} /></div>
          </div>

          <div style={s.storiesGrid}>
            <div style={s.storyCol}>
              <div style={s.reviewCard}>
                <div style={s.stars}><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /></div>
                <div style={s.reviewTitle}>"A Masterpiece of Restraint"</div>
                <div style={s.reviewText}>
                  The build quality surpassed all my expectations. Most 'minimal' watches feel cheap, but this has a weight and finishing that rivals brands triple the price. The ceramic case stays cool on the skin and is remarkably scratch-resistant.
                </div>
                <div style={s.reviewerRow}>
                  <div style={s.reviewerAvatar}>EM</div>
                  <div style={s.reviewerDetails}>
                    <div style={s.reviewerName}>Erik Magnusson</div>
                    <div style={s.reviewerTag}>VERIFIED BUYER • STOCKHOLM</div>
                  </div>
                </div>
              </div>

              <div style={s.reviewCard}>
                <div style={s.stars}><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /></div>
                <div style={s.reviewText}>
                  "Beautiful design, the leather strap is very high quality. My only wish is that the dial had luminosity."
                </div>
                <div style={s.reviewerRow}>
                  <div style={{ ...s.reviewerAvatar, backgroundColor: 'transparent', color: '#111' }}>ML</div>
                  <div style={s.reviewerDetails}>
                    <div style={s.reviewerName}>Marc L.</div>
                    <div style={s.reviewerTag}>Verified Buyer</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={s.storyCol}>
              <div style={{ ...s.reviewCard, backgroundColor: '#F9F9FB', border: 'none', boxShadow: 'none' }}>
                <div style={s.stars}><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /><Star size={12} fill={accentColor} /></div>
                <div style={{ ...s.reviewText, marginTop: '24px' }}>
                  "The shipping was incredibly fast to London. Packaging was editorial grade—opening it felt like a ceremony."
                </div>
                <div style={s.reviewerRow}>
                  <div style={{ ...s.reviewerAvatar, backgroundColor: 'transparent', color: '#111' }}>SJ</div>
                  <div style={s.reviewerDetails}>
                    <div style={s.reviewerName}>Sarah J.</div>
                    <div style={s.reviewerTag}>Verified Buyer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 style={{ ...s.sectionTitleText, marginBottom: '32px' }}>Explore More ...</h2>
          <div style={s.recGrid}>
            <div style={s.recCard} onClick={() => navigate('/product')}>
              <div style={s.recImgWrap}>
                <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" alt="Chronos" style={s.recImg} />
              </div>
              <div style={s.recTitle}>Digital Chronos 04</div>
              <div style={s.recPrice}>$850.00</div>
            </div>

            <div style={s.recCard} onClick={() => navigate('/product')}>
              <div style={s.recImgWrap}>
                <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80" alt="Slim" style={s.recImg} />
              </div>
              <div style={s.recTitle}>Heritage Slim</div>
              <div style={s.recPrice}>$640.00</div>
            </div>

            <div style={s.recCard} onClick={() => navigate('/product')}>
              <div style={s.recImgWrap}>
                <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80" alt="Eyewear" style={s.recImg} />
              </div>
              <div style={s.recTitle}>Atelier Eyewear 01</div>
              <div style={s.recPrice}>$320.00</div>
            </div>

            <div style={s.recCard} onClick={() => navigate('/product')}>
              <div style={s.recImgWrap}>
                <img src="https://images.unsplash.com/photo-1601614838644-8395edb7d3bb?w=400&q=80" alt="Wallet" style={s.recImg} />
              </div>
              <div style={s.recTitle}>Card Holder Noir</div>
              <div style={s.recPrice}>$150.00</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerLeft}>
          <div style={s.footerLogo}>Digital Atelier</div>
          <div style={s.copyright}>© 2024 Digital Atelier. All rights reserved.</div>
        </div>

        <div style={s.footerLinks}>
          <a style={s.footerLinkItem}>Privacy Policy</a>
          <a style={s.footerLinkItem}>Terms of Service</a>
          <a style={s.footerLinkItem}>Shipping & Returns</a>
          <a style={s.footerLinkItem}>Sustainability</a>
        </div>
      </div>
    </div>
  );
}
