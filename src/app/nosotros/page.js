import NosotrosClient from './NosotrosClient';

export const metadata = {
  title: "Sobre Nosotros",
  description: "Conoce a Javier, fundador y Head Coach de Beast Training Concepción. Entrenamiento personalizado, de fuerza y funcional orientado a tus objetivos reales.",
  openGraph: {
    title: "Sobre Nosotros | Beast Training",
    description: "Conoce a Javier, fundador y Head Coach de Beast Training Concepción. Entrenamiento personalizado, de fuerza y funcional orientado a tus objetivos reales.",
    url: "https://beasttraining.cl/nosotros",
  }
};

export default function NosotrosPage() {
  return <NosotrosClient />;
}
