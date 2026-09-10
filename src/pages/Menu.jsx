import React, { useEffect, useState } from 'react';
import { BarChart2, CreditCard, HelpCircle, Headphones, Sliders, Users, ArrowLeft, ChevronRight, Menu as MenuIcon, LogOut } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';

const menuItems = [
  { to: '/dashboard?tab=insights', label: 'Store Insights', description: 'Review traffic and performance', icon: BarChart2, tone: 'blue' },
  { to: '/activation', label: 'Unbley Plans', description: 'Manage your subscription', icon: CreditCard, tone: 'gold', requiresInactivePlan: true },
  { to: '/edit', label: 'Store Settings', description: 'Customize your storefront', icon: Sliders, tone: 'brown' },
  { to: '/contact', label: 'FAQ', description: 'Find answers and support', icon: HelpCircle, tone: 'green' }
];

export default function Menu() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(null);
  const [tourStep, setTourStep] = useState(() => {
    const savedStep = sessionStorage.getItem('unbley_mobile_tour_resume_step');
    return savedStep === null ? null : Number(savedStep);
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  if (isMobile === false) return <Navigate to="/dashboard" replace />;
  if (isMobile === null) return <div style={{ minHeight: '100vh', background: '#FBF9F5' }} />;

  const hasActivePlan = Boolean(
    user?.store_active &&
    user?.plan_id &&
    user?.plan_ends_at &&
    new Date(user.plan_ends_at) > new Date()
  );
  const visibleItems = menuItems.filter(item => !item.requiresInactivePlan || !hasActivePlan);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <PageTransition>
      <main className="mobile-menu-page">
        <header className="mobile-menu-header">
          <Link to="/dashboard" className="mobile-menu-back" aria-label="Back to dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>Menu</h1>
          </div>
          <MenuIcon size={22} color="#8D5B36" />
        </header>

        <section className="mobile-menu-list" aria-label="More store tools">
          {visibleItems.map(({ to, label, description, icon, tone }) => (
            <Link
              key={to}
              id={to === '/edit' ? 'tour-menu-store-settings' : undefined}
              to={to}
              className="mobile-menu-item"
            >
              <span className={`mobile-menu-icon ${tone}`}>{React.createElement(icon, { size: 19 })}</span>
              <span className="mobile-menu-copy">
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight size={17} color="#9CA3AF" />
            </Link>
          ))}

          {isAdmin && (
            <>
              <Link to="/support" className="mobile-menu-item">
                <span className="mobile-menu-icon red"><Headphones size={19} /></span>
                <span className="mobile-menu-copy">
                  <strong>Admin Support</strong>
                  <small>Manage customer conversations</small>
                </span>
                <ChevronRight size={17} color="#9CA3AF" />
              </Link>
              <Link to="/admin/store-owners" className="mobile-menu-item">
                <span className="mobile-menu-icon blue"><Users size={19} /></span>
                <span className="mobile-menu-copy">
                  <strong>Store Owners</strong>
                  <small>View and search owner details</small>
                </span>
                <ChevronRight size={17} color="#9CA3AF" />
              </Link>
            </>
          )}
        </section>

        <div style={{ padding: '18px 16px 28px' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              border: 'none',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6A3E1F 0%, #8C5A35 100%)',
              color: '#fff',
              padding: '14px 18px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(106, 62, 31, 0.2)'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </main>
    </PageTransition>
  );
}
