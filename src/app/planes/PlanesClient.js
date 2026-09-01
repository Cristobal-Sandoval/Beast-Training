'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, MessageCircle, ShieldCheck, User, Users, Wifi, Star, Sparkles } from 'lucide-react';
import styles from './planes.module.css';
import { DEFAULT_PLANS, MAX_PLANS_PER_CATEGORY } from '@/lib/defaultPlans';

const categories = [
  { id: 'solo',   label: 'Solo',   icon: User,  subtitle: 'Individual' },
  { id: 'duo',    label: 'Dúo',    icon: Users, subtitle: 'Parejas' },
  { id: 'online', label: 'Online', icon: Wifi,  subtitle: 'A distancia' },
];

export default function PlanesClient() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
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
          features: (p.features || []).filter(
            f => !f.toLowerCase().includes('casillero') && !f.toLowerCase().includes('ducha')
          ),
        }));

        // Supplement with defaults if any category is missing
        const categoriesInDb = new Set(normalized.map(p => p.category));
        const supplements = DEFAULT_PLANS.filter(dp => !categoriesInDb.has(dp.category));
        const allPlans = [...normalized, ...supplements];

        setPlans(allPlans);
      } else {
        setPlans(DEFAULT_PLANS);
      }
    } catch (err) {
      setPlans(DEFAULT_PLANS);
    }
  };

  const fetchWhatsappNumber = async () => {
    try {
      const { data, error } = await supabase.from('about_info').select('whatsapp_number').single();
      if (!error && data?.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number.replace(/\+/g, '').trim());
      }
    } catch (err) {
      // Use fallback
    }
  };

  // Filter only active/visible plans for the active category (max 6)
  const activePlansForCategory = plans
    .filter(p => p.category === activeCategory && p.visible)
    .slice(0, MAX_PLANS_PER_CATEGORY);

  // Separate popular vs non-popular to place popular in the center on desktop
  const popularPlan = activePlansForCategory.find(p => p.popular);
  const nonPopularPlans = activePlansForCategory
    .filter(p => !p.popular)
    .sort((a, b) => a.price - b.price);

  // Desktop ordering: place popular plan in the center
  let orderedPlans = [...nonPopularPlans];
  if (popularPlan) {
    const midIndex = Math.floor(nonPopularPlans.length / 2);
    orderedPlans.splice(midIndex, 0, popularPlan);
  }

  const handleWhatsAppContact = (plan) => {
    const msg = encodeURIComponent(
      `¡Hola Beast Training! Me interesa contratar el ${plan.name} ($${plan.price.toLocaleString('es-CL')}). ¿Cuáles son los pasos para inscribirme?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  const formatCLP = (value) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value);

  return (
    <div className={styles.wrapper}>
      <div className={styles.glowBg} />

      <section className="section">
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.subtitle}>Membresías Beast Training</span>
          <h1>Nuestros Planes de Entrenamiento</h1>
          <p className={styles.description}>
            Elige el plan que mejor se adapte a tus metas. Sin matrícula ni costos ocultos.
          </p>
          <div className={styles.headerBar} />
        </div>

        {/* Category Tabs (Solo, Duo, Online) */}
        <div className={styles.tabsContainer} role="tablist">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${styles.tabToggleBtn} ${isSelected ? styles.activeTabToggle : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
                {cat.id === 'duo' && <span className={styles.discountBadge}>Ahorra</span>}
                {cat.id === 'online' && <span className={styles.onlineBadge}>App</span>}
              </button>
            );
          })}
        </div>

        {/* Plans Grid */}
        {orderedPlans.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🏋️</p>
            <p>Próximamente más planes en esta categoría. ¡Contáctanos por WhatsApp para consultar!</p>
          </div>
        ) : (
          <div className={styles.plansGrid}>
            {orderedPlans.map((plan) => {
              const isPop = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`${styles.planCard} glass ${isPop ? styles.popularCard : ''}`}
                >
                  {/* Badge de Más Popular */}
                  {isPop && (
                    <div className={styles.popularBadge}>
                      <Star size={13} fill="#fff" />
                      <span>Más Popular</span>
                    </div>
                  )}

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

                  {/* Feature list */}
                  <div className={styles.features}>
                    {(plan.features || []).map((feature, index) => (
                      <div key={index} className={styles.featureItem}>
                        <div className={styles.featureIconWrap}>
                          <Check size={14} className={styles.featureIcon} />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp CTA */}
                  <button
                    type="button"
                    className={`${styles.whatsappBtn} ${isPop ? styles.popularWhatsappBtn : ''}`}
                    onClick={() => handleWhatsAppContact(plan)}
                  >
                    <MessageCircle size={18} />
                    <span>Contratar por WhatsApp</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info badge */}
        <div className={styles.secureBadgeSection}>
          <ShieldCheck size={18} className={styles.secureIcon} />
          <span>Atención personalizada vía WhatsApp. Pagos seguros por transferencia bancaria o tarjeta.</span>
        </div>

      </section>
    </div>
  );
}
