import LoginClient from './LoginClient';

export const metadata = {
  title: "Iniciar Sesión",
  description: "Ingresa a tu panel de alumno en Beast Training para revisar tus evaluaciones físicas, gráficos de evolución, comunicados del gimnasio y planes de entrenamiento.",
  openGraph: {
    title: "Iniciar Sesión | Beast Training",
    description: "Ingresa a tu panel de alumno en Beast Training para revisar tus evaluaciones físicas, gráficos de evolución, comunicados del gimnasio y planes de entrenamiento.",
    url: "https://beasttraining.cl/login",
  }
};

export default function LoginPage() {
  return <LoginClient />;
}
