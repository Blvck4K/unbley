import React from 'react';
import { resolveStoreTheme } from '../lib/storeTheme';

export default function StoreLoadingScreen({ theme }) {
  const { primaryColor, accentColor, storeFont } = resolveStoreTheme(theme || {});

  return (
    <div
      className="store-loading-screen"
      style={{ '--loading-background': primaryColor, '--loading-accent': accentColor, '--loading-font': storeFont }}
      role="status"
      aria-label="Loading"
    >
      <div className="store-loading-bubbles" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}