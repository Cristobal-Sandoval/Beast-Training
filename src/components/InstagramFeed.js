'use client';

import Image from 'next/image';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
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
  subtitle = 'Conoce el día a día de nuestros atletas y entrenamientos en Concepción.'
}) {
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

          {/* Follow Button */}
          <a
            href="https://www.instagram.com/btrainingchile/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.followBtn}
          >
            <InstagramIcon size={18} />
            <span>Seguir a @btrainingchile</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* 6-Photo Instagram Grid */}
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

        {/* Footer info bar */}
        <div className={styles.footerBar}>
          <span>Etiquétanos en tus historias de entrenamiento con</span>
          <a
            href="https://www.instagram.com/explore/tags/beasttrainingchile/"
            target="_blank"
            rel="noopener noreferrer"
          >
            #BeastTrainingChile
          </a>
          <span>para aparecer en nuestra comunidad.</span>
        </div>

      </div>
    </section>
  );
}
