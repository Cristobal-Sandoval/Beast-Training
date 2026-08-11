'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AnnouncementBar.module.css';

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
    <div className={styles.annBarWrapper}>
      {/* Desktop: static centred */}
      <div className={styles.annBarInnerDesktop}>
        <Sparkles size={14} style={{ flexShrink: 0 }} />
        <span>{bar.text}</span>
        {linkEl && <span style={{ marginLeft: '4px' }}>{linkEl}</span>}
        <button type="button"
          onClick={() => setVisible(false)}
          className={styles.annBarDesktopClose}
          aria-label="Cerrar aviso"
        >
          <X size={14} />
        </button>
      </div>

      {/* Mobile: scrolling marquee ticker */}
      <div className={styles.annBarInnerMobile}>
        <span className={styles.annBarTicker}>
          <Sparkles size={13} style={{ flexShrink: 0 }} />
          <span>{bar.text}</span>
          {linkEl && <span style={{ marginLeft: '6px' }}>{linkEl}</span>}
          {/* Duplicate for seamless loop */}
          <span className={styles.annBarTickerSpacer}>
            <Sparkles size={13} style={{ flexShrink: 0, marginRight: '6px' }} />
            {bar.text}
          </span>
        </span>
        <button type="button"
          className={styles.annBarClose}
          onClick={() => setVisible(false)}
          aria-label="Cerrar aviso"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
