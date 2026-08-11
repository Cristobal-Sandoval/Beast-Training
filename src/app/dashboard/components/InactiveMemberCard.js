import { ShieldAlert, MessageSquare } from 'lucide-react';
import styles from '../dashboard.module.css';

export default function InactiveMemberCard({ profile, user }) {
  return (
    <section className={styles.inactiveSection}>
      <div className={`${styles.cardPanel} glass glow-orange ${styles.inactiveCard}`}>
        <div className={styles.inactiveIconWrapper}>
          <ShieldAlert size={50} className={styles.inactiveIcon} />
        </div>

        <h2 className={styles.inactiveTitle}>Membresía Inactiva o Vencida</h2>

        <p className={styles.inactiveDesc}>
          Hola <strong>{profile?.full_name || 'Bestia'}</strong>. Para ver tus rutinas personalizadas del mes, registrar tu evolución física y programar evaluaciones corporales, necesitas activar tu cuenta.
        </p>

        <div className={styles.inactiveSteps}>
          <span className={styles.inactiveStepsLabel}>¿Cómo activar mi cuenta?</span>
          <span className={styles.inactiveStep}>
            1. Contrata un plan en la sección <a href="/planes" className={styles.inactiveStepLink}>Planes</a> o contáctate directamente.
          </span>
          <span className={styles.inactiveStep}>
            2. Realiza la transferencia o pago al Coach.
          </span>
          <span className={styles.inactiveStep}>
            3. Una vez confirmado, el Coach ingresará tu matrícula al sistema y tu cuenta se activará al instante.
          </span>
        </div>

        <button type="button"
          onClick={() => window.open(`https://wa.me/56948925193?text=${encodeURIComponent(`Hola Coach! Tengo mi cuenta inactiva en el sistema (${profile?.email || user?.email}). ¿Me podrías ayudar a activar mi membresía?`)}`, '_blank')}
          className={styles.inactiveWhatsAppBtn}
        >
          <MessageSquare size={18} />
          Contactar al Coach por WhatsApp
        </button>
      </div>
    </section>
  );
}
