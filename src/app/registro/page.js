import { redirect } from 'next/navigation';

export const metadata = {
  title: "Registro Deshabilitado",
  description: "El registro público está deshabilitado en Beast Training. Las cuentas de los alumnos son creadas directamente por el Staff.",
};

export default function RegistroPage() {
  redirect('/login');
}
