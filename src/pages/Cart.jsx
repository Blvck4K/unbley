import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Truck, Globe, CreditCard, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const accentColor = '#0F2C59'; // Deep luxury blue for titles and buttons
  const bgMain = '#FAFAFA'; // Light grey page bg
  const dangerColor = '#D83A3A';

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Ethereal Ceramic Vessel',
      variant: 'Artist Edition • Sandstone',
      price: 240000,
      qty: 1,
      img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
    },
    {
      id: 2,
      name: 'Signature Leather Folio',
      variant: 'Italian Calfskin • Midnight',
      price: 85000,
      qty: 2,
      img: 'https://images.unsplash.com/photo-1601614838644-8395edb7d3bb?w=600&q=80',
    },
    {
      id: 3,
      name: 'Mano Chronograph',
      variant: 'Brushed Steel • Slate Grey',
      price: 550000,
      qty: 1,
      img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    }
  ]);
  
  const [removedItems, setRemovedItems] = useState([]);

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
  const tax = subtotal * 0.075; // 7.5% estimated tax
  const total = subtotal + tax;

  const s = {
    page: { backgroundColor: bgMain, color: '#111', minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' },

    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: bgMain },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333', position: 'relative' },
    cartBadge: { position: 'absolute', top: '-6px', right: '-8px', backgroundColor: accentColor, color: '#FFF', fontSize: '9px', fontWeight: 'bold', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },

    // Main Content
    content: { maxWidth: '1400px', margin: '0 auto' },

    pageTitle: { fontFamily: '"Inter", sans-serif', fontSize: '44px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 16px 0', color: '#111' },
    pageSubtitle: { fontSize: '13px', color: '#666', lineHeight: '1.6', maxWidth: '400px', marginBottom: '48px' },

    // Two Col Layout
    layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '64px' },

    // Cart Items List
    itemsContainer: { display: 'flex', flexDirection: 'column', gap: '24px' },
    cartItem: { backgroundColor: '#FFF', padding: '24px', display: 'flex', gap: '32px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    itemImageWrap: { width: '160px', height: '160px', backgroundColor: '#F0F0F0', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    itemImage: { width: '100%', height: '100%', objectFit: 'cover' },

    itemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    itemNameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
    itemName: { fontSize: '18px', fontWeight: '700', color: accentColor },
    itemPrice: { fontSize: '15px', fontWeight: '700', color: '#111' },
    itemVariant: { fontSize: '11px', color: '#888', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' },

    itemActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '16px' },
    qtyControl: { display: 'flex', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: '4px' },
    qtyBtn: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'transparent', color: '#555', fontSize: '16px' },
    qtyValue: { fontSize: '13px', fontWeight: '600', width: '24px', textAlign: 'center', color: '#111' },
    itemTotalCalc: { fontSize: '13px', color: '#555', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' },
    removeBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: dangerColor, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', background: 'transparent', border: 'none', letterSpacing: '0.05em' },

    // Order Summary
    summaryBox: { backgroundColor: '#F5F5F7', padding: '40px', borderRadius: '4px' },
    summaryTitle: { fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '32px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#555' },

    divider: { height: '1px', backgroundColor: '#EAEAEA', margin: '24px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    totalLabel: { fontSize: '14px', fontWeight: '700', color: '#111' },
    totalValue: { fontSize: '20px', fontWeight: '700', color: accentColor },

    checkoutBtn: { width: '100%', padding: '16px', backgroundColor: accentColor, color: '#FFF', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    continueLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#FFF', backgroundColor: '#333', padding: '14px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'background-color 0.2s', fontWeight: '600' },

    trustBadges: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' },
    trustBadge: { backgroundColor: '#FFF', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    trustBadgeLabel: { fontSize: '8px', fontWeight: '700', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' },

    undoToast: { backgroundColor: '#333', color: '#FFF', padding: '14px 24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    undoBtn: { background: 'transparent', border: 'none', color: '#4ADE80', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },

    // Recommendations
    recommendations: { marginTop: '80px' },
    recTitle: { fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '32px' },
    recGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' },

    featureCard: { backgroundColor: '#E6E6E8', padding: '40px', borderRadius: '4px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '300px' },
    featureTag: { fontSize: '8px', fontWeight: '700', color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    featureTitle: { fontSize: '24px', fontWeight: '600', color: '#111', marginBottom: '8px' },
    featureDesc: { fontSize: '12px', color: '#555', maxWidth: '200px', lineHeight: '1.6' },
    featureLink: { marginTop: 'auto', fontSize: '11px', fontWeight: '700', color: '#111', textDecoration: 'underline', cursor: 'pointer' },
    featureImageWrap: { position: 'absolute', bottom: '24px', right: '24px', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    featureImg: { width: '100%', height: '100%', objectFit: 'cover' },

    smallCard: { backgroundColor: '#FFF', padding: '24px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' },
    smallImgWrap: { width: '100%', height: '180px', backgroundColor: '#F5F5F5', marginBottom: '16px', overflow: 'hidden' },
    smallImg: { width: '100%', height: '100%', objectFit: 'cover' },
    smallTitle: { fontSize: '12px', fontWeight: '600', color: '#111', marginBottom: '4px' },
    smallPrice: { fontSize: '11px', color: '#666' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', borderTop: '1px solid #EAEAEA', marginTop: '64px' },
    footerLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
    footerLogo: { fontSize: '12px', fontWeight: '700', color: '#111' },
    copyright: { fontSize: '10px', color: '#888' },
    footerLinks: { display: 'flex', gap: '24px', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none' },
    footerIcons: { display: 'flex', gap: '12px', color: '#333' }
  };

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .cart-header, .cart-footer { padding: 16px 24px !important; }
          .cart-content { padding: 32px 24px !important; }
          .cart-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cart-item { flex-direction: column !important; gap: 24px !important; padding: 20px !important; }
          .cart-item-image-wrap { width: 100% !important; height: 280px !important; }
          .cart-item-actions { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .cart-summary-col { position: sticky; bottom: 0; z-index: 100; padding-bottom: 0 !important; }
          .cart-summary-box { background-color: #FFF !important; box-shadow: 0 -4px 30px rgba(0,0,0,0.1) !important; margin: 0 -24px !important; border-radius: 20px 20px 0 0 !important; padding: 32px 24px 24px 24px !important; }
          .rec-grid { grid-template-columns: 1fr !important; }
          .footer-links { display: none !important; }
          .page-title { font-size: 32px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{...s.header, padding: '24px 48px'}} className="cart-header">
        <div style={s.logo}>Digital Atelier</div>
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
              <div style={{ padding: '80px 0', textAlign: 'center', color: '#555', backgroundColor: '#FFF', borderRadius: '4px' }}>
                <ShoppingCart size={48} color="#CCC" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', color: '#111', marginBottom: '8px' }}>Your Cart is Empty</h3>
                <p style={{ fontSize: '14px', marginBottom: '32px' }}>Discover unique items to add to your collection.</p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{...s.continueLink, width: 'auto', padding: '16px 32px'}} onClick={() => navigate('/shop-brand')}>
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
                <span style={{ color: '#111', fontWeight: '500' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Estimated Tax (7.5%)</span>
                <span style={{ color: '#111', fontWeight: '500' }}>{formatPrice(tax)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery Info</span>
                <span style={{ fontWeight: '600', color: '#111' }}>Free delivery nationwide</span>
              </div>

              <div style={s.divider}></div>

              <div style={s.totalRow}>
                <span style={s.totalLabel}>Estimated Total</span>
                <span style={s.totalValue}>{formatPrice(total)}</span>
              </div>

              <button onClick={() => navigate('/checkout')} disabled={cartItems.length === 0} style={{...s.checkoutBtn, opacity: cartItems.length === 0 ? 0.5 : 1, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'}}>
                <ShieldCheck size={16} /> Checkout Securely
              </button>

              <div style={s.continueLink} onClick={() => navigate('/shop-brand')}>
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
            <div style={s.featureCard}>
              <div style={s.featureTag}>Limited Release</div>
              <div style={s.featureTitle}>Atelier Fragrance No. 04</div>
              <div style={s.featureDesc}>Notes of cedar, amber, and rain-washed slate.</div>
              <div style={s.featureLink}>Explore Scent</div>
              <div style={s.featureImageWrap}>
                <img src="https://images.unsplash.com/photo-1594034181467-f27eb663ad92?w=400&q=80" alt="Fragrance" style={s.featureImg} />
              </div>
            </div>

            <div style={s.smallCard}>
              <div style={s.smallImgWrap}>
                <img src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80" alt="Candle" style={s.smallImg} />
              </div>
              <div style={s.smallTitle}>Sculpted Wax Candle</div>
              <div style={s.smallPrice}>{formatPrice(65000)}</div>
            </div>

            <div style={s.smallCard}>
              <div style={s.smallImgWrap}>
                <img src="https://images.unsplash.com/photo-1580828369019-223455b8feab?w=400&q=80" alt="Linen" style={s.smallImg} />
              </div>
              <div style={s.smallTitle}>Organic Linen Throw</div>
              <div style={s.smallPrice}>{formatPrice(120000)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{...s.footer, padding: '0 80px'}} className="cart-footer">
        <div style={s.footerLeft}>
          <div style={s.footerLogo}>Digital Atelier</div>
          <div style={s.copyright}>© 2024 Digital Atelier. All rights reserved.</div>
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
