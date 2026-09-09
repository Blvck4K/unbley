const recentReports = new Map();

export const reportClientError = (error) => {
  const reportKey = `${error.source || 'browser'}:${error.message || 'unknown'}`;
  const lastReportedAt = recentReports.get(reportKey) || 0;
  if (Date.now() - lastReportedAt < 30_000) return;
  recentReports.set(reportKey, Date.now());

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
    const source = /Loading chunk|dynamically imported module|imported module/i.test(event.message || '')
      ? 'chunk-load'
      : 'runtime-error';
    reportClientError({ source, message: event.message || 'Uncaught browser error' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason || 'Unhandled promise rejection');
    const source = /Loading chunk|dynamically imported module|imported module/i.test(message)
      ? 'chunk-load'
      : 'unhandled-rejection';
    reportClientError({ source, message });
  });

  ['pagehide', 'pageshow', 'freeze', 'resume'].forEach((eventName) => {
    window.addEventListener(eventName, () => {
      console.debug(`[lifecycle] ${eventName}`, { path: window.location.pathname });
    });
  });

  ['online', 'offline'].forEach((eventName) => {
    window.addEventListener(eventName, () => {
      console.info(`[network] ${eventName}`, { path: window.location.pathname });
    });
  });
};