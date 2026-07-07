import BlogClient from './BlogClient';

export const metadata = {
  title: "Blog de Fitness, Nutrición y Entrenamiento",
  description: "Aprende con los mejores tips de nutrición, rutinas de fuerza, HIIT y CrossFit de nuestros entrenadores calificados en Beast Training Concepción.",
  openGraph: {
    title: "Blog de Fitness, Nutrición y Entrenamiento | Beast Training",
    description: "Aprende con los mejores tips de nutrición, rutinas de fuerza, HIIT y CrossFit de nuestros entrenadores calificados en Beast Training Concepción.",
    url: "https://beasttraining.cl/blog",
  }
};

export default function BlogPage() {
  return <BlogClient />;
}
