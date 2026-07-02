import Link from 'next/link';
import { Dumbbell, MapPin, Mail, Phone, Clock } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Info Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            <Dumbbell className={styles.logoIcon} />
            <span>BEAST<span className={styles.accent}>TRAINING</span></span>
          </Link>
          <p className={styles.description}>
            Entrenamiento de fuerza, funcional, HIIT y CrossFit de alto impacto. Saca la bestia que llevas dentro.
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/btrainingchile/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Contacto</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              <MapPin size={18} className={styles.icon} />
              <span>Libertador Bernardo O'Higgins 940, Concepción</span>
            </li>
            <li className={styles.item}>
              <Phone size={18} className={styles.icon} />
              <span>+56 9 1234 5678</span>
            </li>
            <li className={styles.item}>
              <Mail size={18} className={styles.icon} />
              <span>contacto@beasttraining.cl</span>
            </li>
          </ul>
        </div>

        {/* Hours Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Horarios</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Clock size={18} className={styles.icon} />
              <div>
                <p className={styles.days}>Lunes a Viernes</p>
                <p className={styles.hours}>07:00 - 22:00</p>
              </div>
            </li>
            <li className={styles.item}>
              <Clock size={18} className={styles.icon} />
              <div>
                <p className={styles.days}>Sábado</p>
                <p className={styles.hours}>09:00 - 14:00</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p>&copy; {new Date().getFullYear()} Beast Training Chile. Todos los derechos reservados.</p>
          <p className={styles.developer}>Diseño Premium para Fitness</p>
        </div>
      </div>
    </footer>
  );
}
