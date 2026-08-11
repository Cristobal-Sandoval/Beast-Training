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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
