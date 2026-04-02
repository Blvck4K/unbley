import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Truck, Globe, CreditCard, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [brand, setBrand] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    async function fetchData() {
      if (cartItems.length > 0 && cartItems[0].brand_id) {
        const id = cartItems[0].brand_id;
        if (!brand || brand.id !== id) {
          const { data: bData } = await supabase.from('brand_profiles').select('*').eq('id', id).single();
          if (bData) setBrand(bData);
        }
        
        const cartIds = cartItems.map(i => i.id);
        const { data: pData } = await supabase.from('products').select('*').eq('brand_id', id).limit(6);
        if (pData) {
            setRecommendedProducts(pData.filter(p => !cartIds.includes(p.id)).slice(0, 3));
        }
      } else if (cartItems.length === 0) {
        setBrand(null);
        setRecommendedProducts([]);
      }
    }
    fetchData();
  }, [cartItems]);

  const [removedItems, setRemovedItems] = useState([]);
  
  const accentColor = brand?.accent_color || '#0F2C59';
  const bgMain = brand?.primary_color || '#FAFAFA';
  const secondaryBg = brand?.secondary_color || '#FFFFFF';
  const textColor = brand ? '#FDFDFD' : '#111';
  const mutedColor = brand ? '#999' : '#666';
  const borderColor = brand?.secondary_color ? 'rgba(255,255,255,0.1)' : '#EAEAEA';
  const dangerColor = '#D83A3A';

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  const handleRemove = (id) => {
    const item = cartItems.find(i => i.id === id);
    setRemovedItems([...removedItems, item]);
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  const handleUndo = () => {
    if (removedItems.length > 0) {
      const itemToRestore = removedItems[removedItems.length - 1];
      setCartItems([...cartItems, itemToRestore]);
      setRemovedItems(removedItems.slice(0, -1));
    }
  };

  const updateQty = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80'; // Fallback minimal placeholder
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal;

  const s = {
    page: { backgroundColor: bgMain, color: textColor, minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' },

    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: bgMain },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor },
    headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, position: 'relative' },
    cartBadge: { position: 'absolute', top: '-6px', right: '-8px', backgroundColor: accentColor, color: '#000', fontSize: '9px', fontWeight: 'bold', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },

    // Main Content
    content: { maxWidth: '1400px', margin: '0 auto' },

    pageTitle: { fontFamily: '"Inter", sans-serif', fontSize: isMobile ? '24px' : '44px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 12px 0', color: textColor },
    pageSubtitle: { fontSize: '13px', color: mutedColor, lineHeight: '1.6', maxWidth: '400px', marginBottom: isMobile ? '32px' : '48px' },

    // Two Col Layout
    layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '64px' },

    // Cart Items List
    itemsContainer: { display: 'flex', flexDirection: 'column', gap: '24px' },
    cartItem: { backgroundColor: secondaryBg, padding: '24px', display: 'flex', gap: '32px', borderRadius: '4px', border: `1px solid ${borderColor}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    itemImageWrap: { width: '160px', height: '160px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    itemImage: { width: '100%', height: '100%', objectFit: 'cover' },

    itemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    itemNameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
    itemName: { fontSize: '18px', fontWeight: '700', color: accentColor },
    itemPrice: { fontSize: '15px', fontWeight: '700', color: textColor },
    itemVariant: { fontSize: '11px', color: mutedColor, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' },

    itemActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '16px' },
    qtyControl: { display: 'flex', alignItems: 'center', backgroundColor: bgMain, border: `1px solid ${borderColor}`, borderRadius: '4px' },
    qtyBtn: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'transparent', color: textColor, fontSize: '16px' },
    qtyValue: { fontSize: '13px', fontWeight: '600', width: '24px', textAlign: 'center', color: textColor },
    itemTotalCalc: { fontSize: '13px', color: mutedColor, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' },
    removeBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: dangerColor, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', background: 'transparent', border: 'none', letterSpacing: '0.05em' },

    // Order Summary
    summaryBox: { backgroundColor: secondaryBg, padding: '40px', borderRadius: '4px', border: `1px solid ${borderColor}` },
    summaryTitle: { fontSize: '18px', fontWeight: '600', color: textColor, marginBottom: '32px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: mutedColor },

    divider: { height: '1px', backgroundColor: borderColor, margin: '24px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    totalLabel: { fontSize: '14px', fontWeight: '700', color: textColor },
    totalValue: { fontSize: '20px', fontWeight: '700', color: accentColor },

    checkoutBtn: { width: '100%', padding: '16px', backgroundColor: accentColor, color: '#000', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    continueLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: textColor, backgroundColor: 'transparent', border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'background-color 0.2s', fontWeight: '600' },

    trustBadges: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' },
    trustBadge: { backgroundColor: secondaryBg, padding: '16px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '4px' },
    trustBadgeLabel: { fontSize: '8px', fontWeight: '700', color: mutedColor, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' },

    undoToast: { backgroundColor: accentColor, color: '#000', padding: '14px 24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    undoBtn: { background: 'transparent', border: 'none', color: '#000', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },

    // Recommendations
    recommendations: { marginTop: '80px' },
    recTitle: { fontSize: '24px', fontWeight: '700', color: textColor, marginBottom: '32px' },
    recGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },

    featureCard: { backgroundColor: secondaryBg, padding: '40px', border: `1px solid ${borderColor}`, borderRadius: '4px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '300px', cursor: 'pointer' },
    featureTag: { fontSize: '8px', fontWeight: '700', color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    featureTitle: { fontSize: '24px', fontWeight: '600', color: textColor, marginBottom: '8px' },
    featureDesc: { fontSize: '12px', color: mutedColor, maxWidth: '200px', lineHeight: '1.6' },
    featureLink: { marginTop: 'auto', fontSize: '11px', fontWeight: '700', color: textColor, textDecoration: 'underline', cursor: 'pointer' },
    featureImageWrap: { position: 'absolute', bottom: '24px', right: '24px', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    featureImg: { width: '100%', height: '100%', objectFit: 'cover' },

    smallCard: { backgroundColor: secondaryBg, padding: '24px', border: `1px solid ${borderColor}`, borderRadius: '4px', display: 'flex', flexDirection: 'column', cursor: 'pointer' },
    smallImgWrap: { width: '100%', height: '180px', backgroundColor: '#111', marginBottom: '16px', overflow: 'hidden', borderRadius: '4px' },
    smallImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
    smallTitle: { fontSize: '12px', fontWeight: '600', color: textColor, marginBottom: '4px' },
    smallPrice: { fontSize: '11px', color: accentColor, fontWeight: 'bold' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', borderTop: `1px solid ${borderColor}`, marginTop: '64px' },
    footerLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
    footerLogo: { fontSize: '12px', fontWeight: '700', color: textColor },
    copyright: { fontSize: '10px', color: mutedColor },
    footerLinks: { display: 'flex', gap: '24px', fontSize: '10px', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s' },
    footerIcons: { display: 'flex', gap: '12px', color: textColor }
  };

  const isOwner = user && brand && user.id === brand.id;

  if (isOwner) {
    return (
      <div style={{...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FFF'}}>
        <ShieldCheck size={48} color={dangerColor} style={{ marginBottom: '24px' }} />
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', marginBottom: '16px' }}>Owner Environment Active</h2>
        <p style={{ color: '#999', marginBottom: '32px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
          You cannot construct a cart or checkout your own digital assets. Please switch to a buyer account to test the checkout matrix.
        </p>
        <button onClick={() => navigate(-1)} style={{ padding: '12px 32px', border: `1px solid ${accentColor}`, backgroundColor: 'transparent', color: '#FFF', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
          RETURN TO DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .cart-header, .cart-footer { padding: 16px 24px !important; }
          .cart-content { padding: 32px 24px !important; }
          .cart-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cart-item { flex-direction: column !important; gap: 24px !important; padding: 20px !important; }
          .cart-item-image-wrap { width: 100% !important; height: 180px !important; }
          .cart-item-actions { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .cart-summary-col { position: sticky; bottom: 0; z-index: 100; margin-top: 40px; }
          .cart-summary-box { background-color: ${secondaryBg} !important; box-shadow: 0 -4px 30px rgba(0,0,0,0.1) !important; margin: 0 -24px !important; border-radius: 20px 20px 0 0 !important; padding: 32px 24px 24px 24px !important; border-top: 1px solid ${borderColor} !important; }
          .rec-grid { grid-template-columns: 1fr !important; }
          .footer-links { display: none !important; }
          .page-title { font-size: 28px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{...s.header, padding: '24px 48px'}} className="cart-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ ...s.iconButton, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </div>
          <div style={s.logo}>
            {brand ? brand.brand_name.toUpperCase() : 'DIGITAL ATELIER'}
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.iconButton} onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} />
            <div style={s.cartBadge}>{cartItems.length}</div>
          </div>
        </div>
      </div>

      <div style={{...s.content, padding: '48px 80px'}} className="cart-content">
        <h1 style={s.pageTitle} className="page-title">Your Selection</h1>
        <p style={s.pageSubtitle}>
          A curated collection of pieces refined for your digital lifestyle. Review your atelier items before finalizing your acquisition.
        </p>

        <div style={s.layout} className="cart-layout">
          {/* Left Column: Items */}
          <div style={s.itemsContainer}>
            {removedItems.length > 0 && (
              <div style={s.undoToast}>
                <span>Item removed from cart.</span>
                <button style={s.undoBtn} onClick={handleUndo}>
                  <RotateCcw size={14} /> Undo
                </button>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: mutedColor, backgroundColor: secondaryBg, borderRadius: '4px', border: `1px solid ${borderColor}` }}>
                <ShoppingCart size={48} color={mutedColor} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', color: textColor, marginBottom: '8px' }}>Your Cart is Empty</h3>
                <p style={{ fontSize: '14px', marginBottom: '32px' }}>Discover unique items to add to your collection.</p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{...s.continueLink, width: 'auto', padding: '16px 32px'}} onClick={() => navigate(-1)}>
                    Explore Collection
                  </div>
                </div>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} style={s.cartItem} className="cart-item">
                  <div style={s.itemImageWrap} className="cart-item-image-wrap">
                    <img src={item.img} alt={item.name} style={s.itemImage} onError={handleImageError} />
                  </div>

                  <div style={s.itemDetails}>
                    <div style={s.itemNameRow}>
                      <div style={s.itemName}>{item.name}</div>
                      <div style={s.itemPrice}>{formatPrice(item.price)}</div>
                    </div>
                    <div style={s.itemVariant}>{item.variant}</div>

                    <div style={s.itemActions} className="cart-item-actions">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={s.qtyControl}>
                          <button style={s.qtyBtn} onClick={() => updateQty(item.id, -1)}>-</button>
                          <div style={s.qtyValue}>{item.qty}</div>
                          <button style={s.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                        
                        {item.qty >= 1 && (
                          <div style={s.itemTotalCalc}>
                            Total: <span style={{ color: '#111', fontWeight: '700' }}>{formatPrice(item.price * item.qty)}</span>
                            <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>({formatPrice(item.price)} &times; {item.qty})</span>
                          </div>
                        )}
                      </div>

                      <button style={s.removeBtn} onClick={() => handleRemove(item.id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="cart-summary-col">
            <div style={s.summaryBox} className="cart-summary-box">
              <div style={s.summaryTitle}>Order Summary</div>

              <div style={s.summaryRow}>
                <span>Subtotal</span>
                <span style={{ color: textColor, fontWeight: '500' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery Info</span>
                <span style={{ fontWeight: '600', color: textColor }}>Free delivery nationwide</span>
              </div>

              <div style={s.divider}></div>

              <div style={s.totalRow}>
                <span style={s.totalLabel}>Estimated Total</span>
                <span style={s.totalValue}>{formatPrice(total)}</span>
              </div>

              <button onClick={() => navigate('/checkout')} disabled={cartItems.length === 0} style={{...s.checkoutBtn, opacity: cartItems.length === 0 ? 0.5 : 1, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'}}>
                <ShieldCheck size={16} /> Checkout Securely
              </button>

              <div style={s.continueLink} onClick={() => brand ? navigate(`/shop-brand/${brand.id}`) : navigate(-1)}>
                <ArrowLeft size={14} /> Continue Shopping
              </div>
            </div>

            <div style={s.trustBadges}>
              <div style={s.trustBadge}>
                <ShieldCheck size={18} color="#555" />
                <div style={s.trustBadgeLabel}>Secure<br />Payment</div>
              </div>
              <div style={s.trustBadge}>
                <Truck size={18} color="#555" />
                <div style={s.trustBadgeLabel}>Fast<br />Delivery</div>
              </div>
              <div style={s.trustBadge}>
                <CreditCard size={18} color="#555" />
                <div style={s.trustBadgeLabel}>Multiple<br />Options</div>
              </div>
            </div>
          </div>
        </div>

        {/* You may also desire */}
        <div style={s.recommendations}>
          <h2 style={s.recTitle}>You may also desire</h2>

          <div style={s.recGrid} className="rec-grid">
            {recommendedProducts.map((prod, idx) => {
              if (idx === 0) {
                 return (
                  <div key={prod.id} style={s.featureCard} onClick={() => navigate(`/product?id=${prod.id}`)} >
                    <div style={s.featureTag}>Discover</div>
                    <div style={s.featureTitle}>{prod.title}</div>
                    <div style={s.featureDesc}>{prod.description || 'A timeless addition to your collection.'}</div>
                    <div style={s.featureLink}>Explore Asset</div>
                    <div style={s.featureImageWrap}>
                      <img src={prod.image_url} alt={prod.title} style={s.featureImg} />
                    </div>
                  </div>
                 )
              } else {
                 return (
                  <div key={prod.id} style={s.smallCard} onClick={() => navigate(`/product?id=${prod.id}`)}>
                    <div style={s.smallImgWrap}>
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} style={s.smallImg} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#111' }}></div>
                      )}
                    </div>
                    <div style={s.smallTitle}>{prod.title}</div>
                    <div style={s.smallPrice}>{formatPrice(prod.price)}</div>
                  </div>
                 )
              }
            })}
            {recommendedProducts.length === 0 && <div style={{ color: mutedColor }}>No other assets available.</div>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{...s.footer, padding: '0 80px'}} className="cart-footer">
        <div style={s.footerLeft}>
          <div style={s.footerLogo}>{brand ? brand.brand_name : 'Digital Atelier'}</div>
          <div style={s.copyright}>© {new Date().getFullYear()} {brand ? brand.brand_name : 'Digital Atelier'}. All rights reserved.</div>
        </div>
        <div style={s.footerLinks} className="footer-links">
          <a style={s.footerLinkItem}>Privacy Policy</a>
          <a style={s.footerLinkItem}>Terms of Service</a>
          <a style={s.footerLinkItem}>Shipping & Returns</a>
          <a style={s.footerLinkItem}>Sustainability</a>
        </div>
        <div style={s.footerIcons}>
          <Globe size={16} />
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ borderBottom: '1.5px solid #333', width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
