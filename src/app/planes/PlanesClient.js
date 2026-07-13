'use client';

import { useState, useEffect } from 'react';
import { supabase, isPlaceholderMode } from '@/lib/supabaseClient';
import { Check, Dumbbell, ShieldCheck, MessageCircle } from 'lucide-react';
import styles from './planes.module.css';

// Fallback plans if database is not seeded yet
const defaultPlans = [
  {
    id: 'p1_ind',
    name: 'Mensual Individual',
    category: 'individual',
    description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
    price: 35000,
    duration_months: 1,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial', 'Casilleros y duchas'],
    popular: false,
  },
  {
    id: 'p2_ind',
    name: 'Trimestral Individual',
    category: 'individual',
    description: 'Nuestra opción recomendada para ver los primeros cambios reales.',
    price: 90000,
    duration_months: 3,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Casilleros y duchas'],
    popular: true,
  },
  {
    id: 'p3_ind',
    name: 'Anual Individual',
    category: 'individual',
    description: 'Compromiso total con tu salud y rendimiento físico al mejor precio.',
    price: 320000,
    duration_months: 12,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '1 polera oficial Beast Training'],
    popular: false,
  },
  {
    id: 'p1_duo',
    name: 'Mensual Dúo',
    category: 'duo',
    description: 'Entrena acompañado. Acceso ilimitado para ti y tu partner.',
    price: 60000,
    duration_months: 1,
    features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial individual', 'Casilleros y duchas'],
    popular: false,
  },
  {
    id: 'p2_duo',
    name: 'Trimestral Dúo',
    category: 'duo',
    description: 'La mejor opción en parejas para consolidar hábitos saludables.',
    price: 160000,
    duration_months: 3,
    features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física mensual individual', 'Asesoría nutricional básica para ambos', 'Casilleros y duchas'],
    popular: true,
  },
  {
    id: 'p3_duo',
    name: 'Anual Dúo',
    category: 'duo',
    description: 'Ahorro masivo y compromiso a largo plazo entrenando de a dos.',
    price: 580000,
    duration_months: 12,
    features: ['Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física mensual individual', 'Asesoría nutricional avanzada para ambos', 'Casilleros y duchas', '2 poleras oficiales Beast Training'],
    popular: false,
  }
];

export default function PlanesClient() {
  const [plans, setPlans] = useState(defaultPlans);
  const [activeCategory, setActiveCategory] = useState('individual'); // 'individual' or 'duo'
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });
      if (!error && data && data.length > 0) {
        setPlans(data);
      }
    } catch (err) {
      console.warn('Usando planes predeterminados:', err);
    }
  };

  const handlePurchase = (plan) => {
    const text = `¡Hola Coach! Me interesa inscribirme en el plan *${plan.name}* (valor: ${formatCLP(plan.price)}). ¿Me podrías dar las instrucciones para realizar la transferencia y activar mi cuenta?`;
    const waUrl = `https://wa.me/56948925193?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredPlans = plans.filter(p => (p.category || 'individual') === activeCategory);

  return (
    <div className={styles.wrapper}>
      {/* Background Decor */}
      <div className={styles.glowBg} />

      <section className="section">
        <div className={styles.header}>
          <span className={styles.subtitle}>membresías b-training</span>
          <h1>Nuestros Planes de Entrenamiento</h1>
          <p className={styles.description}>
            Elige el plan que mejor se adapte a tus objetivos. Sin matrícula ni cargos ocultos.
          </p>
          <div className={styles.headerBar}></div>
        </div>

        {/* Category Tabs Switch */}
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveCategory('individual')}
            className={`${styles.tabToggleBtn} ${activeCategory === 'individual' ? styles.activeTabToggle : ''}`}
            type="button"
          >
            Membresía Individual
          </button>
          <button
            onClick={() => setActiveCategory('duo')}
            className={`${styles.tabToggleBtn} ${activeCategory === 'duo' ? styles.activeTabToggle : ''}`}
            type="button"
          >
            Plan Dúo <span className={styles.discountBadge}>Ahorro Extra</span>
          </button>
        </div>

        <div className={styles.plansGrid}>
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} glass ${plan.popular ? styles.popularCard : ''}`}
            >
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
                {plan.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <Check size={18} className={styles.featureIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={styles.actionsContainer}>
                <button
                  className={`${styles.buyBtn} ${plan.popular ? styles.popularBuyBtn : ''}`}
                  onClick={() => handlePurchase(plan)}
                  type="button"
                >
                  Inscribirme en este Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.secureBadgeSection}>
          <ShieldCheck size={20} className={styles.secureIcon} />
          <span>Inscripciones y activaciones de cuenta coordinadas de forma directa y segura vía WhatsApp</span>
        </div>
      </section>
    </div>
  );
}
