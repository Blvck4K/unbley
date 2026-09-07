import React, { useState, useEffect, useCallback } from 'react';
import { 
  Share2, 
  Compass,
  ExternalLink,
  HelpCircle, 
  ArrowUpRight, 
  Package, 
  Eye, 
  Info, 
  Check, 
  Lightbulb, 
  ArrowRight, 
  Menu,
  FileSpreadsheet,
  DollarSign,
  Landmark,
  Pencil,
  Trash2,
  BarChart2,
  TrendingUp,
  Users,
  Wallet,
  Plus
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import SuccessModal from '../components/SuccessModal';
import OnboardingModal from '../components/OnboardingModal';
import DashboardTour from '../components/DashboardTour';
import ProductsModal from '../components/onboarding/ProductsModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSignupSuccessModal, setShowSignupSuccessModal] = useState(false);
  const [signupModalData, setSignupModalData] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(null);
  const [showDashboardTour, setShowDashboardTour] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);

  const [profileData, setProfileData] = useState({
    brand_name: 'Isaac Akpasu',
    owner_name: 'Isaac Akpasu',
    email_address: 'diorbaron2@gmail.com',
    phone_number: '09153625566',
    website_url: 'www.zizzystores.com',
    logo_url: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    delivery_duration: '',
    store_active: false,
    trial_ends_at: null
  });

  const [metrics, setMetrics] = useState({
    totalSales: 200,
    activeStock: 7,
    totalTraffic: 0,
    recentOrders: []
  });

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [payouts, setPayouts] = useState([]);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  // Onboarding completion logic (mirrors OnboardingModal)
  const isStoreInfoDone = Boolean(
    profileData.brand_name &&
    profileData.brand_name !== 'Your Brand' &&
    profileData.brand_name !== 'Isaac Akpasu' &&
    profileData.logo_url
  );
  const isWalletDone = Boolean(
    profileData.phone_number &&
    profileData.phone_number !== 'N/A' &&
    profileData.bank_name &&
    profileData.account_number
  );
  const isShippingDone = Boolean(profileData.delivery_duration);
  const isProductsDone = metrics.activeStock > 0;
  const isPlanDone = Boolean(
    profileData.store_active ||
    (profileData.trial_ends_at && new Date(profileData.trial_ends_at) > new Date())
  );

  const onboardingSteps = [
    { id: 'products', label: 'Add First Products', done: isProductsDone },
    { id: 'wallet', label: 'Connect WhatsApp', done: isWalletDone },
    { id: 'shipping', label: 'Set Delivery Fees', done: isShippingDone },
    { id: 'subscription', label: 'Get Subscription Plan', done: isPlanDone }
  ];
  const completedSteps = onboardingSteps.filter(s => s.done).length;
  const totalSteps = onboardingSteps.length;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  // Data fetch
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: pData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

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
      
      const calcSales = salesData && salesData.length > 0
        ? salesData.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)
        : 200;

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
        .limit(5);

      setMetrics({
        totalSales: calcSales,
        activeStock: stockCount !== null && stockCount > 0 ? stockCount : 7,
        totalTraffic: trafficCount || 0,
        recentOrders: lastOrders || []
      });
    } catch (err) {
      console.error('Error loading live dashboard data:', err);
    }
  }, [user]);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    setProductsLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [user]);

  const fetchPayouts = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at, customer_name, product_name_snapshot')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setPayouts(data || []);
    } catch (err) {
      console.error('Error fetching payouts:', err);
    }
  }, [user]);

  // OAuth signup handling
  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(location.search);
    const isOAuthSignup = params.get('oauth_signup') === 'true';
    if (isOAuthSignup) {
      window.history.replaceState({}, '', window.location.pathname);
      const meta = user?.user_metadata || {};
      const successInfo = {
        name: meta.full_name || meta.name || user?.email?.split('@')[0] || 'Creator',
        email: user?.email || '',
        brandName: meta.full_name || meta.name || 'Isaac Akpasu',
        userType: meta.role || 'brand'
      };
      localStorage.setItem('unbley_just_signed_up', JSON.stringify(successInfo));
      setSignupModalData(successInfo);
      setShowSignupSuccessModal(true);
    } else {
      const justSignedUpRaw = localStorage.getItem('unbley_just_signed_up');
      if (justSignedUpRaw) {
        try {
          const parsed = JSON.parse(justSignedUpRaw);
          setSignupModalData(parsed);
          setShowSignupSuccessModal(true);
        } catch (e) {
          console.error('Error reading signup session:', e);
        }
      }
    }
  }, [user, location.search]);

  // Main data + realtime
  useEffect(() => {
    if (!user) return;
    fetchDashboardData();

    const profileChannel = supabase
      .channel(`dashboard_profile_${user.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'brand_profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.new) {
            setProfileData(prev => ({
              ...prev,
              ...Object.fromEntries(Object.entries(payload.new).filter(([_, v]) => v != null && v !== ''))
            }));
          }
        }
      ).subscribe();

    const productsChannel = supabase
      .channel(`dashboard_products_${user.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `brand_id=eq.${user.id}` },
        () => { fetchDashboardData(); fetchProducts(); }
      ).subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(productsChannel);
    };
  }, [user, fetchDashboardData, fetchProducts]);

  // Tab-specific fetches
  useEffect(() => {
    if (currentTab === 'products') fetchProducts();
    if (currentTab === 'wallet') fetchPayouts();
  }, [currentTab, fetchProducts, fetchPayouts]);

  const handleShareStore = () => {
    const storeUrl = profileData.website_url
      ? (profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`)
      : `${window.location.origin}/shop-brand/${user?.id || 'demo'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      if (toast) toast('Store link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await supabase.from('products').delete().eq('id', productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (toast) toast('Product deleted', 'success');
      fetchDashboardData();
    } catch (err) {
      if (toast) toast('Failed to delete product', 'error');
    }
  };

  const formatMoney = (amount) => '₦' + Number(amount || 0).toLocaleString();

  const defaultOrders = [
    { id: 'ORD-138901-999', order_number: 'ORD-138901-999', time: 'Today, 11:20 AM', item_name: 'Short Carton Colour Chinos (x2)', buyer_name: 'Tunde Balogun', amount: 18500, payment_status: 'PAID', fulfillment_status: 'READY TO SHIP' },
    { id: 'ORD-138901-998', order_number: 'ORD-138901-998', time: 'Yesterday', item_name: 'Vintage Oversized Tee (x1)', buyer_name: 'Chidinma Eze', amount: 12000, payment_status: 'PAID', fulfillment_status: 'SHIPPED' },
    { id: 'ORD-138901-997', order_number: 'ORD-138901-997', time: '2 days ago', item_name: 'Cargo Streetwear Pants (x1)', buyer_name: 'Femi Adeyemi', amount: 22000, payment_status: 'PAID', fulfillment_status: 'DELIVERED' },
    { id: 'ORD-138901-996', order_number: 'ORD-138901-996', time: '3 days ago', item_name: 'Premium Cotton Crew Socks (x3)', buyer_name: 'Amaka Obi', amount: 6500, payment_status: 'AWAITING PAY', fulfillment_status: 'PENDING' }
  ];

  const ordersToDisplay = metrics.recentOrders.length > 0
    ? metrics.recentOrders.map(order => ({
        id: order.id,
        order_number: order.order_number || `ORD-${order.id.slice(0, 6)}`,
        time: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        item_name: order.product_name_snapshot || 'Catalog Product (x1)',
        buyer_name: order.customer_name || 'Store Customer',
        amount: order.total_amount || 0,
        payment_status: order.status === 'completed' ? 'PAID' : 'AWAITING PAY',
        fulfillment_status: order.fulfillment_status || 'READY TO SHIP'
      }))
    : defaultOrders;

  const weeklyData = [
    { day: 'Mon', pxHeight: 52, isToday: false, value: '₦4,200' },
    { day: 'Tue', pxHeight: 78, isToday: false, value: '₦6,800' },
    { day: 'Wed', pxHeight: 40, isToday: false, value: '₦3,100' },
    { day: 'Thu', pxHeight: 96, isToday: false, value: '₦8,500' },
    { day: 'Fri (Today)', pxHeight: 140, isToday: true, value: '₦12,400' },
    { day: 'Sat', pxHeight: 68, isToday: false, value: '₦5,200' },
    { day: 'Sun', pxHeight: 34, isToday: false, value: '₦2,000' }
  ];

  const tabTitles = { overview: 'Dashboard', products: 'Products', wallet: 'Wallet', insights: 'Store Insights' };
  const tabSubtitles = {
    overview: "Welcome back, here is your store's performance today.",
    products: 'Manage your product catalog in real-time.',
    wallet: 'View your earnings and payment details.',
    insights: 'Detailed analytics for your store.'
  };

  return (
    <PageTransition>
      <div className="unbley-app-layout">
        <Sidebar profileData={profileData} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="unbley-main-content">

          {/* Top Header */}
          <header className="unbley-top-header">
            <div className="unbley-header-left">
              <button
                id="tour-mobile-menu"
                onClick={() => setIsSidebarOpen(true)}
                style={{ display: 'none', background: 'none', border: '1px solid #EAE6DF', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                className="mobile-menu-trigger"
                title="Open menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="unbley-header-title-row">
                  <h1 className="unbley-header-title">{tabTitles[currentTab] || 'Dashboard'}</h1>
                  <span className="unbley-live-badge">
                    <span className="unbley-live-dot" />
                    LIVE
                  </span>
                </div>
                <p className="unbley-header-subtitle">
                  {tabSubtitles[currentTab] || "Welcome back, here is your store's performance today."}
                </p>

                {/* Live onboarding progress bar in header — hidden once 100% */}
                {progressPct < 100 && completedSteps < totalSteps && currentTab === 'overview' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <div style={{ width: '140px', height: '5px', backgroundColor: '#EAE6DF', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#6A3E1F', borderRadius: '99px', transition: 'width 0.5s ease' }} />
                    </div>
                    <button
                      onClick={() => setShowOnboardingModal(true)}
                      style={{ fontSize: '11px', fontWeight: '700', color: '#6A3E1F', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      {completedSteps}/{totalSteps} setup steps done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="unbley-header-actions">
              <button onClick={handleShareStore} className="unbley-btn-white">
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share Store'}</span>
              </button>
              <button id="tour-guide-trigger" onClick={() => setShowDashboardTour(true)} className="unbley-btn-white">
                <Compass size={14} />
                <span>Tour Guide</span>
              </button>
              <Link id="tour-storefront" to={`/shop-brand/${user?.id || 'demo'}`} className="unbley-btn-black">
                <ExternalLink size={14} />
                <span>Manage Store</span>
              </Link>
            </div>
          </header>

          {/* ─── OVERVIEW TAB ─────────────────────────────────── */}
          {currentTab === 'overview' && (
            <main className="unbley-workspace-container">

              {/* Brand Profile Banner */}
              <div id="tour-brand-identity" className="unbley-card unbley-brand-banner">
                <div className="unbley-brand-left">
                  <div className="unbley-brand-avatar-box" style={profileData.logo_url ? { background: 'transparent', padding: 0 } : {}}>
                    {profileData.logo_url ? (
                      <img src={profileData.logo_url} alt={profileData.brand_name || 'Store Logo'} style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '12px', display: 'block' }} />
                    ) : (
                      <span style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>
                        {(profileData.brand_name || profileData.owner_name || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="unbley-brand-title-badge">BRAND PROFILE</div>
                    <h2 className="unbley-brand-heading">{profileData.brand_name || 'Isaac Akpasu'}</h2>
                    <div className="unbley-brand-meta">
                      <span><strong>Email:</strong> {profileData.email_address || 'diorbaron2@gmail.com'}</span>
                      <span><strong>Phone / WhatsApp:</strong> {profileData.phone_number || '09153625566'}</span>
                    </div>
                  </div>
                </div>
                <div className="unbley-storefront-box">
                  <span className="unbley-storefront-label">LIVE STOREFRONT</span>
                  <a href={profileData.website_url ? (profileData.website_url.startsWith('http') ? profileData.website_url : `https://${profileData.website_url}`) : '#'} target="_blank" rel="noreferrer" className="unbley-storefront-link">
                    <span>{profileData.website_url || 'www.zizzystores.com'}</span>
                    <ArrowUpRight size={14} color="#6B7280" />
                  </a>
                </div>
              </div>

              {/* Setup Guide Card — hidden once 100% complete */}
              {progressPct < 100 && (
                <div id="tour-setup-meter" className="unbley-card">
                  <div className="unbley-setup-header">
                    <div className="unbley-setup-title-box">
                      <div className="unbley-info-icon-circle"><Info size={16} /></div>
                      <div>
                        <h3 className="unbley-setup-h3">Get Your Store Ready for Buyers</h3>
                        <p className="unbley-setup-p">Complete these simple steps to help customers find and buy your products easily.</p>
                      </div>
                    </div>
                    <div className="unbley-completion-pill">
                      {completedSteps} OF {totalSteps} COMPLETED ({progressPct}%)
                    </div>
                  </div>
                  <div>
                    <div className="unbley-progress-row">
                      <span>Setup Progress</span>
                      <span>{progressPct}% Complete</span>
                    </div>
                    <div className="unbley-progress-track">
                      <div className="unbley-progress-fill" style={{ width: `${progressPct}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  <div className="unbley-step-cards-grid">
                    {/* Step 1 */}
                    <div className="unbley-step-card">
                      <div>
                        <div className="unbley-step-title-row">
                          {isProductsDone ? <div className="unbley-check-circle"><Check size={11} strokeWidth={3} /></div> : <div className="unbley-num-circle">1</div>}
                          <span className="unbley-step-name">1. Add First Products</span>
                        </div>
                        <p className="unbley-step-desc">
                          {isProductsDone ? `${metrics.activeStock} product${metrics.activeStock !== 1 ? 's' : ''} listed in your catalog.` : 'Upload your first product to get started.'}
                        </p>
                      </div>
                      <button onClick={() => { setActiveOnboardingStep('products'); setShowOnboardingModal(true); }} className={isProductsDone ? 'unbley-step-btn-done' : 'unbley-step-btn-share'}>
                        {isProductsDone ? 'DONE' : 'ADD NOW'}
                      </button>
                    </div>
                    {/* Step 2 */}
                    <div className="unbley-step-card">
                      <div>
                        <div className="unbley-step-title-row">
                          {isWalletDone ? <div className="unbley-check-circle"><Check size={11} strokeWidth={3} /></div> : <div className="unbley-num-circle">2</div>}
                          <span className="unbley-step-name">2. Connect WhatsApp</span>
                        </div>
                        <p className="unbley-step-desc">
                          {isWalletDone ? `Phone: ${profileData.phone_number} configured for orders.` : 'Add your WhatsApp number and bank details.'}
                        </p>
                      </div>
                      <button onClick={() => { setActiveOnboardingStep('payment'); setShowOnboardingModal(true); }} className={isWalletDone ? 'unbley-step-btn-done' : 'unbley-step-btn-share'}>
                        {isWalletDone ? 'DONE' : 'SET UP'}
                      </button>
                    </div>
                    {/* Step 3 */}
                    <div className="unbley-step-card">
                      <div>
                        <div className="unbley-step-title-row">
                          {isShippingDone ? <div className="unbley-check-circle"><Check size={11} strokeWidth={3} /></div> : <div className="unbley-num-circle">3</div>}
                          <span className="unbley-step-name">3. Set Delivery Fees</span>
                        </div>
                        <p className="unbley-step-desc">
                          {isShippingDone ? `Delivery: ${profileData.delivery_duration} configured.` : 'Set your shipping rates for customers.'}
                        </p>
                      </div>
                      <button onClick={() => { setActiveOnboardingStep('shipping'); setShowOnboardingModal(true); }} className={isShippingDone ? 'unbley-step-btn-done' : 'unbley-step-btn-share'}>
                        {isShippingDone ? 'DONE' : 'SET UP'}
                      </button>
                    </div>
                    {/* Step 4 */}
                    <div className="unbley-step-card">
                      <div>
                        <div className="unbley-step-title-row">
                          {isPlanDone ? <div className="unbley-check-circle"><Check size={11} strokeWidth={3} /></div> : <div className="unbley-num-circle">4</div>}
                          <span className="unbley-step-name">4. Get a Subscription Plan</span>
                        </div>
                        <p className="unbley-step-desc">
                          {isPlanDone ? 'Your store is active and live.' : 'Get 30% off and unlock exclusive Unbley features.'}
                        </p>
                      </div>
                      <button onClick={() => { setActiveOnboardingStep('subscription'); setShowOnboardingModal(true); }} className={isPlanDone ? 'unbley-step-btn-done' : 'unbley-step-btn-share'}>
                        {isPlanDone ? 'DONE' : 'View Plans'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics Row */}
              <div id="tour-stats-grid" className="unbley-metrics-grid">
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top">
                    <div className="unbley-icon-box-cream"><DollarSign size={18} /></div>
                    <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em', backgroundColor: '#DCFCE7', color: '#15803D', textTransform: 'uppercase' }}>+12.4% THIS MONTH</span>
                  </div>
                  <div>
                    <div className="unbley-metric-label">TOTAL SALES</div>
                    <div className="unbley-metric-value">{formatMoney(metrics.totalSales)}</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><Package size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">PRODUCTS</div>
                    <div className="unbley-metric-value">{metrics.activeStock}</div>
                    <div className="unbley-metric-subtext">Products currently listed in your store</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-blue"><Eye size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">STORE VISITORS</div>
                    <div className="unbley-metric-value">{metrics.totalTraffic}</div>
                    <div className="unbley-metric-subtext">People who visited your store</div>
                  </div>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="unbley-two-col-grid">
                <div className="unbley-col-left">
                  <div id="tour-weekly-chart" className="unbley-card">
                    <div className="unbley-chart-header">
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Weekly Sales Activity</h3>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>How much money your store made each day this week</p>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#F4F2EE', color: '#4B5563', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>THIS WEEK</span>
                    </div>
                    <div>
                      <div className="unbley-chart-bars-wrap">
                        {weeklyData.map((item, idx) => (
                          <div key={idx} className="unbley-bar-col">
                            <div title={`${item.day}: ${item.value}`} className={`unbley-bar-pillar ${item.isToday ? 'active-today' : ''}`} style={{ height: `${item.pxHeight}px` }} />
                          </div>
                        ))}
                      </div>
                      <div className="unbley-chart-days-row">
                        {weeklyData.map((item, idx) => (
                          <div key={idx} className={`unbley-chart-day-cell ${item.isToday ? 'active-today' : ''}`}>{item.day}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div id="tour-orders-ledger" className="unbley-table-card">
                    <div className="unbley-table-header-bar">
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Recent Customer Orders</h3>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>The latest purchases made by customers</p>
                      </div>
                      <Link to="/dashboard?tab=orders" className="unbley-view-all-link">
                        <span>VIEW ALL ORDERS</span><ArrowRight size={13} />
                      </Link>
                    </div>
                    <table className="unbley-table">
                      <thead>
                        <tr>
                          <th>ORDER ID</th><th>ITEM PURCHASED</th><th>AMOUNT</th><th>PAYMENT</th><th>FULFILLMENT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersToDisplay.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <div style={{ fontWeight: '800', color: '#111827' }}>{order.order_number}</div>
                              <div style={{ fontSize: '11px', color: '#8C827A', marginTop: '2px' }}>{order.time}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', flexShrink: 0 }}>
                                  <Package size={16} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', color: '#111827' }}>{order.item_name}</div>
                                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '1px' }}>Buyer: {order.buyer_name}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(order.amount)}</td>
                            <td><span className={order.payment_status === 'PAID' ? 'unbley-pill-paid' : 'unbley-pill-awaiting'}>{order.payment_status}</span></td>
                            <td>
                              <span className={order.fulfillment_status === 'READY TO SHIP' ? 'unbley-pill-ready' : order.fulfillment_status === 'SHIPPED' ? 'unbley-pill-shipped' : order.fulfillment_status === 'DELIVERED' ? 'unbley-pill-delivered' : 'unbley-pill-pending'}>
                                {order.fulfillment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="unbley-col-right">
                  <div id="tour-quick-actions" className="unbley-card">
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Quick Actions</h3>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Common tasks for your store</p>
                    </div>
                    <div>
                      <div onClick={() => { setActiveOnboardingStep('products'); setShowOnboardingModal(true); }} className="unbley-action-row">
                        <div className="unbley-action-left">
                          <div className="unbley-action-icon"><Plus size={16} strokeWidth={2.5} /></div>
                          <div>
                            <div className="unbley-action-title">Add New Product</div>
                            <div className="unbley-action-desc">Upload pictures and set price</div>
                          </div>
                        </div>
                        <ArrowRight size={15} color="#9CA3AF" />
                      </div>
                      <div onClick={() => { setActiveOnboardingStep('payment'); setShowOnboardingModal(true); }} className="unbley-action-row">
                        <div className="unbley-action-left">
                          <div className="unbley-action-icon"><FileSpreadsheet size={16} /></div>
                          <div>
                            <div className="unbley-action-title">Record Quick Sale</div>
                            <div className="unbley-action-desc">Log sales made on WhatsApp or IG</div>
                          </div>
                        </div>
                        <ArrowRight size={15} color="#9CA3AF" />
                      </div>
                      <div onClick={handleShareStore} className="unbley-action-row">
                        <div className="unbley-action-left">
                          <div className="unbley-action-icon"><Share2 size={16} /></div>
                          <div>
                            <div className="unbley-action-title">Share Storefront</div>
                            <div className="unbley-action-desc">Copy link or get QR code</div>
                          </div>
                        </div>
                        <ArrowRight size={15} color="#9CA3AF" />
                      </div>
                    </div>
                  </div>
                  <div className="unbley-tip-box">
                    <div className="unbley-tip-header">
                      <Lightbulb size={17} strokeWidth={2.2} />
                      <span>Beginner Seller Tip</span>
                    </div>
                    <p className="unbley-tip-body">
                      Products with clear daylight photos sell 3x faster! Try placing your items near a window when taking pictures for your catalog.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ─── PRODUCTS TAB ─────────────────────────────────── */}
          {currentTab === 'products' && (
            <main className="unbley-workspace-container">
              <div className="unbley-card" style={{ padding: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F0ECE4' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Product Catalog</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                      {productsLoading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} in your store`}
                    </p>
                  </div>
                  <button onClick={() => { setActiveOnboardingStep('products'); setShowOnboardingModal(true); }} className="unbley-btn-black" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={14} /><span>Add Product</span>
                  </button>
                </div>

                {productsLoading ? (
                  <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>Loading products…</div>
                ) : products.length === 0 ? (
                  <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <Package size={40} color="#D1CBC2" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: '700', color: '#374151', marginBottom: '6px' }}>No products yet</div>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Add your first product to start selling.</p>
                    <button onClick={() => { setActiveOnboardingStep('products'); setShowOnboardingModal(true); }} className="unbley-btn-black">
                      Add First Product
                    </button>
                  </div>
                ) : (
                  <table className="unbley-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>PRODUCT</th><th>PRICE</th><th>STATUS</th><th>ADDED</th><th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                              ) : (
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F4F2EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Package size={16} color="#9CA3AF" />
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: '700', color: '#111827', fontSize: '13px' }}>{p.title || p.name || 'Unnamed Product'}</div>
                                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{p.category || 'Uncategorized'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(p.price)}</td>
                          <td>
                            <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', backgroundColor: p.status === 'active' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'active' ? '#15803D' : '#92400E' }}>
                              {(p.status || 'active').toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px', color: '#6B7280' }}>
                            {p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setShowEditProductModal(true);
                                }}
                                title="Edit product"
                                style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center' }}
                              >
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} title="Delete product" style={{ background: 'none', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#DC2626', display: 'flex', alignItems: 'center' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </main>
          )}

          {/* ─── WALLET TAB ───────────────────────────────────── */}
          {currentTab === 'wallet' && (
            <main className="unbley-workspace-container">
              <div className="unbley-metrics-grid">
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><DollarSign size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">TOTAL EARNINGS</div>
                    <div className="unbley-metric-value">{formatMoney(metrics.totalSales)}</div>
                    <div className="unbley-metric-subtext">Cumulative sales revenue</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-blue"><Wallet size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">PENDING PAYOUTS</div>
                    <div className="unbley-metric-value">{formatMoney(payouts.filter(p => p.status !== 'completed').reduce((s, p) => s + (p.total_amount || 0), 0))}</div>
                    <div className="unbley-metric-subtext">Orders awaiting settlement</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><TrendingUp size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">SETTLED</div>
                    <div className="unbley-metric-value">{formatMoney(payouts.filter(p => p.status === 'completed').reduce((s, p) => s + (p.total_amount || 0), 0))}</div>
                    <div className="unbley-metric-subtext">Completed and paid out</div>
                  </div>
                </div>
              </div>

              <div className="unbley-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Payment Details</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Your linked bank account for withdrawals</p>
                  </div>
                  <button onClick={() => { setActiveOnboardingStep('payment'); setShowOnboardingModal(true); }} className="unbley-btn-white" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Pencil size={13} /> Edit
                  </button>
                </div>
                {profileData.bank_name && profileData.account_number ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {[
                      { label: 'Bank', value: profileData.bank_name },
                      { label: 'Account Number', value: profileData.account_number },
                      { label: 'Account Name', value: profileData.account_name || '—' }
                    ].map(item => (
                      <div key={item.label} style={{ background: '#FAFAF9', borderRadius: '10px', padding: '14px 16px', border: '1px solid #F0ECE4' }}>
                        <div style={{ fontSize: '10px', fontWeight: '800', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                    <Landmark size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <div style={{ fontWeight: '700', color: '#374151', marginBottom: '6px' }}>No bank account linked</div>
                    <p style={{ fontSize: '13px', marginBottom: '16px' }}>Add your bank details to receive payouts.</p>
                    <button onClick={() => { setActiveOnboardingStep('payment'); setShowOnboardingModal(true); }} className="unbley-btn-black">Link Bank Account</button>
                  </div>
                )}
              </div>

              <div className="unbley-table-card">
                <div className="unbley-table-header-bar">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Transaction History</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>All orders and their payment statuses</p>
                  </div>
                </div>
                {payouts.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                    No transactions yet. Start selling to see earnings here.
                  </div>
                ) : (
                  <table className="unbley-table">
                    <thead>
                      <tr><th>ORDER</th><th>PRODUCT</th><th>CUSTOMER</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr>
                    </thead>
                    <tbody>
                      {payouts.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: '700', color: '#111827', fontSize: '12px' }}>{p.order_number || `ORD-${p.id.slice(0, 6)}`}</td>
                          <td style={{ fontSize: '12px', color: '#374151' }}>{p.product_name_snapshot || 'Product'}</td>
                          <td style={{ fontSize: '12px', color: '#6B7280' }}>{p.customer_name || '—'}</td>
                          <td style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(p.total_amount)}</td>
                          <td><span className={p.status === 'completed' ? 'unbley-pill-paid' : 'unbley-pill-awaiting'}>{p.status === 'completed' ? 'PAID' : 'PENDING'}</span></td>
                          <td style={{ fontSize: '11px', color: '#9CA3AF' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </main>
          )}

          {/* ─── INSIGHTS TAB ─────────────────────────────────── */}
          {currentTab === 'insights' && (
            <main className="unbley-workspace-container">
              <div className="unbley-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top">
                    <div className="unbley-icon-box-cream"><DollarSign size={18} /></div>
                    <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#15803D' }}>+12.4%</span>
                  </div>
                  <div>
                    <div className="unbley-metric-label">TOTAL REVENUE</div>
                    <div className="unbley-metric-value">{formatMoney(metrics.totalSales)}</div>
                    <div className="unbley-metric-subtext">All-time store revenue</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><Package size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">ACTIVE PRODUCTS</div>
                    <div className="unbley-metric-value">{metrics.activeStock}</div>
                    <div className="unbley-metric-subtext">Live in your catalog</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-blue"><Eye size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">STORE VISITORS</div>
                    <div className="unbley-metric-value">{metrics.totalTraffic}</div>
                    <div className="unbley-metric-subtext">Unique store visits</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><Users size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">TOTAL ORDERS</div>
                    <div className="unbley-metric-value">{metrics.recentOrders.length || 0}</div>
                    <div className="unbley-metric-subtext">Orders placed this period</div>
                  </div>
                </div>
              </div>

              <div className="unbley-card">
                <div className="unbley-chart-header">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Weekly Sales Activity</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Revenue per day — current week</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#F4F2EE', color: '#4B5563', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>THIS WEEK</span>
                </div>
                <div>
                  <div className="unbley-chart-bars-wrap">
                    {weeklyData.map((item, idx) => (
                      <div key={idx} className="unbley-bar-col">
                        <div title={`${item.day}: ${item.value}`} className={`unbley-bar-pillar ${item.isToday ? 'active-today' : ''}`} style={{ height: `${item.pxHeight}px` }} />
                      </div>
                    ))}
                  </div>
                  <div className="unbley-chart-days-row">
                    {weeklyData.map((item, idx) => (
                      <div key={idx} className={`unbley-chart-day-cell ${item.isToday ? 'active-today' : ''}`}>{item.day}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="unbley-card">
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Conversion Rate</h3>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                    {metrics.totalTraffic > 0 ? `${((metrics.recentOrders.length / metrics.totalTraffic) * 100).toFixed(1)}%` : '—'}
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                    {metrics.totalTraffic > 0 ? `${metrics.recentOrders.length} orders from ${metrics.totalTraffic} visitors` : 'No traffic data yet'}
                  </p>
                </div>
                <div className="unbley-card">
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Avg. Order Value</h3>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                    {metrics.recentOrders.length > 0 ? formatMoney(metrics.totalSales / metrics.recentOrders.length) : '—'}
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Per completed order</p>
                </div>
              </div>

              <div className="unbley-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <BarChart2 size={18} color="#6A3E1F" />
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>Store Insights</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  Detailed analytics including top-selling products, traffic sources, and revenue trends will appear here as your store grows. Keep adding products and sharing your store link to build your data.
                </p>
              </div>
            </main>
          )}

        </div>

        {/* Modals */}
        <SuccessModal
          isOpen={showSignupSuccessModal}
          onClose={() => { localStorage.removeItem('unbley_just_signed_up'); setShowSignupSuccessModal(false); setShowOnboardingModal(true); }}
          type="signup"
          data={signupModalData || { name: profileData.owner_name || 'Creator', brandName: profileData.brand_name || 'Isaac Akpasu', email: profileData.email_address || user?.email, userType: 'brand' }}
        />
        <OnboardingModal
          isOpen={showOnboardingModal && !showSignupSuccessModal}
          onClose={() => {
            if (user?.id) localStorage.setItem(`unbley_onboarding_dismissed_${user.id}`, 'true');
            setShowOnboardingModal(false);
            setActiveOnboardingStep(null);
            if (user?.id && !localStorage.getItem(`unbley_dashboard_tour_seen_${user.id}`)) {
              setTimeout(() => setShowDashboardTour(true), 400);
            }
          }}
          activeStep={activeOnboardingStep}
          onRefresh={fetchDashboardData}
          storeData={{ ...profileData, activeStock: metrics.activeStock, store_active: profileData?.store_active || user?.user_metadata?.store_active }}
          storeId={user?.id}
        />
        <DashboardTour
          isActive={showDashboardTour}
          onClose={() => setShowDashboardTour(false)}
          userId={user?.id}
          onSidebarToggle={(open) => setIsSidebarOpen(open)}
          isStoreComplete={progressPct >= 100}
        />
        <ProductsModal
          isOpen={showEditProductModal}
          editProduct={editingProduct}
          onClose={() => {
            setShowEditProductModal(false);
            setEditingProduct(null);
          }}
          onComplete={() => {
            fetchProducts();
            fetchDashboardData();
          }}
        />
      </div>
    </PageTransition>
  );
}
