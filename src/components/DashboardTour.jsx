import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Store, TrendingUp, Package, Edit as EditIcon, Compass, LayoutGrid, User, Settings } from 'lucide-react';

export default function DashboardTour({
  isActive = false,
  onClose,
  userId = 'default',
  onSidebarToggle
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [placement, setPlacement] = useState('bottom');

  const tourSteps = [
    {
      id: 'tour-nav-overview',
      fallbackId: 'tour-mobile-menu',
      title: 'Overview Command Center',
      description: 'Your primary operational dashboard summarizing real-time sales, live stock listings, store traffic, and incoming orders.',
      icon: LayoutGrid,
      isSidebar: true,
      preferredPlacement: 'right'
    },
    {
      id: 'tour-nav-profile',
      fallbackId: 'tour-mobile-menu',
      title: 'Brand Profile',
      description: 'Inspect your public brand profile, contact information, and direct access to concierge support.',
      icon: User,
      isSidebar: true,
      preferredPlacement: 'right'
    },
    {
      id: 'tour-nav-edit',
      fallbackId: 'tour-mobile-menu',
      title: 'Store Customizer (Edit)',
      description: 'Customize your store branding, banners, color palette, curated product showcase gallery, and social media links.',
      icon: Settings,
      isSidebar: true,
      preferredPlacement: 'right'
    },
    {
      id: 'tour-storefront',
      title: 'Your Live Storefront',
      description: 'Click "Manage Store" to preview what customers see. Any products, prices, and branding you publish update here instantly.',
      icon: Store,
      isSidebar: false,
      preferredPlacement: 'bottom'
    },
    {
      id: 'tour-setup-meter',
      fallbackId: 'tour-launch-btn',
      title: 'Store Setup Checklist',
      description: 'Follow these milestones to launch: upload your logo, set payout bank details, configure shipping, add products, and activate your store.',
      icon: Sparkles,
      isSidebar: false,
      preferredPlacement: 'bottom'
    },
    {
      id: 'tour-brand-identity',
      title: 'Brand Profile & Domain',
      description: 'Your brand name, primary contact details, and custom store link are displayed here so you always have direct access.',
      icon: Compass,
      isSidebar: false,
      preferredPlacement: 'bottom'
    },
    {
      id: 'tour-stats-grid',
      title: 'Sales & Inventory Analytics',
      description: 'Monitor your total revenue, active product listings, and real-time visitor traffic at a single glance.',
      icon: TrendingUp,
      isSidebar: false,
      preferredPlacement: 'top'
    },
    {
      id: 'tour-orders-ledger',
      title: 'Recent Orders & Ledger',
      description: 'All customer purchases appear here in real time. Track order status, payment verification, and fulfill shipments easily.',
      icon: Package,
      isSidebar: false,
      preferredPlacement: 'top'
    }
  ];

  const currentTour = tourSteps[currentStep];

  // Handle mobile sidebar opening/closing depending on whether current step is in the sidebar
  useEffect(() => {
    if (!isActive || !currentTour) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile && onSidebarToggle) {
      if (currentTour.isSidebar) {
        onSidebarToggle(true);
      } else {
        onSidebarToggle(false);
      }
    }
  }, [currentStep, isActive, currentTour, onSidebarToggle]);

  const updatePosition = useCallback(() => {
    if (!isActive || !currentTour) return;

    let el = document.getElementById(currentTour.id);
    if (!el && currentTour.fallbackId) {
      el = document.getElementById(currentTour.fallbackId);
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });

        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          // On mobile, position above or below with safe screen padding
          if (rect.top > window.innerHeight / 2) {
            setPlacement('top');
          } else {
            setPlacement('bottom');
          }
          return;
        }

        // Desktop placement logic
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.right;

        if (currentTour.preferredPlacement === 'right' && spaceRight > 360) {
          setPlacement('right');
        } else if (currentTour.preferredPlacement === 'top' && spaceAbove > 240) {
          setPlacement('top');
        } else if (spaceBelow > 260) {
          setPlacement('bottom');
        } else if (spaceAbove > 240) {
          setPlacement('top');
        } else {
          setPlacement('bottom');
        }
        return;
      }
    }

    // Centered fallback if element is missing or not rendered
    setTargetRect(null);
    setPlacement('center');
  }, [isActive, currentTour]);

  // Scroll target into view and refresh coordinates
  useEffect(() => {
    if (!isActive || !currentTour) return;

    const isMobile = window.innerWidth < 768;
    let el = document.getElementById(currentTour.id);
    if (!el && currentTour.fallbackId) {
      el = document.getElementById(currentTour.fallbackId);
    }

    if (el && (!isMobile || !currentTour.isSidebar)) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer = setTimeout(() => {
      updatePosition();
    }, 280);

    return () => clearTimeout(timer);
  }, [currentStep, isActive, currentTour, updatePosition]);

  // Resize and keyboard listeners
  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, updatePosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (onSidebarToggle) {
      onSidebarToggle(false);
    }
    if (userId) {
      localStorage.setItem(`unbley_dashboard_tour_seen_${userId}`, 'true');
    }
    onClose?.();
  };

  if (!isActive) return null;

  const IconComponent = currentTour?.icon || Sparkles;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const tooltipWidth = isMobile ? Math.min(340, window.innerWidth - 32) : 360;

  let tooltipStyle = {};

  if (targetRect && placement !== 'center') {
    const padding = 14;

    if (isMobile) {
      // Mobile positioning: center horizontally within screen padding
      const left = 16;
      if (placement === 'top') {
        const top = Math.max(16, targetRect.top - 240);
        tooltipStyle = {
          top: `${top}px`,
          left: `${left}px`,
          width: `${tooltipWidth}px`
        };
      } else {
        const top = Math.min(window.innerHeight - 280, targetRect.bottom + padding);
        tooltipStyle = {
          top: `${Math.max(16, top)}px`,
          left: `${left}px`,
          width: `${tooltipWidth}px`
        };
      }
    } else {
      // Desktop positioning
      if (placement === 'bottom') {
        const top = targetRect.bottom + padding;
        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

        tooltipStyle = {
          top: `${Math.min(top, window.innerHeight - 300)}px`,
          left: `${left}px`,
          width: `${tooltipWidth}px`
        };
      } else if (placement === 'top') {
        const top = Math.max(16, targetRect.top - padding - 220);
        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

        tooltipStyle = {
          top: `${top}px`,
          left: `${left}px`,
          width: `${tooltipWidth}px`
        };
      } else if (placement === 'right') {
        const left = targetRect.right + padding;
        let top = targetRect.top;
        top = Math.max(16, Math.min(top, window.innerHeight - 280));

        tooltipStyle = {
          top: `${top}px`,
          left: `${Math.min(left, window.innerWidth - tooltipWidth - 16)}px`,
          width: `${tooltipWidth}px`
        };
      }
    }
  } else {
    tooltipStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${tooltipWidth}px`
    };
  }

  const tourContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        pointerEvents: 'auto',
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Semi-transparent dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          transition: 'all 0.3s ease'
        }}
        onClick={handleComplete}
      />

      {/* Target Highlight Box & Pulse */}
      {targetRect && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: `${targetRect.top - 6}px`,
              left: `${targetRect.left - 6}px`,
              width: `${targetRect.width + 12}px`,
              height: `${targetRect.height + 12}px`,
              borderRadius: '10px',
              border: '2px solid #6A3E1F',
              boxShadow: '0 0 0 4px rgba(106, 62, 31, 0.35), 0 10px 30px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'none',
              zIndex: 1000000,
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }}
          />

          {/* Glowing Animated Pointer Indicator */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.95, 0.45, 0.95]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'fixed',
              top: `${Math.max(8, targetRect.top - 10)}px`,
              left: `${Math.max(8, targetRect.left + (targetRect.width / 2) - 8)}px`,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#6A3E1F',
              border: '3px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
              pointerEvents: 'none',
              zIndex: 1000001
            }}
          />
        </>
      )}

      {/* Interactive Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            ...tooltipStyle,
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D9',
            boxShadow: '0 20px 40px rgba(34, 21, 16, 0.24)',
            padding: '20px 22px',
            zIndex: 1000002,
            boxSizing: 'border-box'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row: Badge & Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(106, 62, 31, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6A3E1F'
                }}
              >
                <IconComponent size={18} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  color: '#8D5B36',
                  textTransform: 'uppercase'
                }}
              >
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>

            <button
              onClick={handleComplete}
              title="Close tour"
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Title & Description */}
          <h4
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              fontWeight: '800',
              color: '#221510',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}
          >
            {currentTour.title}
          </h4>

          <p
            style={{
              fontSize: '12.5px',
              lineHeight: '1.5',
              color: '#6B584C',
              margin: '0 0 18px 0'
            }}
          >
            {currentTour.description}
          </p>

          {/* Progress Indicators & Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #F3EFEA' }}>
            {/* Step Dots */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    width: idx === currentStep ? '16px' : '5px',
                    height: '5px',
                    borderRadius: '9999px',
                    backgroundColor: idx === currentStep ? '#6A3E1F' : '#EAE3D9',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  style={{
                    padding: '7px 11px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                >
                  <ChevronLeft size={13} /> Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#6A3E1F',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(106, 62, 31, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#5a3219'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6A3E1F'; }}
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>Got It! <Check size={13} /></>
                ) : (
                  <>Next <ChevronRight size={13} /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(tourContent, document.body);
  }
  return tourContent;
}
