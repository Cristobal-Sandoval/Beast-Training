'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [simulationStep, setSimulationStep] = useState('idle'); // idle, paying, success
  
  // Promo code states
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const router = useRouter();

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
    if (!user) {
      router.push('/login?redirect=/planes');
      return;
    }
    setSelectedPlan(plan);
    setShowSimulatedModal(true);
    setSimulationStep('idle');
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

      {/* Simulated Payment / WhatsApp Redirect Modal */}
      {showSimulatedModal && selectedPlan && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalCard} glass glow-orange`} style={{ maxWidth: '480px', padding: '30px' }}>
            <div className={styles.modalHeader} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
              <MessageCircle size={28} className={styles.secureIcon} style={{ color: '#25d366' }} />
              <h3 style={{ textTransform: 'uppercase', fontSize: '1.25rem', fontWeight: '800' }}>Confirmar Inscripción</h3>
            </div>
            
            <div className={styles.modalBody} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                ¡Tu cuenta de Beast Training ya está lista! Para activar tu plan y coordinar el método de pago (transferencia electrónica o efectivo), comunícate directamente con el Coach por WhatsApp.
              </p>

              <div className={styles.selectedPlanDetails} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Plan Seleccionado</span>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{selectedPlan.name}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Total del Plan</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{formatCLP(selectedPlan.price)}</strong>
                </div>
              </div>

              <div className={styles.alertNotice} style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#25d366', fontSize: '0.9rem', fontWeight: '500' }}>
                <ShieldCheck size={20} />
                <span>Activación de membresía inmediata al enviar tu comprobante.</span>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <button 
                onClick={() => setShowSimulatedModal(false)} 
                className={styles.buyBtn} 
                style={{ flex: 1, background: 'transparent', borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                type="button"
              >
                Volver
              </button>
              
              <a
                href={`https://wa.me/56948925193?text=¡Hola%20Coach!%20Me%20acabo%20de%20registrar%20en%20Beast%20Training%20y%20quiero%20inscribirme%20en%20el%20${encodeURIComponent(selectedPlan.name)}.%20¿Me%20podrías%20dar%20las%20instrucciones%20para%20realizar%20la%20transferencia%20y%20activar%20mi%20cuenta?`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyBtn}
                style={{ flex: 1.5, background: '#25d366', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
                onClick={() => setShowSimulatedModal(false)}
              >
                <MessageCircle size={18} />
                Enviar a WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
