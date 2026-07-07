'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Calendar, User, ChevronRight, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import styles from './detail.module.css';

// Fallback blog posts if database is empty/not configured
const defaultPosts = [
  {
    id: 'p1',
    title: '5 Ejercicios Clave para Aumentar tu Fuerza',
    content: `La fuerza es la base de todas las cualidades físicas. Ya sea que tu meta sea ganar masa muscular, perder grasa, mejorar en tu deporte o simplemente sentirte más ágil en tu vida diaria, construir una base sólida de fuerza muscular es fundamental.

A continuación, detallaremos los 5 ejercicios compuestos fundamentales que deben ser la columna vertebral de tu programa de entrenamiento:

1. La Sentadilla (Squat): El rey de los ejercicios de pierna. Trabaja cuádriceps, glúteos, femorales y el core. Asegúrate de descender al menos hasta que tus muslos queden paralelos al suelo para una activación completa.
2. El Peso Muerto (Deadlift): Ideal para la cadena posterior. Fortalece la espalda baja, glúteos, femorales y el agarre. Mantén siempre la espalda recta y empuja con las piernas.
3. El Press de Banca (Bench Press): El ejercicio principal para la fuerza del torso empujando horizontalmente. Estimula pectorales, tríceps y deltoides anterior.
4. El Press Militar (Overhead Press): Ejercicio de empuje vertical de hombros y tríceps de pie. Requiere gran estabilidad en el core para mantener una postura firme.
5. Dominadas (Pull-ups): El mejor ejercicio de tirón vertical. Desarrolla la espalda alta (dorsales), hombros y bíceps. Si no puedes hacerlas libres, usa bandas de asistencia.

Integra estos movimientos de 2 a 3 veces por semana de forma progresiva, enfocándote primero en dominar la técnica antes de subir la carga.`,
    excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.',
    slug: 'ejercicios-clave-aumentar-fuerza',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-07-01T12:00:00Z',
    author: 'Coach Javier',
  },
  {
    id: 'p2',
    title: 'La Importancia de la Nutrición en el Entrenamiento Funcional',
    content: `Entrenar intensamente es solo una parte de la ecuación. Si no estás alimentando tu cuerpo con los nutrientes correctos, estarás saboteando tu recuperación, tu energía en las clases y tus metas a largo plazo.

En el entrenamiento funcional y de alta intensidad (como el HIIT o CrossFit), el desgaste de glucógeno y fibras musculares es muy elevado.

Aquí tienes los pilares nutricionales que debes considerar:
* Carbohidratos Complejos: Son tu principal combustible. Consume avena, arroz integral, papas y quinoa antes del entrenamiento para asegurar la energía.
* Proteínas de Alta Calidad: Esenciales para reparar las micro-roturas musculares. Incorpora huevos, pollo, pavo, pescado, legumbres o tofu en tus comidas principales.
* Grasas Saludables: Clave para la regulación hormonal. Consume palta, frutos secos, semillas y aceite de oliva.
* Hidratación constante: Perder tan solo un 2% de agua corporal reduce tu rendimiento deportivo hasta en un 20%. Toma agua antes, durante y después de tus clases.

Recuerda: la nutrición no se trata de comer menos, sino de comer mejor para rendir al máximo.`,
    excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación.',
    slug: 'importancia-nutricion-entrenamiento-funcional',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-06-28T12:00:00Z',
    author: 'Nutri Camila',
  },
  {
    id: 'p3',
    title: 'HIIT vs Cardio Tradicional: ¿Cuál es mejor para ti?',
    content: `La batalla del cardio: ¿debes pasar una hora trotando en la trotadora o realizar 20 minutos de intervalos de alta intensidad (HIIT)? La respuesta depende principalmente de tus metas, nivel actual de condición física y el tiempo del que dispongas.

Beneficios del HIIT (Entrenamiento de Intervalos de Alta Intensidad):
* Eficiencia de tiempo: Puedes quemar una gran cantidad de calorías en solo 15 o 20 minutos.
* Efecto EPOC: Tu cuerpo continúa quemando calorías a un ritmo acelerado incluso horas después de haber terminado de entrenar.
* Preserva masa muscular: A diferencia del cardio de larga duración, ayuda a mantener el tono muscular.

Beneficios del Cardio LISS (Baja Intensidad Estado Estacionario):
* Menor impacto articular: Ideal para principiantes, personas con sobrepeso o en fase de recuperación.
* Mejora la salud cardiovascular basal de forma constante.
* Menor fatiga del sistema nervous central, por lo que es más fácil de recuperar.

Nuestra recomendación en Beast Training: Combina ambos. Haz de 2 a 3 clases de funcional/HIIT por semana y compleméntalo con cardio suave de recuperación en tus días libres para mantener un corazón de acero.`,
    excerpt: 'Comparamos las dos metodologías de resistencia cardiovascular más populares para ayudarte a elegir según tu tiempo y metas.',
    slug: 'hiit-vs-cardio-tradicional',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-06-15T12:00:00Z',
    author: 'Coach Javier',
  }
];

export default function BlogDetailClient({ params }) {
  const { slug } = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostDetails();
  }, [slug]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (!error && data) {
        setPost(data);
      } else {
        // Fallback local
        const localPost = defaultPosts.find(p => p.slug === slug);
        setPost(localPost || null);
      }
    } catch (err) {
      console.warn('Error al buscar en Supabase, usando local:', err);
      const localPost = defaultPosts.find(p => p.slug === slug);
      setPost(localPost || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Dumbbell className={styles.spinner} size={40} />
        <p>Cargando artículo de la Bestia...</p>
      </div>
    );
  }

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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    publisher: {
      '@type': 'Organization',
      name: 'Beast Training',
      logo: {
        '@type': 'ImageObject',
        url: 'https://beasttraining.cl/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://beasttraining.cl/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://beasttraining.cl/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://beasttraining.cl/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://beasttraining.cl/blog/${post.slug}` },
    ],
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
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
        {/* Header */}
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

        {/* Cover Image */}
        {post.image_url && (
          <div className={styles.imageContainer}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 80vw"
              className={styles.coverImage}
            />
          </div>
        )}

        {/* Main Content Layout */}
        <div className={styles.layout}>
          {/* Post Content */}
          <div className={`${styles.body} glass`}>
            {post.content.split('\n\n').map((paragraph, index) => {
              // Simple check to render list items or numbered items
              if (paragraph.match(/^\d+\.\s/)) {
                return (
                  <div key={index} className={styles.listItem}>
                    {paragraph}
                  </div>
                );
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

          {/* Sidebar CTA */}
          <aside className={styles.sidebar}>
            <div className={`${styles.ctaCard} glass glow-orange`}>
              <Dumbbell className={styles.ctaIcon} size={36} />
              <h3>¿Listo para Entrenar?</h3>
              <p>Ven a probar una clase gratis a nuestra sede en Concepción.</p>
              <Link href="/planes" className={styles.ctaBtn}>
                Ver Planes & Precios
              </Link>
            </div>
          </aside>
        </div>

        {/* Back navigation */}
        <div className={styles.footerNav}>
          <Link href="/blog" className={styles.backBtn}>
            <ArrowLeft size={16} /> Volver a todas las noticias
          </Link>
        </div>
      </article>
    </div>
  );
}
