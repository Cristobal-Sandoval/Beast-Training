export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/login', '/api/', '/registro'],
      },
    ],
    sitemap: 'https://beasttraining.cl/sitemap.xml',
  };
}
