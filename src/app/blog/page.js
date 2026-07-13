import BlogClient from './BlogClient';

export const metadata = {
  title: "Blog de Fitness, Nutrición y Entrenamiento en Concepción",
  description: "Tips de entrenamiento funcional, HIIT, CrossFit, nutrición deportiva y recuperación muscular. Escrito por los coaches de Beast Training Concepción.",
  openGraph: {
    title: "Blog de Fitness, Nutrición y Entrenamiento | Beast Training",
    description: "Tips de entrenamiento funcional, HIIT, CrossFit, nutrición deportiva y recuperación muscular. Escrito por los coaches de Beast Training Concepción.",
    url: "https://beasttraining.cl/blog",
    siteName: "Beast Training",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Fitness | Beast Training",
    description: "Tips de entrenamiento, nutrición y recuperación muscular.",
  },
  alternates: {
    canonical: "https://beasttraining.cl/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
