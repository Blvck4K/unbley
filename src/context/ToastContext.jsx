import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const confirm = useCallback(({ title = 'Are you sure?', message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    return new Promise((resolve) => {
      setDialog({
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const value = {
    toast: {
      success: (msg, dur) => addToast(msg, 'success', dur),
      error: (msg, dur) => addToast(msg, 'error', dur),
      info: (msg, dur) => addToast(msg, 'info', dur),
    },
    confirmDialog: confirm
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Render Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {t.type === 'success' && <CheckCircle2 size={18} color="#10B981" />}
              {t.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
              {t.type === 'info' && <Info size={18} color="#6A3E1F" />}
            </div>
            <div style={{ flex: 1, wordBreak: 'break-word', fontWeight: 500 }}>
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#8D5B36',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Modern Confirmation Dialog Modal */}
      {dialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 11000,
            backgroundColor: 'rgba(34, 21, 16, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={dialog.onCancel}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(34, 21, 16, 0.25)',
              border: '1px solid #EAE3D9',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(106, 62, 31, 0.08)',
                color: '#6A3E1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Info size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#221510', marginBottom: '8px' }}>
              {dialog.title}
            </h3>
            {dialog.message && (
              <p style={{ fontSize: '14px', color: '#6B584C', lineHeight: '1.6', marginBottom: '24px' }}>
                {dialog.message}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={dialog.onCancel}
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', fontSize: '14px' }}
              >
                {dialog.cancelText}
              </button>
              <button
                onClick={dialog.onConfirm}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', fontSize: '14px' }}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider during tests
    return {
      toast: {
        success: (msg) => console.log(msg),
        error: (msg) => console.error(msg),
        info: (msg) => console.log(msg),
      },
      confirmDialog: async () => true,
    };
  }
  return context;
};
