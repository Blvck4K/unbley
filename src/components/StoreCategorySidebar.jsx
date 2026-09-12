import React, { useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { getContrastColor, getReadableMutedColor } from '../lib/colors';

export default function StoreCategorySidebar({ categories, onSelect, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerBackground = theme?.primaryColor || '#17120F';
  const drawerText = getContrastColor(drawerBackground);
  const drawerMuted = getReadableMutedColor(drawerBackground);
  const drawerAccent = theme?.accentColor || '#B98D5B';

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
        style={{ backgroundColor: drawerBackground, color: drawerText, '--store-sidebar-muted': drawerMuted, '--store-sidebar-accent': drawerAccent }}
      >
        <div className="store-category-sidebar-header">
          <div>
            <span>Browse</span>
            <h2>Categories</h2>
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
