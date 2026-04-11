import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { useState } from 'react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Edit = lazy(() => import('./pages/Edit'));
const Activation = lazy(() => import('./pages/Activation'));
const Storefront = lazy(() => import('./pages/Storefront'));
const ExploreBrand = lazy(() => import('./pages/ExploreBrand'));
const FinalizeActivation = lazy(() => import('./pages/FinalizeActivation'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const ShopBrand = lazy(() => import('./pages/ShopBrand'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SellDigitalGoods = lazy(() => import('./pages/SellDigitalGoods'));
const CreatorPlatform = lazy(() => import('./pages/CreatorPlatform'));
const CreateOnlineStore = lazy(() => import('./pages/CreateOnlineStore'));
const ShopifyAlternative = lazy(() => import('./pages/ShopifyAlternative'));
const AffordableEcommerce = lazy(() => import('./pages/AffordableEcommerce'));
const AllBlog = lazy(() => import('./pages/AllBlog'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const FillBlog = lazy(() => import('./pages/FillBlog'));

import ChatWidget from './components/ChatWidget';
import FloatingWhatsApp from './components/FloatingWhatsApp';

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
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
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
    </AuthProvider>
  );
}

export default App;
