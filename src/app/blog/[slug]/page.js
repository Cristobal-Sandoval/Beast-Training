import BlogDetailClient from './BlogDetailClient';
import { supabase } from '@/lib/supabaseClient';

const defaultPosts = [
  {
    title: '5 Ejercicios Clave para Aumentar tu Fuerza',
    excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.',
    slug: 'ejercicios-clave-aumentar-fuerza',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'La Importancia de la Nutrición en el Entrenamiento Funcional',
    excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación.',
    slug: 'importancia-nutricion-entrenamiento-funcional',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'HIIT vs Cardio Tradicional: ¿Cuál es mejor para ti?',
    excerpt: 'Comparamos las dos metodologías de resistencia cardiovascular más populares para ayudarte a elegir según tu tiempo y metas.',
    slug: 'hiit-vs-cardio-tradicional',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop',
  }
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let title = "Artículo";
  let description = "Noticias y consejos de entrenamiento.";
  let imageUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop";

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('title, excerpt, image_url')
      .eq('slug', slug)
      .single();

    if (data) {
      title = data.title;
      description = data.excerpt || description;
      imageUrl = data.image_url || imageUrl;
    } else {
      const fallback = defaultPosts.find(p => p.slug === slug);
      if (fallback) {
        title = fallback.title;
        description = fallback.excerpt;
        imageUrl = fallback.image_url;
      }
    }
  } catch (e) {
    const fallback = defaultPosts.find(p => p.slug === slug);
    if (fallback) {
      title = fallback.title;
      description = fallback.excerpt;
      imageUrl = fallback.image_url;
    }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Beast Training Blog`,
      description: description,
      url: `https://beasttraining.cl/blog/${slug}`,
      images: [{ url: imageUrl }],
    }
  };
}

export default function BlogPostPage({ params }) {
  return <BlogDetailClient params={params} />;
}
