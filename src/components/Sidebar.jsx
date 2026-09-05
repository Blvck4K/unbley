import React, { useState } from 'react';
import { LayoutGrid, User, Settings, ChevronRight, X, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ profileData, isSidebarOpen, setIsSidebarOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const brandColor = '#6A3E1F';

  const s = {
    sidebar: { 
      width: isCollapsed ? '80px' : '280px', 
      borderRight: '1px solid #EAE3D9', 
      padding: '0', 
      display: 'flex', 
      flexDirection: 'column', 
      transition: 'width 0.3s ease',
      height: '100%',
      backgroundColor: '#FFFFFF',
      flexShrink: 0,
      zIndex: 1000
    },
    logoContainer: { 
      padding: isCollapsed ? '40px 0' : '60px 40px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: isCollapsed ? 'center' : 'flex-start',
      position: 'relative'
    },
    logo: { 
      fontFamily: 'var(--font-heading)', 
      fontSize: isCollapsed ? '16px' : '20px', 
      letterSpacing: '-0.02em', 
      fontWeight: '800',
      color: brandColor, 
      textTransform: 'none' 
    },
    nav: { padding: '0', flex: 1, overflowX: 'hidden' },
    navItem: (active) => ({ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      padding: isCollapsed ? '20px 0' : '16px 40px', 
      justifyContent: isCollapsed ? 'center' : 'flex-start', 
      color: active ? '#221510' : '#6B584C', 
      backgroundColor: active ? '#F7F2EC' : 'transparent', 
      borderLeft: !isCollapsed && active ? `3px solid ${brandColor}` : '3px solid transparent', 
      cursor: 'pointer', 
      fontSize: '12px', 
      fontWeight: active ? '600' : '400', 
      letterSpacing: '0.05em', 
      transition: 'all 0.2s', 
      textTransform: 'uppercase', 
      textDecoration: 'none' 
    }),
    userProfile: { 
      padding: isCollapsed ? '24px 0' : '24px 40px', 
      borderTop: '1px solid #EAE3D9', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isCollapsed ? 'center' : 'flex-start', 
      gap: '16px', 
      backgroundColor: '#FBF9F5' 
    },
    userAvatar: { 
      width: '32px', 
      height: '32px', 
      minWidth: '32px', 
      backgroundColor: '#EAE3D9', 
      overflow: 'hidden', 
      borderRadius: '50%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    collapseBtn: { 
      padding: '20px', 
      borderTop: '1px solid #EAE3D9', 
      cursor: 'pointer', 
      display: 'flex', 
      justifyContent: 'center', 
      color: '#6B584C',
      background: 'none',
      width: '100%'
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .dash-sidebar { 
            position: fixed !important; 
            top: 0 !important; 
            left: ${isSidebarOpen ? '0' : '-100%'} !important; 
            width: ${isCollapsed ? '80px' : '280px'} !important; 
            height: 100vh !important; 
            z-index: 1001 !important; 
            background-color: #FFFFFF !important;
            transition: left 0.3s ease, width 0.3s ease !important;
            box-shadow: 10px 0 30px rgba(34,21,16,0.1) !important;
          }
           .dash-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background-color: rgba(34,21,16,0.4) !important;
            z-index: 1000 !important;
            display: ${isSidebarOpen ? 'block' : 'none'} !important;
          }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="dash-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <div style={s.sidebar} className="dash-sidebar">
        <div style={s.logoContainer}>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'absolute', top: '24px', right: isCollapsed ? '50%' : '24px', transform: isCollapsed ? 'translateX(50%)' : 'none', background: 'none', border: 'none', color: '#6B584C', cursor: 'pointer' }}
            className="mobile-only"
          >
            <X size={24} />
          </button>
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={s.logo}>{isCollapsed ? 'U.' : 'Unbley.'}</div>
          </Link>
          {!isCollapsed && (
            <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#8D5B36', marginTop: '8px', textTransform: 'uppercase' }}>
              Digital Store
            </div>
          )}
        </div>

        <div style={s.nav}>
          <Link to="/dashboard" style={s.navItem(isActive('/dashboard'))} title="Overview">
            <LayoutGrid size={18} /> {!isCollapsed && "Dashboard"}
          </Link>
          <Link to="/profile" style={s.navItem(isActive('/profile'))} title="Profile">
            <User size={18} /> {!isCollapsed && "Profile"}
          </Link>
          <Link to="/edit" style={s.navItem(isActive('/edit'))} title="Edit Store">
            <Settings size={18} /> {!isCollapsed && "Edit Store"}
          </Link>
        </div>

        {/* Unified Collapse Toggle (Works on Desktop & Mobile per user request) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          style={s.collapseBtn}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronRight size={16} style={{transform: 'rotate(180deg)'}} />}
        </button>

        <div style={s.userProfile}>
          <div style={s.userAvatar}>
            {profileData?.logo_url ? (
              <img src={profileData.logo_url} alt={profileData.owner_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#6A3E1F', fontSize: '10px', fontWeight: 'bold' }}>{profileData?.owner_name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#221510', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {profileData?.owner_name || 'User'}
              </div>
              <div style={{ fontSize: '9px', color: '#6B584C', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
                Principal Curator
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
