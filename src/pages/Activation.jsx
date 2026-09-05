import React, { useState } from 'react';
import {
  Check,
  HelpCircle,
  LogOut,
  X,
  Lock,
  ArrowUpRight,
  Search,
  Bell,
  Moon,
  LayoutGrid,
  User,
  Edit,
  HeadphonesIcon,
  TrendingUp,
  Package,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../hooks/useAuth';

// =========================================================================================
// 🛠️ ACTIVATION CONFIGURATION - TWEAK AND WRITE WHAT YOU WANT HERE
// =========================================================================================
// Feel free to change any text, prices, discounts, bullet points, or conditions below.
// All colors are mapped to Unbley's brand theme:
//   Primary: #6A3E1F | Hover: #522F16 | Accent: #8D5B36 | Surface: #F7F2EC | Border: #EAE3D9
// =========================================================================================

export const ACTIVATION_CONFIG = {
  // -----------------------------------------------------------------------------------------
  // 1. DISPLAY CONDITIONS & BEHAVIOR
  // ---------------------------------------------------------------------------------------
  conditions: {
    showAsPopup: true,            // true = displays as centered landscape pop-up over dashboard
    allowDismiss: true,           // true = shows 'X' button and allows peeking at dashboard
    defaultInterval: 'monthly', // Default active tab: 'monthly' | 'yearly'
    showTrialButton: true,        // Show 'Start free trial (No card required)' button
    autoOpenOnLoad: true,         // Pop-up opens immediately on page load
  },

  // ---------------------------------------------------------------------------------------
  // 2. TOP BANNER / SOCIAL PROOF
  // ---------------------------------------------------------------------------------------
  socialProof: {
    prefixText: "Join other businesses like",
    brands: [
      { name: "M3thods", link: "#" },
      { name: "Smokywurld", link: "#" }
    ],
    suffixText: "on Unbley and skyrocket your growth at 30% off !",
    helpButtonText: "Need Help?",
    helpActionUrl: "https://wa.me/2349000000000?text=Hello%20Unbley%2C%20I%20need%20help%20activating%20my%20store",
    logoutButtonText: "Log Out",
    trialButtonText: "Start 14-days free trial",
  },

  // ---------------------------------------------------------------------------------------
  // 3. BILLING CYCLE TABS
  // ---------------------------------------------------------------------------------------
  intervals: [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' }
  ],

  // ---------------------------------------------------------------------------------------
  // 4. LANDSCAPE PRICING CARDS (Edit, add, or customize plans here)
  // ---------------------------------------------------------------------------------------
  plans: [
    {
      id: 'free-trial',
      name: 'Unbley Free Trial',
      subtitle: 'For new businesses still figuring things out',
      isRecommended: false,
      recommendedBadge: null,
      // Pricing per billing interval
      pricing: {
        monthly: {
          displayPrice: 'Free',
          numericPrice: 0,
          usdPrice: 0,
          billingDetail: '14 Days Free Access (No Card Required)',
        },
        yearly: {
          displayPrice: 'Free',
          numericPrice: 0,
          usdPrice: 0,
          billingDetail: '14 Days Free Access (No Card Required)',
        }
      },
      // Checklist items
      features: [
        '14-days full access',
        'Add & Manage products',
        'Business Website + customisation',
        'No credit card required'
      ],
      buttonText: 'Start 14-Days Free Trial',
      theme: {
        cardBg: '#FFFFFF',
        cardBorder: '#EAE3D9',
        buttonBg: '#6A3E1F',
        buttonHoverBg: '#522F16',
        badgeBg: '#8D5B36',
        badgeText: '#FFFFFF',
        checkColor: '#6A3E1F'
      }
    },

    {
      id: 'starter',
      name: 'Unbley Starter',
      subtitle: 'For new businesses still figuring things out',
      isRecommended: true,
      recommendedBadge: 'RECOMMENDED',
      // Pricing per billing interval
      pricing: {
        monthly: {
          displayPrice: '₦5,000',
          numericPrice: 5000,
          usdPrice: 5,
          billingDetail: 'Billed Monthly',
        },
        yearly: {
          originalPrice: '₦60,000',
          displayPrice: '₦50,000',
          numericPrice: 50000,
          usdPrice: 40,
          discountBadge: '17% off',
          billingDetail: 'Billed Annually (12 Months)',
        }
      },
      // Checklist items
      features: [
        'Add & Manage products',
        'Business Website + customisation',
        'Send invoices/receipts',
        'Create discounts & coupons',
        'Record sales & expenses',
        'Integrations: Shipbubble & Fez',
        'Send bulk SMS & email campaigns'
      ],
      buttonText: 'Select Plan',
      theme: {
        cardBg: '#F7F2EC',
        cardBorder: '#DFCFC2',
        buttonBg: '#6A3E1F',
        buttonHoverBg: '#522F16',
        badgeBg: '#6A3E1F',
        badgeText: '#FFFFFF',
        checkColor: '#6A3E1F'
      }
    },

    {
      id: 'business',
      name: 'Unbley Business',
      subtitle: 'For solopreneurs with a small customer base',
      isRecommended: false,
      recommendedBadge: null,
      // Pricing per billing interval
      pricing: {
        monthly: {
          originalPrice: '₦20,000',
          displayPrice: '₦15,000',
          numericPrice: 15000,
          usdPrice: 10,
          discountBadge: '30% off',
          billingDetail: 'Billed Monthly. Save ₦5,000',
        },
        yearly: {
          originalPrice: '₦180,000',
          displayPrice: '₦120,000',
          numericPrice: 120000,
          usdPrice: 80,
          discountBadge: '37% off',
          billingDetail: 'Billed Annually (12 Months). Save ₦60,000',
        }
      },
      // Checklist items
      features: [
        'Everything in Starter',
        'Free .com.ng domain on a one-year plan',
        'Create MoQ & MaxOQ for products',
        'Add up to 3 staff accounts',
        'Customise invoices & receipts',
        'Automatically show delivery fee from different logistic providers on your website',
        'Simple business analytics',
        'Integrations: Facebook Pixel & Google Analytics'
      ],
      buttonText: 'Select Plan',
      theme: {
        cardBg: '#FFFFFF',
        cardBorder: '#EAE3D9',
        buttonBg: '#6A3E1F',
        buttonHoverBg: '#522F16',
        badgeBg: '#8D5B36',
        badgeText: '#FFFFFF',
        checkColor: '#6A3E1F'
      }
    }
  ]
};

export default function Activation() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // State condition to toggle pop-up visibility and active interval
  const [isOpen, setIsOpen] = useState(ACTIVATION_CONFIG.conditions.autoOpenOnLoad);
  const [activeInterval, setActiveInterval] = useState(ACTIVATION_CONFIG.conditions.defaultInterval);

  // Handle plan selection -> forwards plan details to finalize activation
  const handleSelectPlan = (plan) => {
    if (!plan) return;
    const currentPriceInfo = plan.pricing?.[activeInterval]
      || plan.pricing?.monthly
      || plan.pricing?.yearly
      || (plan.pricing ? Object.values(plan.pricing)[0] : null)
      || { displayPrice: 'Free', numericPrice: 0, usdPrice: 0, billingDetail: '14-Day Free Access' };

    navigate('/finalize-activation', {
      state: {
        planId: plan.id,
        planName: plan.name,
        interval: activeInterval,
        amount: currentPriceInfo.numericPrice ?? 0,
        usdAmount: currentPriceInfo.usdPrice ?? 0,
        period: currentPriceInfo.billingDetail || 'Selected Period',
        displayPrice: currentPriceInfo.displayPrice || 'Free'
      }
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <PageTransition>
      <div className="act-wrapper">
        <style>{`
          .act-wrapper {
            position: relative;
            min-height: 100vh;
            background-color: var(--bg-light, #FBF9F5);
            font-family: var(--font-primary, 'Inter', sans-serif);
            overflow-x: hidden;
          }

          /* Blurred Dashboard Background */
          .act-bg-dashboard {
            filter: blur(4px);
            opacity: 0.55;
            pointer-events: none;
            user-select: none;
            display: flex;
            min-height: 100vh;
          }

          .act-bg-sidebar {
            width: 260px;
            background: #FFFFFF;
            border-right: 1px solid var(--border-color, #EAE3D9);
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .act-bg-main {
            flex: 1;
            padding: 40px 60px;
          }

          /* Pop-up Overlay (Warm branded dim with subtle blur) */
          .act-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(38, 23, 16, 0.6);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            z-index: 1000;
            overflow-y: auto;
          }

          /* Landscape Pop-up Box */
          .act-popup-card {
            background: #FFFFFF;
            width: 100%;
            max-width: 1180px;
            border-radius: 20px;
            border: 1px solid var(--border-color, #EAE3D9);
            box-shadow: 0 25px 60px -15px rgba(34, 21, 16, 0.22);
            padding: 36px 36px;
            position: relative;
            max-height: 94vh;
            overflow-y: auto;
          }

          /* Top Header Banner */
          .act-header-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color, #EAE3D9);
          }

          .act-social-proof {
            font-size: 13.5px;
            color: var(--text-secondary, #6B584C);
            line-height: 1.5;
            font-weight: 500;
          }

          .act-brand-link {
            color: var(--primary, #6A3E1F);
            font-weight: 700;
            text-decoration: underline;
            margin: 0 3px;
          }

          .act-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
          }

          .act-pill-action {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 16px;
            border-radius: 9999px;
            border: 1px solid #DFCFC2;
            background: var(--bg-surface, #F7F2EC);
            color: var(--text-primary, #221510);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
          }

          .act-pill-action:hover {
            background: #EAE3D9;
            border-color: #C9BFB5;
            color: var(--primary, #6A3E1F);
          }

          .act-close-btn {
            background: var(--bg-surface, #F7F2EC);
            border: 1px solid #DFCFC2;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-secondary, #6B584C);
            transition: all 0.2s;
          }

          .act-close-btn:hover {
            background: #EAE3D9;
            color: var(--text-primary, #221510);
          }

          /* Intervals & Free Trial Row */
          .act-controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 28px;
            flex-wrap: wrap;
          }

          .act-interval-tabs {
            display: inline-flex;
            background: var(--bg-surface, #F7F2EC);
            border: 1px solid var(--border-color, #EAE3D9);
            padding: 4px;
            border-radius: 9999px;
            gap: 4px;
          }

          .act-tab-btn {
            border: none;
            outline: none;
            padding: 8px 22px;
            border-radius: 9999px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .act-tab-btn.active {
            background: var(--primary, #6A3E1F);
            color: #FFFFFF;
            box-shadow: 0 2px 8px rgba(106, 62, 31, 0.25);
          }

          .act-tab-btn.inactive {
            background: transparent;
            color: var(--text-secondary, #6B584C);
          }

          .act-tab-btn.inactive:hover {
            color: var(--text-primary, #221510);
          }

          .act-trial-pill {
            display: inline-flex;
            align-items: center;
            border: 1.5px solid var(--primary, #6A3E1F);
            color: var(--primary, #6A3E1F);
            background: #FFFFFF;
            padding: 8px 18px;
            border-radius: 9999px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .act-trial-pill:hover {
            background: var(--bg-surface, #F7F2EC);
          }

          /* Landscape Grid of Cards */
          .act-cards-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            align-items: stretch;
          }

          .act-card {
            border-radius: 18px;
            padding: 30px 22px;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .act-card:hover {
            transform: translateY(-2px);
          }

          .act-card-recommended-badge {
            position: absolute;
            top: -11px;
            right: 20px;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.08em;
            padding: 4px 12px;
            border-radius: 9999px;
            text-transform: uppercase;
            box-shadow: 0 2px 6px rgba(106, 62, 31, 0.2);
          }

          .act-card-title {
            font-size: 22px;
            font-weight: 800;
            color: var(--text-primary, #221510);
            margin-bottom: 6px;
            letter-spacing: -0.02em;
          }

          .act-card-sub {
            font-size: 12.5px;
            color: var(--text-secondary, #6B584C);
            margin-bottom: 20px;
            line-height: 1.4;
            min-height: 35px;
          }

          .act-price-wrap {
            margin-bottom: 18px;
          }

          .act-price-original {
            font-size: 13px;
            color: var(--text-muted, #8D5B36);
            text-decoration: line-through;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .act-price-main-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .act-price-number {
            font-size: 30px;
            font-weight: 800;
            color: var(--text-primary, #221510);
            letter-spacing: -0.03em;
            line-height: 1.1;
          }

          .act-discount-tag {
            background: rgba(141, 91, 54, 0.12);
            color: var(--accent, #8D5B36);
            border: 1px solid #DFCFC2;
            font-size: 10.5px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .act-price-detail {
            font-size: 11px;
            color: var(--text-secondary, #6B584C);
            margin-top: 6px;
            font-weight: 500;
          }

          .act-card-divider {
            height: 1px;
            background: var(--border-color, #EAE3D9);
            margin: 18px 0 24px 0;
          }

          .act-feature-list {
            list-style: none;
            padding: 0;
            margin: 0 0 32px 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
            flex-grow: 1;
          }

          .act-feature-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 13px;
            color: var(--text-primary, #221510);
            line-height: 1.4;
          }

          .act-check-icon {
            color: var(--primary, #6A3E1F);
            flex-shrink: 0;
            margin-top: 2px;
          }

          .act-select-btn {
            width: 100%;
            border: none;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 700;
            padding: 14px 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: auto;
          }

          .act-select-btn:hover {
            filter: brightness(0.92);
            transform: scale(1.01);
          }

          /* Floating Re-Open Button when closed */
          .act-floating-trigger {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-dark, #261710);
            color: var(--text-light, #FDFBF7);
            padding: 14px 28px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 10px 25px -5px rgba(38, 23, 16, 0.35);
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            z-index: 999;
            border: 1px solid var(--border-dark, #4A3326);
            transition: all 0.2s ease;
          }

          .act-floating-trigger:hover {
            background: #3A2317;
            transform: translateX(-50%) translateY(-2px);
          }

          /* Responsive Breakpoint for Medium & Small Screens */
          @media (max-width: 1080px) {
            .act-cards-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 860px) {
            .act-popup-card {
              padding: 24px 18px;
              max-height: 96vh;
            }

            .act-header-banner {
              flex-direction: column;
              align-items: flex-start;
              gap: 14px;
            }

            .act-header-actions {
              width: 100%;
              justify-content: space-between;
            }

            .act-controls-row {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }

            .act-interval-tabs {
              width: 100%;
              justify-content: center;
            }

            .act-tab-btn {
              flex: 1;
              text-align: center;
              padding: 8px 12px;
              font-size: 11.5px;
            }

            .act-trial-pill {
              justify-content: center;
              width: 100%;
            }

            .act-cards-grid {
              grid-template-columns: 1fr !important;
              gap: 20px;
            }

            .act-card {
              padding: 26px 20px;
            }
          }
        `}</style>

        {/* 1. Background Mockup of Dashboard (Gives context that store is locked) */}
        <div className="act-bg-dashboard">
          <div className="act-bg-sidebar">
            <div style={{ fontWeight: '800', fontSize: '20px', color: 'var(--primary, #6A3E1F)' }}>Unbley.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary, #6B584C)' }}>
                <LayoutGrid size={16} /> Overview <Lock size={12} style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary, #6B584C)' }}>
                <User size={16} /> Profile <Lock size={12} style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary, #6B584C)' }}>
                <Edit size={16} /> Edit Store <Lock size={12} style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary, #6B584C)' }}>
                <HeadphonesIcon size={16} /> Customer Service
              </div>
            </div>
          </div>

          <div className="act-bg-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary, #221510)' }}>Dashboard</h2>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary, #6B584C)' }}>
                <Search size={18} />
                <Bell size={18} />
                <Moon size={18} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color, #EAE3D9)' }}>
                <TrendingUp size={20} color="var(--primary, #6A3E1F)" />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B584C)', marginTop: '12px' }}>Total Sales</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary, #221510)' }}>₦0</div>
              </div>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color, #EAE3D9)' }}>
                <Package size={20} color="var(--text-secondary, #6B584C)" />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B584C)', marginTop: '12px' }}>Stock Portfolio</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary, #221510)' }}>0</div>
              </div>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color, #EAE3D9)' }}>
                <BarChart3 size={20} color="var(--text-secondary, #6B584C)" />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B584C)', marginTop: '12px' }}>Your Traffic</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary, #221510)' }}>0</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Landscape Pop-up Modal (Condition: isOpen && showAsPopup) */}
        <AnimatePresence>
          {isOpen && ACTIVATION_CONFIG.conditions.showAsPopup && (
            <motion.div
              className="act-popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="act-popup-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Top Header Banner */}
                <div className="act-header-banner">
                  <div className="act-social-proof">
                    {ACTIVATION_CONFIG.socialProof.prefixText}
                    {ACTIVATION_CONFIG.socialProof.brands.map((brand, idx) => (
                      <span key={brand.name}>
                        <a href={brand.link} className="act-brand-link" onClick={(e) => e.preventDefault()}>
                          {brand.name}
                        </a>
                        {idx < ACTIVATION_CONFIG.socialProof.brands.length - 1 ? ', ' : ' '}
                      </span>
                    ))}
                    {ACTIVATION_CONFIG.socialProof.suffixText}
                  </div>

                  <div className="act-header-actions">
                    <a
                      href={ACTIVATION_CONFIG.socialProof.helpActionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="act-pill-action"
                    >
                      <HelpCircle size={14} color="var(--primary, #6A3E1F)" />
                      {ACTIVATION_CONFIG.socialProof.helpButtonText || ACTIVATION_CONFIG.socialProof.needHelpText || "Need Help?"}
                    </a>

                    <button onClick={handleLogout} className="act-pill-action">
                      <LogOut size={14} />
                      {ACTIVATION_CONFIG.socialProof.logoutButtonText}
                    </button>

                    {ACTIVATION_CONFIG.conditions.allowDismiss && (
                      <button
                        onClick={() => setIsOpen(false)}
                        className="act-close-btn"
                        title="Close pop-up"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Interval Tabs & Free Trial Row */}
                <div className="act-controls-row">
                  <div className="act-interval-tabs">
                    {ACTIVATION_CONFIG.intervals.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveInterval(tab.id)}
                        className={`act-tab-btn ${activeInterval === tab.id ? 'active' : 'inactive'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {ACTIVATION_CONFIG.conditions.showTrialButton && (
                    <button
                      onClick={() => {
                        const trialPlan = ACTIVATION_CONFIG.plans.find(p => p.id === 'free-trial') || ACTIVATION_CONFIG.plans[0];
                        handleSelectPlan(trialPlan);
                      }}
                      className="act-trial-pill"
                    >
                      {ACTIVATION_CONFIG.socialProof.trialButtonText}
                    </button>
                  )}
                </div>

                {/* Landscape Cards Grid */}
                <div className="act-cards-grid">
                  {ACTIVATION_CONFIG.plans.map((plan) => {
                    const pricing = plan.pricing?.[activeInterval]
                      || plan.pricing?.monthly
                      || plan.pricing?.yearly
                      || (plan.pricing ? Object.values(plan.pricing)[0] : null)
                      || { displayPrice: 'Free', numericPrice: 0, usdPrice: 0, billingDetail: '14-Day Free Access' };
                    return (
                      <div
                        key={plan.id}
                        className="act-card"
                        style={{
                          backgroundColor: plan.theme?.cardBg || '#FFFFFF',
                          border: `1.5px solid ${plan.theme?.cardBorder || '#EAE3D9'}`
                        }}
                      >
                        {/* Recommended Badge */}
                        {plan.isRecommended && plan.recommendedBadge && (
                          <div
                            className="act-card-recommended-badge"
                            style={{
                              backgroundColor: plan.theme?.badgeBg || 'var(--primary, #6A3E1F)',
                              color: plan.theme?.badgeText || '#FFFFFF'
                            }}
                          >
                            {plan.recommendedBadge}
                          </div>
                        )}

                        {/* Title & Subtitle */}
                        <div className="act-card-title">{plan.name}</div>
                        <div className="act-card-sub">{plan.subtitle}</div>

                        {/* Pricing Block */}
                        <div className="act-price-wrap">
                          {pricing.originalPrice && (
                            <div className="act-price-original">
                              {pricing.originalPrice}
                            </div>
                          )}

                          <div className="act-price-main-row">
                            <div className="act-price-number">
                              {pricing.displayPrice}
                            </div>
                            {pricing.discountBadge && (
                              <div className="act-discount-tag">
                                <span>🏷️</span> {pricing.discountBadge}
                              </div>
                            )}
                          </div>

                          <div className="act-price-detail">
                            {pricing.billingDetail}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="act-card-divider" />

                        {/* Feature Checklist */}
                        <ul className="act-feature-list">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="act-feature-item">
                              <Check
                                size={16}
                                strokeWidth={2.6}
                                className="act-check-icon"
                                style={{ color: plan.theme?.checkColor || 'var(--primary, #6A3E1F)' }}
                              />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Select Plan Button */}
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className="act-select-btn"
                          style={{
                            backgroundColor: plan.theme?.buttonBg || 'var(--primary, #6A3E1F)'
                          }}
                        >
                          {plan.buttonText}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Floating Re-open Trigger (Displays if the user closes the modal) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="act-floating-trigger"
            onClick={() => setIsOpen(true)}
          >
            <Lock size={15} color="#E8DCCF" />
            <span>Store Inactive — Click to View Activation Plans</span>
            <ArrowUpRight size={15} />
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
