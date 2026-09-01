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

const fallbackPosts = [
  {
    id: 'p1', title: '5 Ejercicios Clave para Aumentar tu Fuerza',
    excerpt: 'Descubre los movimientos fundamentales para construir una base de fuerza sólida.',
    slug: 'ejercicios-clave-aumentar-fuerza',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    published_at: '2026-07-01T12:00:00Z', author: 'Coach Javier',
  },
  {
    id: 'p2', title: 'La Importancia de la Nutrición en el Entrenamiento Funcional',
    excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo.',
    slug: 'importancia-nutricion-entrenamiento-funcional',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    published_at: '2026-06-28T12:00:00Z', author: 'Nutri Camila',
  }
];

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
