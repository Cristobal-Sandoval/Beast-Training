'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Dumbbell, User, LogOut, Menu, X, Shield } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const menuToggleRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstLinkRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  const closeMobileMenu = useCallback(() => setIsMenuOpen(false), []);

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu} aria-label="Beast Training — Ir al inicio">
          <img src="/logo-full.svg" alt="Beast Training" className={styles.logoImg} />
        </Link>

        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`} aria-current={isActive('/') ? 'page' : undefined}>
            Inicio
          </Link>
          <Link href="/planes" className={`${styles.link} ${isActive('/planes') ? styles.active : ''}`} aria-current={isActive('/planes') ? 'page' : undefined}>
            Planes
          </Link>
          <Link href="/blog" className={`${styles.link} ${isActive('/blog') ? styles.active : ''}`} aria-current={isActive('/blog') ? 'page' : undefined}>
            Blog
          </Link>
          <Link href="/nosotros" className={`${styles.link} ${isActive('/nosotros') ? styles.active : ''}`} aria-current={isActive('/nosotros') ? 'page' : undefined}>
            Nosotros
          </Link>
          
          {user && (user.email?.toLowerCase() === 'btrainingchile@gmail.com' || profile?.role === 'admin') ? (
            <Link href="/admin" className={`${styles.link} ${styles.adminLink} ${isActive('/admin') ? styles.active : ''}`} aria-current={isActive('/admin') ? 'page' : undefined}>
              <Shield size={16} aria-hidden="true" /> Panel Staff
            </Link>
          ) : user ? (
            <Link href="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`} aria-current={isActive('/dashboard') ? 'page' : undefined}>
              Mi Progreso
            </Link>
          ) : null}
        </div>

        <div className={styles.authContainer}>
          {user ? (
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user.email?.toLowerCase() === 'btrainingchile@gmail.com' ? 'Pelu' : (profile?.full_name || user.user_metadata?.full_name || user.email)}
              </span>
              <button type="button" onClick={handleLogout} className={styles.logoutBtn} aria-label="Cerrar sesión">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginNavBtn}>
              Iniciar Sesión
            </Link>
          )}
        </div>

        <button
          ref={menuToggleRef}
          type="button"
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} id="mobile-menu" className={styles.mobileMenu} role="dialog" aria-label="Menú de navegación móvil">
          <Link ref={firstLinkRef} href="/" className={`${styles.mobileLink} ${isActive('/') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/') ? 'page' : undefined}>
            Inicio
          </Link>
          <Link href="/planes" className={`${styles.mobileLink} ${isActive('/planes') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/planes') ? 'page' : undefined}>
            Planes
          </Link>
          <Link href="/blog" className={`${styles.mobileLink} ${isActive('/blog') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/blog') ? 'page' : undefined}>
            Blog
          </Link>
          <Link href="/nosotros" className={`${styles.mobileLink} ${isActive('/nosotros') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/nosotros') ? 'page' : undefined}>
            Nosotros
          </Link>
          {user && (user.email?.toLowerCase() === 'btrainingchile@gmail.com' || profile?.role === 'admin') ? (
            <Link href="/admin" className={`${styles.mobileLink} ${styles.mobileAdminLink} ${isActive('/admin') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/admin') ? 'page' : undefined}>
              <Shield size={16} aria-hidden="true" /> Panel Staff
            </Link>
          ) : user ? (
            <Link href="/dashboard" className={`${styles.mobileLink} ${isActive('/dashboard') ? styles.mobileActive : ''}`} onClick={closeMobileMenu} aria-current={isActive('/dashboard') ? 'page' : undefined}>
              Mi Progreso
            </Link>
          ) : null}
          <div className={styles.mobileAuth}>
            {user ? (
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileUserName}>
                  {user.email?.toLowerCase() === 'btrainingchile@gmail.com' ? 'Pelu' : (profile?.full_name || user.user_metadata?.full_name || user.email)}
                </span>
                <button type="button" onClick={handleLogout} className={styles.mobileLogoutBtn} aria-label="Cerrar sesión">
                  <LogOut size={16} aria-hidden="true" /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMobileMenu}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
