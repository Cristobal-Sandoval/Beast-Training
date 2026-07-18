export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/login'],
      },
    ],
    sitemap: 'https://beasttraining.cl/sitemap.xml',
  };
}
