'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, MessageCircle, ShieldCheck, User, Users, Wifi } from 'lucide-react';
import styles from './planes.module.css';

// Default fallback plans — no duchas/casilleros, 3 categories
const defaultPlans = [
  // --- SOLO ---
  {
    id: 'p1', name: 'Plan Mensual Solo', description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
    price: 35000, duration_months: 1, category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial'],
    popular: false, visible: true,
  },
  {
    id: 'p2', name: 'Plan Trimestral Solo', description: 'Nuestra opción recomendada para ver los primeros cambios reales.',
    price: 90000, duration_months: 3, category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica'],
    popular: true, visible: true,
  },
  {
    id: 'p3', name: 'Plan Anual Solo', description: 'Compromiso total con tu salud y rendimiento físico al mejor precio.',
    price: 320000, duration_months: 12, category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', '1 polera oficial Beast Training'],
    popular: false, visible: true,
  },
  // --- DÚO ---
  {
    id: 'p4', name: 'Plan Mensual Dúo', description: 'Acceso completo para dos personas. Entrenád juntos.',
    price: 50000, duration_months: 1, category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial c/u'],
    popular: false, visible: true,
  },
  {
    id: 'p5', name: 'Plan Trimestral Dúo', description: 'La opción recomendada en pareja para ver resultados juntos.',
    price: 135000, duration_months: 3, category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional básica'],
    popular: true, visible: true,
  },
  {
    id: 'p6', name: 'Plan Anual Dúo', description: 'Máximo ahorro para dos. Un año de entrenamiento juntos.',
    price: 480000, duration_months: 12, category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional avanzada', '2 poleras oficiales Beast Training'],
    popular: false, visible: true,
  },
  // --- ONLINE ---
  {
    id: 'p7', name: 'Plan Online Mensual', description: 'Entrenamiento personalizado desde donde estés, guiado por tu coach.',
    price: 25000, duration_months: 1, category: 'online',
    features: ['Rutina personalizada mensual', 'Seguimiento vía WhatsApp', 'Evaluación física inicial online', 'Asesoría nutricional básica'],
    popular: false, visible: true,
  },
  {
    id: 'p8', name: 'Plan Online Trimestral', description: 'Seguimiento continuo y ajuste de rutinas cada mes durante 3 meses.',
    price: 65000, duration_months: 3, category: 'online',
    features: ['Rutinas personalizadas mensuales', 'Seguimiento vía WhatsApp', 'Evaluación física mensual online', 'Asesoría nutricional avanzada'],
    popular: true, visible: true,
  },
];

const categories = [
  { id: 'solo',   label: 'Solo',   icon: User },
  { id: 'duo',    label: 'Dúo',    icon: Users },
  { id: 'online', label: 'Online', icon: Wifi },
];

export default function PlanesClient() {
  const [plans, setPlans] = useState(defaultPlans);
  const [activeCategory, setActiveCategory] = useState('solo');
  const [whatsappNumber, setWhatsappNumber] = useState('56948925193');

  useEffect(() => {
    fetchPlans();
    fetchWhatsappNumber();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase.from('plans').select('*');
      if (!error && data && data.length > 0) {
        const catMap = { individual: 'solo', couple: 'duo', family: 'solo' };
        const normalized = data.map(p => ({
          ...p,
          category: catMap[p.category] || p.category,
          visible: p.visible !== false,
          features: (p.features || []).filter(f =>
            !f.toLowerCase().includes('casillero') && !f.toLowerCase().includes('ducha')
          ),
        }));
        // Only show visible plans on public page, popular first
        const activeFromDb = normalized
          .filter(p => p.visible)
          .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.price - b.price);
        if (activeFromDb.length > 0) {
          setPlans(activeFromDb);
          return;
        }
      }
      // Fallback to defaults (all visible)
    } catch (err) { /* use defaults */ }
  };

  const fetchWhatsappNumber = async () => {
    try {
      const { data, error } = await supabase.from('about_info').select('whatsapp_number').single();
      if (!error && data?.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number.replace(/\+/g, '').trim());
      }
    } catch (err) { /* use default */ }
  };

  // Only show visible plans for active category (popular/featured first)
  const filteredPlans = plans.filter(p => p.category === activeCategory);

  const handleWhatsAppContact = (plan) => {
    const msg = encodeURIComponent(
      `Hola! Me gustaría contratar el ${plan.name} de Beast Training (${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(plan.price)}). ¿Cómo puedo inscribirme?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  const formatCLP = (value) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value);

  return (
    <div className={styles.wrapper}>
      <div className={styles.glowBg} />

      <section className="section">
        <div className={styles.header}>
          <span className={styles.subtitle}>membresías b-training</span>
          <h1>Nuestros Planes de Entrenamiento</h1>
          <p className={styles.description}>
            Elige el plan que mejor se adapte a tus objetivos. Sin matrícula ni cargos ocultos.
          </p>
          <div className={styles.headerBar} />
        </div>

        {/* Category Tabs — scrollable on mobile */}
        <div className={styles.tabsContainer} role="tablist">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`${styles.tabToggleBtn} ${activeCategory === cat.id ? styles.activeTabToggle : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={17} />
                {cat.label}
                {cat.id === 'duo' && <span className={styles.discountBadge}>Ahorra</span>}
                {cat.id === 'online' && <span className={styles.onlineBadge}>Nuevo</span>}
              </button>
            );
          })}
        </div>

        {/* Plans grid — or empty state */}
        {filteredPlans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏋️</p>
            <p>Próximamente más planes en esta categoría. ¡Consultanos por WhatsApp!</p>
          </div>
        ) : (
        <div className={styles.plansGrid}>
          {filteredPlans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} glass ${plan.popular ? styles.popularCard : ''}`}>
              {plan.popular && <span className={styles.popularBadge}>Más Popular</span>}

              <div className={styles.cardHeader}>
                <h2 className={styles.planName}>{plan.name}</h2>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{formatCLP(plan.price)}</span>
                  <span className={styles.duration}>
                    / {plan.duration_months === 1 ? 'Mes' : `${plan.duration_months} Meses`}
                  </span>
                </div>
                {plan.description && <p className={styles.planDesc}>{plan.description}</p>}
              </div>

              <div className={styles.features}>
                {(plan.features || []).map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <Check size={17} className={styles.featureIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`${styles.whatsappBtn} ${plan.popular ? styles.popularWhatsappBtn : ''}`}
                onClick={() => handleWhatsAppContact(plan)}
              >
                <MessageCircle size={20} />
                Contratar por WhatsApp
              </button>
            </div>
          ))}
        </div>
        )}

        <div className={styles.secureBadgeSection}>
          <ShieldCheck size={20} className={styles.secureIcon} />
          <span>Contáctanos vía WhatsApp para contratar tu plan. Consulta sin compromiso.</span>
        </div>
      </section>
    </div>
  );
}
