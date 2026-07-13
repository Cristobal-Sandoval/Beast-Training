import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default async function sitemap() {
  const baseUrl = 'https://beasttraining.cl';

  const staticEntries = [
    { url: baseUrl, lastModified: '2026-07-07', changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/planes`, lastModified: '2026-07-13', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nosotros`, lastModified: '2026-07-13', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: '2026-07-13', changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: '2026-07-13', changeFrequency: 'monthly', priority: 0.4 },
  ];

  const blogEntries = [];

  try {
    if (supabase) {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug, published_at, updated_at');

      if (!error && posts) {
        posts.forEach((post) => {
          blogEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: (post.updated_at || post.published_at || '2026-07-07').split('T')[0],
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
