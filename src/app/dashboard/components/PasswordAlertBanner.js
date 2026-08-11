import { ShieldAlert } from 'lucide-react';
import styles from '../dashboard.module.css';

export default function PasswordAlertBanner({ onOpenModal }) {
  return (
    <div className={styles.passwordAlert}>
      <div className={styles.passwordAlertContent}>
        <ShieldAlert size={24} className={styles.passwordAlertIcon} />
        <div>
          <strong className={styles.passwordAlertTitle}>
            Seguridad de tu Cuenta: Contraseña Temporal Detectada
          </strong>
          <span className={styles.passwordAlertDesc}>
            Estás ingresando con la clave inicial. Te sugerimos cambiarla por una segura para proteger tus datos de progreso.
          </span>
        </div>
      </div>
      <button type="button" onClick={onOpenModal} className={styles.passwordAlertBtn}>
        Cambiar Contraseña
      </button>
    </div>
  );
}
