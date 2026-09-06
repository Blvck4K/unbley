import React, { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, Headphones, TrendingUp, Package, BarChart3, CheckCircle2, ChevronRight, ShoppingBag, ArrowUpRight, Edit, Menu, X, MessageSquare, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AdminChat from '../components/AdminChat';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessModal from '../components/SuccessModal';
import OnboardingModal from '../components/OnboardingModal';
import DashboardTour from '../components/DashboardTour';

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'support'
  const [showSignupSuccessModal, setShowSignupSuccessModal] = useState(false);
  const [signupModalData, setSignupModalData] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(null);
  const [showDashboardTour, setShowDashboardTour] = useState(false);
  const location = useLocation();

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

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: pData, error: pError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

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
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);

    // 1a. Check if user just signed up via Google OAuth
    const isOAuthSignup = params.get('oauth_signup') === 'true';
    if (isOAuthSignup) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      const meta = user?.user_metadata || {};
      const successInfo = {
        name: meta.full_name || meta.name || user?.email?.split('@')[0] || 'Creator',
        email: user?.email || '',
        brandName: meta.full_name || meta.name || 'Your Brand',
        userType: meta.role || 'brand'
      };
      localStorage.setItem('unbley_just_signed_up', JSON.stringify(successInfo));
      setSignupModalData(successInfo);
      setShowSignupSuccessModal(true);
    } else {
      // 1b. Check if user just signed up via email/password
      const justSignedUpRaw = localStorage.getItem('unbley_just_signed_up');
      if (justSignedUpRaw) {
        try {
          const parsed = JSON.parse(justSignedUpRaw);
          setSignupModalData(parsed);
          setShowSignupSuccessModal(true);
        } catch (e) {
          console.error('Error reading signup session:', e);
        }
      } else {
        // 2. Show onboarding if not dismissed
        const forceOnboarding = params.get('onboarding') === 'true';
        const onboardingDismissedKey = `unbley_onboarding_dismissed_${user.id}`;
        if (forceOnboarding || !localStorage.getItem(onboardingDismissedKey)) {
          setShowOnboardingModal(true);
        }
      }
    }
  }, [user, location.search]);

  // Trigger interactive tutorial tour if user hasn't seen it yet and not blocked by modals
  useEffect(() => {
    if (!user || showSignupSuccessModal || showOnboardingModal) return;

    const tourSeenKey = `unbley_dashboard_tour_seen_${user.id}`;
    if (!localStorage.getItem(tourSeenKey)) {
      const timer = setTimeout(() => {
        setShowDashboardTour(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, showSignupSuccessModal, showOnboardingModal]);

  // ── Real-time: re-fetch dashboard whenever brand_profiles or products change ──
  useEffect(() => {
    if (!user) return;

    fetchDashboardData();

    const profileChannel = supabase
      .channel(`dashboard_profile_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brand_profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.new) {
            setProfileData(prev => ({
              ...prev,
              ...Object.fromEntries(Object.entries(payload.new).filter(([_, v]) => v != null && v !== ''))
            }));
          }
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel(`dashboard_products_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `brand_id=eq.${user.id}` },
        () => { fetchDashboardData(); }
      )
      .subscribe();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(productsChannel);
      window.removeEventListener('resize', handleResize);
    };
  }, [user, fetchDashboardData]);

  const brandColor = '#6A3E1F';

  // Profile Completion Meter Calculation
  const isStoreInfoDone = Boolean(profileData?.brand_name && profileData.brand_name !== 'Your Brand' && profileData?.logo_url);
  const isWalletDone = Boolean(profileData?.phone_number && profileData.phone_number !== 'N/A' && (profileData?.bank_name || profileData?.bank_code || profileData?.account_number));
  const isShippingDone = Boolean(profileData?.delivery_duration);
  const isProductsDone = Boolean((metrics?.activeStock || 0) > 0);
  const isPlanDone = Boolean(profileData?.store_active || user?.user_metadata?.store_active || (profileData?.trial_ends_at && new Date(profileData.trial_ends_at) > new Date()));

  const profileSteps = [
    { id: 'store_info', label: 'Store Info & Logo', completed: isStoreInfoDone, submodal: 'store_info' },
    { id: 'wallet', label: 'Payout Wallet & Bank', completed: isWalletDone, submodal: 'payment' },
    { id: 'shipping', label: 'Shipping & Delivery', completed: isShippingDone, submodal: 'shipping' },
    { id: 'products', label: 'Add First Product', completed: isProductsDone, submodal: 'products' },
    { id: 'subscription', label: 'Subscription / Trial', completed: isPlanDone, submodal: 'subscription' }
  ];

  const completedStepsCount = profileSteps.filter(s => s.completed).length;
  const completionPercentage = Math.round((completedStepsCount / profileSteps.length) * 100);
  const showProfileMeter = completionPercentage < 100;

  const s = {
    page: { backgroundColor: '#FBF9F5', color: '#221510', height: isMobile ? 'auto' : '100vh', minHeight: '100vh', overflow: isMobile ? 'visible' : 'hidden', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #EAE3D9', backgroundColor: '#FFFFFF', padding: '0', display: 'flex', flexDirection: 'column' },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: 'var(--font-heading)', fontSize: '20px', letterSpacing: '-0.02em', fontWeight: '800', color: brandColor, textTransform: 'none' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 40px', color: active ? '#221510' : '#6B584C', backgroundColor: active ? '#F7F2EC' : 'transparent', borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '600' : '400', letterSpacing: '0.05em', transition: 'all 0.2s', textTransform: 'uppercase', textDecoration: 'none' }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #EAE3D9', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FBF9F5' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#EAE3D9', overflow: 'hidden', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '80px', padding: '0 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EAE3D9', backgroundColor: '#FFFFFF' },
    headerTitle: { fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FBF9F5', padding: '10px 16px', width: '320px', border: '1px solid #EAE3D9', borderRadius: '4px' },
    searchInput: { background: 'transparent', border: 'none', color: '#221510', fontSize: '12px', outline: 'none', width: '100%', letterSpacing: '0.05em' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '32px' },
    premiumBadge: { color: brandColor, fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', padding: '4px 8px', border: `1px solid ${brandColor}` },
    content: { padding: '80px', flex: 1, overflowY: 'auto' },
    sectionLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8D5B36', marginBottom: '16px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' },
    mainTitle: { fontFamily: 'var(--font-heading)', fontSize: '42px', fontWeight: '800', color: '#221510', marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: '1.2' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '64px' },
    card: { backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #EAE3D9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(34,21,16,0.04)', position: 'relative', overflow: 'hidden' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    cardTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8D5B36', textTransform: 'uppercase' },
    cardValue: { fontFamily: 'var(--font-heading)', fontSize: '36px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em' },
    cardSubtitle: { fontSize: '11px', color: '#6B584C', marginTop: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' },
    bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '64px' },
    listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #EAE3D9' },
    statusBadge: (status) => ({ fontSize: '10px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', border: `1px solid ${status === 'green' ? brandColor : '#EAE3D9'}`, color: status === 'green' ? '#FFFFFF' : '#6B584C', backgroundColor: status === 'green' ? brandColor : '#F7F2EC', textTransform: 'uppercase', letterSpacing: '0.1em' })
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
              background-color: #FFFFFF !important;
              transition: left 0.3s ease !important;
              box-shadow: 10px 0 30px rgba(34,21,16,0.1) !important;
            }
            .dash-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background-color: rgba(34,21,16,0.4) !important;
              z-index: 999 !important;
              display: ${isSidebarOpen ? 'block' : 'none'} !important;
            }
            .dash-logo-container { padding: 24px !important; }
            .dash-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
            .dash-nav a, .dash-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
            .dash-user-profile { display: flex !important; margin-top: auto; } 
            
            .dash-header { height: auto !important; padding: 24px 20px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; position: sticky; top: 0; background: #FFFFFF; z-index: 100; border-bottom: 1px solid #EAE3D9; }
            .dash-content { padding: 24px 20px !important; }
            .dash-search-bar { display: none !important; }
            .dash-header-actions { 
              width: 100% !important; 
              display: flex !important; 
              flex-wrap: wrap !important; 
              gap: 8px !important; 
              align-items: stretch !important; 
              justify-content: flex-start !important; 
            }
            .dash-header-actions button { 
              flex: 1 1 calc(50% - 6px) !important; 
              justify-content: center !important; 
              padding: 10px 8px !important; 
              font-size: 10px !important; 
              text-align: center !important; 
            }
            .dash-header-actions a { 
              width: 100% !important; 
              flex-basis: 100% !important; 
            }
            .dash-header-actions a > div { 
              justify-content: center !important; 
              width: 100% !important; 
              padding: 12px !important; 
            }
            
            .dash-brand-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
            .dash-brand-info { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
            .dash-live-domain { width: 100% !important; align-items: flex-start !important; margin-top: 16px !important; }
            
            .dash-stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-top: 40px !important; }
            .dash-card { padding: 24px !important; }
            .dash-card-value { font-size: 28px !important; }
            
            .dash-bottom-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-top: 40px !important; }
            .dash-meter-card { padding: 20px 16px !important; margin-top: 24px !important; }
            .dash-meter-steps-grid { grid-template-columns: 1fr !important; }
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
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer' }}
              className="mobile-only"
            >
              <X size={24} />
            </button>
            <Link to="/" style={{ textDecoration: 'none' }}><div style={s.logo}>Unbley.</div></Link>
            <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#8D5B36', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
          </div>

          <div id="tour-sidebar-nav" style={s.nav} className="dash-nav">
            <div id="tour-nav-overview" onClick={() => setActiveTab('overview')} style={s.navItem(activeTab === 'overview')}><LayoutGrid size={16} /> Overview</div>
            <Link id="tour-nav-profile" to="/profile" style={s.navItem(false)}><User size={16} /> Profile</Link>
            <Link id="tour-nav-edit" to="/edit" style={s.navItem(false)}><Edit size={16} /> Edit</Link>
            {profileData.is_admin && (
              <div onClick={() => setActiveTab('support')} style={s.navItem(activeTab === 'support')}><MessageSquare size={16} /> Support</div>
            )}
          </div>

          <div style={s.userProfile} className="dash-user-profile">
            <div style={s.userAvatar}>
              {profileData.logo_url ? (
                <img src={profileData.logo_url} alt={profileData.owner_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#6A3E1F', fontWeight: 'bold' }}>{profileData.owner_name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#221510', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{profileData.owner_name}</div>
              <div style={{ fontSize: '10px', color: '#6B584C', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Brand Director</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={s.main}>
          {/* Header */}
          <div style={s.header} className="dash-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                id="tour-mobile-menu"
                onClick={() => setIsSidebarOpen(true)}
                style={{ background: 'none', border: 'none', color: '#221510', cursor: 'pointer' }}
                className="mobile-only"
              >
                <Menu size={24} />
              </button>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #EAE3D9', color: '#6B584C', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#221510'; e.currentTarget.style.borderColor = '#6A3E1F'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B584C'; e.currentTarget.style.borderColor = '#EAE3D9'; }}>
                <ArrowLeft size={18} />
              </Link>
              <div style={s.headerTitle}>{activeTab === 'overview' ? 'Dashboard' : 'Customer Support'}</div>
            </div>
            <div style={s.searchBar} className="dash-search-bar">
              <Search size={14} color="#6B584C" />
              <input type="text" placeholder="SEARCH ..." style={s.searchInput} />
            </div>
            <div style={s.headerActions} className="dash-header-actions">
              <button
                id="tour-guide-trigger"
                onClick={() => setShowDashboardTour(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#6B584C',
                  border: '1px solid #DFCFC2',
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.04em'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F7F2EC'; e.currentTarget.style.color = brandColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#6B584C'; }}
                title="Take a quick tutorial tour of your dashboard"
              >
                <HelpCircle size={14} color="#8D5B36" /> TOUR GUIDE
              </button>
              <button
                id="tour-launch-btn"
                onClick={() => setShowOnboardingModal(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: brandColor,
                  border: '1px solid #DFCFC2',
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.04em'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F7F2EC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                title="Complete the next steps to launch your website"
              >
                <Sparkles size={14} color={brandColor} /> LAUNCH CHECKLIST
              </button>
              <Link id="tour-storefront" to={`/shop-brand/${user?.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ ...s.premiumBadge, backgroundColor: brandColor, color: '#FFFFFF', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', border: 'none', borderRadius: '4px', boxShadow: '0 4px 12px rgba(106, 62, 31, 0.2)' }}>
                  <Store size={16} /> MANAGE STORE
                </div>
              </Link>
            </div>
          </div>

          {/* Content Area */}
          <div style={s.content} className="dash-content">

            {activeTab === 'overview' ? (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div id="tour-brand-identity" variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #EAE3D9', paddingBottom: '40px' }} className="dash-brand-header">
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="dash-brand-info">
                    <div style={{ width: '100px', height: '100px', border: '1px solid #EAE3D9', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {profileData.logo_url ? (
                        <img src={profileData.logo_url} alt="Brand Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '48px', color: '#6A3E1F', fontFamily: 'var(--font-heading)', fontWeight: '800' }}>{profileData.brand_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <div style={s.sectionLabel}>
                        <div style={{ width: '2px', height: '12px', backgroundColor: brandColor }}></div>
                        Brand Profile
                      </div>
                      <h1 style={{ ...s.mainTitle, fontSize: '36px', marginBottom: '16px', lineHeight: '1' }}>{profileData.brand_name}</h1>
                      <div style={{ display: 'flex', gap: '24px', color: '#6B584C', fontSize: '12px', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#221510', fontWeight: '600' }}>Email:</span> {profileData.email_address}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#221510', fontWeight: '600' }}>Phone:</span> {profileData.phone_number}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '24px', border: '1px solid #EAE3D9', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="dash-live-domain">
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8D5B36', textTransform: 'uppercase', marginBottom: '8px' }}>Live Domain</div>
                    {profileData.website_url ? (
                      <a href={profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#221510', textDecoration: 'none', borderBottom: `1px solid ${brandColor}`, paddingBottom: '2px', display: 'flex', alignItems: 'center' }}>
                        {profileData.website_url.replace(/^https?:\/\//, '')} <ArrowUpRight size={14} style={{ marginLeft: '6px', color: brandColor }} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#8D5B36' }}>activation pending</span>
                    )}
                  </div>
                </motion.div>

                {/* Profile Completion Meter (Disappears once 100% completed) */}
                <AnimatePresence>
                  {showProfileMeter && (
                    <motion.div
                      id="tour-setup-meter"
                      variants={itemVariants}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        marginTop: '36px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EAE3D9',
                        borderRadius: '12px',
                        padding: '24px 32px',
                        boxShadow: '0 4px 16px rgba(34, 21, 16, 0.04)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      className="dash-meter-card"
                    >
                      {/* Decorative Accent Top Line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          backgroundColor: '#EAE3D9'
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ height: '100%', backgroundColor: brandColor }}
                        />
                      </div>

                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <Sparkles size={16} color={brandColor} />
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: '#8D5B36', textTransform: 'uppercase' }}>
                              Store Setup Progress
                            </span>
                            <span
                              style={{
                                backgroundColor: 'rgba(106, 62, 31, 0.08)',
                                color: brandColor,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: '800'
                              }}
                            >
                              {completionPercentage}%
                            </span>
                          </div>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#221510', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                            {completionPercentage === 0 
                              ? 'Start setting up your store to launch' 
                              : completionPercentage < 50 
                              ? 'Great start! Complete a few more steps to launch' 
                              : 'Almost ready! Just a few finishing touches'}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6B584C', margin: 0, lineHeight: '1.4' }}>
                            {completedStepsCount} of {profileSteps.length} essential setup milestones completed. Once finished, your storefront will be fully active.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const firstIncomplete = profileSteps.find(s => !s.completed);
                            setActiveOnboardingStep(firstIncomplete ? firstIncomplete.submodal : null);
                            setShowOnboardingModal(true);
                          }}
                          style={{
                            backgroundColor: brandColor,
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            boxShadow: '0 3px 10px rgba(106, 62, 31, 0.2)'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#522F16'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = brandColor; }}
                        >
                          <span>Complete Setup</span>
                          <ChevronRight size={15} />
                        </button>
                      </div>

                      {/* Progress Bar Track */}
                      <div
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: '#F3EFEA',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          position: 'relative',
                          marginBottom: '20px'
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            background: `linear-gradient(90deg, #8D5B36 0%, ${brandColor} 100%)`
                          }}
                        />
                      </div>

                      {/* Milestone Pills / Checklist */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                          gap: '10px'
                        }}
                        className="dash-meter-steps-grid"
                      >
                        {profileSteps.map((step) => (
                          <div
                            key={step.id}
                            onClick={() => {
                              setActiveOnboardingStep(step.submodal);
                              setShowOnboardingModal(true);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              backgroundColor: step.completed ? 'rgba(106, 62, 31, 0.05)' : '#FBF9F5',
                              border: step.completed ? '1px solid rgba(106, 62, 31, 0.15)' : '1px solid #EAE3D9',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F7F2EC';
                              e.currentTarget.style.borderColor = '#DFCFC2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = step.completed ? 'rgba(106, 62, 31, 0.05)' : '#FBF9F5';
                              e.currentTarget.style.borderColor = step.completed ? 'rgba(106, 62, 31, 0.15)' : '#EAE3D9';
                            }}
                          >
                            {step.completed ? (
                              <CheckCircle2 size={16} color={brandColor} style={{ flexShrink: 0 }} />
                            ) : (
                              <div
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '50%',
                                  border: '1.5px solid #A89F91',
                                  flexShrink: 0
                                }}
                              />
                            )}
                            <span
                              style={{
                                fontSize: '11.5px',
                                fontWeight: step.completed ? '700' : '500',
                                color: step.completed ? '#221510' : '#6B584C',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dynamic Real-Time Stats Grid */}
                <div id="tour-stats-grid" style={s.statsGrid} className="dash-stats-grid">
                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <div style={{ border: '1px solid #EAE3D9', borderRadius: '4px', padding: '8px', backgroundColor: '#F7F2EC' }}>
                        <TrendingUp size={14} color={brandColor} />
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#8D5B36', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {metrics.totalSales > 0 ? '+12.4% THIS MONTH' : 'NO DATA YET'}
                      </div>
                    </div>
                    <div style={s.cardTitle}>Total Sales</div>
                    <div style={s.cardValue}>{formatMoney(metrics.totalSales)}</div>

                    <div style={{ marginTop: '32px', width: '100%', height: '2px', backgroundColor: '#EAE3D9', position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: metrics.totalSales > 0 ? '60%' : '0%' }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                        style={{ position: 'absolute', top: 0, left: 0, height: '2px', backgroundColor: brandColor }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <Package size={18} color="#8D5B36" />
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#8D5B36', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{metrics.activeStock > 0 ? 'ACTIVE' : 'EMPTY'}</div>
                    </div>
                    <div style={s.cardTitle}>Stock Portfolio</div>
                    <div style={s.cardValue}>{metrics.activeStock}</div>
                    <div style={s.cardSubtitle}>Total Product Listings</div>
                  </motion.div>

                  <motion.div variants={itemVariants} style={s.card}>
                    <div style={s.cardHeader}>
                      <BarChart3 size={18} color="#8D5B36" />
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#8D5B36', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{metrics.totalTraffic > 0 ? 'LIVE NOW' : 'AWAITING TRAFFIC'}</div>
                    </div>
                    <div style={s.cardTitle}>Your Traffic</div>
                    <div style={s.cardValue}>{formatCompact(metrics.totalTraffic)}</div>
                    <div style={s.cardSubtitle}>Unique Store Visitors</div>
                  </motion.div>
                </div>

                {/* Bottom Ledger Grid */}
                <div id="tour-orders-ledger" style={s.bottomGrid} className="dash-bottom-grid">
                  <motion.div variants={itemVariants} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #EAE3D9' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#221510', fontWeight: '800', letterSpacing: '-0.02em' }}>Recent Orders</div>
                      {metrics.recentOrders.length > 0 && <div style={{ fontSize: '10px', color: brandColor, letterSpacing: '0.1em', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer', borderBottom: `1px solid ${brandColor}` }}>View Full Ledger</div>}
                    </div>

                    {metrics.recentOrders.length > 0 ? (
                      metrics.recentOrders.map((order) => (
                        <motion.div key={order.id} variants={itemVariants} style={s.listRow} className="dash-list-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '48px', height: '48px', border: '1px solid #EAE3D9', borderRadius: '4px', backgroundColor: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ShoppingBag size={18} color="#6B584C" />
                            </div>
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: '700', color: '#8D5B36', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>{order.order_number}</div>
                              <div style={{ fontSize: '14px', color: '#221510', fontWeight: '600' }}>{order.product_name_snapshot}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#221510', marginBottom: '12px' }}>{formatMoney(order.total_amount)}</div>
                            <div style={s.statusBadge(order.status === 'processing' ? 'gray' : order.status === 'completed' ? 'green' : 'gray')}>
                              {order.status === 'processing' ? 'Processing' : order.status === 'completed' ? 'Paid & Ready' : order.status}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ padding: '64px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#F7F2EC', borderRadius: '50%', marginBottom: '24px' }}>
                          <Package size={24} color="#6A3E1F" />
                        </div>
                        <div style={{ fontSize: '14px', color: '#221510', fontWeight: '600', marginBottom: '8px' }}>Your Ledger is Empty</div>
                        <div style={{ fontSize: '12px', color: '#6B584C' }}>Incoming orders will securely populate here.</div>
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

        {/* Stage 1: Signup Success Pop-up Modal */}
        <SuccessModal
          isOpen={showSignupSuccessModal}
          onClose={() => {
            localStorage.removeItem('unbley_just_signed_up');
            setShowSignupSuccessModal(false);
            // Immediately open Stage 2: Store launch checklist!
            setShowOnboardingModal(true);
          }}
          type="signup"
          data={signupModalData || {
            name: profileData.owner_name || 'Creator',
            brandName: profileData.brand_name || 'Your Brand',
            email: profileData.email_address || user?.email,
            userType: 'brand'
          }}
        />

        {/* Stage 2: Onboarding Next Steps Modal */}
        <OnboardingModal
          isOpen={showOnboardingModal && !showSignupSuccessModal}
          onClose={() => {
            if (user?.id) {
              localStorage.setItem(`unbley_onboarding_dismissed_${user.id}`, 'true');
            }
            setShowOnboardingModal(false);
            setActiveOnboardingStep(null);
            // Launch tutorial tour if not seen yet
            if (user?.id && !localStorage.getItem(`unbley_dashboard_tour_seen_${user.id}`)) {
              setTimeout(() => {
                setShowDashboardTour(true);
              }, 400);
            }
          }}
          activeStep={activeOnboardingStep}
          onRefresh={fetchDashboardData}
          storeData={{
            ...profileData,
            activeStock: metrics.activeStock,
            store_active: profileData?.store_active || user?.user_metadata?.store_active
          }}
          storeId={user?.id}
        />

        {/* Stage 3: Interactive Dashboard Tutorial Tour */}
        <DashboardTour
          isActive={showDashboardTour}
          onClose={() => setShowDashboardTour(false)}
          userId={user?.id}
          onSidebarToggle={(open) => setIsSidebarOpen(open)}
        />
      </div>
    </PageTransition>
  );
}

