import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus,
  AlertCircle,
  Crown,
  Gem,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import SuccessModal from '../components/SuccessModal';
import OnboardingModal from '../components/OnboardingModal';
import DashboardTour from '../components/DashboardTour';
import ProductsModal from '../components/onboarding/ProductsModal';
import logoImg from '../assets/logogo.png';

const PAGE_SIZE = 25;
const REVENUE_STATUSES = ['paid', 'completed', 'processing', 'shipped', 'delivered'];
const PENDING_SETTLEMENT_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export default function Dashboard() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const DASHBOARD_TUTORIAL_URL = 'https://www.youtube.com/results?search_query=Unbley+dashboard+guide';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showSignupSuccessModal, setShowSignupSuccessModal] = useState(false);
  const [signupModalData, setSignupModalData] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(null);
  const [showDashboardTour, setShowDashboardTour] = useState(false);
  const [dashboardTourStartStep, setDashboardTourStartStep] = useState(0);
  const [isCompactView, setIsCompactView] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showWelcomeOnboarding, setShowWelcomeOnboarding] = useState(false);
  const [isFirstSignupSession, setIsFirstSignupSession] = useState(false);
  const [welcomeOnboardingStep, setWelcomeOnboardingStep] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);

  useEffect(() => {
    const savedStep = sessionStorage.getItem('unbley_mobile_tour_resume_step');
    if (savedStep !== null) {
      sessionStorage.removeItem('unbley_mobile_tour_resume_step');
      const parsedStep = Number(savedStep);
      setDashboardTourStartStep(Number.isInteger(parsedStep) && parsedStep >= 0 ? parsedStep : 0);
      setShowDashboardTour(true);
    }
  }, []);

  const brandPrimary = '#6A3E1F';
  const brandSoft = '#F6EFEA';
  const brandAccent = '#B98D5B';

  const [profileData, setProfileData] = useState({
    brand_name: 'Isaac Akpasu',
    owner_name: 'Isaac Akpasu',
    email_address: 'diorbaron2@gmail.com',
    phone_number: '09153625566',
    website_url: 'www.zizzystores.com',
    unbley_domain: '',
    custom_domain: '',
    logo_url: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    delivery_duration: '',
    store_active: false,
    trial_ends_at: null
  });
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);

  const [metrics, setMetrics] = useState({
    totalSales: 0,
    activeStock: 0,
    totalTraffic: 0,
    recentOrders: [],
    weeklySales: []
  });

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [dashboardError, setDashboardError] = useState('');
  const [productsError, setProductsError] = useState('');
  const [ordersError, setOrdersError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [productsPage, setProductsPage] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const isMountedRef = useRef(true);
  const dashboardRequestRef = useRef(0);
  const productsRequestRef = useRef(0);
  const ordersRequestRef = useRef(0);
  const dashboardRefreshTimerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const updateViewport = () => setIsCompactView(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (isCompactView) {
      setShowDashboardTour(false);
      sessionStorage.removeItem('unbley_mobile_tour_resume_step');
    }
  }, [isCompactView]);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const currentTabRef = useRef(currentTab);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => () => {
    isMountedRef.current = false;
    if (dashboardRefreshTimerRef.current) clearTimeout(dashboardRefreshTimerRef.current);
  }, []);

  // Onboarding completion logic (mirrors OnboardingModal)
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

  const storeStatusCards = [
    {
      id: 'store_info',
      label: 'Brand identity',
      ready: Boolean(profileData.brand_name && profileData.brand_name !== 'Your Brand' && profileData.logo_url),
      summary: profileData.brand_name && profileData.brand_name !== 'Your Brand'
        ? `${profileData.brand_name} is live with a recognizable brand identity.`
        : 'Brand details are incomplete and not yet customer-ready.',
      actionLabel: 'Review brand',
      accent: profileData.brand_name && profileData.brand_name !== 'Your Brand' && profileData.logo_url ? '#16A34A' : '#D97706'
    },
    {
      id: 'products',
      label: 'Product catalog',
      ready: isProductsDone,
      summary: isProductsDone
        ? `${metrics.activeStock} product${metrics.activeStock !== 1 ? 's' : ''} visible to shoppers.`
        : 'Your storefront needs at least one live product before buyers can place orders.',
      actionLabel: isProductsDone ? 'Manage products' : 'Add product',
      accent: isProductsDone ? '#16A34A' : '#D97706'
    },
    {
      id: 'payment',
      label: 'Checkout + payment',
      ready: isWalletDone,
      summary: isWalletDone
        ? 'Bank and WhatsApp details are configured for buyer communication and payout setup.'
        : 'Payment account and WhatsApp details are not fully connected yet.',
      actionLabel: isWalletDone ? 'Review setup' : 'Complete setup',
      accent: isWalletDone ? '#16A34A' : '#D97706'
    },
    {
      id: 'shipping',
      label: 'Delivery + fulfillment',
      ready: isShippingDone,
      summary: isShippingDone
        ? `Delivery timing is set to ${profileData.delivery_duration}.`
        : 'No delivery setup is configured yet, so buyers will not know shipping expectations.',
      actionLabel: isShippingDone ? 'Review delivery' : 'Set delivery',
      accent: isShippingDone ? '#16A34A' : '#D97706'
    },
    {
      id: 'subscription',
      label: 'Support + visibility',
      ready: isPlanDone,
      summary: isPlanDone
        ? 'Your store is active and visible to customers.'
        : 'The storefront is still missing the activation layer needed for a complete launch.',
      actionLabel: isPlanDone ? 'View plan' : 'Activate store',
      accent: isPlanDone ? '#16A34A' : '#D97706'
    }
  ];

  const hasActivePlan = Boolean(
    user?.store_active &&
    user?.plan_id &&
    user?.plan_ends_at &&
    new Date(user.plan_ends_at) > new Date(currentTime)
  );
  const isActiveTrial = Boolean(
    user?.store_active &&
    user?.trial_ends_at &&
    new Date(user.trial_ends_at) > new Date(currentTime)
  );
  const dashboardPlanName = user?.plan_id === 'business'
    ? 'Business'
    : user?.plan_id === 'starter'
      ? 'Starter'
      : isActiveTrial
        ? 'Free Trial'
        : null;
  const dashboardPlanEndsAt = hasActivePlan ? user.plan_ends_at : user?.trial_ends_at;
  const dashboardDaysLeft = dashboardPlanEndsAt
    ? Math.max(0, Math.ceil((new Date(dashboardPlanEndsAt).getTime() - currentTime) / 86400000))
    : 0;
  const dashboardPlanIsYearly = hasActivePlan && user?.plan_interval === 'yearly';
  const dashboardPlanAccent = dashboardPlanIsYearly ? '#B8862C' : '#7C8795';
  const dashboardPlanSurface = user?.plan_id === 'business' ? '#FFF8ED' : '#F5F7FA';
  const dashboardPlanBorder = user?.plan_id === 'business' ? '#E8C98A' : '#CBD5E1';
  const DashboardPlanIcon = user?.plan_id === 'business' ? Crown : isActiveTrial ? Sparkles : Gem;

  // Data fetch
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    const requestId = ++dashboardRequestRef.current;
    setDashboardError('');

    const fallbackProfile = {
      brand_name: user?.user_metadata?.brand_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Your Brand',
      owner_name: user?.user_metadata?.full_name || user?.user_metadata?.brand_name || 'Brand Owner',
      email_address: user?.email || '',
      phone_number: user?.user_metadata?.phone_number || '',
      website_url: user?.user_metadata?.website_url || '',
      unbley_domain: user?.user_metadata?.unbley_domain || '',
      custom_domain: user?.user_metadata?.custom_domain || '',
      logo_url: user?.user_metadata?.logo_url || '',
      bank_name: user?.user_metadata?.bank_name || '',
      account_number: user?.user_metadata?.account_number || '',
      account_name: user?.user_metadata?.account_name || '',
      delivery_duration: user?.user_metadata?.delivery_duration || '',
      store_active: Boolean(user?.user_metadata?.store_active),
      trial_ends_at: user?.user_metadata?.trial_ends_at || null
    };

    try {
      const { data: pData, error: profileError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw new Error(`Could not load your store profile: ${profileError.message}`);

      if (!isMountedRef.current || requestId !== dashboardRequestRef.current) return;

      setProfileDataLoaded(true);

      setProfileData(prev => ({
        ...prev,
        ...fallbackProfile,
        ...(pData ? Object.fromEntries(Object.entries(pData).filter(([_, v]) => v != null && v !== '')) : {})
      }));

      const { count: stockCount, error: stockError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('brand_id', user.id)
        .eq('status', 'active');
      if (stockError) throw new Error(`Could not load product totals: ${stockError.message}`);

      if (!isMountedRef.current || requestId !== dashboardRequestRef.current) return;
      setMetrics(currentMetrics => ({ ...currentMetrics, activeStock: stockCount || 0 }));

      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('brand_id', user.id)
        .in('status', REVENUE_STATUSES);
      if (salesError) throw new Error(`Could not load sales totals: ${salesError.message}`);
      
      const calcSales = salesData && salesData.length > 0
        ? salesData.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)
        : 0;

      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - 6);
      const { data: weeklyOrders, error: weeklyOrdersError } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .eq('brand_id', user.id)
        .in('status', [...REVENUE_STATUSES, 'cancelled'])
        .gte('created_at', weekStart.toISOString());
      if (weeklyOrdersError) throw new Error(`Could not load weekly sales: ${weeklyOrdersError.message}`);
      const paidStatuses = new Set(['paid', 'completed', 'processing', 'shipped', 'delivered']);
      const weeklyTotals = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + index);
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        return {
          day,
          total: (weeklyOrders || [])
            .filter(order => paidStatuses.has(String(order.status).toLowerCase()) && new Date(order.created_at) >= day && new Date(order.created_at) < nextDay)
            .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)
        };
      });
      const maxWeeklyTotal = Math.max(...weeklyTotals.map(item => item.total), 0);

      const { count: trafficCount, error: trafficError } = await supabase
        .from('store_traffic')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', user.id);
      if (trafficError) console.warn('Could not load traffic totals:', trafficError.message);

      const { data: lastOrders, error: recentOrdersError } = await supabase
        .from('orders')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentOrdersError) throw new Error(`Could not load recent orders: ${recentOrdersError.message}`);

      if (!isMountedRef.current || requestId !== dashboardRequestRef.current) return;

      setMetrics({
        totalSales: calcSales,
        activeStock: stockCount || 0,
        totalTraffic: trafficCount || 0,
        recentOrders: lastOrders || [],
        weeklySales: weeklyTotals.map((item, index) => ({
          day: `${item.day.toLocaleDateString('en-US', { weekday: 'short' })}${index === 6 ? ' (Today)' : ''}`,
          pxHeight: maxWeeklyTotal > 0 ? Math.max(8, Math.round((item.total / maxWeeklyTotal) * 140)) : 8,
          isToday: index === 6,
          value: formatMoney(item.total)
        }))
      });
    } catch (err) {
      console.error('Error loading live dashboard data:', err);
      if (isMountedRef.current && requestId === dashboardRequestRef.current) setDashboardError(err.message || 'Could not load dashboard data.');
    }
  }, [user]);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    const requestId = ++productsRequestRef.current;
    setProductsLoading(true);
    setProductsError('');
    try {
      const from = productsPage * PAGE_SIZE;
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      if (!isMountedRef.current || requestId !== productsRequestRef.current) return;
      setProducts(data || []);
      setProductsTotal(count || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (isMountedRef.current && requestId === productsRequestRef.current) setProductsError(err.message || 'Could not load products.');
    } finally {
      if (isMountedRef.current && requestId === productsRequestRef.current) setProductsLoading(false);
    }
  }, [user, productsPage]);

  const fetchAllOrders = useCallback(async () => {
    if (!user) return;
    const requestId = ++ordersRequestRef.current;
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const from = ordersPage * PAGE_SIZE;
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('brand_id', user.id)
        .in('status', ['paid', 'completed', 'processing', 'shipped', 'delivered', 'cancelled'])
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      if (!isMountedRef.current || requestId !== ordersRequestRef.current) return;
      setAllOrders(data || []);
      setOrdersTotal(count || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (isMountedRef.current && requestId === ordersRequestRef.current) setOrdersError(err.message || 'Could not load orders.');
      toast?.error('Could not load orders');
    } finally {
      if (isMountedRef.current && requestId === ordersRequestRef.current) setOrdersLoading(false);
    }
  }, [user, toast, ordersPage]);

  const scheduleDashboardRefresh = useCallback(() => {
    if (dashboardRefreshTimerRef.current) clearTimeout(dashboardRefreshTimerRef.current);
    dashboardRefreshTimerRef.current = setTimeout(() => {
      dashboardRefreshTimerRef.current = null;
      fetchDashboardData();
    }, 500);
  }, [fetchDashboardData]);

  const handleProductRealtime = useCallback((payload) => {
    const eventType = payload.eventType;
    const nextProduct = payload.new;
    const previousProduct = payload.old;

    setProducts((currentProducts) => {
      if (eventType === 'INSERT' && nextProduct?.id) return [nextProduct, ...currentProducts.filter((product) => product.id !== nextProduct.id)];
      if (eventType === 'UPDATE' && nextProduct?.id) return currentProducts.map((product) => product.id === nextProduct.id ? { ...product, ...nextProduct } : product);
      if (eventType === 'DELETE' && previousProduct?.id) return currentProducts.filter((product) => product.id !== previousProduct.id);
      return currentProducts;
    });

    setMetrics((currentMetrics) => {
      const previousActive = previousProduct?.status === 'active';
      const nextActive = nextProduct?.status === 'active';
      let activeStockDelta = 0;
      if (eventType === 'INSERT' && nextActive) activeStockDelta = 1;
      if (eventType === 'DELETE' && previousActive) activeStockDelta = -1;
      if (eventType === 'UPDATE') activeStockDelta = Number(nextActive) - Number(previousActive);
      return activeStockDelta === 0 ? currentMetrics : { ...currentMetrics, activeStock: Math.max(0, currentMetrics.activeStock + activeStockDelta) };
    });
  }, []);

  const refreshRecentOrders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('brand_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error refreshing recent orders:', error);
      return;
    }

    if (!isMountedRef.current) return;
    setMetrics((currentMetrics) => ({ ...currentMetrics, recentOrders: data || [] }));
  }, [user]);

  const handleOrderRealtime = useCallback((payload) => {
    const eventType = payload.eventType;
    const nextOrder = payload.new;
    const previousOrder = payload.old;
    const orderId = nextOrder?.id || previousOrder?.id;
    if (!orderId) return;

    setAllOrders((currentOrders) => {
      if (eventType === 'INSERT' && nextOrder) return [nextOrder, ...currentOrders.filter((order) => order.id !== orderId)];
      if (eventType === 'UPDATE' && nextOrder) return currentOrders.some((order) => order.id === orderId)
        ? currentOrders.map((order) => order.id === orderId ? { ...order, ...nextOrder } : order)
        : [nextOrder, ...currentOrders];
      if (eventType === 'DELETE') return currentOrders.filter((order) => order.id !== orderId);
      return currentOrders;
    });

    setMetrics((currentMetrics) => {
      const previousAmount = Number(previousOrder?.total_amount) || 0;
      const nextAmount = Number(nextOrder?.total_amount) || 0;
      const salesDelta = eventType === 'INSERT' ? nextAmount : eventType === 'DELETE' ? -previousAmount : nextAmount - previousAmount;
      return { ...currentMetrics, totalSales: Math.max(0, currentMetrics.totalSales + salesDelta) };
    });

    void refreshRecentOrders();
  }, [refreshRecentOrders]);

  const fetchPayouts = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at, customer_name, product_name_snapshot')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setPayouts(data || []);
      setWalletError('');
    } catch (err) {
      console.error('Error fetching payouts:', err);
      setWalletError(err.message || 'Could not load payout data.');
    }
  }, [user]);

  const fetchWithdrawalRequests = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setWithdrawalRequests(data || []);
      setWalletError('');
    } catch (err) {
      // Table may not exist yet, gracefully handle
      console.error('Error fetching withdrawal requests:', err);
      setWalletError(err.message || 'Could not load withdrawal requests.');
    }
  }, [user]);

  const fetchAvailableBalance = useCallback(async () => {
    if (!user) return;

    let ledgerAvailable = 0;
    let ledgerPending = 0;

    try {
      const { data: ledgerData, error: ledgerError } = await supabase
        .from('merchant_financial_transactions')
        .select('amount, type, status, available_at')
        .eq('merchant_id', user.id);

      if (!ledgerError && Array.isArray(ledgerData)) {
        ledgerAvailable = (ledgerData || [])
          .filter(entry => entry.type === 'PAYMENT' && (entry.status === 'AVAILABLE' || entry.status === 'POSTED'))
          .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

        ledgerPending = (ledgerData || [])
          .filter(entry => entry.type === 'PAYMENT' && entry.status === 'PENDING')
          .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
      }
    } catch (error) {
      console.warn('Ledger balance not available yet:', error);
    }

    const [{ data: orderData, error: orderError }, { data: requestData, error: requestError }] = await Promise.all([
      supabase.from('orders').select('total_amount, status').eq('brand_id', user.id),
      supabase.from('withdrawal_requests').select('amount, status').eq('brand_id', user.id)
    ]);
    if (orderError || requestError) {
      const error = orderError || requestError;
      console.error('Error calculating available balance:', error);
      setWalletError(error.message || 'Could not calculate available balance.');
      return;
    }

    const completedSales = (orderData || [])
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
    const reservedWithdrawals = (requestData || [])
      .filter(request => request.status === 'pending' || request.status === 'approved')
      .reduce((sum, request) => sum + (Number(request.amount) || 0), 0);

    const fallbackAvailable = Math.max(0, completedSales - reservedWithdrawals);
    const nextAvailableBalance = ledgerAvailable > 0 ? Math.max(ledgerAvailable, fallbackAvailable) : fallbackAvailable;
    const nextPendingBalance = ledgerPending > 0 ? Math.max(ledgerPending, 0) : Math.max(0, completedSales - nextAvailableBalance);

    setAvailableBalance(nextAvailableBalance);
    setPendingBalance(nextPendingBalance);
    setWalletError('');
  }, [user]);
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
      setIsFirstSignupSession(true);
      setSignupModalData(successInfo);
      setShowSignupSuccessModal(true);
    } else {
      const justSignedUpRaw = localStorage.getItem('unbley_just_signed_up');
      if (justSignedUpRaw) {
        try {
          const parsed = JSON.parse(justSignedUpRaw);
          localStorage.removeItem('unbley_just_signed_up');
          setIsFirstSignupSession(true);
          setSignupModalData(parsed);
          setShowSignupSuccessModal(true);
        } catch (e) {
          console.error('Error reading signup session:', e);
        }
      }
    }
  }, [user, location.search]);

  // Main data + realtime
  const brandDisplayName = profileData?.brand_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'your brand';

  const firstMissingSetup = (() => {
    if (!profileData.logo_url || !profileData.brand_name || profileData.brand_name === 'Your Brand') return 'store_info';
    if (!isProductsDone) return 'products';
    if (!isWalletDone) return 'payment';
    if (!isShippingDone) return 'shipping';
    if (!isPlanDone) return 'subscription';
    return null;
  })();

  const welcomeSlides = [
    {
      title: `Welcome to ${brandDisplayName}`,
      text: `Your dashboard is the control center for ${brandDisplayName}. Review your overview, watch your live activity, and get ready to launch your store.` ,
      highlight: 'Action: open the Overview tab and check your store health before editing anything.'
    },
    {
      title: 'Create your brand identity',
      text: `Use Edit to upload your logo, choose your colors, add a banner, and share the story behind ${brandDisplayName}.`,
      highlight: 'Action: update your logo and banner first so your storefront looks polished and trustworthy.'
    },
    {
      title: 'Add your first products',
      text: 'List your best items with clear photos, prices, and descriptions so customers can browse and buy with confidence.',
      highlight: 'Action: add at least one product to make your store active and ready for orders.'
    },
    {
      title: 'Complete payments and delivery',
      text: 'Connect your payment method and set delivery charges before sharing your store. This helps customers complete checkout smoothly.',
      highlight: 'Action: finish your payment and delivery setup, then share your store link.'
    }
  ];

  const handleWelcomeSetupLaunch = useCallback((neverShow = false) => {
    if (user?.id && neverShow) {
      localStorage.setItem(`unbley_welcome_onboarding_never_show_${user.id}`, 'true');
    }
    setShowWelcomeOnboarding(false);
    setWelcomeOnboardingStep(0);
    if (firstMissingSetup) {
      setActiveOnboardingStep(firstMissingSetup);
      setShowOnboardingModal(true);
      return;
    }
    if (!isCompactView && !neverShow && user?.id && !localStorage.getItem(`unbley_dashboard_tour_seen_${user.id}`)) {
      setTimeout(() => setShowDashboardTour(true), 200);
    }
  }, [firstMissingSetup, user?.id, isCompactView]);

  const finishWelcomeOnboarding = useCallback((neverShow = false) => {
    if (user?.id) {
      localStorage.setItem(`unbley_welcome_onboarding_seen_${user.id}`, 'true');
      if (neverShow) {
        localStorage.setItem(`unbley_welcome_onboarding_never_show_${user.id}`, 'true');
      }
    }
    handleWelcomeSetupLaunch(neverShow);
  }, [handleWelcomeSetupLaunch, user?.id]);

  useEffect(() => {
    if (!user) return;
    const hasSeenWelcome = localStorage.getItem(`unbley_welcome_onboarding_seen_${user.id}`) === 'true';
    const hasDismissedWelcome = localStorage.getItem(`unbley_welcome_onboarding_never_show_${user.id}`) === 'true';
    if (isFirstSignupSession && !hasSeenWelcome && !hasDismissedWelcome && !showSignupSuccessModal && !showOnboardingModal && !showDashboardTour) {
      setShowWelcomeOnboarding(true);
    }
  }, [user, isFirstSignupSession, showSignupSuccessModal, showOnboardingModal, showDashboardTour]);

  useEffect(() => {
    if (!user) return;
    setProfileDataLoaded(false);
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
      ).subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') scheduleDashboardRefresh();
      });

    const productsChannel = supabase
      .channel(`dashboard_products_${user.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `brand_id=eq.${user.id}` },
        (payload) => handleProductRealtime(payload)
      ).subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') scheduleDashboardRefresh();
      });

    const ordersChannel = supabase
      .channel(`dashboard_orders_${user.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `brand_id=eq.${user.id}` },
        (payload) => {
          handleOrderRealtime(payload);
          if (currentTabRef.current === 'overview') {
            scheduleDashboardRefresh();
            void refreshRecentOrders();
          }
        }
      ).subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') scheduleDashboardRefresh();
      });

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [user, fetchDashboardData, handleProductRealtime, handleOrderRealtime, scheduleDashboardRefresh, refreshRecentOrders]);

  useEffect(() => {
    if (!user) return undefined;

    const synchronizeOnVisible = () => {
      if (document.visibilityState !== 'visible') return;
      fetchDashboardData();
      if (currentTabRef.current === 'products') fetchProducts();
      if (currentTabRef.current === 'orders') fetchAllOrders();
      if (currentTabRef.current === 'wallet') {
        fetchPayouts();
        fetchWithdrawalRequests();
        fetchAvailableBalance();
      }
    };

    const synchronizeOnOnline = () => synchronizeOnVisible();
    document.addEventListener('visibilitychange', synchronizeOnVisible);
    window.addEventListener('online', synchronizeOnOnline);
    return () => {
      document.removeEventListener('visibilitychange', synchronizeOnVisible);
      window.removeEventListener('online', synchronizeOnOnline);
    };
  }, [user, fetchDashboardData, fetchProducts, fetchAllOrders, fetchPayouts, fetchWithdrawalRequests, fetchAvailableBalance]);

  // Tab-specific fetches
  useEffect(() => {
    if (currentTab === 'products') fetchProducts();
    if (currentTab === 'orders') fetchAllOrders();
    if (currentTab === 'wallet') {
      fetchPayouts();
      fetchWithdrawalRequests();
      fetchAvailableBalance();
    }
  }, [currentTab, fetchProducts, fetchAllOrders, fetchPayouts, fetchWithdrawalRequests, fetchAvailableBalance]);

  useEffect(() => {
    if (!user || currentTab !== 'wallet') return undefined;

    const withdrawalChannel = supabase
      .channel(`dashboard_withdrawals_${user.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawal_requests', filter: `brand_id=eq.${user.id}` },
        () => { fetchWithdrawalRequests(); fetchAvailableBalance(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(withdrawalChannel);
    };
  }, [user, currentTab, fetchWithdrawalRequests, fetchAvailableBalance]);

  const toStoreUrl = (domain) => {
    if (!domain) return '#';
    return domain.startsWith('http') ? domain : `https://${domain}`;
  };

  const handleShareStore = () => {
    const storeDomain = profileData.custom_domain || profileData.unbley_domain || profileData.website_url;
    const storeUrl = storeDomain ? toStoreUrl(storeDomain) : `${window.location.origin}/shop-brand/${user?.id || 'demo'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      toast?.success('Store link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('brand_id', user.id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast?.success('Product deleted');
      fetchDashboardData();
    } catch {
      toast?.error('Failed to delete product');
    }
  };

  const fulfillmentOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const itemStatusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const updateFulfillmentStatus = async (orderId, nextStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({
        fulfillment_status: nextStatus
      })
      .eq('id', orderId)
      .eq('brand_id', user.id);

    if (error) {
      toast?.error('Could not update order status. Apply the order fulfillment migration first.');
      return;
    }

    setMetrics(prev => ({
      ...prev,
      recentOrders: prev.recentOrders.map(order => order.id === orderId
        ? { ...order, fulfillment_status: nextStatus }
        : order)
    }));
    setAllOrders(prev => prev.map(order => order.id === orderId
      ? { ...order, fulfillment_status: nextStatus }
      : order));
    notifyOrderStatus(orderId, nextStatus);
    toast?.success('Order status updated');
  };

  const updateOrderItemStatus = async (orderId, itemIndex, nextStatus) => {
    const order = allOrders.find(item => item.id === orderId);
    if (!order) return;
    const items = Array.isArray(order.items) ? order.items : [];
    const nextItems = items.map((item, index) => index === itemIndex
      ? { ...item, fulfillment_status: nextStatus }
      : item);
    const { error } = await supabase
      .from('orders')
      .update({ items: nextItems })
      .eq('id', orderId)
      .eq('brand_id', user.id);
    if (error) {
      toast?.error('Could not update this item status');
      return;
    }
    setAllOrders(prev => prev.map(item => item.id === orderId ? { ...item, items: nextItems } : item));
    setMetrics(prev => ({
      ...prev,
      recentOrders: prev.recentOrders.map(item => item.id === orderId ? { ...item, items: nextItems } : item)
    }));
    notifyOrderStatus(orderId, nextStatus);
    toast?.success('Item status updated');
  };

  const notifyOrderStatus = async (orderId, nextStatus) => {
    const order = allOrders.find(item => item.id === orderId) || metrics.recentOrders.find(item => item.id === orderId);
    if (!order?.customer_email) return;
    try {
      await fetch('/api/orders/status-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ orderId, status: nextStatus })
      });
    } catch (error) {
      console.warn('Order status notification failed:', error);
    }
  };

  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      setWithdrawalError('Please enter a valid amount');
      return;
    }
    if (amount > availableBalance) {
      setWithdrawalError(`Amount exceeds your available balance of ${formatMoney(availableBalance)}`);
      return;
    }

    setWithdrawalLoading(true);
    setWithdrawalError(null);

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert([
          {
            brand_id: user.id,
            brand_name: profileData.brand_name || 'Unknown Brand',
            amount: amount,
            bank_name: profileData.bank_name || '',
            account_number: profileData.account_number || '',
            account_name: profileData.account_name || '',
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast?.success('Withdrawal request submitted successfully!');
      setWithdrawalAmount('');
      setShowWithdrawalModal(false);
      fetchWithdrawalRequests();
      fetchAvailableBalance();
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      setWithdrawalError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const formatMoney = (amount) => '₦' + Number(amount || 0).toLocaleString();

  const ordersToDisplay = (metrics.recentOrders || []).map(order => ({
    id: order.id,
    order_number: order.order_number || `ORD-${order.id.slice(0, 6)}`,
    time: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    item_name: order.product_name_snapshot || 'Catalog Product (x1)',
    buyer_name: order.customer_name || 'Store Customer',
    amount: order.total_amount || 0,
    payment_status: ['paid', 'completed'].includes(String(order.status).toLowerCase()) ? 'PAID' : 'AWAITING PAY',
    fulfillment_status: order.fulfillment_status || 'pending',
    order_status: ['paid', 'processing', 'shipped', 'delivered', 'cancelled'].includes(String(order.fulfillment_status).toLowerCase())
      ? String(order.fulfillment_status).toLowerCase()
      : 'paid',
    isDemo: false
  }));

  const weeklyData = metrics.weeklySales.length > 0 ? metrics.weeklySales : Array.from({ length: 7 }, (_, index) => ({
    day: `${new Date(Date.now() - (6 - index) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}${index === 6 ? ' (Today)' : ''}`,
    pxHeight: 8,
    isToday: index === 6,
    value: '₦0'
  }));

  const tabTitles = { overview: 'Dashboard', orders: 'Orders', products: 'Products', wallet: 'Wallet', insights: 'Store Insights' };
  const tabSubtitles = {
    overview: "Welcome back, here is your store's performance today.",
    orders: 'Review paid orders and keep customers updated as you fulfill them.',
    products: 'Manage your product catalog in real-time.',
    wallet: 'View your earnings and payment details.',
    insights: 'Detailed analytics for your store.'
  };

  return (
    <PageTransition>
      <div className="unbley-app-layout">
        <Sidebar profileData={profileData} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="unbley-main-content">

          {(dashboardError || (currentTab === 'products' && productsError) || (currentTab === 'orders' && ordersError) || (currentTab === 'wallet' && walletError)) && (
            <div role="alert" style={{ margin: '16px 24px 0', padding: '12px 16px', border: '1px solid #F3B4B4', borderRadius: '8px', background: '#FFF5F5', color: '#991B1B', fontSize: '13px' }}>
              {dashboardError || productsError || ordersError || walletError}
            </div>
          )}

          {/* Top Header */}
          <header className="unbley-top-header">
            <div className="unbley-header-left">
              <button
                id="tour-mobile-menu-trigger"
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
                {profileDataLoaded && progressPct < 100 && completedSteps < totalSteps && currentTab === 'overview' && (
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
              <button
                id="tour-guide-trigger"
                onClick={() => {
                  if (isCompactView) {
                    setShowTutorialModal(true);
                    return;
                  }
                  setShowDashboardTour(true);
                }}
                className="unbley-btn-white"
              >
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
                  <a href={toStoreUrl(profileData.custom_domain || profileData.unbley_domain || profileData.website_url)} target="_blank" rel="noreferrer" className="unbley-storefront-link">
                    <span>{profileData.custom_domain || profileData.unbley_domain || profileData.website_url || 'Your store domain is being prepared'}</span>
                    <ArrowUpRight size={14} color="#6B7280" />
                  </a>
                </div>
              </div>

              {dashboardPlanName && (
                <div
                  className="unbley-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '18px',
                    padding: '18px 22px',
                    background: dashboardPlanSurface,
                    border: `1px solid ${dashboardPlanBorder}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '13px', minWidth: 0 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background: '#FFFFFF',
                      border: `1px solid ${dashboardPlanAccent}55`,
                      color: dashboardPlanAccent
                    }}>
                      <DashboardPlanIcon size={20} strokeWidth={2.2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: dashboardPlanAccent, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Your current plan
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#221510' }}>
                        Unbley {dashboardPlanName}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '22px', lineHeight: 1, fontWeight: '800', color: '#221510' }}>
                      {dashboardDaysLeft}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', marginTop: '5px' }}>
                      {dashboardDaysLeft === 1 ? 'day' : 'days'} left{hasActivePlan ? ` · ${dashboardPlanIsYearly ? 'Yearly' : 'Monthly'}` : ''}
                    </div>
                  </div>
                </div>
              )}

              {profileDataLoaded && completedSteps < totalSteps && storeStatusCards.some(item => !item.ready) && (
              <div className="unbley-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.12em', color: '#8D5B36', textTransform: 'uppercase' }}>Store health</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '6px 0 0' }}>Business readiness overview</h3>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#6B7280', background: '#F3F4F6', borderRadius: '999px', padding: '6px 10px' }}>
                    {storeStatusCards.filter(item => item.ready).length}/{storeStatusCards.length} ready
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {storeStatusCards.map((item) => (
                    <div key={item.id} style={{ border: '1px solid #EAE3D9', borderRadius: '12px', background: item.ready ? '#F5F9F5' : '#FFF9F2', padding: '14px 14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#111827', letterSpacing: '0.02em' }}>{item.label}</span>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 7px', borderRadius: '999px', background: item.ready ? 'rgba(22, 163, 74, 0.12)' : 'rgba(217, 119, 6, 0.12)', color: item.accent, textTransform: 'uppercase' }}>
                          {item.ready ? 'Ready' : 'Needs attention'}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>{item.summary}</p>
                      <button
                        onClick={() => {
                          if (item.id === 'subscription') setActiveOnboardingStep('subscription');
                          else if (item.id === 'products') setActiveOnboardingStep('products');
                          else if (item.id === 'payment') setActiveOnboardingStep('payment');
                          else if (item.id === 'shipping') setActiveOnboardingStep('shipping');
                          else setActiveOnboardingStep('store_info');
                          setShowOnboardingModal(true);
                        }}
                        style={{ marginTop: '12px', width: '100%', border: 'none', borderRadius: '8px', background: item.ready ? '#111827' : '#6A3E1F', color: '#FFFFFF', padding: '9px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                      >
                        {item.actionLabel}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Setup Guide Card — hidden once 100% complete */}
              {profileDataLoaded && progressPct < 100 && (
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
                        {ordersToDisplay.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ padding: '22px 12px', textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>
                              No recent customer orders yet.
                            </td>
                          </tr>
                        ) : ordersToDisplay.map((order) => (
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
                              {order.isDemo ? (
                                <span className={order.fulfillment_status === 'SHIPPED' ? 'unbley-pill-shipped' : order.fulfillment_status === 'DELIVERED' ? 'unbley-pill-delivered' : 'unbley-pill-ready'}>
                                  {order.fulfillment_status}
                                </span>
                              ) : (
                                <select
                                  value={order.order_status}
                                  onChange={(event) => updateFulfillmentStatus(order.id, event.target.value)}
                                  aria-label={`Update fulfillment status for ${order.order_number}`}
                                  style={{ border: '1px solid #E5E7EB', borderRadius: '7px', background: '#FFFFFF', color: '#374151', padding: '6px 8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', maxWidth: '150px' }}
                                >
                                  {fulfillmentOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                              )}
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

          {currentTab === 'orders' && (
            <main className="unbley-workspace-container">
              <div className="unbley-table-card">
                <div className="unbley-table-header-bar">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>All Paid Orders</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Update fulfillment as each order moves to the customer.</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#6B7280' }}>{ordersTotal} order{ordersTotal === 1 ? '' : 's'}</span>
                </div>
                {ordersLoading ? (
                  <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9CA3AF' }}>Loading orders...</div>
                ) : allOrders.length === 0 ? (
                  <div style={{ padding: '60px 24px', textAlign: 'center', color: '#6B7280' }}>No paid orders yet.</div>
                ) : (
                  <table className="unbley-table">
                    <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>AMOUNT</th><th>PAYMENT</th><th>STATUS</th></tr></thead>
                    <tbody>
                      {allOrders.map(order => {
                        const status = ['paid', 'processing', 'shipped', 'delivered', 'cancelled'].includes(String(order.fulfillment_status).toLowerCase()) ? String(order.fulfillment_status).toLowerCase() : 'paid';
                        return (
                          <React.Fragment key={order.id}>
                            <tr>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} aria-label={`${expandedOrderId === order.id ? 'Collapse' : 'Expand'} ${order.order_number}`} style={{ border: 'none', background: 'none', padding: 0, color: '#111827', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>{expandedOrderId === order.id ? '−' : '+'}</span>
                                  <span>{order.order_number}</span>
                                </button>
                                {Array.isArray(order.items) && order.items.length > 0 && (
                                  <div title={`${order.items.length} item${order.items.length === 1 ? '' : 's'} in this order`} style={{ display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
                                    {order.items.slice(0, 3).map((item, itemIndex) => (
                                      item.image_url ? (
                                        <img key={`${order.id}-thumb-${itemIndex}`} src={item.image_url} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: itemIndex === 0 ? '-5px' : '-8px', boxShadow: '0 1px 4px rgba(34,21,16,0.15)' }} />
                                      ) : (
                                        <div key={`${order.id}-thumb-${itemIndex}`} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F4F2EE', border: '2px solid #FFFFFF', marginLeft: itemIndex === 0 ? '-5px' : '-8px', display: 'grid', placeItems: 'center', boxShadow: '0 1px 4px rgba(34,21,16,0.15)' }}><Package size={12} color="#9CA3AF" /></div>
                                      )
                                    ))}
                                    {order.items.length > 3 && <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6A3E1F', border: '2px solid #FFFFFF', marginLeft: '-8px', display: 'grid', placeItems: 'center', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', boxShadow: '0 1px 4px rgba(34,21,16,0.15)' }}>+{order.items.length - 3}</span>}
                                  </div>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', color: '#8C827A', marginTop: '3px' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</div>
                            </td>
                            <td>{order.customer_name || 'Store Customer'}<div style={{ fontSize: '11px', color: '#8C827A', marginTop: '3px' }}>{order.customer_email || 'No email'}</div></td>
                            <td style={{ fontWeight: '800' }}>{formatMoney(order.total_amount)}</td>
                            <td><span className="unbley-pill-paid">{order.transaction_id ? 'PAID' : String(order.status || 'PENDING').toUpperCase()}</span></td>
                            <td>
                              <select value={status} onChange={(event) => updateFulfillmentStatus(order.id, event.target.value)} aria-label={`Update status for ${order.order_number}`} style={{ border: '1px solid #E5E7EB', borderRadius: '7px', background: '#FFFFFF', color: '#374151', padding: '7px 9px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                                {fulfillmentOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                              </select>
                            </td>
                            </tr>
                            {expandedOrderId === order.id && (
                            <tr>
                              <td colSpan="5" style={{ background: '#FBF9F5', padding: '14px 18px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#8D5B36', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Items in this order</div>
                                {Array.isArray(order.items) && order.items.length > 0 ? order.items.map((item, itemIndex) => (
                                  <div key={`${order.id}-item-${itemIndex}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderTop: '1px solid #EAE3D9', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                      {item.image_url ? (
                                        <img src={item.image_url} alt={item.name || item.title || 'Ordered product'} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                      ) : (
                                        <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#F4F2EE', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Package size={16} color="#9CA3AF" /></div>
                                      )}
                                      <div>
                                      <div style={{ fontWeight: '700', color: '#111827', fontSize: '13px' }}>{item.qty || 1}x {item.name || item.title || 'Product'}</div>
                                      {item.price !== undefined && <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatMoney(item.price)} each</div>}
                                    </div>
                                    </div>
                                    <select value={item.fulfillment_status || 'paid'} onChange={(event) => updateOrderItemStatus(order.id, itemIndex, event.target.value)} aria-label={`Update ${item.name || item.title || 'item'} status`} style={{ border: '1px solid #E5E7EB', borderRadius: '7px', background: '#FFFFFF', color: '#374151', padding: '7px 9px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                                      {itemStatusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                  </div>
                                )) : <div style={{ color: '#6B7280', fontSize: '12px' }}>Item details are not available for this order.</div>}
                              </td>
                            </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {ordersTotal > PAGE_SIZE && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: '1px solid #F0ECE4' }}>
                    <button type="button" onClick={() => setOrdersPage((page) => Math.max(0, page - 1))} disabled={ordersPage === 0 || ordersLoading} className="unbley-btn-white">Previous</button>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Page {ordersPage + 1} of {Math.ceil(ordersTotal / PAGE_SIZE)}</span>
                    <button type="button" onClick={() => setOrdersPage((page) => page + 1)} disabled={(ordersPage + 1) * PAGE_SIZE >= ordersTotal || ordersLoading} className="unbley-btn-white">Next</button>
                  </div>
                )}
              </div>
            </main>
          )}

          {/* ─── PRODUCTS TAB ─────────────────────────────────── */}
          {currentTab === 'products' && (
            <main className="unbley-workspace-container">
              <div className="unbley-card unbley-product-catalog-card" style={{ padding: '0' }}>
                <div className="unbley-product-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F0ECE4' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Product Catalog</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                      {productsLoading ? 'Loading…' : `${productsTotal} product${productsTotal !== 1 ? 's' : ''} in your store`}
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
                  <table className="unbley-table unbley-product-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>PRODUCT</th><th>PRICE</th><th>STATUS</th><th>ADDED</th><th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td data-label="PRODUCT">
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
                          <td data-label="PRICE" style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(p.price)}</td>
                          <td data-label="STATUS">
                            <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', backgroundColor: p.status === 'active' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'active' ? '#15803D' : '#92400E' }}>
                              {(p.status || 'active').toUpperCase()}
                            </span>
                          </td>
                          <td data-label="ADDED" style={{ fontSize: '12px', color: '#6B7280' }}>
                            {p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                          </td>
                          <td data-label="ACTIONS">
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
                {productsTotal > PAGE_SIZE && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: '1px solid #F0ECE4' }}>
                    <button type="button" onClick={() => setProductsPage((page) => Math.max(0, page - 1))} disabled={productsPage === 0 || productsLoading} className="unbley-btn-white">Previous</button>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Page {productsPage + 1} of {Math.ceil(productsTotal / PAGE_SIZE)}</span>
                    <button type="button" onClick={() => setProductsPage((page) => page + 1)} disabled={(productsPage + 1) * PAGE_SIZE >= productsTotal || productsLoading} className="unbley-btn-white">Next</button>
                  </div>
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
                    <div className="unbley-metric-label">PENDING BALANCE</div>
                    <div className="unbley-metric-value">{formatMoney(pendingBalance)}</div>
                    <div className="unbley-metric-subtext">Funds waiting for settlement</div>
                  </div>
                </div>
                <div className="unbley-metric-card">
                  <div className="unbley-metric-top"><div className="unbley-icon-box-cream"><TrendingUp size={18} /></div></div>
                  <div>
                    <div className="unbley-metric-label">AVAILABLE BALANCE</div>
                    <div className="unbley-metric-value">{formatMoney(availableBalance)}</div>
                    <div className="unbley-metric-subtext">Ready for payout</div>
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

              {/* Withdrawal Requests Section */}
              <div className="unbley-table-card">
                <div className="unbley-table-header-bar">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Your Withdrawal Requests</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Request and track your payouts</p>
                  </div>
                  <button 
                    onClick={() => {
                      setWithdrawalError(null);
                      setWithdrawalAmount('');
                      setShowWithdrawalModal(true);
                    }}
                    className="unbley-btn-black"
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Request Withdrawal
                  </button>
                </div>
                {withdrawalRequests.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                    No withdrawal requests yet. Request a withdrawal when you're ready to cash out.
                  </div>
                ) : (
                  <table className="unbley-table">
                    <thead>
                      <tr><th>AMOUNT</th><th>BANK NAME</th><th>ACCOUNT</th><th>STATUS</th><th>DATE REQUESTED</th></tr>
                    </thead>
                    <tbody>
                      {withdrawalRequests.map(req => {
                        const statusColors = {
                          pending: { bg: '#FEF3C7', color: '#92400E', label: 'PENDING' },
                          approved: { bg: '#DBEAFE', color: '#1E40AF', label: 'APPROVED' },
                          paid_out: { bg: '#DCFCE7', color: '#15803D', label: 'PAID OUT' }
                        };
                        const statusStyle = statusColors[req.status] || statusColors.pending;
                        return (
                          <tr key={req.id}>
                            <td style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(req.amount)}</td>
                            <td style={{ fontSize: '12px', color: '#374151' }}>{req.bank_name || '—'}</td>
                            <td style={{ fontSize: '12px', color: '#6B7280' }}>
                              <div>{req.account_number}</div>
                              <div style={{ fontSize: '11px', marginTop: '2px' }}>{req.account_name}</div>
                            </td>
                            <td>
                              <span style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700'
                              }}>
                                {statusStyle.label}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {req.created_at 
                                ? new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
                                : '—'
                              }
                            </td>
                          </tr>
                        );
                      })}
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
        <AnimatePresence>
          {showWelcomeOnboarding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="unbley-modal-overlay"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.60)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 999999
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  finishWelcomeOnboarding();
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 18 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #EAE3D9',
                  boxShadow: '0 24px 60px rgba(18, 18, 20, 0.18)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div style={{ padding: '24px 24px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={logoImg}
                        alt="Unbley logo"
                        style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(106, 62, 31, 0.15)' }}
                      />
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: brandSoft,
                        border: '1px solid #E7D7C8',
                        color: brandPrimary,
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}>
                        <Sparkles size={12} />
                        Welcome
                      </span>
                    </div>
                    <button
                      onClick={() => finishWelcomeOnboarding(true)}
                      aria-label="Close welcome onboarding"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        color: '#6B7280',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>×</span>
                    </button>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: brandPrimary, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Step {welcomeOnboardingStep + 1} of {welcomeSlides.length}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '26px', lineHeight: 1.15, letterSpacing: '-0.04em', color: '#111827', fontWeight: 800 }}>
                      {welcomeSlides[welcomeOnboardingStep].title}
                    </h2>
                  </div>

                  <div style={{
                    background: '#F9F6F3',
                    border: '1px solid #F0E5DB',
                    borderRadius: '14px',
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    marginBottom: '20px'
                  }}>
                    {welcomeSlides[welcomeOnboardingStep].text}
                    <div style={{ marginTop: '10px', color: brandPrimary, fontWeight: 700 }}>
                      {welcomeSlides[welcomeOnboardingStep].highlight}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {welcomeSlides.map((_, idx) => (
                        <span
                          key={idx}
                          style={{
                            width: idx === welcomeOnboardingStep ? '18px' : '8px',
                            height: '8px',
                            borderRadius: '999px',
                            background: idx === welcomeOnboardingStep ? brandPrimary : '#E5E7EB',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {welcomeOnboardingStep > 0 && (
                        <button
                          onClick={() => setWelcomeOnboardingStep((prev) => Math.max(prev - 1, 0))}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            color: '#374151',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Back
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (welcomeOnboardingStep < welcomeSlides.length - 1) {
                            setWelcomeOnboardingStep((prev) => prev + 1);
                          } else {
                            handleWelcomeSetupLaunch(false);
                          }
                        }}
                        style={{
                          background: `linear-gradient(135deg, ${brandPrimary} 0%, ${brandAccent} 100%)`,
                          border: '1px solid ' + brandPrimary,
                          color: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '10px 18px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 10px 20px rgba(106, 62, 31, 0.18)'
                        }}
                      >
                        {welcomeOnboardingStep < welcomeSlides.length - 1 ? 'Next' : 'Start setup'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleWelcomeSetupLaunch(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#6B7280',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      Skip for now
                    </button>
                    <button
                      onClick={() => handleWelcomeSetupLaunch(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#6A3E1F',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      Never show again
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showTutorialModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 24px 48px rgba(15, 23, 42, 0.2)', padding: '22px', border: '1px solid #F1E7DE' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Dashboard tour</div>
                <button
                  type="button"
                  onClick={() => setShowTutorialModal(false)}
                  aria-label="Close tutorial modal"
                  style={{ border: 'none', background: '#F3F4F6', color: '#374151', width: '32px', height: '32px', borderRadius: '999px', fontSize: '18px', cursor: 'pointer', fontWeight: 800 }}
                >
                  ×
                </button>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
                This dashboard is easier to understand with the walkthrough video. Please watch the tutorial to learn how the pages, tools, and store setup flow work on mobile or tablet.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
                <a
                  href={DASHBOARD_TUTORIAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #6A3E1F 0%, #8C5A35 100%)', color: '#FFFFFF', textDecoration: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 800, fontSize: '14px' }}
                >
                  <Compass size={15} />
                  Watch the YouTube tutorial
                </a>

                <button
                  type="button"
                  onClick={() => setShowTutorialModal(false)}
                  style={{ border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#374151', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {!isCompactView && (
          <DashboardTour
            isActive={showDashboardTour}
            initialStep={dashboardTourStartStep}
            onClose={() => setShowDashboardTour(false)}
            userId={user?.id}
            onSidebarToggle={(open) => setIsSidebarOpen(open)}
            onMobileMenuOpen={(step) => {
              sessionStorage.setItem('unbley_mobile_tour_resume_step', String(step));
              setShowDashboardTour(false);
              navigate('/menu');
            }}
            isStoreComplete={progressPct >= 100}
          />
        )}
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

        {/* Withdrawal Request Modal */}
        {showWithdrawalModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EAE3D9',
                boxShadow: '0 20px 50px rgba(34, 21, 16, 0.2)',
                maxWidth: '420px',
                width: '100%',
                padding: '28px',
                fontFamily: '"Inter", sans-serif'
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#111827',
                  margin: '0 0 6px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <DollarSign size={22} color="#6A3E1F" />
                  Request Withdrawal
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  Submit a withdrawal request to transfer your earnings to your linked bank account
                </p>
              </div>

              {withdrawalError && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '13px', color: '#991B1B', margin: 0, fontWeight: '500' }}>{withdrawalError}</p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                    setWithdrawalError(null);
                  }}
                  placeholder="Enter amount"
                  step="any"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6A3E1F'; e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '6px 0 0 0' }}>
                  Total available: {formatMoney(availableBalance)}
                </p>
              </div>

              {!profileData.bank_name || !profileData.account_number ? (
                <div style={{
                  backgroundColor: '#FFFBF8',
                  border: '1px solid #EAE3D9',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '12px', color: '#92400E', margin: 0, fontWeight: '600' }}>
                    ⚠️ Your bank account details are not set up. Please add your bank information first.
                  </p>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRequestWithdrawal}
                  disabled={withdrawalLoading || !profileData.bank_name || !profileData.account_number || !withdrawalAmount || Number(withdrawalAmount) > availableBalance}
                  style={{
                    flex: 2,
                    padding: '11px 20px',
                    backgroundColor: withdrawalLoading || !profileData.bank_name || !profileData.account_number || !withdrawalAmount || Number(withdrawalAmount) > availableBalance ? '#D1D5DB' : '#6A3E1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    cursor: withdrawalLoading || !profileData.bank_name || !profileData.account_number || !withdrawalAmount || Number(withdrawalAmount) > availableBalance ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(106, 62, 31, 0.2)'
                  }}
                  onMouseEnter={(e) => { if (!withdrawalLoading && profileData.bank_name && profileData.account_number && withdrawalAmount && Number(withdrawalAmount) <= availableBalance) e.currentTarget.style.backgroundColor = '#5a3219'; }}
                  onMouseLeave={(e) => { if (!withdrawalLoading && profileData.bank_name && profileData.account_number && withdrawalAmount && Number(withdrawalAmount) <= availableBalance) e.currentTarget.style.backgroundColor = '#6A3E1F'; }}
                >
                  {withdrawalLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
