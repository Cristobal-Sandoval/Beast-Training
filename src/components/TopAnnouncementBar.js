'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TopAnnouncementBar() {
  const [bar, setBar] = useState(null);
  const [visible, setVisible] = useState(true);

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

  if (!bar || !visible) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #FF5700, #E04E00)',
        color: '#ffffff',
        padding: '8px 36px 8px 16px',
        fontSize: '0.85rem',
        fontWeight: '600',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      <Sparkles size={14} style={{ flexShrink: 0 }} />
      <span>{bar.text}</span>
      {bar.link_url && (
        <Link 
          href={bar.link_url} 
          style={{ 
            color: '#ffffff', 
            textDecoration: 'underline', 
            marginLeft: '4px',
            fontWeight: '700' 
          }}
        >
          Ver más &rarr;
        </Link>
      )}
      
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
          justifyContent: 'center',
          opacity: 0.8
        }}
        aria-label="Cerrar aviso"
      >
        <X size={14} />
      </button>
    </div>
  );
}
