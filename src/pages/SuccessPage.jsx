import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { 
  Check, 
  ShieldCheck, 
  Download, 
  LayoutDashboard, 
  Sparkles, 
  Package, 
  Palette, 
  Share2, 
  ArrowRight, 
  CreditCard,
  User,
  Clock
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import SuccessModal from '../components/SuccessModal';

export { SuccessModal };

/**
 * SuccessPage handles 4 major success states:
 * 1. 'signup' - When a user newly signs up
 * 2. 'paid_plan' - When a user pays for a plan (Starter / Business, yearly / monthly)
 * 3. 'free_trial' - When a user activates their 14-day free trial
 * 4. 'first_dashboard' - When a user visits their dashboard for the first time
 */
export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Extract navigation state
  const rawState = location.state || {};
  const queryType = new URLSearchParams(location.search).get('type');

  // Determine scenario type
  const detectType = () => {
    if (queryType) return queryType;
    if (rawState.type) return rawState.type;
    if (rawState.method === 'Free Trial' || rawState.amount === 0 || rawState.planId === 'free-trial') return 'free_trial';
    if (rawState.reference && !rawState.reference.startsWith('trial_')) return 'paid_plan';
    if (rawState.userType || rawState.name) return 'signup';
    return 'paid_plan';
  };

  const [realState, setRealState] = useState({
    type: detectType(),
    reference: rawState.reference || '...',
    amount: typeof rawState.amount === 'number' ? rawState.amount : 0,
    email: rawState.email || user?.email || 'admin@unbley.com',
    name: rawState.name || user?.user_metadata?.full_name || '',
    brandName: rawState.brandName || user?.user_metadata?.brand_name || 'Your Brand',
    method: rawState.method || 'paystack',
    currency: rawState.currency || 'NGN',
    planName: rawState.planName || 'Unbley Subscription',
    period: rawState.period || 'Selected Period',
    userType: rawState.userType || user?.user_metadata?.role || 'brand'
  });

  useEffect(() => {
    async function verifyRealtimeData() {
      if (!user) return;
      
      // If no reference in memory or refreshed page, check Supabase brand profile
      if (!rawState.reference || realState.reference === '...') {
        try {
          const { data } = await supabase
            .from('brand_profiles')
            .select('last_transaction_id, brand_name, email_address, store_active')
            .eq('id', user.id)
            .maybeSingle();

          if (data) {
            const hasTx = !!data.last_transaction_id;
            const isTrialTx = hasTx && data.last_transaction_id.startsWith('trial_');
            
            setRealState(prev => {
              const inferredType = prev.type !== 'signup' && prev.type !== 'first_dashboard'
                ? (isTrialTx ? 'free_trial' : (hasTx ? 'paid_plan' : 'first_dashboard'))
                : prev.type;

              return {
                ...prev,
                type: inferredType,
                reference: data.last_transaction_id || prev.reference,
                brandName: data.brand_name || prev.brandName,
                email: data.email_address || prev.email
              };
            });
          }
        } catch (err) {
          console.error("Failed to recover transaction context:", err);
        }
      }
    }
    verifyRealtimeData();
  }, [user, rawState, realState.reference]);

  const {
    type,
    reference,
    amount,
    currency,
    email,
    name,
    brandName,
    method,
    planName,
    period,
    userType
  } = realState;

  const brandColor = '#6A3E1F';
  const successColor = '#10B981';
  const bgColor = '#FBF9F5';

  const currencySign = currency === 'USD' ? '$' : '₦';
  const formattedAmount = (amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: currency === 'USD' ? 2 : 0
  });

  // Scenario-specific texts & configurations
  const pageConfigs = {
    signup: {
      headerBadge: 'ACCOUNT CREATED',
      headerBadgeColor: brandColor,
      icon: <Sparkles size={34} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.12)',
      title: `Welcome to Unbley, ${name || brandName}! 🎉`,
      subtitle: 'Your merchant account has been registered successfully. Set up your store details to begin selling to your audience.',
      summaryHeading: 'ACCOUNT PROFILE SUMMARY',
      summaryBadge: 'REGISTERED & ACTIVE',
      grid: [
        { label: 'MERCHANT NAME', value: name || brandName, highlight: false },
        { label: 'REGISTERED EMAIL', value: email, highlight: false },
        { label: 'ACCOUNT TYPE', value: userType === 'brand' ? 'Brand Owner' : 'Customer Account', highlight: false },
        { label: 'NEXT STEP', value: 'Complete Store Profile', highlight: true }
      ],
      stepsTitle: 'YOUR ONBOARDING PATHWAY',
      steps: [
        {
          icon: <Palette size={18} color={brandColor} />,
          title: '1. Brand Customization',
          desc: 'Add your business logo, custom palette, and bio in Edit Store.'
        },
        {
          icon: <Package size={18} color={brandColor} />,
          title: '2. Add Products',
          desc: 'Create products with pricing, descriptions, and stock quantities.'
        },
        {
          icon: <Share2 size={18} color={brandColor} />,
          title: '3. Launch & Sell',
          desc: 'Share your personal store link across WhatsApp and Instagram.'
        }
      ],
      primaryBtnText: 'Complete Store Setup',
      primaryAction: () => navigate('/edit'),
      secondaryBtnText: 'Go to Dashboard',
      secondaryAction: () => navigate('/dashboard')
    },

    paid_plan: {
      headerBadge: 'PAYMENT VERIFIED',
      headerBadgeColor: brandColor,
      icon: <Check size={34} color={brandColor} strokeWidth={3} />,
      iconBg: 'rgba(106, 62, 31, 0.12)',
      title: `${planName} Activated! 🚀`,
      subtitle: `Your subscription is active for ${period}. Your digital storefront is completely unlocked and live for customers worldwide.`,
      summaryHeading: 'TRANSACTION & PLAN DETAILS',
      summaryBadge: 'PAYMENT CONFIRMED',
      grid: [
        { label: 'ACTIVATED STORE', value: brandName, highlight: false },
        { label: 'SUBSCRIBED PLAN', value: `${planName} (${period})`, highlight: false },
        { label: 'AMOUNT PAID', value: `${currencySign}${formattedAmount} (${currency})`, highlight: true },
        { label: 'PAYMENT GATEWAY', value: method === 'flutterwave' ? 'Flutterwave International' : 'Paystack Local', highlight: false },
        { label: 'TRANSACTION ID', value: reference, highlight: false, isMono: true }
      ],
      stepsTitle: 'UNLOCKED CAPABILITIES',
      steps: [
        {
          icon: <ShieldCheck size={18} color={brandColor} />,
          title: 'Custom Domain Included',
          desc: 'Claim your professional .store / .com.ng domain on your plan.'
        },
        {
          icon: <Package size={18} color={brandColor} />,
          title: 'Unlimited Products & Orders',
          desc: 'List your full catalog and manage orders with real-time alerts.'
        },
        {
          icon: <CreditCard size={18} color={brandColor} />,
          title: 'Direct Payouts',
          desc: 'Customers pay securely; funds settle directly to your bank account.'
        }
      ],
      primaryBtnText: 'Go to Dashboard',
      primaryAction: () => navigate('/dashboard'),
      secondaryBtnText: 'Download Official Receipt',
      secondaryAction: () => handleDownloadReceipt()
    },

    free_trial: {
      headerBadge: '14-DAY TRIAL ACTIVE',
      headerBadgeColor: '#8D5B36',
      icon: <Sparkles size={34} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.12)',
      title: '14-Day Free Trial Activated! ✨',
      subtitle: 'Your 14-day full access pass has begun with zero charges and no credit card required. Experience all Unbley features risk-free.',
      summaryHeading: 'FREE TRIAL CONFIRMATION',
      summaryBadge: '14-DAY FULL ACCESS',
      grid: [
        { label: 'ACTIVATED STORE', value: brandName, highlight: false },
        { label: 'TRIAL DURATION', value: '14 Days Full Access', highlight: false },
        { label: 'AMOUNT BILLED', value: 'Free (₦0.00)', highlight: true },
        { label: 'PAYMENT STATUS', value: 'No Credit Card Required', highlight: false },
        { label: 'TRIAL REFERENCE', value: reference, highlight: false, isMono: true }
      ],
      stepsTitle: 'HOW TO MAXIMIZE YOUR TRIAL',
      steps: [
        {
          icon: <Package size={18} color={brandColor} />,
          title: 'Add Your First 3 Products',
          desc: 'Upload product imagery, set prices, and write captivating copy.'
        },
        {
          icon: <Palette size={18} color={brandColor} />,
          title: 'Brand Your Storefront',
          desc: 'Set your signature colors, store banner, and Instagram handles.'
        },
        {
          icon: <Share2 size={18} color={brandColor} />,
          title: 'Test Live Checkout',
          desc: 'Place a test order to see your seamless customer shopping flow.'
        }
      ],
      primaryBtnText: 'Start Using Your Store',
      primaryAction: () => navigate('/dashboard'),
      secondaryBtnText: 'Customize Storefront (Edit)',
      secondaryAction: () => navigate('/edit')
    },

    first_dashboard: {
      headerBadge: 'WELCOME TO UNBLEY',
      headerBadgeColor: brandColor,
      icon: <LayoutDashboard size={34} color={brandColor} />,
      iconBg: 'rgba(106, 62, 31, 0.12)',
      title: 'Welcome to Your Dashboard! 👑',
      subtitle: `Your store headquarters for "${brandName}" is ready. Here is everything you need to scale your business online.`,
      summaryHeading: 'STORE COMMAND CENTER',
      summaryBadge: 'OPERATIONAL',
      grid: [
        { label: 'STORE NAME', value: brandName, highlight: false },
        { label: 'OWNER ACCOUNT', value: email, highlight: false },
        { label: 'STORE STATUS', value: 'Active & Open for Business', highlight: true },
        { label: 'GATEWAY', value: 'Instant Local & Card Payments', highlight: false }
      ],
      stepsTitle: 'YOUR 3-STEP QUICK START',
      steps: [
        {
          icon: <Package size={18} color={brandColor} />,
          title: '1. Add Products',
          desc: 'Use the product manager to add photos, inventory, and variants.'
        },
        {
          icon: <Palette size={18} color={brandColor} />,
          title: '2. Personalize Appearance',
          desc: 'Fine-tune your brand aesthetics in the Edit Store interface.'
        },
        {
          icon: <Share2 size={18} color={brandColor} />,
          title: '3. Promote & Sell',
          desc: 'Copy your store link and share with customers anywhere.'
        }
      ],
      primaryBtnText: 'Open Dashboard Overview',
      primaryAction: () => navigate('/dashboard'),
      secondaryBtnText: 'Edit Store Details',
      secondaryAction: () => navigate('/edit')
    }
  };

  const current = pageConfigs[type] || pageConfigs.paid_plan;

  const handleDownloadReceipt = () => {
    const isTrial = type === 'free_trial';
    const isSignup = type === 'signup';
    
    let titleStr = `UNBLEY OFFICIAL RECEIPT - ${planName.toUpperCase()}`;
    let statusStr = 'ACTIVATION SUCCESSFUL (PAID)';
    let costStr = `${currencySign}${formattedAmount} (${currency})`;

    if (isTrial) {
      titleStr = 'UNBLEY 14-DAY FREE TRIAL CONFIRMATION';
      statusStr = 'TRIAL ACTIVATED (NO PAYMENT REQUIRED)';
      costStr = 'FREE (₦0.00)';
    } else if (isSignup) {
      titleStr = 'UNBLEY REGISTRATION CONFIRMATION';
      statusStr = 'ACCOUNT CREATED';
      costStr = 'N/A';
    }

    const receiptContent = `
========================================
         ${titleStr}
========================================

STORE NAME:   ${brandName}
EMAIL:        ${email}
STATUS:       ${statusStr}
PLAN / CYCLE: ${planName} (${period})
AMOUNT:       ${costStr}
PAYMENT:      ${method === 'flutterwave' ? 'Flutterwave International' : (isTrial ? 'Free Trial (Zero Charge)' : 'Paystack Local')}

TRANSACTION:  ${reference}
DATE:         ${new Date().toLocaleString()}

----------------------------------------
Thank you for building with Unbley.
Your digital store is securely verified.
========================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Unbley-${isTrial ? 'Trial' : 'Receipt'}-${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div
        className="success-page"
        style={{
          backgroundColor: bgColor,
          color: '#221510',
          minHeight: '100vh',
          fontFamily: '"Inter", sans-serif',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '80px'
        }}
      >
        <style>{`
          .success-container {
            max-width: 820px;
            margin: 0 auto;
            width: 100%;
            padding: 56px 24px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .success-card {
            background-color: #FFFFFF;
            border: 1px solid #EAE3D9;
            border-radius: 16px;
            width: 100%;
            padding: 36px 40px;
            position: relative;
            box-shadow: 0 10px 35px -5px rgba(34, 21, 16, 0.05);
            margin-bottom: 40px;
          }

          .success-glow-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, ${successColor}, transparent);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }

          .success-steps-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            width: 100%;
            margin-bottom: 40px;
          }

          .success-step-card {
            background-color: #FFFFFF;
            border: 1px solid #EAE3D9;
            border-radius: 12px;
            padding: 22px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: all 0.2s ease;
          }

          .success-step-card:hover {
            transform: translateY(-2px);
            border-color: #DFCFC2;
            box-shadow: 0 4px 14px rgba(34, 21, 16, 0.05);
          }

          .success-btn-primary {
            background-color: ${brandColor};
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            padding: 16px 36px;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(106, 62, 31, 0.25);
          }

          .success-btn-primary:hover {
            background-color: #522F16;
            transform: translateY(-1px);
          }

          .success-btn-secondary {
            background-color: #FFFFFF;
            color: #221510;
            border: 1px solid #DFCFC2;
            border-radius: 8px;
            padding: 16px 28px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .success-btn-secondary:hover {
            background-color: #F7F2EC;
            border-color: #C9BFB5;
          }

          @media (max-width: 768px) {
            .success-container { padding: 36px 18px 0 !important; }
            .success-card { padding: 24px 20px !important; }
            .success-steps-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .success-actions-row { flex-direction: column !important; width: 100% !important; gap: 12px !important; }
            .success-btn-primary, .success-btn-secondary { width: 100% !important; }
          }
        `}</style>

        {/* Top Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 48px',
            borderBottom: '1px solid #EAE3D9',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: brandColor,
              cursor: 'pointer'
            }}
          >
            Unbley.
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '10.5px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: current.headerBadgeColor,
              backgroundColor: 'rgba(106, 62, 31, 0.06)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid #DFCFC2',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: current.headerBadgeColor }} />
            {current.headerBadge}
          </div>
        </header>

        {/* Main Content */}
        <main className="success-container">
          {/* Animated Centered Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: current.iconBg,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px',
              boxShadow: '0 8px 20px rgba(106, 62, 31, 0.08)'
            }}
          >
            {current.icon}
          </motion.div>

          {/* Heading & Subtitle */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '34px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              marginBottom: '14px',
              textAlign: 'center',
              color: '#221510',
              lineHeight: '1.2'
            }}
          >
            {current.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              color: '#6B584C',
              fontSize: '14.5px',
              lineHeight: '1.6',
              textAlign: 'center',
              maxWidth: '560px',
              marginBottom: '40px'
            }}
          >
            {current.subtitle}
          </motion.p>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="success-card"
          >
            <div className="success-glow-line" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#8D5B36', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {current.summaryHeading}
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(106, 62, 31, 0.1)',
                  color: brandColor,
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={13} strokeWidth={3} /> {current.summaryBadge}
              </div>
            </div>

            {/* Grid of Key Info */}
            <div
              style={{
                backgroundColor: '#F7F2EC',
                borderRadius: '12px',
                border: '1px solid #DFCFC2',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px 24px'
              }}
            >
              {current.grid.map((field, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#8D5B36', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {field.label}
                  </div>
                  <div
                    style={{
                      fontSize: field.highlight ? '18px' : '14px',
                      fontWeight: field.highlight ? '800' : '600',
                      color: field.highlight ? brandColor : '#221510',
                      fontFamily: field.isMono ? 'monospace' : 'inherit',
                      wordBreak: 'break-word'
                    }}
                  >
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Pathways / Steps */}
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#6B584C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'left' }}>
              {current.stepsTitle}
            </div>

            <div className="success-steps-grid">
              {current.steps.map((st, idx) => (
                <div key={idx} className="success-step-card">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#F7F2EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: brandColor
                    }}
                  >
                    {st.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#221510', marginBottom: '4px' }}>
                      {st.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B584C', lineHeight: '1.5' }}>
                      {st.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="success-actions-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            <button className="success-btn-primary" onClick={current.primaryAction}>
              <span>{current.primaryBtnText}</span>
              <ArrowRight size={17} />
            </button>

            {current.secondaryBtnText && (
              <button className="success-btn-secondary" onClick={current.secondaryAction}>
                {type === 'paid_plan' || type === 'free_trial' ? <Download size={16} /> : null}
                <span>{current.secondaryBtnText}</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '56px', fontSize: '12px', color: '#6B584C', textAlign: 'center' }}>
            Need guidance or assistance? Contact our{' '}
            <a
              href="https://wa.me/2349000000000?text=Hello%20Unbley%20Support%2C%20I%20have%20a%20question%20about%20my%20store"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: brandColor, fontWeight: '700', textDecoration: 'underline' }}
            >
              VIP merchant concierge
            </a>.
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
