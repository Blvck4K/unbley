import React, { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div role="status" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 13000, padding: '10px 16px', backgroundColor: '#221510', color: '#FFFFFF', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
      You are offline. Your cart is saved, but payment and account changes need an internet connection.
    </div>
  );
}