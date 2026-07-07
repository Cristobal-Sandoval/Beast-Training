import DashboardClient from './DashboardClient';

export const metadata = {
  title: "Mi Progreso",
  description: "Accede a tu panel personal de Beast Training Concepción para ver tu evolución de peso, grasa corporal y masa muscular, tus rutinas de entrenamiento y chatear con tu coach.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
