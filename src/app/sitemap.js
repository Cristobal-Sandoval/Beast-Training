import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://beasttraining.cl';

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = [
    { url: baseUrl, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/planes`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nosotros`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
    // SEO-07: /login eliminado del sitemap (no aporta valor SEO, consume crawl budget)
  ];

  const blogEntries = [];

  try {
    if (supabase) {
      // SEO: blog_posts no tiene columna updated_at; usar published_at/created_at reales.
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug, published_at, created_at');

      if (!error && posts) {
        posts.forEach((post) => {
          blogEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: (post.published_at || post.created_at || today).split('T')[0],
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }
  } catch (err) {
    console.warn('Error fetching blog posts for sitemap:', err);
  }

  return [...staticEntries, ...blogEntries];
}
