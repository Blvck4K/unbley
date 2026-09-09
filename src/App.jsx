import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import StoreDomainResolver from './components/StoreDomainResolver';
import OfflineBanner from './components/OfflineBanner';

const lazyWithRetry = (importer) => lazy(async () => {
  try {
    const module = await importer();
    return module;
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    return importer().catch(() => {
      throw error;
    });
  }
});

// Lazy load pages
const Home = lazyWithRetry(() => import('./pages/Home'));
const Auth = lazyWithRetry(() => import('./pages/Auth'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));
const Edit = lazyWithRetry(() => import('./pages/Edit'));
const Activation = lazyWithRetry(() => import('./pages/Activation'));
const Storefront = lazyWithRetry(() => import('./pages/Storefront'));
const ExploreBrand = lazyWithRetry(() => import('./pages/ExploreBrand'));
const FinalizeActivation = lazyWithRetry(() => import('./pages/FinalizeActivation'));
const SuccessPage = lazyWithRetry(() => import('./pages/SuccessPage'));
const CheckoutSuccess = lazyWithRetry(() => import('./pages/CheckoutSuccess'));
const ShopBrand = lazyWithRetry(() => import('./pages/ShopBrand'));
const Cart = lazyWithRetry(() => import('./pages/Cart'));
const Checkout = lazyWithRetry(() => import('./pages/Checkout'));
const ProductDetail = lazyWithRetry(() => import('./pages/ProductDetail'));
const SellDigitalGoods = lazyWithRetry(() => import('./pages/SellDigitalGoods'));
const CreatorPlatform = lazyWithRetry(() => import('./pages/CreatorPlatform'));
const CreateOnlineStore = lazyWithRetry(() => import('./pages/CreateOnlineStore'));
const ShopifyAlternative = lazyWithRetry(() => import('./pages/ShopifyAlternative'));
const AffordableEcommerce = lazyWithRetry(() => import('./pages/AffordableEcommerce'));
const AllBlog = lazyWithRetry(() => import('./pages/AllBlog'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const AdminBlog = lazyWithRetry(() => import('./pages/AdminBlog'));
const FillBlog = lazyWithRetry(() => import('./pages/FillBlog'));
const AdminPayments = lazyWithRetry(() => import('./pages/AdminPayments'));
const AdminStoreOwners = lazyWithRetry(() => import('./pages/AdminStoreOwners'));
const About = lazyWithRetry(() => import('./pages/About'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const Support = lazyWithRetry(() => import('./pages/Support'));

import ChatWidget from './components/ChatWidget';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import OAuthRedirectHandler from './components/OAuthRedirectHandler';
import Menu from './pages/Menu.jsx';

// Loading Component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-light)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <div className="loader-dots"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
    <style>{`.loader-dots { display: flex; gap: 8px; } .dot { width: 12px; height: 12px; background-color: var(--primary); border-radius: 50%; animation: pulse 1.5s infinite ease-in-out; } .dot:nth-child(2) { animation-delay: 0.2s; } .dot:nth-child(3) { animation-delay: 0.4s; } @keyframes pulse { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <OfflineBanner />
          <ScrollToTop />
          <StoreDomainResolver />
          <OAuthRedirectHandler />
          <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/store" element={<Storefront />} />
                <Route path="/explore-brand" element={<ExploreBrand />} />
                <Route path="/explore-brand/:id" element={<ExploreBrand />} />
                <Route path="/shop-brand" element={<ShopBrand />} />
                <Route path="/shop-brand/:id" element={<ShopBrand />} />
                <Route path="/@:slug" element={<ShopBrand />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/all-blogs" element={<AllBlog />} />
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/admin-blog" element={<AdminBlog />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product" element={<ProductDetail />} />
                <Route path="/sell-digital-products" element={<SellDigitalGoods />} />
                <Route path="/creator-platform" element={<CreatorPlatform />} />
                <Route path="/create-online-store" element={<CreateOnlineStore />} />
                <Route path="/shopify-alternative" element={<ShopifyAlternative />} />
                <Route path="/affordable-ecommerce-platform" element={<AffordableEcommerce />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
                <Route path="/admin/store-owners" element={<ProtectedRoute><AdminStoreOwners /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/activation" element={<ProtectedRoute><Activation /></ProtectedRoute>} />
                <Route path="/finalize-activation" element={<ProtectedRoute><FinalizeActivation /></ProtectedRoute>} />
                <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                <Route path="/fillblog" element={<FillBlog />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
          <ChatWidget />
          <FloatingWhatsApp />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
