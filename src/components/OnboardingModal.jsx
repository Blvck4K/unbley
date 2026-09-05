import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Landmark, Store, Banknote, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PaymentSetupModal from './onboarding/PaymentSetupModal';
import StoreInfoModal from './onboarding/StoreInfoModal';
import ShippingModal from './onboarding/ShippingModal';
import ProductsModal from './onboarding/ProductsModal';
import SubscriptionPlanModal from './onboarding/SubscriptionPlanModal';

export default function OnboardingModal({ isOpen = true, onClose, storeData = {}, storeId = null, onRefresh = null, activeStep = null }) {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(activeStep);
  const [liveData, setLiveData] = useState({ brand_name: storeData?.brand_name || '', logo_url: storeData?.logo_url || '', phone_number: storeData?.phone_number || '', bank_name: storeData?.bank_name || '', account_number: storeData?.account_number || '', delivery_duration: storeData?.delivery_duration || '', store_active: storeData?.store_active || storeData?.is_active || false, trial_ends_at: storeData?.trial_ends_at || null });
  const [liveProductCount, setLiveProductCount] = useState(storeData?.activeStock || 0);

  useEffect(() => { setLiveData({ brand_name: storeData?.brand_name || '', logo_url: storeData?.logo_url || '', phone_number: storeData?.phone_number || '', bank_name: storeData?.bank_name || '', account_number: storeData?.account_number || '', delivery_duration: storeData?.delivery_duration || '', store_active: storeData?.store_active || storeData?.is_active || false, trial_ends_at: storeData?.trial_ends_at || null }); setLiveProductCount(storeData?.activeStock || 0); }, [storeData]);
  useEffect(() => { if (activeStep) setActiveModal(activeStep); }, [activeStep]);

  const fetchLiveProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('brand_profiles')
        .select('brand_name, logo_url, phone_number, bank_name, account_number, account_name, bank_code, delivery_duration, store_active, is_active, trial_ends_at, country, address_line_1')
        .eq('id', user.id)
        .single();
      if (data) {
        setLiveData({
          brand_name: data.brand_name || '',
          logo_url: data.logo_url || '',
          phone_number: data.phone_number || '',
          bank_name: data.bank_name || '',
          bank_code: data.bank_code || '',
          account_number: data.account_number || '',
          account_name: data.account_name || '',
          delivery_duration: data.delivery_duration || '',
          country: data.country || '',
          address_line_1: data.address_line_1 || '',
          store_active: data.store_active || data.is_active || false,
          trial_ends_at: data.trial_ends_at || null
        });
      }
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', user.id)
        .eq('status', 'active');
      setLiveProductCount(count || 0);
    } catch (err) { console.warn('OnboardingModal live fetch:', err.message); }
  }, [user?.id]);

  useEffect(() => {
    if (!isOpen || !user?.id) return;
    fetchLiveProfile();
    const profileCh = supabase
      .channel('onboarding_profile_' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_profiles', filter: 'id=eq.' + user.id },
        () => { fetchLiveProfile(); if (onRefresh) onRefresh(); })
      .subscribe();
    const productsCh = supabase
      .channel('onboarding_products_' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: 'brand_id=eq.' + user.id },
        () => { fetchLiveProfile(); if (onRefresh) onRefresh(); })
      .subscribe();
    return () => { supabase.removeChannel(profileCh); supabase.removeChannel(productsCh); };
  }, [isOpen, user?.id, fetchLiveProfile, onRefresh]);

  if (!isOpen) return null;
  const brandColor = '#6A3E1F';
  const isStoreInfoDone = Boolean(liveData.brand_name && liveData.brand_name !== 'Your Brand' && liveData.logo_url);
  const isWalletDone = Boolean(
    liveData.phone_number && liveData.phone_number !== 'N/A' &&
    (liveData.bank_name || liveData.bank_code) &&
    liveData.account_number
  );
  const isShippingDone = Boolean(liveData.delivery_duration);
  const isProductsDone = liveProductCount > 0;
  const isPlanDone = Boolean(liveData.store_active || (liveData.trial_ends_at && new Date(liveData.trial_ends_at) > new Date()));

  const steps = [
    { id: 'wallet', icon: <Landmark size={20} color={brandColor} />, title: 'Create your wallet to receive payments', subtitle: 'Choose your preferred payment gateway and add bank details for withdrawals', completed: isWalletDone, action: () => setActiveModal('payment') },
    { id: 'store_info', icon: <Store size={20} color={brandColor} />, title: 'Complete store information', subtitle: 'Add your store logo, currency, and other relevant details', completed: isStoreInfoDone, action: () => setActiveModal('store_info') },
    { id: 'shipping', icon: <Banknote size={20} color={brandColor} />, title: 'Add shipping prices on your website', subtitle: 'Add shipping prices for your customers to checkout seamlessly', completed: isShippingDone, action: () => setActiveModal('shipping') },
    { id: 'products', icon: <Tag size={20} color={brandColor} />, title: 'Add products to your store', subtitle: 'You can always add more products later from the Products page', completed: isProductsDone, action: () => setActiveModal('products') },
    { id: 'subscription', icon: <ShieldCheck size={20} color={brandColor} />, title: 'Get a Subscription Plan at 30% off', subtitle: 'Get this amazing discount and enjoy exclusive Unbley features', completed: isPlanDone, action: () => setActiveModal('subscription') }
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const allDone = completedCount === steps.length;
  const handleRefreshData = () => { fetchLiveProfile(); if (onRefresh) onRefresh(); };
  const handlePreviewSample = () => { window.open(storeId ? '/shop-brand/' + storeId : '/store', '_blank'); };

  return (
    <>
      <AnimatePresence>
        <div className="unbley-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px', overflowY: 'auto' }} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAE3D9', boxShadow: '0 20px 50px rgba(34, 21, 16, 0.2)', maxWidth: '540px', width: '100%', overflow: 'hidden', fontFamily: '"Inter", sans-serif', position: 'relative', padding: '28px 28px 24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em', lineHeight: '1.3', margin: 0, paddingRight: '12px' }}>Complete the next steps to launch your website</h2>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', backgroundColor: '#EAE3D9', borderRadius: '99px', overflow: 'hidden', maxWidth: '200px' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: ((completedCount / steps.length) * 100) + '%' }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', backgroundColor: brandColor, borderRadius: '99px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: brandColor }}>{completedCount}/{steps.length} done</span>
                </div>
              </div>
              <button onClick={onClose} style={{ border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.color = '#111827'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.color = '#6B7280'; }} title="Close" aria-label="Close modal"><X size={18} /></button>
            </div>

            <div style={{ marginBottom: '20px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {steps.map((step) => {
                const isDone = step.completed;
                return (
                  <div key={step.id} onClick={isDone ? undefined : step.action} title={isDone ? 'Already completed' : undefined} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', backgroundColor: isDone ? '#F7F2EC' : '#FFFFFF', border: '1px solid ' + (isDone ? 'rgba(106,62,31,0.25)' : '#E5E7EB'), borderRadius: '10px', cursor: isDone ? 'default' : 'pointer', transition: 'all 0.18s ease', opacity: isDone ? 0.8 : 1 }} onMouseEnter={(e) => { if (isDone) return; e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }} onMouseLeave={(e) => { if (isDone) return; e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: isDone ? 'rgba(106, 62, 31, 0.12)' : 'rgba(106, 62, 31, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isDone ? <CheckCircle2 size={20} color="#6A3E1F" /> : step.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: isDone ? '#6A3E1F' : '#111827', marginBottom: '2px', textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: 'rgba(106,62,31,0.4)' }}>{step.title}</div>
                      <div style={{ fontSize: '11px', color: isDone ? 'rgba(106,62,31,0.6)' : '#6B7280', lineHeight: '1.4' }}>{isDone ? 'Completed \u2713' : step.subtitle}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {isDone ? (<span style={{ fontSize: '10px', fontWeight: '700', color: '#6A3E1F', backgroundColor: 'rgba(106,62,31,0.12)', border: '1px solid rgba(106,62,31,0.25)', borderRadius: '99px', padding: '3px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Done</span>) : (<div style={{ color: '#9CA3AF' }}><ChevronRight size={18} /></div>)}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={allDone ? onClose : handlePreviewSample} style={{ width: '100%', padding: '12px 16px', backgroundColor: allDone ? brandColor : '#E5E7EB', border: '1px solid ' + (allDone ? brandColor : '#D1D5DB'), borderRadius: '8px', color: allDone ? '#FFFFFF' : '#374151', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.borderColor = brandColor; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = allDone ? brandColor : '#E5E7EB'; e.currentTarget.style.borderColor = allDone ? brandColor : '#D1D5DB'; e.currentTarget.style.color = allDone ? '#FFFFFF' : '#374151'; }}>
              {allDone ? String.fromCodePoint(0x1F389) + ' Launch Your Store' : 'Done'}
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
      <PaymentSetupModal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} onComplete={() => { handleRefreshData(); setActiveModal(null); }} />
      <StoreInfoModal isOpen={activeModal === 'store_info'} onClose={() => setActiveModal(null)} onComplete={() => { handleRefreshData(); setActiveModal(null); }} />
      <ShippingModal isOpen={activeModal === 'shipping'} onClose={() => setActiveModal(null)} onComplete={() => { handleRefreshData(); setActiveModal(null); }} />
      <ProductsModal isOpen={activeModal === 'products'} onClose={() => setActiveModal(null)} onComplete={() => { handleRefreshData(); setActiveModal(null); }} />
      <SubscriptionPlanModal isOpen={activeModal === 'subscription'} onClose={() => setActiveModal(null)} onComplete={() => { handleRefreshData(); setActiveModal(null); if (onClose) onClose(); }} />
    </>
  );
}