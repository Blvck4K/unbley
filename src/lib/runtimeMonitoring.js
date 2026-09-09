const reportClientError = (error) => {
  const payload = JSON.stringify({
    source: error.source || 'browser',
    path: window.location.pathname,
    message: String(error.message || 'Unknown client error'),
    status: error.status
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/client-errors', new Blob([payload], { type: 'application/json' }));
    return;
  }

  window.fetch('/api/client-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true
  }).catch(() => {});
};

export const installRuntimeMonitoring = () => {
  if (typeof window === 'undefined' || window.__unbleyMonitoringInstalled) return;
  window.__unbleyMonitoringInstalled = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const requestUrl = String(args[0]?.url || args[0] || '');
    const isIgnoredRequest = requestUrl.includes('/auth/v1/') || requestUrl === '/api/client-errors';

    try {
      const response = await originalFetch(...args);
      if (!response.ok && requestUrl.startsWith('/api/') && !isIgnoredRequest) {
        reportClientError({
          source: 'api-request',
          message: `API request failed: ${requestUrl}`,
          status: response.status
        });
      }
      return response;
    } catch (error) {
      if (requestUrl.startsWith('/api/') && !isIgnoredRequest) {
        reportClientError({ source: 'api-request', message: error.message });
      }
      throw error;
    }
  };

  window.addEventListener('error', (event) => {
    if (/Loading chunk|dynamically imported module|imported module/i.test(event.message || '')) {
      reportClientError({ source: 'chunk-load', message: event.message });
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason || 'Unhandled promise rejection');
    if (/Loading chunk|dynamically imported module|imported module/i.test(message)) {
      reportClientError({ source: 'chunk-load', message });
    }
  });
};