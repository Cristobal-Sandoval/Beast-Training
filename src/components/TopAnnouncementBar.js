'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const marqueeStyles = `
@keyframes marqueeScroll {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.ann-bar-wrapper {
  background: linear-gradient(90deg, #FF5700, #E04E00);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  position: relative;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  overflow: hidden;
}

/* Desktop: centred static text */
.ann-bar-inner-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 48px 8px 16px;
  text-align: center;
}

/* Mobile: hide desktop, show ticker */
@media (max-width: 640px) {
  .ann-bar-inner-desktop {
    display: none;
  }
  .ann-bar-inner-mobile {
    display: flex !important;
  }
}

/* Mobile ticker row */
.ann-bar-inner-mobile {
  display: none;
  align-items: center;
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.ann-bar-ticker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  animation: marqueeScroll 16s linear infinite;
  padding-right: 48px;
}

.ann-bar-close {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 10px;
  background: rgba(0,0,0,0.15);
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  flex-shrink: 0;
}
`;

export default function TopAnnouncementBar() {
  const [bar, setBar] = useState(null);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetchActiveBar();
  }, []);

  const fetchActiveBar = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .eq('active', true);
      
      if (!error && data && data.length > 0) {
        setBar(data[0]);
      }
    } catch (err) {
      console.warn('Error fetching announcement bar:', err);
    }
  };

  const isDashboardOrAdmin = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (!bar || !visible || isDashboardOrAdmin) return null;

  const linkEl = bar.link_url ? (
    <Link
      href={bar.link_url}
      style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: '700' }}
    >
      Ver más →
    </Link>
  ) : null;

  return (
    <>
      <style>{marqueeStyles}</style>
      <div className="ann-bar-wrapper">

        {/* Desktop: static centred */}
        <div className="ann-bar-inner-desktop">
          <Sparkles size={14} style={{ flexShrink: 0 }} />
          <span>{bar.text}</span>
          {linkEl && <span style={{ marginLeft: '4px' }}>{linkEl}</span>}
          <button
            onClick={() => setVisible(false)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
              minHeight: 'auto'
            }}
            aria-label="Cerrar aviso"
          >
            <X size={14} />
          </button>
        </div>

        {/* Mobile: scrolling marquee ticker */}
        <div className="ann-bar-inner-mobile">
          <span className="ann-bar-ticker">
            <Sparkles size={13} style={{ flexShrink: 0 }} />
            <span>{bar.text}</span>
            {linkEl && <span style={{ marginLeft: '6px' }}>{linkEl}</span>}
            {/* Duplicate for seamless loop */}
            <span style={{ marginLeft: '48px' }}>
              <Sparkles size={13} style={{ flexShrink: 0, marginRight: '6px' }} />
              {bar.text}
            </span>
          </span>
          <button
            className="ann-bar-close"
            onClick={() => setVisible(false)}
            aria-label="Cerrar aviso"
            style={{ minHeight: 'auto' }}
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </>
  );
}
