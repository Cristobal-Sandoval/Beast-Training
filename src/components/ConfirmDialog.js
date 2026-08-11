'use client';

import { useState, useEffect, useCallback } from 'react';

let _resolve = null;

export function confirmDialog(message) {
  return new Promise((resolve) => {
    _resolve = resolve;
    window.dispatchEvent(new CustomEvent('beast-confirm', { detail: { message } }));
  });
}

export default function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail.message);
      setOpen(true);
    };
    window.addEventListener('beast-confirm', handler);
    return () => window.removeEventListener('beast-confirm', handler);
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    _resolve?.(true);
    _resolve = null;
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    _resolve?.(false);
    _resolve = null;
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={handleCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(15,15,17,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        }}
      >
        <h3
          id="confirm-dialog-title"
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}
        >
          Confirmar acción
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1,
              background: 'var(--error)',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(239,68,68,0.25)',
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
