import Link from 'next/link';
import { Dumbbell, MapPin, Mail, Phone, Clock, Lock } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Info Column */}
        <div className={styles.brandCol}>
          {/* UX-11: aria-label en logo + aria-hidden en icono decorativo */}
          <Link href="/" className={styles.logo} aria-label="Beast Training — Ir al inicio">
            <Dumbbell className={styles.logoIcon} aria-hidden="true" />
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
              <Lock size={12} className={styles.btnIcon} aria-hidden="true" />
              <span>Acceso Staff & Alumnos</span>
            </Link>
          </div>
          
          {/* UX-14: Copyright unificado, sin duplicado HTML — control visual con CSS */}
          {/* UX-15: aria-label en link del desarrollador */}
          <div className={styles.metaBlock}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Beast Training Chile. Todos los derechos reservados.
              <span className={styles.separator}> • </span>
              Hecho por{' '}
              <a
                href="https://cristobalsandoval-portafolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.portfolioLink}
                aria-label="Portfolio del desarrollador (Cristóbal Sandoval)"
              >
                🐈
              </a>
            </p>
          </div>
        </div>

        {/* Navigation Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Navegación</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Link href="/">Inicio</Link>
            </li>
            <li className={styles.item}>
              <Link href="/planes">Planes</Link>
            </li>
            <li className={styles.item}>
              <Link href="/blog">Blog</Link>
            </li>
            <li className={styles.item}>
              <Link href="/nosotros">Nosotros</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Contacto</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              <MapPin size={18} className={styles.icon} aria-hidden="true" />
              <span>Libertador Bernardo O'Higgins 940, Piso 4, Oficina 404, Concepción</span>
            </li>
            <li className={styles.item}>
              <Phone size={18} className={styles.icon} aria-hidden="true" />
              <a href="tel:+56948925193" style={{ color: 'inherit', textDecoration: 'none' }}>+56 9 4892 5193</a>
            </li>
            <li className={styles.item}>
              <Mail size={18} className={styles.icon} aria-hidden="true" />
              <a href="mailto:btrainingchile@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>btrainingchile@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Hours Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Horarios</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Clock size={18} className={styles.icon} aria-hidden="true" />
              <div>
                <p className={styles.days}>Lunes a Viernes</p>
                <p className={styles.hours}>10:00 - 13:00 hrs.</p>
                <p className={styles.hours}>15:30 - 21:30 hrs.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Location / Google Maps Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.heading}>Ubicación</h3>
          <div className={styles.mapContainer}>
            <iframe
              title="Ubicación de Beast Training en Concepción"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.3764834289895!2d-73.05350862343292!3d-36.82701467223945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9626e4fb2d711a91%3A0xa64b38d38096f9a0!2sLibertador%20Gral.%20Bernardo%20O'Higgins%20940%2C%204030000%20Concepci%C3%B3n%2C%20B%C3%ADo%20B%C3%ADo!5e0!3m2!1ses!2scl!4v1710000000000!5m2!1ses!2scl"
              width="100%"
              height="220"
              style={{ border: 0, borderRadius: '14px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapIframe}
            />
            <a
              href="https://maps.google.com/?q=Libertador+Bernardo+O'Higgins+940,+Concepci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Ver en Google Maps &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* UX-14: Bloque mobile eliminado — copyright unificado arriba con CSS responsive */}
    </footer>
  );
}
