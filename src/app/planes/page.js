import PlanesClient from './PlanesClient';

export const metadata = {
  title: "Planes y Precios",
  description: "Elige tu plan de entrenamiento en Beast Training Concepción: Mensual, Trimestral o Anual. Obtén evaluación física mensual y asesoría de nutrición.",
  openGraph: {
    title: "Planes y Precios | Beast Training",
    description: "Elige tu plan de entrenamiento en Beast Training Concepción: Mensual, Trimestral o Anual. Obtén evaluación física mensual y asesoría de nutrición.",
    url: "https://beasttraining.cl/planes",
  }
};

export default function PlanesPage() {
  return <PlanesClient />;
}
