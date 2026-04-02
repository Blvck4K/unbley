import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Activation from './pages/Activation';
import Storefront from './pages/Storefront';
import ExploreBrand from './pages/ExploreBrand';
import FinalizeActivation from './pages/FinalizeActivation';
import SuccessPage from './pages/SuccessPage';
import ShopBrand from './pages/ShopBrand';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';

function App() {
  const [customBrandId, setCustomBrandId] = useState(null);
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  useEffect(() => {
    async function checkDomainMapping() {
      const hostname = window.location.hostname;
      // Define your platform domains that shouldn't be treated as custom brand domains
      const platformDomains = ['localhost', 'zizzystores.com', 'zizzystores.vercel.app'];
      
      if (!platformDomains.includes(hostname)) {
        try {
          const { data, error } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('custom_domain', hostname)
            .single();
            
          if (data) {
            setCustomBrandId(data.id);
            setIsCustomDomain(true);
          }
        } catch (err) {
          console.error("Domain lookup failed:", err);
        }
      }
    }
    checkDomainMapping();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Custom Domain Root */}
          {isCustomDomain && customBrandId && (
            <Route path="/" element={<ShopBrand customId={customBrandId} />} />
          )}

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/store" element={<Storefront />} />
          <Route path="/explore-brand" element={<ExploreBrand />} />
          <Route path="/explore-brand/:id" element={<ExploreBrand />} />
          <Route path="/shop-brand" element={<ShopBrand />} />
          <Route path="/shop-brand/:id" element={<ShopBrand />} />
          {/* Support for friendly slugs if implementing later */}
          <Route path="/@:slug" element={<ShopBrand />} />
           
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product" element={<ProductDetail />} />

          {/* Protected Routes (require auth and Profile Completion if not /edit) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
          <Route path="/activation" element={<ProtectedRoute><Activation /></ProtectedRoute>} />
          <Route path="/finalize-activation" element={<ProtectedRoute><FinalizeActivation /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
