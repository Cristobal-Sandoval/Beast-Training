'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, User, ChevronRight, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import styles from './detail.module.css';

export default function BlogDetailClient({ post, slug }) {
  const articleSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    publisher: { '@type': 'Organization', name: 'Beast Training', logo: { '@type': 'ImageObject', url: 'https://beasttraining.cl/favicon.ico' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://beasttraining.cl/blog/${post.slug}` },
  } : null;

  const breadcrumbSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://beasttraining.cl/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://beasttraining.cl/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://beasttraining.cl/blog/${post.slug}` },
    ],
  } : null;

  if (!post) {
    return (
      <div className={styles.notFoundWrapper}>
        <h2>Artículo no encontrado</h2>
        <p>El artículo que buscas no existe o ha sido eliminado.</p>
        <Link href="/blog" className={styles.backBtn}>
          <ArrowLeft size={16} /> Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}

      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContent}>
          <Link href="/">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/blog">Blog</Link>
          <ChevronRight size={14} />
          <span className={styles.current}>{post.title}</span>
        </div>
      </div>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <User size={16} className={styles.icon} />
              <span>Por {post.author}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={16} className={styles.icon} />
              <span>{new Date(post.published_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {post.image_url && (
          <div className={styles.imageContainer}>
            <Image src={post.image_url} alt={post.title} fill priority sizes="(max-width: 1000px) 100vw, 80vw" className={styles.coverImage} />
          </div>
        )}

        <div className={styles.layout}>
          <div className={`${styles.body} glass`}>
            {(post.content || '').split('\n\n').map((paragraph, index) => {
              if (paragraph.match(/^\d+\.\s/)) {
                return <div key={index} className={styles.listItem}>{paragraph}</div>;
              }
              if (paragraph.startsWith('* ')) {
                return (
                  <ul key={index} className={styles.list}>
                    {paragraph.split('\n').map((li, liIndex) => (
                      <li key={liIndex}>{li.replace('* ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index} className={styles.paragraph}>{paragraph}</p>;
            })}
          </div>

          <aside className={styles.sidebar}>
            <div className={`${styles.ctaCard} glass glow-orange`}>
              <Dumbbell className={styles.ctaIcon} size={36} />
              <h3>¿Listo para Entrenar?</h3>
              <p>Ven a probar una clase gratis a nuestra sede en Concepción.</p>
              <Link href="/planes" className={styles.ctaBtn}>Ver Planes & Precios</Link>
            </div>
          </aside>
        </div>

        <div className={styles.footerNav}>
          <Link href="/blog" className={styles.backBtn}>
            <ArrowLeft size={16} /> Volver a todas las noticias
          </Link>
        </div>
      </article>
    </div>
  );
}
