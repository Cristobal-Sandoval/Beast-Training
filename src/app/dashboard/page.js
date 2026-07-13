import DashboardClient from './DashboardClient';

export const metadata = {
  title: "Mi Progreso — Dashboard Beast Training",
  description: "Panel personal de alumno en Beast Training Concepción. Consulta tu evolución física, rutinas, evaluaciones y mensajes del coach.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
