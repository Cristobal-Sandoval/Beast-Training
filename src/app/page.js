import HomeClient from './HomeClient';
import { supabase } from '@/lib/supabaseClient';

// SEO: la home usaba solo el metadata default del layout. Canonical + OG propios + ISR.
export const metadata = {
  title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
  description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento. Saca la bestia que llevas dentro.",
  openGraph: {
    title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
    description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados, nutrición deportiva y el mejor ambiente de entrenamiento.",
    url: "https://beasttraining.cl",
    siteName: "Beast Training",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://beasttraining.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beast Training — Gimnasio de Alto Rendimiento en Concepción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beast Training | Gimnasio de Alto Rendimiento en Concepción",
    description: "Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción. Planes personalizados y seguimiento digital.",
    images: ["https://beasttraining.cl/og-image.jpg"],
  },
  alternates: {
    canonical: "https://beasttraining.cl",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 60;

const fallbackBanners = [
  {
    id: 'b1',
    title: 'Saca la Bestia que Llevas Dentro',
    h3_tagline: 'beast training concepción',
    description: 'Entrenamiento funcional de alta intensidad, musculación y fuerza en el corazón de Concepción.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    link_url: '/planes',
    active: true,
  },
  {
    id: 'b2',
    title: 'Desafía Tus Límites Diariamente',
    h3_tagline: 'alto rendimiento & disciplina',
    description: 'Clases de CrossFit, HIIT y preparación física con seguimiento profesional para superar tus metas.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
    link_url: '/planes',
    active: true,
  },
  {
    id: 'b3',
    title: 'Entrena Donde Quieras con Planes Online',
    h3_tagline: 'tu coach beast training en tu bolsillo',
    description: 'Rutinas 100% personalizadas en app, corrección de técnica por video y asesoría nutricional continua.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1600&auto=format&fit=crop',
    link_url: '/planes',
    active: true,
  }
];

import { DEFAULT_BLOG_POSTS } from '@/lib/defaultBlogPosts';

const fallbackPosts = DEFAULT_BLOG_POSTS.slice(0, 2);

async function fetchBanners() {
  try {
    const { data } = await supabase.from('banners').select('*').eq('active', true);
    if (data && data.length > 0) return data;
  } catch (e) {}
  return fallbackBanners;
}

async function fetchPosts() {
  try {
    const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).limit(2);
    if (data && data.length > 0) return data;
  } catch (e) {}
  return fallbackPosts;
}

export default async function Home() {
  const [initialBanners, initialPosts] = await Promise.all([fetchBanners(), fetchPosts()]);
  return <HomeClient initialBanners={initialBanners} initialPosts={initialPosts} fallbackBanners={fallbackBanners} fallbackPosts={fallbackPosts} />;
}
