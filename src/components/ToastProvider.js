'use client';

import { useState, useEffect } from 'react';
import { registerToast, unregisterToast } from '@/lib/toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    registerToast((message, type) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto remove after 3.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    });

    return () => {
      unregisterToast();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toastContainer">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type === 'success' ? 'toastSuccess' : 'toastError'}`}
          role="alert"
          aria-live="polite"
        >
          {t.type === 'success' ? (
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
          ) : (
            <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
