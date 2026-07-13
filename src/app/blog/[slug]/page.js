import BlogDetailClient from './BlogDetailClient';
import { supabase } from '@/lib/supabaseClient';

const defaultPosts = [
  {
    id: 'p1', title: '5 Ejercicios Clave para Aumentar tu Fuerza',
    content: `La fuerza es la base de todas las cualidades físicas. Ya sea que tu meta sea ganar masa muscular, perder grasa, mejorar en tu deporte o simplemente sentirte más ágil en tu vida diaria, construir una base sólida de fuerza muscular es fundamental.\n\nA continuación, detallaremos los 5 ejercicios compuestos fundamentales que deben ser la columna vertebral de tu programa de entrenamiento:\n\n1. La Sentadilla (Squat): El rey de los ejercicios de pierna.\n2. El Peso Muerto (Deadlift): Ideal para la cadena posterior.\n3. El Press de Banca (Bench Press): El ejercicio principal para la fuerza del torso.\n4. El Press Militar (Overhead Press): Ejercicio de empuje vertical.\n5. Dominadas (Pull-ups): El mejor ejercicio de tirón vertical.\n\nIntegra estos movimientos de 2 a 3 veces por semana de forma progresiva.`,
    excerpt: 'Descubre los movimientos fundamentales que te ayudarán a construir una base de fuerza sólida y mejorar tu rendimiento.',
    slug: 'ejercicios-clave-aumentar-fuerza', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-07-01T12:00:00Z', author: 'Coach Javier',
  },
  {
    id: 'p2', title: 'La Importancia de la Nutrición en el Entrenamiento Funcional',
    content: `Entrenar intensamente es solo una parte de la ecuación. Si no estás alimentando tu cuerpo con los nutrientes correctos, estarás saboteando tu recuperación.\n\nPilares nutricionales:\n* Carbohidratos Complejos: Avena, arroz integral, papas y quinoa.\n* Proteínas de Alta Calidad: Huevos, pollo, pavo, pescado.\n* Grasas Saludables: Palta, frutos secos, semillas.\n* Hidratación constante.\n\nRecuerda: la nutrición no se trata de comer menos, sino de comer mejor.`,
    excerpt: 'Entrenar duro es solo la mitad del trabajo. Descubre cómo alimentar tu cuerpo para potenciar la recuperación.',
    slug: 'importancia-nutricion-entrenamiento-funcional', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-06-28T12:00:00Z', author: 'Nutri Camila',
  },
  {
    id: 'p3', title: 'HIIT vs Cardio Tradicional: ¿Cuál es mejor para ti?',
    content: `La batalla del cardio: ¿debes pasar una hora trotando o realizar 20 minutos de intervalos de alta intensidad?\n\nBeneficios del HIIT:\n* Eficiencia de tiempo\n* Efecto EPOC: Quemas calorías incluso después de entrenar\n* Preserva masa muscular\n\nBeneficios del Cardio LISS:\n* Menor impacto articular\n* Mejora cardiovascular constante\n* Menor fatiga del SNC\n\nNuestra recomendación: Combina ambos para un corazón de acero.`,
    excerpt: 'Comparamos las dos metodologías de resistencia cardiovascular más populares para ayudarte a elegir.',
    slug: 'hiit-vs-cardio-tradicional', image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop',
    published_at: '2026-06-15T12:00:00Z', author: 'Coach Javier',
  },
];

const defaultSlugs = defaultPosts.map(p => ({ slug: p.slug, ...p }));

export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('blog_posts').select('slug');
    if (data && data.length > 0) return data.map(post => ({ slug: post.slug }));
  } catch (e) {}
  return defaultSlugs.map(post => ({ slug: post.slug }));
}

async function fetchPost(slug) {
  try {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (data) return data;
  } catch (e) {}
  return defaultPosts.find(p => p.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const title = post?.title || 'Artículo';
  const description = post?.excerpt || 'Noticias y consejos de entrenamiento.';
  const imageUrl = post?.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Beast Training Blog`,
      description: description,
      url: `https://beasttraining.cl/blog/${slug}`,
      type: 'article',
      siteName: 'Beast Training',
      locale: 'es_CL',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Beast Training Blog`,
      description: description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://beasttraining.cl/blog/${slug}`,
      languages: { 'es-CL': `https://beasttraining.cl/blog/${slug}` },
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  return <BlogDetailClient post={post} slug={slug} />;
}
