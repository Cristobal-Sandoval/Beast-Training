import NosotrosClient from './NosotrosClient';

export const metadata = {
  title: "Sobre Nosotros | Coach y Filosof\u00eda de Beast Training Concepci\u00f3n",
  description: "Conoce a Javier, Head Coach y fundador de Beast Training. Certificaci\u00f3n CrossFit L-2, preparaci\u00f3n f\u00edsica, biom\u00e1canica y asesor\u00eda nutricional deportiva en Concepci\u00f3n, Chile.",
  openGraph: {
    title: "Sobre Nosotros | Beast Training Concepci\u00f3n",
    description: "Conoce a Javier, Head Coach y fundador de Beast Training. Entrenamiento personalizado, t\u00e9cnica correcta y progreso cient\u00edfico.",
    url: "https://beasttraining.cl/nosotros",
    siteName: "Beast Training",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://beasttraining.cl/og-image.jpg", width: 1200, height: 630, alt: "Coach Javier - Beast Training Concepci\u00f3n" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros | Beast Training",
    description: "Conoce al equipo de Beast Training Concepci\u00f3n. Entrenamiento personalizado y de alto rendimiento.",
    images: ["https://beasttraining.cl/og-image.jpg"],
  },
  alternates: {
    canonical: "https://beasttraining.cl/nosotros",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NosotrosPage() {
  return <NosotrosClient />;
}
