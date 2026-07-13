import LoginClient from './LoginClient';

export const metadata = {
  title: "Iniciar Sesión — Alumnos Beast Training",
  description: "Accede a tu panel de alumno en Beast Training Concepción. Revisa tus evaluaciones físicas, evolución, rutinas y mensajes del coach.",
  openGraph: {
    title: "Iniciar Sesión | Beast Training",
    description: "Accede a tu panel de alumno en Beast Training Concepción.",
    url: "https://beasttraining.cl/login",
    siteName: "Beast Training",
    locale: "es_CL",
  },
  alternates: {
    canonical: "https://beasttraining.cl/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
