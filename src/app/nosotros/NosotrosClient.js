'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import Image from 'next/image';
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
              <Image
                src={aboutInfo.image_url || '/images/coach.png'}
                alt="Coach Javier - Beast Training"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className={styles.aboutImage}
                style={{ objectFit: 'cover' }}
                priority
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

            <div className={styles.aboutBtnWrapper} style={{ marginTop: '20px' }}>
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
