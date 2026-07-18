'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import styles from './nosotros.module.css';

export default function NosotrosClient() {
  const [aboutInfo, setAboutInfo] = useState({
    subtitle: 'sobre nosotros',
    title: 'Entrenamiento Inteligente, Resultados Reales',
    bio_p1: 'Hola, soy Javier. Fundador y Head Coach de Beast Training. Tras años de experiencia entrenando a deportistas y personas de todos los niveles en Concepción, fundé este espacio con un propósito: ofrecer un entrenamiento de fuerza y funcional verdaderamente personalizado.',
    bio_p2: 'Aquí no eres un número más. Nos enfocamos en enseñarte la técnica correcta, planificar tus progresos de manera científica y acompañarte en cada paso para que superes tus límites de forma segura y constante.',
    image_url: '/images/coach.png',
    badge_text: 'Coach Fundador',
    spec_1: 'Certificación CrossFit L-2',
    spec_2: 'Preparación Física & Musculación (IPCH)',
    spec_3: 'Especialista en Biomecánica aplicada al Fitness',
    spec_4: 'Asesoría Nutricional Deportiva Avanzada'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .single();
      if (!error && data) {
        setAboutInfo(data);
      }
    } catch (err) {
      console.warn('Usando información Nosotros predeterminada:', err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll reveal animation observer
  useEffect(() => {
    if (loading) return;
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealVisible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  return (
    <div className={styles.wrapper}>
      {/* Background Decor */}
      <div className={styles.glowBg} />

      <section className="section reveal">
        <div className={styles.aboutContainer} style={{ marginTop: '20px' }}>
          <div className={styles.aboutImageCol}>
            <div className={styles.aboutImageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aboutInfo.image_url || '/images/coach.png'}
                alt="Coach Javier - Beast Training"
                className={styles.aboutImage}
                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectPosition: aboutInfo.image_position || 'center' }}
              />
              <div className={styles.aboutImageBadge}>
                <Sparkles size={16} />
                <span>{aboutInfo.badge_text || 'Coach Fundador'}</span>
              </div>
            </div>
          </div>

          <div className={styles.aboutTextCol}>
            <span className={styles.subtitle}>{aboutInfo.subtitle || 'sobre nosotros'}</span>
            <h2>{aboutInfo.title || 'Entrenamiento Inteligente, Resultados Reales'}</h2>
            <div className={styles.aboutDivider}></div>
            <p className={styles.aboutBio}>
              {aboutInfo.bio_p1}
            </p>
            {aboutInfo.bio_p2 && (
              <p className={styles.aboutBio}>
                {aboutInfo.bio_p2}
              </p>
            )}

            <div className={styles.aboutSpecs}>
              {aboutInfo.spec_1 && (
                <div className={styles.specItem}>
                  <Award size={18} className={styles.specIcon} />
                  <span>{aboutInfo.spec_1}</span>
                </div>
              )}
              {aboutInfo.spec_2 && (
                <div className={styles.specItem}>
                  <Award size={18} className={styles.specIcon} />
                  <span>{aboutInfo.spec_2}</span>
                </div>
              )}
              {aboutInfo.spec_3 && (
                <div className={styles.specItem}>
                  <Award size={18} className={styles.specIcon} />
                  <span>{aboutInfo.spec_3}</span>
                </div>
              )}
              {aboutInfo.spec_4 && (
                <div className={styles.specItem}>
                  <Award size={18} className={styles.specIcon} />
                  <span>{aboutInfo.spec_4}</span>
                </div>
              )}
            </div>

            {/* Social Links Block */}
            {((aboutInfo.show_coach_socials !== false && (aboutInfo.coach_instagram || aboutInfo.coach_tiktok)) || 
              (aboutInfo.show_gym_socials !== false && (aboutInfo.gym_instagram || aboutInfo.gym_facebook))) && (
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
                  Síguenos en Redes Sociales
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Coach social media */}
                  {aboutInfo.show_coach_socials !== false && 
                   ((aboutInfo.coach_instagram && aboutInfo.coach_instagram.length > 20) || (aboutInfo.coach_tiktok && aboutInfo.coach_tiktok.length > 18)) && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Redes del Coach Javier:
                      </span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {aboutInfo.coach_instagram && aboutInfo.coach_instagram.length > 20 && (
                          <a
                            href={aboutInfo.coach_instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'rgba(255, 87, 0, 0.1)',
                              border: '1px solid rgba(255, 87, 0, 0.3)',
                              color: 'var(--primary)',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            className={styles.socialBtn}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram Coach
                          </a>
                        )}
                        {aboutInfo.coach_tiktok && aboutInfo.coach_tiktok.length > 18 && (
                          <a
                            href={aboutInfo.coach_tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-light)',
                              color: '#ffffff',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            className={styles.socialBtn}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                            </svg>
                            TikTok Coach
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Gym social media */}
                  {aboutInfo.show_gym_socials !== false &&
                   ((aboutInfo.gym_instagram && aboutInfo.gym_instagram.length > 20) || (aboutInfo.gym_facebook && aboutInfo.gym_facebook.length > 20)) && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Redes de Beast Training:
                      </span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {aboutInfo.gym_instagram && aboutInfo.gym_instagram.length > 20 && (
                          <a
                            href={aboutInfo.gym_instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'rgba(255, 87, 0, 0.1)',
                              border: '1px solid rgba(255, 87, 0, 0.3)',
                              color: 'var(--primary)',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            className={styles.socialBtn}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram Beast
                          </a>
                        )}
                        {aboutInfo.gym_facebook && aboutInfo.gym_facebook.length > 20 && (
                          <a
                            href={aboutInfo.gym_facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-light)',
                              color: '#ffffff',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            className={styles.socialBtn}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                            Facebook Beast
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.aboutBtnWrapper} style={{ marginTop: '24px' }}>
              <Link href="/planes" className={styles.primaryBtn}>
                Ver Planes <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
