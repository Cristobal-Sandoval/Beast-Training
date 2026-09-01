import BlogDetailClient from './BlogDetailClient';
import { supabase } from '@/lib/supabaseClient';
import { DEFAULT_BLOG_POSTS } from '@/lib/defaultBlogPosts';

export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('blog_posts').select('slug');
    if (data && data.length > 0) return data.map(post => ({ slug: post.slug }));
  } catch (e) {}
  return DEFAULT_BLOG_POSTS.map(post => ({ slug: post.slug }));
}

async function fetchPost(slug) {
  try {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (data) return data;
  } catch (e) {}
  return DEFAULT_BLOG_POSTS.find(p => p.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const title = post?.title || 'Artículo';
  const description = post?.excerpt || 'Noticias y consejos de entrenamiento por Pelu.';
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
