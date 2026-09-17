import React, { useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { getContrastColor, getReadableMutedColor } from '../lib/colors';

export default function StoreCategorySidebar({ categories, onSelect, theme, brand }) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerBackground = theme?.primaryColor || '#17120F';
  const drawerText = getContrastColor(drawerBackground);
  const drawerMuted = getReadableMutedColor(drawerBackground);
  const drawerAccent = theme?.accentColor || '#B98D5B';
  const brandName = brand?.brand_name || 'Brand';
  const brandLogo = brand?.logo_url || null;

  const handleSelect = (category) => {
    onSelect(category);
    setIsOpen(false);
  };

  const drawer = (
    <>
      <div className={`store-category-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
      <aside
        className={`store-category-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Store categories"
        style={{ backgroundColor: drawerBackground, color: drawerText, fontFamily: theme?.storeFont || 'inherit', '--store-sidebar-muted': drawerMuted, '--store-sidebar-accent': drawerAccent }}
      >
        <div className="store-category-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {brandLogo ? (
              <img src={brandLogo} alt={brandName} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: `${drawerAccent}22`, display: 'grid', placeItems: 'center', fontWeight: 700, color: drawerText, flexShrink: 0 }}>
                {brandName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8 }}>Store</span>
              <h2 style={{ margin: 0, fontSize: '20px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brandName}</h2>
            </div>
          </div>
          <button type="button" className="store-category-sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close categories">
            <X size={18} />
          </button>
        </div>
        <div className="store-category-sidebar-list">
          {categories.length === 0 ? (
            <p className="store-category-sidebar-empty">Categories will appear as products are added.</p>
          ) : categories.map((category) => (
            <button type="button" key={category.key} className="store-category-sidebar-item" onClick={() => handleSelect(category)}>
              <span>
                <small>{category.eyebrow}</small>
                {category.label}
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button type="button" className="store-category-mobile-trigger" onClick={() => setIsOpen(true)} aria-label="Open categories" title="Categories">
        <Menu size={21} />
      </button>
      {typeof document !== 'undefined' ? createPortal(drawer, document.body) : null}
    </>
  );
}
