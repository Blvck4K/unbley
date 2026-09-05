import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  LayoutDashboard,
  X,
  ArrowRight,
  ShieldCheck,
  Download,
  Package,
  Palette,
  Share2,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

/**
 * SuccessModal Component
 * Supports 4 scenarios:
 * 1. 'signup' - When a user newly registers
 * 2. 'paid_plan' - When a user pays for Starter or Business plan (monthly/yearly)
 * 3. 'free_trial' - When a user activates their 14-day free trial
 * 4. 'first_dashboard' - When a user enters their dashboard for the first time
 */
export default function SuccessModal({
  isOpen = true,
  onClose,
  type = 'first_dashboard', // 'signup' | 'paid_plan' | 'free_trial' | 'first_dashboard'
  data = {}
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const brandColor = '#6A3E1F';

  const {
    brandName = 'Your Brand',
    name = '',
    email = '',
    userType = 'brand',
    planName = 'Unbley Plan',
    period = 'Monthly',
    amount = 0,
    currency = 'NGN',
    reference = 'REF-' + Date.now().toString().slice(-6),
    method = 'paystack'
  } = data;

  const currencySign = currency === 'USD' ? '$' : '₦';
  const formattedAmount = (amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: currency === 'USD' ? 2 : 0
  });

  // Scenario-specific content configuration
  const configs = {
    signup: {
      badge: 'ACCOUNT CREATED',
      badgeColor: brandColor,
      icon: <Sparkles size={28} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.1)',
      title: `Welcome to Unbley, ${name || (userType === 'customer' ? 'Shopper' : 'Creator')}! 🎉`,
      subtitle: userType === 'customer'
        ? 'Your account is ready. Discover unique local brands and start shopping directly.'
        : 'Your account is registered and ready. Set up your store profile now and start selling.',
      summaryItems: [
        { label: 'ACCOUNT NAME', value: name || brandName },
        { label: 'EMAIL ADDRESS', value: email || 'Verified Account' },
        { label: 'ACCOUNT TYPE', value: userType === 'brand' ? 'Brand Owner (Merchant)' : 'Customer Account' },
        { label: 'STATUS', value: 'Active & Ready' }
      ],
      checklist: userType === 'customer' ? [
        { icon: <Package size={16} color={brandColor} />, title: 'Explore Curated Brands', desc: 'Browse handcrafted fashion, retail, and lifestyle goods' },
        { icon: <ShieldCheck size={16} color={brandColor} />, title: 'Buyer Protection', desc: 'Every checkout is protected and tracked in real-time' },
        { icon: <CreditCard size={16} color={brandColor} />, title: 'Instant Checkouts', desc: 'Seamless card, USSD, and transfer payments' }
      ] : [
        { icon: <Palette size={16} color={brandColor} />, title: 'Complete Store Profile', desc: 'Add brand bio, logo, and social handles' },
        { icon: <Package size={16} color={brandColor} />, title: 'Add Your Products', desc: 'List physical or digital items for sale' },
        { icon: <Share2 size={16} color={brandColor} />, title: 'Share Your Storefront', desc: 'Get your unique store link to share anywhere' }
      ],
      primaryBtnText: userType === 'customer' ? 'Start Shopping' : 'Continue to Dashboard',
      primaryAction: () => {
        if (onClose) onClose();
        navigate(userType === 'customer' ? '/store' : '/dashboard?onboarding=true');
      },
      secondaryBtnText: userType === 'customer' ? 'Browse Discover' : 'View Dashboard',
      secondaryAction: () => {
        if (onClose) onClose();
        navigate(userType === 'customer' ? '/store' : '/dashboard');
      }
    },

    paid_plan: {
      badge: 'SUBSCRIPTION ACTIVE',
      badgeColor: brandColor,
      icon: <Check size={32} color={brandColor} strokeWidth={2.8} />,
      iconBg: 'rgba(106, 62, 31, 0.1)',
      title: `${planName} Activated! 🚀`,
      subtitle: `Payment verified. Your store is officially live on the ${planName} plan (${period}).`,
      summaryItems: [
        { label: 'ACTIVATED STORE', value: brandName },
        { label: 'PLAN & CYCLE', value: `${planName} (${period})` },
        { label: 'AMOUNT PAID', value: `${currencySign}${formattedAmount}` },
        { label: 'GATEWAY', value: method === 'flutterwave' ? 'Flutterwave International' : 'Paystack Local' }
      ],
      checklist: [
        { icon: <ShieldCheck size={16} color={brandColor} />, title: 'Custom Domain Access', desc: 'Complimentary domain for your brand' },
        { icon: <Package size={16} color={brandColor} />, title: 'Full Store Features', desc: 'Invoicing, bulk SMS, and staff accounts' },
        { icon: <CreditCard size={16} color={brandColor} />, title: 'Seamless Payments', desc: 'Direct bank & card payouts enabled' }
      ],
      primaryBtnText: 'Open Dashboard',
      primaryAction: () => {
        if (onClose) onClose();
        navigate('/dashboard');
      },
      secondaryBtnText: 'Download Receipt',
      secondaryAction: () => {
        downloadReceiptContent({
          title: `UNBLEY RECEIPT - ${planName.toUpperCase()}`,
          store: brandName,
          email,
          status: 'PAID & ACTIVATED',
          amount: `${currencySign}${formattedAmount} (${currency})`,
          reference,
          gateway: method === 'flutterwave' ? 'Flutterwave' : 'Paystack'
        });
      }
    },

    free_trial: {
      badge: '14-DAY TRIAL ACTIVE',
      badgeColor: brandColor,
      icon: <Sparkles size={30} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.1)',
      title: '14-Day Free Trial Activated! ✨',
      subtitle: 'Enjoy 14 days of unrestricted access with zero charges and no credit card required.',
      summaryItems: [
        { label: 'STORE NAME', value: brandName },
        { label: 'TRIAL DURATION', value: '14 Days Full Access' },
        { label: 'COST TODAY', value: 'Free (₦0.00)' },
        { label: 'TRANSACTION ID', value: reference }
      ],
      checklist: [
        { icon: <Package size={16} color={brandColor} />, title: 'Upload Products', desc: 'Add photos, pricing, and stock amounts' },
        { icon: <Palette size={16} color={brandColor} />, title: 'Customize Storefront', desc: 'Pick your theme, banners, and fonts' },
        { icon: <Share2 size={16} color={brandColor} />, title: 'Take Test Orders', desc: 'See how customers checkout on your site' }
      ],
      primaryBtnText: 'Start Using Your Store',
      primaryAction: () => {
        if (onClose) onClose();
        navigate('/dashboard');
      },
      secondaryBtnText: 'Customize Store Design',
      secondaryAction: () => {
        if (onClose) onClose();
        navigate('/edit');
      }
    },

    first_dashboard: {
      badge: 'STORE HEADQUARTERS',
      badgeColor: brandColor,
      icon: <LayoutDashboard size={28} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.1)',
      title: 'Welcome to Your Dashboard! 👑',
      subtitle: `Your store "${brandName}" is ready. Here is a quick guide to help you get your first sale.`,
      summaryItems: [
        { label: 'ACTIVE STORE', value: brandName },
        { label: 'ACCOUNT STATUS', value: 'Live & Operational' },
        { label: 'STORE DOMAIN', value: `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.unbley.store` },
        { label: 'CHECKOUT', value: 'Instant Local & Card' }
      ],
      checklist: [
        { icon: <Package size={16} color={brandColor} />, title: '1. Add Your Products', desc: 'Click "Manage Products" to list items' },
        { icon: <Palette size={16} color={brandColor} />, title: '2. Personalize Appearance', desc: 'Change theme colors, banners & bio' },
        { icon: <Share2 size={16} color={brandColor} />, title: '3. Share Your Storefront', desc: 'Promote your link on Instagram & WhatsApp' }
      ],
      primaryBtnText: "Let's Get Started!",
      primaryAction: () => {
        if (onClose) onClose();
      },
      secondaryBtnText: 'Edit Store Details',
      secondaryAction: () => {
        if (onClose) onClose();
        navigate('/edit');
      }
    }
  };

  const currentConfig = configs[type] || configs.first_dashboard;

  function downloadReceiptContent({ title, store, email, status, amount, reference, gateway }) {
    const receiptContent = `
========================================
         ${title}
========================================

STORE NAME:   ${store}
EMAIL:        ${email}
STATUS:       ${status}
AMOUNT:       ${amount}
PAYMENT:      ${gateway}
REFERENCE:    ${reference}
DATE:         ${new Date().toLocaleString()}

----------------------------------------
Thank you for using Unbley.
Your digital store is securely active.
========================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Unbley-Confirmation-${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const modalElement = (
    <AnimatePresence>
      <div
        className="unbley-modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(34, 21, 16, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          zIndex: 999999,
          overflowY: 'auto'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE3D9',
            boxShadow: '0 25px 60px -15px rgba(34, 21, 16, 0.28)',
            maxWidth: '640px',
            width: '100%',
            padding: '36px 32px',
            position: 'relative',
            maxHeight: '92vh',
            overflowY: 'auto',
            fontFamily: '"Inter", sans-serif',
            color: '#221510'
          }}
        >
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#F7F2EC',
                border: '1px solid #DFCFC2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B584C',
                transition: 'all 0.2s'
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          )}

          {/* Top Badge & Icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: currentConfig.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(106, 62, 31, 0.08)'
              }}
            >
              {currentConfig.icon}
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(106, 62, 31, 0.08)',
                color: currentConfig.badgeColor,
                border: '1px solid #DFCFC2',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentConfig.badgeColor }} />
              {currentConfig.badge}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '26px',
                fontWeight: '800',
                color: '#221510',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}
            >
              {currentConfig.title}
            </h2>

            <p style={{ fontSize: '13.5px', color: '#6B584C', lineHeight: '1.5', maxWidth: '480px', margin: '0 auto' }}>
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Summary Details Grid */}
          <div
            style={{
              backgroundColor: '#F7F2EC',
              borderRadius: '12px',
              border: '1px solid #DFCFC2',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px 20px',
              marginBottom: '24px'
            }}
          >
            {currentConfig.summaryItems.map((item, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#8D5B36', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#221510', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Steps / Checklist */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em', color: '#6B584C', textTransform: 'uppercase', marginBottom: '10px' }}>
              RECOMMENDED NEXT STEPS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentConfig.checklist.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE3D9',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#F7F2EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#221510' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B584C' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={currentConfig.primaryAction}
              style={{
                flex: 1,
                minWidth: '200px',
                height: '48px',
                backgroundColor: brandColor,
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(106, 62, 31, 0.25)'
              }}
            >
              <span>{currentConfig.primaryBtnText}</span>
              <ArrowRight size={16} />
            </button>

            {currentConfig.secondaryBtnText && (
              <button
                onClick={currentConfig.secondaryAction}
                style={{
                  height: '48px',
                  padding: '0 20px',
                  backgroundColor: '#FFFFFF',
                  color: '#221510',
                  borderRadius: '8px',
                  border: '1px solid #DFCFC2',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {type === 'paid_plan' ? <Download size={15} /> : null}
                <span>{currentConfig.secondaryBtnText}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalElement, document.body);
  }
  return modalElement;
}
