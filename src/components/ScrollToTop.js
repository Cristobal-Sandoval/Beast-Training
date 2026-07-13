'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button type="button"
      onClick={scrollToTop}
      aria-label="Volver al inicio"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--border-light)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: 999,
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--primary)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 0 15px var(--primary-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--glass-bg)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
}
