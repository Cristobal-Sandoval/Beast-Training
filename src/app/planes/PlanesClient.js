'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, MessageCircle, ShieldCheck, User, Users } from 'lucide-react';
import styles from './planes.module.css';

const defaultPlans = [
  {
    id: 'p1', name: 'Plan Mensual', description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
    price: 35000, duration_months: 1, category: 'individual',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial', 'Casilleros y duchas'],
    popular: false, visible: true,
  },
  {
    id: 'p2', name: 'Plan Trimestral', description: 'Nuestra opción recomendada para ver los primeros cambios reales.',
    price: 90000, duration_months: 3, category: 'individual',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Casilleros y duchas'],
    popular: true, visible: true,
  },
  {
    id: 'p3', name: 'Plan Anual', description: 'Compromiso total con tu salud y rendimiento físico al mejor precio.',
    price: 320000, duration_months: 12, category: 'individual',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '1 polera oficial Beast Training'],
    popular: false, visible: true,
  },
  {
    id: 'p4', name: 'Plan Dúo Mensual', description: 'Acceso completo para dos personas. Entrená con quien más quieras.',
    price: 50000, duration_months: 1, category: 'couple',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial c/u', 'Casilleros y duchas'],
    popular: false, visible: true,
  },
  {
    id: 'p5', name: 'Plan Dúo Trimestral', description: 'La opción recomendada en pareja para ver resultados juntos.',
    price: 135000, duration_months: 3, category: 'couple',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional básica', 'Casilleros y duchas'],
    popular: true, visible: true,
  },
  {
    id: 'p6', name: 'Plan Dúo Anual', description: 'Máximo ahorro para dos. Un año de entrenamiento juntos.',
    price: 480000, duration_months: 12, category: 'couple',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '2 poleras oficiales Beast Training'],
    popular: false, visible: true,
  },
];

const categories = [
  { id: 'individual', label: 'Individual', icon: User },
  { id: 'couple', label: 'Dúo / Pareja', icon: Users },
];

export default function PlanesClient() {
  const [plans, setPlans] = useState(defaultPlans);
  const [activeCategory, setActiveCategory] = useState('individual');
  const [whatsappNumber, setWhatsappNumber] = useState('56948925193');

  useEffect(() => { 
    fetchPlans(); 
    fetchWhatsappNumber();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
      if (!error && data && data.length > 0 && data.some(p => p.category)) {
        const visible = data.filter(p => p.visible !== false);
        const categoriesInDb = new Set(visible.map(p => p.category));
        const supplements = defaultPlans.filter(dp => !categoriesInDb.has(dp.category));
        setPlans([...visible, ...supplements]);
      }
    } catch (err) { console.warn('Usando planes predeterminados:', err); }
  };

  const fetchWhatsappNumber = async () => {
    try {
      const { data, error } = await supabase.from('about_info').select('whatsapp_number').single();
      if (!error && data?.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number.replace(/\+/g, '').trim());
      }
    } catch (err) {
      console.warn('Error fetching whatsapp number:', err);
    }
  };

  const filteredPlans = plans.filter(p => p.category === activeCategory);

  const handleWhatsAppContact = (plan) => {
    const message = encodeURIComponent(`Hola! Me gustaría contratar el ${plan.name} de Beast Training ($${plan.price.toLocaleString('es-CL')}). ¿Cómo puedo inscribirme?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value);
  };

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
          <div className={styles.headerBar}></div>
        </div>

        {/* Category Tabs */}
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
                <Icon size={18} />
                {cat.label}
                {cat.id === 'couple' && <span className={styles.discountBadge}>Ahorra</span>}
              </button>
            );
          })}
        </div>

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
                {plan.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <Check size={18} className={styles.featureIcon} />
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

        <div className={styles.secureBadgeSection}>
          <ShieldCheck size={20} className={styles.secureIcon} />
          <span>Contáctanos vía WhatsApp para contratar tu plan. Consulta sin compromiso.</span>
        </div>
      </section>
    </div>
  );
}
