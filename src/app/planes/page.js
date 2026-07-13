import PlanesClient from './PlanesClient';

export const metadata = {
  title: "Planes y Precios | Membresías Beast Training Concepción",
  description: "Planes mensual, trimestral y anual en Beast Training. Entrenamiento funcional, HIIT, musculación y evaluación física mensual. Contrata vía WhatsApp.",
  openGraph: {
    title: "Planes y Precios | Beast Training Concepción",
    description: "Elige tu plan: Mensual, Trimestral o Anual. Evaluación física mensual incluida en todos los planes.",
    url: "https://beasttraining.cl/planes",
    siteName: "Beast Training",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes y Precios | Beast Training",
    description: "Planes de entrenamiento personalizados en Concepción. Contrata vía WhatsApp.",
  },
  alternates: {
    canonical: "https://beasttraining.cl/planes",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'article:published_time': '2026-07-07',
  },
};

export default function PlanesPage() {
  return <PlanesClient />;
}
