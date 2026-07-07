import RegistroClient from './RegistroClient';

export const metadata = {
  title: "Crear Cuenta",
  description: "Regístrate en Beast Training Concepción para contratar tu plan de entrenamiento, llevar registro de tu peso, % de grasa y masa muscular, y coordinar evaluaciones físicas.",
  openGraph: {
    title: "Crear Cuenta | Beast Training",
    description: "Regístrate en Beast Training Concepción para contratar tu plan de entrenamiento, llevar registro de tu peso, % de grasa y masa muscular, y coordinar evaluaciones físicas.",
    url: "https://beasttraining.cl/registro",
  }
};

export default function RegistroPage() {
  return <RegistroClient />;
}
