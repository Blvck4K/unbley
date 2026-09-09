import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const appHosts = new Set(['localhost', '127.0.0.1', 'unbley.com', 'www.unbley.com']);

export default function StoreDomainResolver() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const isAppHost = appHosts.has(hostname) || hostname.endsWith('.vercel.app');
    if (isAppHost || location.pathname !== '/') return undefined;

    let cancelled = false;
    fetch(`/api/store-domain?host=${encodeURIComponent(hostname)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!cancelled && result?.storeId) {
          navigate(`/shop-brand/${result.storeId}`, { replace: true });
        }
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, [location.pathname, navigate]);

  return null;
}
