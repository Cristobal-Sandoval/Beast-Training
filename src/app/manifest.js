export default function manifest() {
  return {
    name: 'Beast Training — Gimnasio de Alto Rendimiento',
    short_name: 'Beast Training',
    description: 'Entrenamiento funcional, HIIT, fuerza y CrossFit en Concepción.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070708',
    theme_color: '#070708',
    icons: [
      {
        src: '/logo-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
