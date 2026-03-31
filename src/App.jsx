import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Activation from './pages/Activation';
import Storefront from './pages/Storefront';
import ExploreBrand from './pages/ExploreBrand';
import FinalizeActivation from './pages/FinalizeActivation';
import ShopBrand from './pages/ShopBrand';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/store" element={<Storefront />} />
        <Route path="/explore-brand" element={<ExploreBrand />} />
        <Route path="/finalize-activation" element={<FinalizeActivation />} />
        <Route path="/shop-brand" element={<ShopBrand />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
