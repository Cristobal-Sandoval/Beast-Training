'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, ExternalLink, Play, Grid, Film } from 'lucide-react';
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

// Curated Instagram community posts from @btrainingchile
const COMMUNITY_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    likes: 184,
    comments: 24,
    caption: '¡Energía al 100% en la clase de HIIT y CrossFit de hoy! Saca la bestia 🐺🔥',
    url: 'https://www.instagram.com/btrainingchile/',
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    likes: 215,
    comments: 31,
    caption: 'Superando marcas personales en sentadilla y peso muerto. La disciplina no se negocia 💪',
    url: 'https://www.instagram.com/btrainingchile/',
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    likes: 142,
    comments: 18,
    caption: 'Atención personalizada y corrección biomecánica en cada repetición con Coach Pelu 🏋️‍♂️',
    url: 'https://www.instagram.com/btrainingchile/',
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    likes: 267,
    comments: 42,
    caption: 'El entrenamiento une, el progreso motiva. Orgullo de nuestra comunidad en Concepción ⚡',
    url: 'https://www.instagram.com/btrainingchile/',
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    likes: 156,
    comments: 15,
    caption: 'Nutrición deportiva real para potenciar la recuperación muscular y el rendimiento 🥗',
    url: 'https://www.instagram.com/btrainingchile/',
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',
    likes: 198,
    comments: 27,
    caption: 'Condicionamiento físico de alta intensidad. ¿Listo para tu próxima clase? 🏃💨',
    url: 'https://www.instagram.com/btrainingchile/',
  },
];

export default function InstagramFeed({
  title = 'Comunidad en Instagram',
  subtitle = 'Conoce el día a día de nuestros atletas, eventos y entrenamientos en Concepción.'
}) {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'profile'

  return (
    <section className={styles.section}>
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
              <span>Ver Perfil @btrainingchile</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className={styles.modeTabs}>
          <button
            type="button"
            onClick={() => setViewMode('gallery')}
            className={`${styles.modeTabBtn} ${viewMode === 'gallery' ? styles.modeTabActive : ''}`}
          >
            <Grid size={15} />
            <span>Galería de Fotos</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('profile')}
            className={`${styles.modeTabBtn} ${viewMode === 'profile' ? styles.modeTabActive : ''}`}
          >
            <Film size={15} />
            <span>Feed &amp; Reels en Vivo</span>
          </button>
        </div>

        {/* ── View 1: Fast Community Gallery ── */}
        {viewMode === 'gallery' && (
          <div className={styles.grid}>
            {COMMUNITY_POSTS.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.postCard}
                title={post.caption}
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className={styles.postImage}
                />
                
                {/* Hover / Active Touch Overlay */}
                <div className={styles.overlay}>
                  <div className={styles.overlayTop}>
                    <InstagramIcon size={18} className={styles.instagramIcon} />
                  </div>
                  
                  <div className={styles.overlayBottom}>
                    <div className={styles.stats}>
                      <span className={styles.statItem}>
                        <Heart size={13} fill="#fff" /> {post.likes}
                      </span>
                      <span className={styles.statItem}>
                        <MessageCircle size={13} fill="#fff" /> {post.comments}
                      </span>
                    </div>
                    <p className={styles.caption}>{post.caption}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── View 2: Real Instagram Profile & Embed Showcase ── */}
        {viewMode === 'profile' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            {/* Instagram Profile Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#070708',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                }}>
                  🐺
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800 }}>
                  @btrainingchile
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Beast Training · Gimnasio &amp; Entrenamiento Funcional en Concepción
                </p>
              </div>

              <a
                href="https://www.instagram.com/btrainingchile/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(225, 48, 108, 0.3)',
                }}
              >
                <InstagramIcon size={16} />
                <span>Abrir Instagram Oficial</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              Publicamos rutinas semanales, historias en vivo desde el box, técnicas de levantamiento y testimonios de nuestros alumnos.
            </p>
          </div>
        )}

        {/* Footer info bar */}
        <div className={styles.footerBar}>
          <span>Etiquétanos en tus historias con</span>
          <a
            href="https://www.instagram.com/explore/tags/beasttrainingchile/"
            target="_blank"
            rel="noopener noreferrer"
          >
            #BeastTrainingChile
          </a>
          <span>para aparecer en el feed de la comunidad.</span>
        </div>

      </div>
    </section>
  );
}
