import Link from 'next/link';
import { Dumbbell, MapPin, Mail, Phone, Clock, Lock } from 'lucide-react';
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
          <div className={styles.socialsAndAccess}>
            <a href="https://www.instagram.com/btrainingchile/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            
            <Link href="/login" className={styles.loginBtn}>
              <Lock size={12} className={styles.btnIcon} />
              <span>Acceso Staff & Alumnos</span>
            </Link>
          </div>
          
          {/* Metadata Block: Copyright and Signature (Desktop Only) */}
          <div className={`${styles.metaBlock} ${styles.desktopOnly}`}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Beast Training Chile. Todos los derechos reservados.
              <span className={styles.separator}> • </span>
              Hecho por{' '}
              <a
                href="https://cristobalsandoval-portafolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.portfolioLink}
              >
                🐈
              </a>
            </p>
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
              <a href="tel:+56912345678" style={{ color: 'inherit', textDecoration: 'none' }}>+56 9 1234 5678</a>
            </li>
            <li className={styles.item}>
              <Mail size={18} className={styles.icon} />
              <a href="mailto:btrainingchile@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>btrainingchile@gmail.com</a>
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
                <p className={styles.hours}>10:00 - 13:00 hrs.</p>
                <p className={styles.hours}>15:30 - 21:30 hrs.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Metadata Block: Copyright and Signature (Mobile Only) */}
      <div className={`${styles.metaBlockMobile} ${styles.mobileOnly}`}>
        <p className={styles.copyrightMobile}>
          &copy; {new Date().getFullYear()} Beast Training Chile. Todos los derechos reservados.
          <span className={styles.separator}> • </span>
          Hecho por{' '}
          <a
            href="https://cristobalsandoval-portafolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioLink}
          >
            🐈
          </a>
        </p>
      </div>
    </footer>
  );
}
