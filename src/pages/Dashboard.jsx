import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, Headphones, TrendingUp, Package, BarChart3, CheckCircle2, ChevronRight, ShoppingBag, ArrowUpRight, Edit, Menu, X, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AdminChat from '../components/AdminChat';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'support'

  const [profileData, setProfileData] = useState({
    brand_name: 'Your Brand',
    owner_name: 'Brand Owner',
    email_address: 'business@example.com',
    phone_number: 'N/A',
    website_url: '',
    logo_url: ''
  });

  // Real-Time Store Metrics
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    activeStock: 0,
    totalTraffic: 0,
    recentOrders: []
  });

  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        const { data: pData, error: pError } = await supabase
          .from('brand_profiles')
          .select('*') 
          .eq('id', user.id)
          .single();

        if (pError) console.warn("Dashboard: Initial profile fetch warning:", pError.message);

        if (pData) {
          setProfileData(prev => ({
            ...prev,
            ...Object.fromEntries(Object.entries(pData).filter(([_, v]) => v != null && v !== ''))
          }));
        }

        const { data: salesData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('brand_id', user.id);
        const calcSales = salesData ? salesData.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) : 0;

        const { count: stockCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('brand_id', user.id)
          .eq('status', 'active');

        const { count: trafficCount } = await supabase
          .from('store_traffic')
          .select('*', { count: 'exact', head: true })
          .eq('brand_id', user.id);

        const { data: lastOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        setMetrics({
          totalSales: calcSales,
          activeStock: stockCount || 0,
          totalTraffic: trafficCount || 0,
          recentOrders: lastOrders || []
        });

      } catch (err) {
        console.error("Error loading live dashboard data:", err);
      } finally {
        setLoadingMetrics(false);
      }
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchDashboardData();
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const brandColor = '#06acf8ff';

  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', height: isMobile ? 'auto' : '100vh', minHeight: '100vh', overflow: isMobile ? 'visible' : 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column' },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 40px', color: active ? '#FFF' : '#888', backgroundColor: active ? '#111' : 'transparent', borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '600' : '400', letterSpacing: '0.05em', transition: 'all 0.2s', textTransform: 'uppercase', textDecoration: 'none' }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
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
    bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '64px' },
    listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #1F1F1F', ':last-child': { borderBottom: 'none' } },
    statusBadge: (status) => ({ fontSize: '10px', fontWeight: '700', padding: '6px 12px', border: `1px solid ${status === 'green' ? brandColor : status === 'gray' ? '#444' : '#333'}`, color: status === 'green' ? '#000' : status === 'gray' ? '#CCC' : '#888', backgroundColor: status === 'green' ? brandColor : 'transparent', textTransform: 'uppercase', letterSpacing: '0.1em' })
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const formatCompact = (num) => {
    if (num < 1000) return num;
    return (num / 1000).toFixed(1) + 'k';
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <PageTransition>
      <div style={s.page} className="dash-page">
        <style>{`
          @media (max-width: 768px) {
            .dash-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
            .dash-sidebar { 
              position: fixed !important; 
              top: 0 !important; 
              left: ${isSidebarOpen ? '0' : '-100%'} !important; 
              width: 280px !important; 
              height: 100vh !important; 
              z-index: 1000 !important; 
              background-color: #0A0A0A !important;
              transition: left 0.3s ease !important;
              box-shadow: 10px 0 30px rgba(0,0,0,0.5) !important;
            }
            .dash-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background-color: rgba(0,0,0,0.7) !important;
              z-index: 999 !important;
              display: ${isSidebarOpen ? 'block' : 'none'} !important;
            }
            .dash-logo-container { padding: 24px !important; }
            .dash-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
            .dash-nav a, .dash-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
            .dash-user-profile { display: flex !important; margin-top: auto; } 
            
            .dash-header { height: auto !important; padding: 24px 20px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; position: sticky; top: 0; background: #0A0A0A; z-index: 100; border-bottom: 1px solid #1F1F1F; }
            .dash-search-bar { width: 100% !important; order: 3; margin-top: 8px; }
            .dash-header-actions { width: 100%; order: 4; justify-content: space-between; padding-top: 12px; border-top: 1px solid #1F1F1F; }
            
            .dash-content { padding: 24px 20px !important; overflow: visible !important; }
            .dash-brand-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
            .dash-brand-info { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
            .dash-brand-info h1 { font-size: 28px !important; }
            .dash-live-domain { width: 100%; align-items: flex-start !important; padding: 20px !important; }
            
            .dash-stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-top: 40px !important; }
            .dash-card { padding: 24px !important; }
            .dash-card-value { font-size: 28px !important; }
            
            .dash-bottom-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-top: 40px !important; }
            .dash-list-row { padding: 20px !important; flex-direction: column; align-items: flex-start !important; gap: 16px; }
            .dash-list-row > div:last-child { text-align: left !important; width: 100%; display: flex; justify-content: space-between; align-items: center; }
            .mobile-only { display: block !important; }
          }
          @media (min-width: 769px) {
            .mobile-only { display: none !important; }
          }
        `}</style>
        {/* Mobile Sidebar Overlay */}
        <div className="dash-overlay" onClick={() => setIsSidebarOpen(false)}></div>

        {/* Sidebar */}
        <div style={s.sidebar} className="dash-sidebar">
          <div style={{ ...s.logoContainer, position: 'relative' }} className="dash-logo-container">
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
              className="mobile-only"
            >
              <X size={24} />
            </button>
            <Link to="/" style={{ textDecoration: 'none' }}><div style={s.logo}>Zizzystores.</div></Link>
            <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
          </div>

          <div style={s.nav} className="dash-nav">
            <div onClick={() => setActiveTab('overview')} style={s.navItem(activeTab === 'overview')}><LayoutGrid size={16} /> Overview</div>
            <Link to="/profile" style={s.navItem(false)}><User size={16} /> Profile</Link>
            <Link to="/edit" style={s.navItem(false)}><Edit size={16} /> Edit</Link>
            {profileData.is_admin && (
              <div onClick={() => setActiveTab('support')} style={s.navItem(activeTab === 'support')}><MessageSquare size={16} /> Support</div>
            )}
          </div>

          <div style={s.userProfile} className="dash-user-profile">
            <div style={s.userAvatar}>
              {profileData.logo_url ? (
                <img src={profileData.logo_url} alt={profileData.owner_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#FFF' }}>{profileData.owner_name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{profileData.owner_name}</div>
              <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Brand Director</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={s.main}>
          {/* Header */}
          <div style={s.header} className="dash-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setIsSidebarOpen(true)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
                className="mobile-only"
              >
                <Menu size={24} />
              </button>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #1F1F1F', color: '#888', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#333'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#1F1F1F'; }}>
                <ArrowLeft size={18} />
              </Link>
              <div style={s.headerTitle}>{activeTab === 'overview' ? 'Dashboard' : 'Customer Support'}</div>
            </div>
            <div style={s.searchBar} className="dash-search-bar">
              <Search size={14} color="#666" />
              <input type="text" placeholder="SEARCH ..." style={s.searchInput} />
            </div>
            <div style={s.headerActions} className="dash-header-actions">
              <Link to={`/shop-brand/${user?.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ ...s.premiumBadge, backgroundColor: brandColor, color: '#000', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', border: 'none', borderRadius: '4px', boxShadow: `0 4px 12px ${brandColor}33` }}>
                  <Store size={16} /> MANAGE STORE
                </div>
              </Link>
            </div>
          </div>

          {/* Content Area */}
          <div style={s.content} className="dash-content">

            {activeTab === 'overview' ? (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1F1F1F', paddingBottom: '40px' }} className="dash-brand-header">
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="dash-brand-info">
                    <div style={{ width: '100px', height: '100px', border: '1px solid #333', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {profileData.logo_url ? (
                        <img src={profileData.logo_url} alt="Brand Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '48px', color: '#FFF', fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>{profileData.brand_name?.charAt(0)?.toUpperCase() || 'Z'}</span>
                      )}
                    </div>
                    <div>
                      <div style={s.sectionLabel}>
                        <div style={{ width: '2px', height: '12px', backgroundColor: '#FFF' }}></div>
                        Brand Profile
                      </div>
                      <h1 style={{ ...s.mainTitle, fontSize: '36px', marginBottom: '16px', lineHeight: '1' }}>{profileData.brand_name}</h1>
                      <div style={{ display: 'flex', gap: '24px', color: '#888', fontSize: '12px', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#FFF', fontWeight: '600' }}>Email:</span> {profileData.email_address}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#FFF', fontWeight: '600' }}>Phone:</span> {profileData.phone_number}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '24px', border: '1px solid #1F1F1F', backgroundColor: '#111', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="dash-live-domain">
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Live Domain</div>
                    {profileData.website_url ? (
                      <a href={profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#FFF', textDecoration: 'none', borderBottom: '1px solid #FFF', paddingBottom: '2px', display: 'flex', alignItems: 'center' }}>
                        {profileData.website_url.replace(/^https?:\/\//, '')} <ArrowUpRight size={14} style={{ marginLeft: '6px' }} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>activation pending</span>
                    )}
                  </div>
                </motion.div>

                {/* Dynamic Real-Time Stats Grid */}
                <div style={s.statsGrid} className="dash-stats-grid">
                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <div style={{ border: '1px solid #333', padding: '8px' }}>
                        <TrendingUp size={14} color="#FFF" />
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {metrics.totalSales > 0 ? '+12.4% THIS MONTH' : 'NO DATA YET'}
                      </div>
                    </div>
                    <div style={s.cardTitle}>Total Sales</div>
                    <div style={s.cardValue}>{formatMoney(metrics.totalSales)}</div>

                    <div style={{ marginTop: '32px', width: '100%', height: '1px', backgroundColor: '#1F1F1F', position: 'relative' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: metrics.totalSales > 0 ? '60%' : '0%' }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                        style={{ position: 'absolute', top: 0, left: 0, height: '1px', backgroundColor: '#FFF' }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <Package size={18} color="#888" />
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{metrics.activeStock > 0 ? 'ACTIVE' : 'EMPTY'}</div>
                    </div>
                    <div style={s.cardTitle}>Stock Portfolio</div>
                    <div style={s.cardValue}>{metrics.activeStock}</div>
                    <div style={s.cardSubtitle}>Total Product Listings</div>
                  </motion.div>

                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <BarChart3 size={18} color="#888" />
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{metrics.totalTraffic > 0 ? 'LIVE NOW' : 'AWAITING TRAFFIC'}</div>
                    </div>
                    <div style={s.cardTitle}>Your Traffic</div>
                    <div style={s.cardValue}>{formatCompact(metrics.totalTraffic)}</div>
                    <div style={s.cardSubtitle}>Unique Store Visitors</div>
                  </motion.div>
                </div>

                {/* Bottom Ledger Grid */}
                <div style={s.bottomGrid} className="dash-bottom-grid">
                  <motion.div variants={itemVariants} style={{ backgroundColor: '#111', border: '1px solid #1F1F1F' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #1F1F1F' }}>
                      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', fontStyle: 'italic' }}>Recent Orders</div>
                      {metrics.recentOrders.length > 0 && <div style={{ fontSize: '10px', color: '#FFF', letterSpacing: '0.1em', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', borderBottom: '1px solid #FFF' }}>View Full Ledger</div>}
                    </div>

                    {metrics.recentOrders.length > 0 ? (
                      metrics.recentOrders.map((order, index) => (
                        <motion.div key={order.id} variants={itemVariants} style={s.listRow} className="dash-list-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '48px', height: '48px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ShoppingBag size={18} color="#666" />
                            </div>
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>{order.order_number}</div>
                              <div style={{ fontSize: '14px', color: '#FFF' }}>{order.product_name_snapshot}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>{formatMoney(order.total_amount)}</div>
                            <div style={s.statusBadge(order.status === 'processing' ? 'gray' : order.status === 'completed' ? 'green' : 'gray')}>
                              {order.status === 'processing' ? 'Processing' : order.status === 'completed' ? 'Paid & Ready' : order.status}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ padding: '64px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#1A1A1A', borderRadius: '50%', marginBottom: '24px' }}>
                          <Package size={24} color="#666" />
                        </div>
                        <div style={{ fontSize: '14px', color: '#FFF', marginBottom: '8px' }}>Your Ledger is Empty</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Incoming orders will securely populate here.</div>
                      </div>
                    )}

                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div style={{ height: 'calc(100vh - 160px)' }}>
                <AdminChat />
              </div>
            )}

          </div>
        </div>
      </div>
    </PageTransition>
  );
}

