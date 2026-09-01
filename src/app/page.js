import HomeClient from './HomeClient';
import { supabase } from '@/lib/supabaseClient';

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
