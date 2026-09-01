'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Calendar, User, Flame } from 'lucide-react';
import Image from 'next/image';
import styles from './blog.module.css';

import { DEFAULT_BLOG_POSTS } from '@/lib/defaultBlogPosts';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogClient() {
  const [posts, setPosts] = useState(DEFAULT_BLOG_POSTS);

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
      console.warn('Usando artículos predeterminados:', err);
    }
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className={styles.wrapper}>

      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Flame size={13} style={{ display: 'inline', marginRight: 5 }} />
            Beast Blog
          </span>
          <h1>Noticias &amp; Consejos de Entrenamiento</h1>
          <p>Potencia tus entrenamientos y mejora tu nutrición con información validada por nuestros entrenadores.</p>
        </div>
      </section>

      <div className={styles.feedWrapper}>

        {/* Featured Post — large card */}
        {featured && (
          <article className={`${styles.featuredCard} glass`}>
            {featured.image_url && (
              <div className={styles.featuredImageWrapper}>
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 840px) 100vw, 50vw"
                  className={styles.featuredImage}
                />
                <div className={styles.featuredOverlay} />
                {featured.category && (
                  <span className={styles.categoryBadge}>{featured.category}</span>
                )}
              </div>
            )}
            <div className={styles.featuredContent}>
              <span className={styles.featuredLabel}>Artículo Destacado</span>
              <h2 className={styles.featuredTitle}>
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <div className={styles.featuredMeta}>
                <span className={styles.metaItem}><User size={13} /> {featured.author}</span>
                <span className={styles.metaDot} />
                <span className={styles.metaItem}><Calendar size={13} /> {formatDate(featured.published_at)}</span>
              </div>
              <Link href={`/blog/${featured.slug}`} className={styles.readMoreBtn}>
                Leer artículo <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        )}

        {/* Rest of posts — compact grid */}
        {rest.length > 0 && (
          <div className={styles.blogGrid}>
            {rest.map((post) => (
              <article key={post.id} className={`${styles.blogCard} glass`}>
                {post.image_url && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className={styles.cardImage}
                    />
                    {post.category && (
                      <span className={styles.categoryBadge}>{post.category}</span>
                    )}
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}><User size={12} /> {post.author}</span>
                    <span className={styles.metaDot} />
                    <span className={styles.metaItem}><Calendar size={12} /> {formatDate(post.published_at)}</span>
                  </div>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMoreLink}>
                    Leer más <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className={styles.noResults}>
            <p>Aún no hay artículos publicados. ¡Vuelve pronto!</p>
          </div>
        )}
      </div>

    </div>
  );
}
