import React from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, HeadphonesIcon, TrendingUp, Package, BarChart3, CheckCircle2, ChevronRight, ShoppingBag, ArrowUpRight, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const brandColor = '#06acf8ff';
  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column' },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 40px', color: active ? '#FFF' : '#888', backgroundColor: active ? '#111' : 'transparent', borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '600' : '400', letterSpacing: '0.05em', transition: 'all 0.2s', textTransform: 'uppercase', textDecoration: 'none' }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F' },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', fontStyle: 'italic' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', padding: '10px 16px', width: '320px', border: '1px solid #1F1F1F' },
    searchInput: { background: 'transparent', border: 'none', color: '#FFF', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '32px' },
    premiumBadge: { color: brandColor, fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', padding: '4px 8px', border: `1px solid ${brandColor}` },
    content: { padding: '80px', flex: 1, overflowY: 'auto' },
    sectionLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginBottom: '16px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' },
    mainTitle: { fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '48px', fontWeight: '400', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.2' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '64px' },
    card: { backgroundColor: '#111', padding: '32px', border: '1px solid #1F1F1F', position: 'relative', overflow: 'hidden' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    cardTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase' },
    cardValue: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF' },
    cardSubtitle: { fontSize: '11px', color: '#888', marginTop: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' },
    banner: { marginTop: '64px', position: 'relative', display: 'flex', backgroundColor: '#111', padding: '64px', border: '1px solid #1F1F1F' },
    bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at right, rgba(255, 255, 255, 0.03) 0%, transparent 60%)', pointerEvents: 'none' },
    bannerContent: { flex: 1, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
    bannerBadge: { backgroundColor: brandColor, color: '#000', fontSize: '10px', fontWeight: '700', padding: '8px 16px', letterSpacing: '0.1em', marginBottom: '32px', textTransform: 'uppercase' },
    bannerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '40px', fontStyle: 'italic', color: '#FFF', lineHeight: '1.2', marginBottom: '24px' },
    bannerDesc: { color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '400px', marginBottom: '40px' },
    upgradeBtn: { backgroundColor: brandColor, color: '#000', padding: '16px 32px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
    bannerCard: { width: '320px', backgroundColor: '#0A0A0A', padding: '40px', border: '1px solid #1F1F1F', zIndex: 1, transform: 'rotate(2deg)', alignSelf: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' },
    bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '64px' },
    listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #1F1F1F', ':last-child': { borderBottom: 'none' } },
    statusBadge: (status) => ({ fontSize: '10px', fontWeight: '700', padding: '6px 12px', border: `1px solid ${status === 'green' ? brandColor : '#333'}`, color: status === 'green' ? '#000' : '#888', backgroundColor: status === 'green' ? brandColor : 'transparent', textTransform: 'uppercase', letterSpacing: '0.1em' }),
    progressRow: { marginBottom: '32px' },
    progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '16px' },
    progressBar: { height: '1px', backgroundColor: '#1F1F1F', width: '100%', position: 'relative' },
    progressFill: (color, width) => ({ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: color, width: width })
  };

  return (
    <div style={s.page} className="dash-page">
      <style>{`
        @media (max-width: 768px) {
          .dash-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .dash-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #1F1F1F; }
          .dash-logo-container { padding: 24px !important; flex-direction: row !important; justify-content: space-between; align-items: center; }
          .dash-nav { display: flex; overflow-x: auto; padding-bottom: 8px !important; white-space: nowrap; }
          .dash-nav a, .dash-nav div { border-left: none !important; border-bottom: 3px solid transparent; padding: 12px 24px !important; margin-top: 0 !important; }
          .dash-nav a[style*="border-left"] { border-bottom: 3px solid #06acf8ff !important; }
          .dash-user-profile { display: none !important; } /* Hide heavy user profile on mobile nav */
          
          .dash-header { height: auto !important; padding: 24px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; }
          .dash-search-bar { width: 100% !important; order: 3; }
          
          .dash-content { padding: 24px !important; overflow: visible !important; }
          .dash-brand-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; padding-bottom: 24px !important; }
          .dash-brand-info { flex-direction: column !important; gap: 16px !important; }
          .dash-live-domain { align-items: flex-start !important; width: 100%; box-sizing: border-box; }
          
          .dash-stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-top: 32px !important; }
          .dash-bottom-grid { grid-template-columns: 1fr !important; margin-top: 32px !important; }
          .dash-list-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px; padding: 24px !important; }
          .dash-list-row > div:last-child { text-align: left !important; }
        }
      `}</style>
      {/* Sidebar */}
      <div style={s.sidebar} className="dash-sidebar">
        <div style={s.logoContainer} className="dash-logo-container">
          <div style={s.logo}>Zizzystores.</div>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
        </div>

        <div style={s.nav} className="dash-nav">
          <Link to="/dashboard" style={s.navItem(true)}><LayoutGrid size={16} /> Overview</Link>
          <Link to="/profile" style={s.navItem(false)}><User size={16} /> Profile</Link>
          <Link to="/edit" style={s.navItem(false)}><Edit size={16} /> Edit</Link>
          <div style={{ ...s.navItem(false), marginTop: '48px' }}><HeadphonesIcon size={16} /> Customer Service</div>
        </div>

        <div style={s.userProfile} className="dash-user-profile">
          <div style={s.userAvatar}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Julian Vane" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Julian Vane</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Brand Director</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header} className="dash-header">
          <div style={s.headerTitle}>Dashboard</div>
          <div style={s.searchBar} className="dash-search-bar">
            <Search size={14} color="#666" />
            <input type="text" placeholder="SEARCH ..." style={s.searchInput} />
          </div>
          <div style={s.headerActions}>
            <Bell size={16} color="#888" cursor="pointer" />
            <Moon size={16} color="#888" cursor="pointer" />
            <div style={s.premiumBadge}>MEMBERSHIP</div>
          </div>
        </div>

        {/* Content Area */}
        <div style={s.content} className="dash-content">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1F1F1F', paddingBottom: '40px' }} className="dash-brand-header">
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="dash-brand-info">
              <div style={{ width: '100px', height: '100px', border: '1px solid #333', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop" alt="Brand Logo" style={{ width: '100%', height: '100%', objectFit: '', filter: 'grayscale(0%)' }} />
              </div>
              <div>
                <div style={s.sectionLabel}>
                  <div style={{ width: '2px', height: '12px', backgroundColor: '#FFF' }}></div>
                  Brand Profile
                </div>
                <h1 style={{ ...s.mainTitle, fontSize: '36px', marginBottom: '16px', lineHeight: '1' }}>Zizzy W3ars</h1>
                <div style={{ display: 'flex', gap: '24px', color: '#888', fontSize: '12px', letterSpacing: '0.05em' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFF', fontWeight: '600' }}>Email:</span> contact@zizzywears.com
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFF', fontWeight: '600' }}>Phone:</span> +1 (555) 123-4567
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '24px', border: '1px solid #1F1F1F', backgroundColor: '#111', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="dash-live-domain">
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Live Domain</div>
              <a href="https://zizzywears.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#FFF', textDecoration: 'none', borderBottom: '1px solid #FFF', paddingBottom: '2px', display: 'flex', alignItems: 'center' }}>
                zizzywears.com <ArrowUpRight size={14} style={{ marginLeft: '6px' }} />
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={s.statsGrid} className="dash-stats-grid">
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={{ border: '1px solid #333', padding: '8px' }}>
                  <TrendingUp size={14} color="#FFF" />
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>+12.4% THIS MONTH</div>
              </div>
              <div style={s.cardTitle}>Total Sales</div>
              <div style={s.cardValue}>₦12,450,000</div>

              <div style={{ marginTop: '32px', width: '100%', height: '1px', backgroundColor: '#1F1F1F', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '60%', height: '1px', backgroundColor: '#FFF' }}></div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}>
                <Package size={18} color="#888" />
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ACTIVE</div>
              </div>
              <div style={s.cardTitle}>Stock Portfolio</div>
              <div style={s.cardValue}>142</div>
              <div style={s.cardSubtitle}>Across 4 collections</div>
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}>
                <BarChart3 size={18} color="#888" />
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LIVE NOW</div>
              </div>
              <div style={s.cardTitle}>Your Traffic</div>
              <div style={s.cardValue}>8.2k</div>
              <div style={s.cardSubtitle}>Visitors</div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div style={s.bottomGrid} className="dash-bottom-grid">
            <div style={{ backgroundColor: '#111', border: '1px solid #1F1F1F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #1F1F1F' }}>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', fontStyle: 'italic' }}>Recent Orders</div>
                <div style={{ fontSize: '10px', color: '#FFF', letterSpacing: '0.1em', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', borderBottom: '1px solid #FFF' }}>View Full Ledger</div>
              </div>

              <div style={s.listRow} className="dash-list-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '48px', height: '48px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={18} color="#666" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>ORD-22485</div>
                    <div style={{ fontSize: '14px', color: '#FFF' }}>Velvet Minimalist Armchair</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>₦450,000</div>
                  <div style={s.statusBadge('green')}>Paid & Ready</div>
                </div>
              </div>

              <div style={s.listRow} className="dash-list-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '48px', height: '48px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={18} color="#666" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>ORD-22482</div>
                    <div style={{ fontSize: '14px', color: '#FFF' }}>Sculptural Glass Vessel</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>₦85,000</div>
                  <div style={{ ...s.statusBadge('gray') }}>Processing</div>
                </div>
              </div>

              <div style={s.listRow} className="dash-list-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '48px', height: '48px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={18} color="#666" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>ORD-22480</div>
                    <div style={{ fontSize: '14px', color: '#FFF' }}>Monolith Concrete Table</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>₦1,200,000</div>
                  <div style={{ ...s.statusBadge('green') }}>Dispatched</div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}
