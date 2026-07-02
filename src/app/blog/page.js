'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react';
import styles from './blog.module.css';

// Fallback blog posts if database is empty/not configured
const defaultPosts = [
  {
    id: 'p1',
    title: '5 Ejercicios Clave para Aumentar tu Fuerza',
    excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.',
    slug: 'ejercicios-clave-aumentar-fuerza',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    published_at: '2026-07-01T12:00:00Z',
    author: 'Coach Javier',
  },
  {
    id: 'p2',
    title: 'La Importancia de la Nutrición en el Entrenamiento Funcional',
    excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación.',
    slug: 'importancia-nutricion-entrenamiento-funcional',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    published_at: '2026-06-28T12:00:00Z',
    author: 'Nutri Camila',
  },
  {
    id: 'p3',
    title: 'HIIT vs Cardio Tradicional: ¿Cuál es mejor para ti?',
    excerpt: 'Comparamos las dos metodologías de resistencia cardiovascular más populares para ayudarte a elegir según tu tiempo y metas.',
    slug: 'hiit-vs-cardio-tradicional',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',
    published_at: '2026-06-15T12:00:00Z',
    author: 'Coach Javier',
  }
];

export default function Blog() {
  const [posts, setPosts] = useState(defaultPosts);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Usando noticias predeterminadas:', err);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>beast blog</span>
          <h1>Noticias & Consejos de Entrenamiento</h1>
          <p>Potencia tus entrenamientos y mejora tu nutrición con información validada por nuestros entrenadores.</p>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="section">
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar artículos (fuerza, nutrición...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${styles.searchInput} glass`}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className={styles.noResults}>
            <BookOpen size={48} className={styles.noResultsIcon} />
            <h3>No se encontraron artículos</h3>
            <p>Prueba con otros términos de búsqueda.</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {filteredPosts.map((post) => (
              <article key={post.id} className={`${styles.blogCard} glass`}>
                {post.image_url && (
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image_url} alt={post.title} className={styles.cardImage} />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <User size={14} /> {post.author}
                    </span>
                    <span className={styles.metaDivider}>|</span>
                    <span className={styles.metaItem}>
                      <Calendar size={14} /> {new Date(post.published_at).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMoreLink}>
                    Leer Artículo Completo <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
