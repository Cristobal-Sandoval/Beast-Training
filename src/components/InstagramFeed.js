'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { ExternalLink } from 'lucide-react';
import styles from './InstagramFeed.module.css';

function InstagramIcon({ size = 18, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function InstagramFeed({
  title = 'Comunidad en Instagram',
  subtitle = 'Conoce el día a día de nuestros atletas, eventos y entrenamientos en vivo desde Concepción.'
}) {
  useEffect(() => {
    // Re-initialize Elfsight platform if script is already loaded across client navigations
    if (typeof window !== 'undefined' && window.eapps) {
      try {
        window.eapps.init();
      } catch (err) {
        // Safe fallback
      }
    }
  }, []);

  return (
    <section className={styles.section}>
      {/* Elfsight Platform Script */}
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />

      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.badge}>
              <InstagramIcon size={14} /> @btrainingchile
            </span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{subtitle}</p>
          </div>

          <div className={styles.headerActions}>
            <a
              href="https://www.instagram.com/btrainingchile/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followBtn}
            >
              <InstagramIcon size={18} />
              <span>Seguir en Instagram</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* ── Elfsight Live Auto-Updating Feed ── */}
        <div className={styles.elfsightWrapper}>
          <div
            className="elfsight-app-c73a52a2-a352-4203-b7b7-6ee82bd481cc"
            data-elfsight-app-lazy
          />
        </div>

        {/* Footer info bar */}
        <div className={styles.footerBar}>
          <span>Publicaciones sincronizadas en tiempo real desde</span>
          <a
            href="https://www.instagram.com/btrainingchile/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @btrainingchile
          </a>
          <span>· Etiquétanos en tus historias para aparecer en el feed.</span>
        </div>

      </div>
    </section>
  );
}
