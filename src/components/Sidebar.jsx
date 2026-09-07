import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Tag, 
  FileText, 
  Wallet,
  BarChart2, 
  Sliders, 
  HelpCircle, 
  Headphones, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ExternalLink,
  LogOut
} from 'lucide-react';
import logoImg from '../assets/logogo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Sidebar({ profileData, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, isAdmin } = useAuth();
  const sidebarRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Persist collapsed state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('unbley_sidebar_collapsed') === 'true';
  });

  // Hover expand — only active when sidebar is collapsed
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Whether sidebar should visually appear expanded
  const isExpanded = !isCollapsed || isHoverExpanded;

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('unbley_sidebar_collapsed', String(next));
      return next;
    });
    setIsHoverExpanded(false);
  };

  const handleMouseEnter = () => {
    if (isCollapsed) setIsHoverExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsHoverExpanded(false);
    setShowProfileMenu(false);
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' && !location.search.includes('tab=');
    }
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  useEffect(() => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
    setShowProfileMenu(false);
  }, [location.pathname, location.search, setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const ownerName = profileData?.owner_name || profileData?.brand_name || 'Isaac Akpasu';
  const firstInitial = (ownerName || 'U').charAt(0).toUpperCase();
  const brandLogo = profileData?.logo_url || null;

  // Fetch unread concierge messages count (admin only)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('concierge_messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender', 'user')
        .is('read_at', null);
      setUnreadCount(count ?? 0);
    };

    fetchUnread();

    // Realtime: catches new INSERT messages
    const channel = supabase
      .channel('admin_concierge_unread')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'concierge_messages' },
        () => fetchUnread()
      ).subscribe();

    // Optimistic clear: Support page dispatches this the moment a thread opens.
    // We zero immediately (no DB round-trip) so the badge clears instantly,
    // then do a background fetch to get the true remaining count.
    const onMessagesRead = (e) => {
      const zeroNow = e?.detail?.zeroAll;
      if (zeroNow) setUnreadCount(0);
      // Background sync after a short delay to let the DB UPDATE settle
      setTimeout(fetchUnread, 500);
    };
    window.addEventListener('unbley:messages-read', onMessagesRead);

    const onVisible = () => { if (document.visibilityState === 'visible') fetchUnread(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', fetchUnread);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('unbley:messages-read', onMessagesRead);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', fetchUnread);
    };
  }, [isAdmin]);

  return (
    <>
      <style>{`
        .sidebar-tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background-color: #18181B;
          color: #FFFFFF;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 9999;
          pointer-events: none;
          transition: opacity 0.15s ease, visibility 0.15s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        /* Only show tooltips when truly collapsed (not hover-expanded) */
        .sidebar-collapsed-true .has-tooltip:hover .sidebar-tooltip {
          visibility: visible;
          opacity: 1;
        }
        /* Sidebar label fade */
        .unbley-sidebar .sidebar-label {
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 0.2s ease, max-width 0.25s cubic-bezier(0.16,1,0.3,1);
          max-width: 160px;
          opacity: 1;
        }
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .sidebar-label {
          max-width: 0;
          opacity: 0;
        }
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-nav-group-title,
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-sidebar-brand-name,
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-sidebar-brand-tag,
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-sidebar-logo-text,
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-user-text-info,
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-user-options-btn {
          opacity: 0;
          width: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-nav-divider {
          display: block;
        }
        .unbley-sidebar .unbley-nav-group-title,
        .unbley-sidebar .unbley-sidebar-logo-text,
        .unbley-sidebar .unbley-user-text-info,
        .unbley-sidebar .unbley-user-options-btn {
          transition: opacity 0.2s ease, width 0.2s ease;
        }
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-collapse-toggle-btn {
          display: none;
        }
        /* Collapsed icon-only nav item */
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-nav-item {
          justify-content: center;
          padding: 10px;
        }
        .unbley-sidebar.is-collapsed:not(.is-hover-expanded) .unbley-user-card {
          justify-content: center;
        }
      `}</style>

      {/* Mobile Overlay */}
      <div 
        className={`unbley-mobile-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
      />

      {/* Sidebar Root */}
      <aside 
        ref={sidebarRef}
        className={`unbley-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isHoverExpanded ? 'is-hover-expanded' : ''} ${isSidebarOpen ? 'mobile-open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header: Logo & Collapse Button */}
        <div 
          className="unbley-sidebar-header" 
          style={{ justifyContent: isExpanded ? 'space-between' : 'center' }}
        >
          <Link to="/" className="unbley-sidebar-logo-link">
            <div className="unbley-sidebar-logo-badge">
              <img src={logoImg} alt="Unbley Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
            </div>
            <div className="unbley-sidebar-logo-text">
              <span className="unbley-sidebar-brand-name">Unbley</span>
              <span className="unbley-sidebar-brand-tag">DIGITAL STORE</span>
            </div>
          </Link>

          {/* Collapse toggle — only show when expanded (not hover state) */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              title="Collapse sidebar"
              className="unbley-sidebar-collapse-btn unbley-collapse-toggle-btn"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
            className="unbley-sidebar-mobile-close"
            title="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div id="tour-sidebar-nav" className="unbley-sidebar-nav">
          
          {/* Section 1: STORE MANAGEMENT */}
          <div>
            {isExpanded ? (
              <div className="unbley-nav-group-title">STORE MANAGEMENT</div>
            ) : (
              <div className="unbley-nav-divider" />
            )}

            <div>
              <Link 
                id="tour-nav-overview"
                to="/dashboard" 
                className={`unbley-nav-item ${isActive('/dashboard') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <LayoutGrid size={18} strokeWidth={isActive('/dashboard') ? 2.2 : 1.8} />
                <span className="sidebar-label">Dashboard</span>
                {!isExpanded && <span className="sidebar-tooltip">Dashboard</span>}
              </Link>

              <Link 
                id="tour-nav-profile"
                to="/profile" 
                className={`unbley-nav-item ${isActive('/profile') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <Tag size={18} strokeWidth={isActive('/profile') ? 2.2 : 1.8} />
                <span className="sidebar-label">Store Profile</span>
                {!isExpanded && <span className="sidebar-tooltip">Store Profile</span>}
              </Link>

              <Link 
                to="/dashboard?tab=products" 
                className={`unbley-nav-item ${isActive('/dashboard?tab=products') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <FileText size={18} strokeWidth={isActive('/dashboard?tab=products') ? 2.2 : 1.8} />
                <span className="sidebar-label">Products</span>
                {!isExpanded && <span className="sidebar-tooltip">Products</span>}
              </Link>

              <Link 
                to="/dashboard?tab=wallet" 
                className={`unbley-nav-item ${isActive('/dashboard?tab=wallet') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <Wallet size={18} strokeWidth={isActive('/dashboard?tab=wallet') ? 2.2 : 1.8} />
                <span className="sidebar-label">Wallet</span>
                {!isExpanded && <span className="sidebar-tooltip">Wallet</span>}
              </Link>

              <Link 
                to="/dashboard?tab=insights" 
                className={`unbley-nav-item ${isActive('/dashboard?tab=insights') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <BarChart2 size={18} strokeWidth={isActive('/dashboard?tab=insights') ? 2.2 : 1.8} />
                <span className="sidebar-label">Store Insights</span>
                {!isExpanded && <span className="sidebar-tooltip">Store Insights</span>}
              </Link>

              <Link 
                id="tour-nav-edit"
                to="/edit" 
                className={`unbley-nav-item ${isActive('/edit') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <Sliders size={18} strokeWidth={isActive('/edit') ? 2.2 : 1.8} />
                <span className="sidebar-label">Settings</span>
                {!isExpanded && <span className="sidebar-tooltip">Settings</span>}
              </Link>
            </div>
          </div>

          {/* Section 2: HELP */}
          <div>
            {isExpanded ? (
              <div className="unbley-nav-group-title">HELP</div>
            ) : (
              <div className="unbley-nav-divider" />
            )}

            <div>
              <Link 
                to="/contact" 
                className={`unbley-nav-item ${isActive('/contact') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                style={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
              >
                <HelpCircle size={18} strokeWidth={isActive('/contact') ? 2.2 : 1.8} />
                <span className="sidebar-label">F&Q</span>
                {!isExpanded && <span className="sidebar-tooltip">F&Q</span>}
              </Link>

              {isAdmin && (
                <Link 
                  to="/support" 
                  className={`unbley-nav-item ${isActive('/support') ? 'active' : ''} ${!isExpanded ? 'has-tooltip' : ''}`}
                  style={{ justifyContent: isExpanded ? 'flex-start' : 'center', position: 'relative' }}
                >
                  <Headphones size={18} strokeWidth={isActive('/support') ? 2.2 : 1.8} />
                  <span className="sidebar-label" style={{ flex: 1 }}>Contact Support</span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: '#DC2626',
                      color: '#fff',
                      borderRadius: '9999px',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '1px 5px',
                      minWidth: '16px',
                      textAlign: 'center',
                      lineHeight: '16px',
                      flexShrink: 0
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {!isExpanded && <span className="sidebar-tooltip">Contact Support{unreadCount > 0 ? ` (${unreadCount})` : ''}</span>}
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Expand button shown at bottom when truly collapsed + not hovering */}
        {isCollapsed && !isHoverExpanded && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '12px' }}>
            <button
              onClick={toggleCollapse}
              title="Expand sidebar"
              className="unbley-sidebar-collapse-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom User Card */}
        <div className="unbley-sidebar-footer user-menu-container">
          <div 
            className="unbley-user-card"
            style={{ justifyContent: isExpanded ? 'space-between' : 'center' }}
          >
            <div className="unbley-user-info">
              {/* Avatar — brand logo or initial */}
              <div
                className="unbley-user-avatar"
                style={brandLogo ? {
                  background: 'transparent',
                  padding: 0,
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                } : { flexShrink: 0 }}
              >
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt={ownerName}
                    style={{
                      width: '36px',
                      height: '36px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  `${firstInitial}.`
                )}
              </div>
              {isExpanded && (
                <div className="unbley-user-text-info" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span className="unbley-user-name">{ownerName}</span>
                  <span className="unbley-user-role">BRAND DIRECTOR</span>
                </div>
              )}
            </div>

            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="unbley-user-options-btn"
                title="Account options"
              >
                <MoreVertical size={14} />
              </button>
            )}
          </div>

          {/* User Popover Menu */}
          {showProfileMenu && isExpanded && (
            <div style={{
              position: 'absolute',
              bottom: '68px',
              left: '12px',
              right: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE6DF',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '6px',
              zIndex: 9999
            }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textDecoration: 'none'
                }}
              >
                <Tag size={15} /> Store Profile
              </Link>
              <Link
                to="/edit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textDecoration: 'none'
                }}
              >
                <Sliders size={15} /> Store Settings
              </Link>
              <div style={{ height: '1px', backgroundColor: '#F0ECE4', margin: '4px 0' }} />
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    navigate('/auth');
                  } catch (e) {
                    console.error("Sign out error", e);
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#DC2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
