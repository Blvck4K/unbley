import React from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, HeadphonesIcon, TrendingUp, Package, BarChart3, CheckCircle2, ShoppingBag, ArrowUpRight, Edit, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Activation() {
  const brandColor = '#06acf8ff';
  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column', opacity: 0.5, pointerEvents: 'none' },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 40px', color: active ? '#FFF' : '#888', backgroundColor: active ? '#111' : 'transparent', borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '600' : '400', letterSpacing: '0.05em', transition: 'all 0.2s', textTransform: 'uppercase', textDecoration: 'none' }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden' },

    main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' },

    topBanner: { backgroundColor: '#111', borderBottom: '1px solid #1F1F1F', padding: '16px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 },
    topBannerText: { color: '#FFF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' },
    topBannerBtn: { backgroundColor: brandColor, color: '#000', padding: '10px 20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px' },

    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F' },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '12px' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '10px 16px', width: '320px', border: '1px solid #1F1F1F' },
    searchInput: { background: 'transparent', border: 'none', color: '#FFF', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '32px' },
    premiumBadge: { color: brandColor, fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', padding: '4px 8px', border: `1px solid ${brandColor}` },

    contentWrap: { flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    blurredBg: { display: 'flex', flexDirection: 'column', filter: 'blur(3px)', opacity: 0.6, pointerEvents: 'none', height: '100%' },
    blurredContent: { padding: '80px', flex: 1, overflowY: 'hidden' },

    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 5, 5, 0.6)', zIndex: 10, overflowY: 'auto', padding: '40px' },
    modal: { backgroundColor: '#0A0A0A', border: '1px solid #1F1F1F', width: '100%', maxWidth: '540px', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', padding: '48px', position: 'relative' },

    stepLabel: { fontSize: '10px', fontWeight: '700', color: brandColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    modalTitle: { fontFamily: '"Playfair Display", serif', fontSize: '32px', color: '#FFF', marginBottom: '12px' },
    modalDesc: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '40px' },

    priceBox: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '24px', borderRadius: '8px', marginBottom: '32px', textAlign: 'center' },
    priceLabel: { fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
    priceValue: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF', marginBottom: '4px' },
    priceOriginal: { fontSize: '14px', color: '#666', textDecoration: 'line-through', marginRight: '8px' },
    priceSavings: { fontSize: '12px', color: '#10B981', fontWeight: '600' },

    unlocksTitle: { fontSize: '11px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' },
    unlockList: { listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' },
    unlockItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: '#CCC', lineHeight: '1.4' },

    activateBtn: { width: '100%', backgroundColor: brandColor, color: '#000', padding: '18px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '6px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },

    // Abstracted Dashboard styles just for background visuals
    sectionLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginBottom: '16px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' },
    mainTitle: { fontFamily: '"Playfair Display", serif', fontSize: '48px', fontWeight: '400', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.2' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '64px' },
    card: { backgroundColor: '#111', padding: '32px', border: '1px solid #1F1F1F' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    cardTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase' },
    cardValue: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF' },
    cardSubtitle: { fontSize: '11px', color: '#888', marginTop: '12px' }
  };

  return (
    <PageTransition>
      <div style={s.page} className="act-page">
      <style>{`
        @media (max-width: 768px) {
          .act-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .act-sidebar { display: none !important; }
          
          .act-top-banner { padding: 24px 20px !important; flex-direction: column !important; gap: 16px !important; text-align: center; }
          .act-top-banner button { width: 100%; padding: 14px !important; }
          
          .act-header { height: auto !important; padding: 24px 20px !important; flex-wrap: wrap; gap: 16px; justify-content: center; }
          .act-search { display: none !important; }
          
          .act-blurred-content { padding: 24px 20px !important; }
          
          .act-overlay { padding: 24px 16px !important; align-items: flex-start !important; overflow-y: auto !important; position: absolute !important; display: block !important; }
          .act-modal { padding: 48px 24px !important; margin: 40px auto; max-width: 100%; box-sizing: border-box; }
          .act-modal-badge { top: -20px !important; padding: 12px 16px !important; width: 90%; box-sizing: border-box; text-align: center; font-size: 10px !important; transform: translateX(-50%) !important; left: 50% !important; }
          .act-modal-title { font-size: 28px !important; text-align: center; }
          .act-modal-desc { text-align: center; font-size: 13px !important; }
          
          .act-price-box { padding: 20px !important; }
          .act-price-value { font-size: 32px !important; }
          
          .act-unlock-item { font-size: 12px !important; }
          .act-activate-btn { padding: 16px !important; }
        }
      `}</style>
      {/* Sidebar - Blurred/Disabled visually via opacity & pointerEvents */}
      <div style={s.sidebar} className="act-sidebar">
        <div style={s.logoContainer}>
          <div style={s.logo}>Zizzystores.</div>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
        </div>
        <div style={s.nav}>
          <div style={s.navItem(true)} title="Activate your store to unlock this feature"><LayoutGrid size={16} /> Overview <Lock size={12} style={{ marginLeft: 'auto' }} /></div>
          <div style={s.navItem(false)} title="Activate your store to unlock this feature"><User size={16} /> Profile <Lock size={12} style={{ marginLeft: 'auto' }} /></div>
          <div style={s.navItem(false)} title="Activate your store to unlock this feature"><Edit size={16} /> Edit <Lock size={12} style={{ marginLeft: 'auto' }} /></div>
          <div style={{ ...s.navItem(false), marginTop: '48px' }}><HeadphonesIcon size={16} /> Customer Service</div>
        </div>
        <div style={s.userProfile}>
          <div style={s.userAvatar}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Julian Vane" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Julian Vane</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Brand Director</div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={s.main}>
        {/* Top Lock Banner */}
        <div style={s.topBanner} className="act-top-banner">
          <div style={s.topBannerText}>
            <Lock size={16} color={brandColor} />
            Your store is not active yet. Complete your setup to start selling.
          </div>
          <Link to="/finalize-activation" style={{ textDecoration: 'none' }}>
            <button style={s.topBannerBtn}>Activate My Store (₦30k / $30)</button>
          </Link>
        </div>

        {/* Content Wrapper for Blur + Modal */}
        <div style={s.contentWrap}>
          {/* Blurred Background Dashboard */}
          <div style={s.blurredBg}>
            {/* Header */}
            <div style={s.header} className="act-header">
              <div style={s.headerTitle}>Dashboard <Lock size={16} color="#666" /></div>
              <div style={s.searchBar} className="act-search">
                <Search size={14} color="#666" />
                <input type="text" placeholder="SEARCH ..." style={s.searchInput} disabled />
              </div>
              <div style={s.headerActions}>
                <Bell size={16} color="#888" />
                <Moon size={16} color="#888" />
                <div style={s.premiumBadge}>LOCKED</div>
              </div>
            </div>

            <div style={s.blurredContent} className="act-blurred-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1F1F1F', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', border: '1px solid #333', backgroundColor: '#111' }}></div>
                <div>
                  <div style={s.sectionLabel}>Brand Profile</div>
                  <h1 style={{ ...s.mainTitle, fontSize: '36px', marginBottom: '16px' }}>Zizzy W3ars</h1>
                  <div style={{ display: 'flex', gap: '24px', color: '#888', fontSize: '12px' }}>
                    <div><span style={{ color: '#FFF' }}>Email:</span> contact@zizzywears.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={s.statsGrid}>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <TrendingUp size={14} color="#FFF" />
                  <div style={s.cardTitle}>+0.0% THIS MONTH</div>
                </div>
                <div style={s.cardTitle}>Total Sales</div>
                <div style={s.cardValue}>₦0</div>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <Package size={18} color="#888" />
                </div>
                <div style={s.cardTitle}>Stock Portfolio</div>
                <div style={s.cardValue}>0</div>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <BarChart3 size={18} color="#888" />
                </div>
                <div style={s.cardTitle}>Your Traffic</div>
                <div style={s.cardValue}>0</div>
              </div>
              </div>
            </div>
          </div>

          {/* Foreground Modal Overlay */}
          <div style={s.overlay} className="act-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={s.modal} 
              className="act-modal"
            >
              <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', padding: '12px 24px', borderRadius: '24px', fontSize: '11px', color: '#FFF', fontWeight: '600', letterSpacing: '0.05em', border: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '8px' }} className="act-modal-badge">
                <Lock size={14} color={brandColor} /> Activate your store to start selling and unlock your dashboard
              </div>

              <div style={s.stepLabel}>Step 2 of 2: Activate Your Store</div>
              <h2 style={s.modalTitle} className="act-modal-title">Activate Your Store</h2>
              <div style={{ fontSize: '15px', color: brandColor, fontWeight: '500', marginBottom: '16px', letterSpacing: '-0.01em' }}>You’re one step away from launching your business.</div>
              <p style={s.modalDesc}>
                Your store is ready. Complete activation to go live, accept payments, and start selling.
              </p>

              <div style={s.priceBox}>
                <div style={s.priceLabel}>Store Activation (First Year)</div>
                <div style={s.priceValue}>₦30,000 / $30</div>
                <div>
                  <span style={s.priceOriginal}>₦50,000 / $60</span>
                  <span style={s.priceSavings}>40% OFF – Limited Launch Offer</span>
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '12px' }}>
                  Renewal: ₦50,000 / $60 per year
                </div>
              </div>

              <h3 style={s.unlocksTitle}>What You Unlock After Activation:</h3>
              <ul style={s.unlockList} className="act-unlock-list">
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Start making sales within 24 hours</strong></span>
                </li>
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Your store goes <strong>live instantly</strong></span>
                </li>
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Receive payments directly to your account (Paystack / Flutterwave)</span>
                </li>
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Custom domain setup and SSL</span>
                </li>
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Full access to the Admin Dashboard & Analytics</span>
                </li>
                <li style={s.unlockItem} className="act-unlock-item">
                  <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Complete control of your store's inventory and layout</span>
                </li>
              </ul>

              <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.05em' }}>⚡ Limited spots remaining at this price</div>
              <Link to="/finalize-activation" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={s.activateBtn} 
                  className="act-activate-btn"
                >
                  Launch My Store Now <ArrowUpRight size={16} />
                </motion.button>
              </Link>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '12px', textAlign: 'center' }}>One-time activation — no hidden fees</div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888' }}><Lock size={12} /> Secure payment via Paystack</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888' }}><Zap size={12} color="#F59E0B" /> Instant activation after payment</div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#666', borderTop: '1px solid #1F1F1F', paddingTop: '24px' }}>
                Join <span style={{ color: '#FFF', fontWeight: 'bold' }}>100+ brands</span> already selling on Zizzystores
              </div>
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: brandColor, cursor: 'pointer', textDecoration: 'underline' }}>
                Already paid? Refresh to unlock dashboard
              </div>
            </motion.div>
          </div>
        </div>

      </div>
      </div>
    </PageTransition>
  );
}
