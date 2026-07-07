import BlogDetailClient from './BlogDetailClient';
import { supabase } from '@/lib/supabaseClient';

const defaultSlugs = [
  { slug: 'ejercicios-clave-aumentar-fuerza', title: '5 Ejercicios Clave para Aumentar tu Fuerza', excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida.', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop', author: 'Coach Javier', published_at: '2026-07-01T12:00:00Z' },
  { slug: 'importancia-nutricion-entrenamiento-funcional', title: 'La Importancia de la Nutrición en el Entrenamiento Funcional', excerpt: 'Entrenar duro es solo la mitad del trabajo.', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop', author: 'Nutri Camila', published_at: '2026-06-28T12:00:00Z' },
  { slug: 'hiit-vs-cardio-tradicional', title: 'HIIT vs Cardio Tradicional: ¿Cuál es mejor para ti?', excerpt: 'Comparamos las dos metodologías de resistencia cardiovascular.', image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop', author: 'Coach Javier', published_at: '2026-06-15T12:00:00Z' },
];

const defaultPosts = defaultSlugs.map(p => ({ ...p }));

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug');

    if (data && data.length > 0) {
      return data.map(post => ({ slug: post.slug }));
    }
  } catch (e) {
    // fallback
  }
  return defaultSlugs.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let title = "Artículo";
  let description = "Noticias y consejos de entrenamiento.";
  let imageUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop";
  let author = "Beast Staff";
  let publishedAt = null;

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      title = data.title;
      description = data.excerpt || description;
      imageUrl = data.image_url || imageUrl;
      author = data.author || author;
      publishedAt = data.published_at || null;
    } else {
      const fallback = defaultPosts.find(p => p.slug === slug);
      if (fallback) {
        title = fallback.title;
        description = fallback.excerpt;
        imageUrl = fallback.image_url;
        author = fallback.author || author;
        publishedAt = fallback.published_at || null;
      }
    }
  } catch (e) {
    const fallback = defaultPosts.find(p => p.slug === slug);
    if (fallback) {
      title = fallback.title;
      description = fallback.excerpt;
      imageUrl = fallback.image_url;
      author = fallback.author || author;
      publishedAt = fallback.published_at || null;
    }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Beast Training Blog`,
      description: description,
      url: `https://beasttraining.cl/blog/${slug}`,
      type: 'article',
      images: [{ url: imageUrl }],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'article:published_time': publishedAt || '',
      'article:author': author,
    },
    alternates: {
      canonical: `https://beasttraining.cl/blog/${slug}`,
    },
  };
}

export default function BlogPostPage({ params }) {
  return <BlogDetailClient params={params} />;
}
