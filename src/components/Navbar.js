'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
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
    if (typeof window !== 'undefined' && !window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      return;
    }
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <Dumbbell className={styles.logoIcon} />
          <span>BEAST<span className={styles.accent}>TRAINING</span></span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Inicio
          </Link>
          <Link href="/planes" className={`${styles.link} ${isActive('/planes') ? styles.active : ''}`}>
            Planes
          </Link>
          <Link href="/blog" className={`${styles.link} ${isActive('/blog') ? styles.active : ''}`}>
            Blog
          </Link>
          <Link href="/nosotros" className={`${styles.link} ${isActive('/nosotros') ? styles.active : ''}`}>
            Nosotros
          </Link>
          
          {user && profile?.role !== 'admin' && (
            <Link href="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}>
              Mi Progreso
            </Link>
          )}

          {profile?.role === 'admin' && (
            <Link href="/admin" className={`${styles.link} ${styles.adminLink} ${isActive('/admin') ? styles.active : ''}`}>
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Auth Button */}
        <div className={styles.authContainer}>
          {user ? (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{profile?.full_name || user.email}</span>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              <User size={16} />
              <span>Ingresar</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links Overlay */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={`${styles.mobileLink} ${isActive('/') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link href="/planes" className={`${styles.mobileLink} ${isActive('/planes') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
            Planes
          </Link>
          <Link href="/blog" className={`${styles.mobileLink} ${isActive('/blog') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/nosotros" className={`${styles.mobileLink} ${isActive('/nosotros') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
            Nosotros
          </Link>
          {user && profile?.role !== 'admin' && (
            <Link href="/dashboard" className={`${styles.mobileLink} ${isActive('/dashboard') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
              Mi Progreso
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link href="/admin" className={`${styles.mobileLink} ${styles.mobileAdminLink} ${isActive('/admin') ? styles.mobileActive : ''}`} onClick={() => setIsMenuOpen(false)}>
              Panel Admin
            </Link>
          )}
          <div className={styles.mobileAuth}>
            {user ? (
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileUserName}>{profile?.full_name || user.email}</span>
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMenuOpen(false)}>
                <User size={16} /> Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
