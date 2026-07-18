'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Dumbbell, ArrowRight, Activity, Zap, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

export default function HomeClient({ initialBanners, initialPosts, fallbackBanners, fallbackPosts }) {
  const [banners, setBanners] = useState(initialBanners);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [latestPosts, setLatestPosts] = useState(initialPosts);

  useEffect(() => {
    refreshBanners();
    refreshPosts();
  }, []);

  const refreshBanners = async () => {
    try {
      const { data } = await supabase.from('banners').select('*').eq('active', true);
      if (data && data.length > 0) setBanners(data);
    } catch (e) { setBanners(fallbackBanners); }
  };

  const refreshPosts = async () => {
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).limit(2);
      if (data && data.length > 0) setLatestPosts(data);
    } catch (e) { setLatestPosts(fallbackPosts); }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealVisible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el) => observer.observe(el));
    return () => revealElements.forEach((el) => observer.unobserve(el));
  }, [latestPosts, banners]);

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        {banners.map((banner, index) => (
          <div key={banner.id} className={`${styles.heroSlide} ${index === activeBannerIndex ? styles.activeSlide : ''}`} style={{
            alignItems: banner.text_vertical_align === 'top' ? 'flex-start' : banner.text_vertical_align === 'bottom' ? 'flex-end' : 'center',
            paddingTop: banner.text_vertical_align === 'top' ? '120px' : '0',
            paddingBottom: banner.text_vertical_align === 'bottom' ? '80px' : '0'
          }}>
            {banner.image_url && (
              <Image src={banner.image_url} alt={banner.title || 'Beast Training'} fill priority={index === 0} sizes="100vw" className={styles.heroBgImage} style={{ objectPosition: banner.image_position || '50% 50%' }} />
            )}
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent} style={{
              textAlign: banner.text_align || 'left',
              alignItems: banner.text_align === 'center' ? 'center' : banner.text_align === 'right' ? 'flex-end' : 'flex-start',
              marginLeft: banner.text_align === 'center' ? 'auto' : '0',
              marginRight: banner.text_align === 'center' ? 'auto' : banner.text_align === 'right' ? '0' : 'auto',
              width: '100%', display: 'flex', flexDirection: 'column'
            }}>
              <span className={styles.heroBadge}><Sparkles size={14} /> {banner.h3_tagline || 'beast training concepción'}</span>
              <h1 className={styles.heroTitle}>{banner.h1_title || banner.title}</h1>
              <p className={styles.heroDescription}>{banner.h2_subtitle || banner.description}</p>
              <div className={styles.heroBtns} style={{ alignSelf: banner.text_align === 'center' ? 'center' : banner.text_align === 'right' ? 'flex-end' : 'flex-start' }}>
                <Link href={banner.link_url || '/planes'} className={styles.primaryBtn}>Ver Planes <ArrowRight size={18} /></Link>
                <Link href="/planes" className={styles.secondaryBtn}>Unirse Ahora</Link>
              </div>
            </div>
          </div>
        ))}
        {banners.length > 1 && (
          <>
            <button className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`} onClick={() => setActiveBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)} aria-label="Banner anterior" type="button"><ChevronLeft size={24} /></button>
            <button className={`${styles.carouselArrow} ${styles.carouselArrowRight}`} onClick={() => setActiveBannerIndex((prev) => (prev + 1) % banners.length)} aria-label="Banner siguiente" type="button"><ChevronRight size={24} /></button>
          </>
        )}
        {banners.length > 1 && (
          <div className={styles.carouselDots} role="tablist" aria-label="Navegación de slides">
            {banners.map((_, index) => (
              <button key={index} className={`${styles.carouselDot} ${index === activeBannerIndex ? styles.activeDot : ''}`} onClick={() => setActiveBannerIndex(index)} aria-label={`Ir al slide ${index + 1}`} role="tab" aria-selected={index === activeBannerIndex} type="button" />
            ))}
          </div>
        )}
      </section>

      <section className="section reveal">
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>nuestro método</span>
          <h2>¿por qué entrenar con nosotros?</h2>
          <div className={styles.headerBar}></div>
        </div>
        <div className={styles.pillarsGrid}>
          <div className={`${styles.pillarCard} glass`}>
            <div className={styles.pillarIconWrapper}><Zap size={32} /></div>
            <h3>Alta Intensidad</h3>
            <p>Clases de HIIT y CrossFit diseñadas para quemar grasa, aumentar resistencia y desafiar tu mente.</p>
          </div>
          <div className={`${styles.pillarCard} glass`}>
            <div className={styles.pillarIconWrapper}><Activity size={32} /></div>
            <h3>Fuerza & Musculación</h3>
            <p>Equipamiento moderno y asesoría experta para ganar masa muscular y fuerza funcional real.</p>
          </div>
          <div className={`${styles.pillarCard} glass`}>
            <div className={styles.pillarIconWrapper}><Shield size={32} /></div>
            <h3>Progreso Integrado</h3>
            <p>Registra tu peso, % de grasa y masa muscular en nuestra plataforma y ve tu evolución con gráficos.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaBannerSection} reveal`}>
        <div className={`${styles.ctaContainer} glass glow-orange`}>
          <div className={styles.ctaContent}>
            <h2>LLEVA TU CUERPO AL SIGUIENTE NIVEL</h2>
            <p>Todos nuestros planes incluyen evaluación física mensual, acceso ilimitado a clases guiadas y seguimiento digital de tu progreso.</p>
          </div>
          <Link href="/planes" className={styles.ctaBtn}>Únete a Nosotros <Dumbbell size={18} /></Link>
        </div>
      </section>

      <section className="section reveal">
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>consejos de expertos</span>
          <h2>Últimas Noticias & Tips</h2>
          <div className={styles.headerBar}></div>
        </div>
        <div className={styles.blogGrid}>
          {latestPosts.map((post) => (
            <article key={post.id} className={`${styles.blogCard} glass`}>
              {post.image_url && (
                <div className={styles.blogImageWrapper}>
                  <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.blogImage} />
                </div>
              )}
              <div className={styles.blogContent}>
                <div className={styles.blogMeta}>
                  <span>Por {post.author}</span>
                  <span className={styles.metaDivider}>•</span>
                  <span>{new Date(post.published_at).toLocaleDateString('es-CL')}</span>
                </div>
                <h3 className={styles.blogTitle}><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className={styles.readMoreLink}>Leer más <ArrowRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.blogFooter}>
          <Link href="/blog" className={styles.blogAllBtn}>Ver todas las publicaciones</Link>
        </div>
      </section>
    </div>
  );
}
