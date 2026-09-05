import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function SubscriptionPlanModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('monthly'); // 'monthly' or 'yearly'

  const brandColor = '#6A3E1F';

  const plans = [
    {
      id: 'free-trial',
      name: '14-Day Free Trial',
      badge: 'RISK-FREE',
      badgeBg: '#8D5B36',
      price: '₦0',
      period: '14 Days Access',
      description: 'Experience all Unbley features with zero charges and no card required.',
      features: [
        'Full storefront access',
        'List up to 10 products',
        'Accept local & card payments',
        'Direct WhatsApp integration',
        'Standard store analytics',
        'No credit card required'
      ],
      isTrial: true,
      buttonText: 'Start 14-Day Free Trial'
    },
    {
      id: 'starter',
      name: 'Unbley Starter',
      badge: '30% OFF',
      badgeBg: brandColor,
      price: interval === 'monthly' ? '₦5,000' : '₦50,000',
      originalPrice: interval === 'monthly' ? '₦5,000' : '₦60,000',
      period: interval === 'monthly' ? '/ month' : '/ year (save ₦10,000)',
      numericPrice: interval === 'monthly' ? 5000 : 50000,
      usdPrice: interval === 'monthly' ? 5 : 40,
      description: 'Essential toolkit for upcoming creators and boutique brands.',
      features: [
        'Everything in Free Trial',
        'Complimentary .store domain (Annual)',
        'Unlimited product listings',
        'Direct bank settlements via Paystack',
        'Zero commission on direct sales',
        'Standard creator support'
      ],
      popular: true,
      buttonText: 'Select Starter Plan'
    },
    {
      id: 'business',
      name: 'Unbley Business',
      badge: 'POPULAR',
      badgeBg: '#221510',
      price: interval === 'monthly' ? '₦15,000' : '₦120,000',
      originalPrice: interval === 'monthly' ? '₦20,000' : '₦180,000',
      period: interval === 'monthly' ? '/ month' : '/ year (save ₦60,000)',
      numericPrice: interval === 'monthly' ? 15000 : 120000,
      usdPrice: interval === 'monthly' ? 10 : 80,
      description: 'Advanced scaling suite for high-volume merchants and established brands.',
      features: [
        'Everything in Starter',
        'Free .com.ng custom domain on 1-year plan',
        'Multiple staff accounts (up to 3)',
        'Automated logistics rate calculator',
        'Customized receipts & invoices',
        'Priority VIP concierge assistance'
      ],
      popular: false,
      buttonText: 'Select Business Plan'
    }
  ];

  const handleStartTrial = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const trialRef = `trial_${Date.now()}`;
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const basePayload = {
        id: user.id,
        email_address: user.email || '',
        brand_name: user.user_metadata?.brand_name || user.user_metadata?.full_name || 'Your Brand',
        owner_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        store_active: true,
        updated_at: new Date().toISOString()
      };

      // 1. Attempt upsert with all extended trial fields
      let { error: dbErr } = await supabase
        .from('brand_profiles')
        .upsert({
          ...basePayload,
          trial_ends_at: trialEndsAt,
          last_transaction_id: trialRef
        }, { onConflict: 'id' });

      // 2. Fallback: If last_transaction_id or trial_ends_at do not exist in DB schema
      if (dbErr) {
        console.warn("Extended trial columns missing in DB, activating store with core fields:", dbErr.message);
        const fallbackRes = await supabase
          .from('brand_profiles')
          .upsert(basePayload, { onConflict: 'id' });

        if (fallbackRes.error) throw fallbackRes.error;
      }

      // 3. Update auth metadata so UI immediately treats store as active
      await supabase.auth.updateUser({
        data: { store_active: true, trial_ends_at: trialEndsAt }
      });

      onComplete?.();
      handleClose();
      navigate('/success', {
        state: {
          type: 'free_trial',
          reference: trialRef,
          amount: 0,
          method: 'Free Trial',
          planName: '14-Day Free Trial',
          period: '14 Days Access'
        }
      });
    } catch (err) {
      console.error('Trial activation error:', err);
      setError(err.message || 'Failed to activate free trial');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPaidPlan = (plan) => {
    if (onClose) onClose();
    navigate('/finalize-activation', {
      state: {
        planId: plan.id,
        planName: plan.name,
        interval,
        amount: plan.numericPrice,
        usdAmount: plan.usdPrice,
        period: plan.period,
        displayPrice: plan.price
      }
    });
  };

  const handleClose = () => {
    setError(null);
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="subscription-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(34, 21, 16, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE3D9',
            boxShadow: '0 25px 60px -15px rgba(34, 21, 16, 0.28)',
            maxWidth: '1020px',
            width: '100%',
            overflow: 'hidden',
            fontFamily: '"Inter", sans-serif',
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '28px 32px 20px',
              borderBottom: '1px solid #EAE3D9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <ShieldCheck size={26} color={brandColor} />
                Activate Your Storefront
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}
              >
                Choose a plan or start your 14-day free trial to unlock your website
              </p>
            </div>

            {/* Interval Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#F7F2EC',
                  padding: '3px',
                  borderRadius: '9999px',
                  border: '1px solid #DFCFC2'
                }}
              >
                <button
                  type="button"
                  onClick={() => setInterval('monthly')}
                  style={{
                    border: 'none',
                    backgroundColor: interval === 'monthly' ? brandColor : 'transparent',
                    color: interval === 'monthly' ? '#FFFFFF' : '#6B584C',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setInterval('yearly')}
                  style={{
                    border: 'none',
                    backgroundColor: interval === 'yearly' ? brandColor : 'transparent',
                    color: interval === 'yearly' ? '#FFFFFF' : '#6B584C',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Annual (Save 30%)
                </button>
              </div>

              <button
                onClick={handleClose}
                style={{
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  color: '#6B7280',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px 32px 32px', overflowY: 'auto' }}>
            {error && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#991B1B', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Plans Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    border: plan.popular ? `2px solid ${brandColor}` : '1px solid #E5E7EB',
                    backgroundColor: plan.popular ? '#FDFBF9' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {/* Top Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span
                      style={{
                        backgroundColor: plan.badgeBg,
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {plan.badge}
                    </span>
                    {plan.isTrial && (
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={13} /> INSTANT ACCESS
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Desc */}
                  <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0', lineHeight: '1.4', minHeight: '34px' }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div
                    style={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                      padding: '14px',
                      borderRadius: '10px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      {plan.period}
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', flex: 1 }}>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={15} color={brandColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '12px', color: '#374151', lineHeight: '1.4' }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (plan.isTrial) {
                        handleStartTrial();
                      } else {
                        handleSelectPaidPlan(plan);
                      }
                    }}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: plan.popular || plan.isTrial ? brandColor : '#221510',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(106, 62, 31, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <span>{loading && plan.isTrial ? 'Activating...' : plan.buttonText}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
