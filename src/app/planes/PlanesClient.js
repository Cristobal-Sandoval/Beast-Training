'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Check, Dumbbell, AlertTriangle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import styles from './planes.module.css';

// Fallback plans if database is not seeded yet
const defaultBanners = [
  {
    id: 'p1',
    name: 'Plan Mensual',
    description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
    price: 35000,
    duration_months: 1,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial', 'Casilleros y duchas'],
    popular: false,
  },
  {
    id: 'p2',
    name: 'Plan Trimestral',
    description: 'Nuestra opción recomendada para ver los primeros cambios reales.',
    price: 90000,
    duration_months: 3,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Casilleros y duchas'],
    popular: true,
  },
  {
    id: 'p3',
    name: 'Plan Anual',
    description: 'Compromiso total con tu salud y rendimiento físico al mejor precio.',
    price: 320000,
    duration_months: 12,
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', 'Casilleros y duchas', '1 polera oficial Beast Training'],
    popular: false,
  }
];

export default function PlanesClient() {
  const [plans, setPlans] = useState(defaultBanners);
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

  const handlePurchase = async (plan) => {
    if (!user) {
      router.push('/login?redirect=/planes');
      return;
    }

    setLoadingPlanId(plan.id);
    setSelectedPlan(plan);

    try {
      // 1. Intentar llamar al backend para iniciar preferencia real de Mercado Pago
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.initPoint) {
        // Redirigir a Mercado Pago real
        window.location.href = result.initPoint;
      } else {
        // Si no está configurada la llave secreta o da error, mostramos la simulación interactiva
        console.warn('Iniciando simulación de pago local debido a falta de credenciales de producción');
        setShowSimulatedModal(true);
        setSimulationStep('idle');
      }
    } catch (error) {
      console.error('Error al conectar con la API de pagos, usando simulación local:', error);
      setShowSimulatedModal(true);
      setSimulationStep('idle');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const confirmSimulatedPayment = async () => {
    setSimulationStep('paying');
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    try {
      const finalPrice = appliedPromo
        ? selectedPlan.price * (1 - appliedPromo.discount_percent / 100)
        : selectedPlan.price;

      // Record simulated payment/subscription in Supabase or localStorage
      const paymentData = {
        user_id: user.id,
        plan_name: selectedPlan.name,
        price: finalPrice,
        status: 'approved',
        created_at: new Date().toISOString(),
      };
      
      // Save simulation locally in user storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('beast_last_payment', JSON.stringify(paymentData));
      }

      // Update student profile status to active
      await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', user.id);

      setSimulationStep('success');
      
      // Auto redirect after success display
      setTimeout(() => {
        setShowSimulatedModal(false);
        router.push('/dashboard?payment=success');
      }, 2500);
    } catch (err) {
      console.error(err);
      setSimulationStep('idle');
    }
  };

  const handleValidatePromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    
    try {
      const pastPayment = localStorage.getItem('beast_last_payment');
      if (pastPayment) {
        setPromoError('Este código es válido solo para tu primera compra.');
        setPromoLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCodeInput.trim().toUpperCase())
        .eq('active', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        setPromoError('Código de descuento inválido o vencido.');
      } else {
        setAppliedPromo(data[0]);
        setPromoCodeInput('');
      }
    } catch (err) {
      console.error('Error validating coupon:', err);
      setPromoError('Error al validar el cupón. Inténtalo de nuevo.');
    } finally {
      setPromoLoading(false);
    }
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

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

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
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

              <button
                className={`${styles.buyBtn} ${plan.popular ? styles.popularBuyBtn : ''}`}
                onClick={() => handlePurchase(plan)}
                disabled={loadingPlanId === plan.id}
              >
                {loadingPlanId === plan.id ? 'Cargando Pago...' : 'Pagar Membresía'}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.secureBadgeSection}>
          <ShieldCheck size={20} className={styles.secureIcon} />
          <span>Pagos protegidos mediante encriptación SSL y procesados por Mercado Pago Chile</span>
        </div>
      </section>

      {/* Simulated Mercado Pago Modal */}
      {showSimulatedModal && selectedPlan && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalCard} glass glow-orange`}>
            {simulationStep === 'idle' && (
              <>
                <div className={styles.modalHeader}>
                  <Image
                    src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icon-1024.png"
                    alt="Mercado Pago"
                    width={32}
                    height={32}
                    style={{ objectFit: 'contain' }}
                    className={styles.mpLogo}
                  />
                  <h3>Pasarela de Pago (Pruebas)</h3>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.alertNotice}>
                    <AlertTriangle size={20} />
                    <span>Entorno Sandbox Local</span>
                  </div>
                  <p>Estás comprando la membresía:</p>
                  <div className={styles.selectedPlanDetails}>
                    <strong>{selectedPlan.name}</strong>
                    {appliedPromo ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.9rem' }}>
                          {formatCLP(selectedPlan.price)}
                        </span>
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                          {formatCLP(selectedPlan.price * (1 - appliedPromo.discount_percent / 100))} ({appliedPromo.discount_percent}% OFF)
                        </span>
                      </div>
                    ) : (
                      <span>{formatCLP(selectedPlan.price)}</span>
                    )}
                  </div>

                  {/* Promo Code Input section */}
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', textAlign: 'left' }}>
                    {appliedPromo ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed var(--success)', padding: '10px 14px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                          Cupón aplicado: <strong>{appliedPromo.code}</strong>
                        </span>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--error)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            minHeight: 'auto'
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                          ¿Tienes un código de descuento? (Solo primera compra)
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Ej: BEAST20"
                            value={promoCodeInput}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value);
                              setPromoError('');
                            }}
                            style={{
                              flex: 1,
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border-light)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              color: '#ffffff',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          />
                          <button
                            onClick={handleValidatePromoCode}
                            disabled={promoLoading}
                            style={{
                              background: 'var(--primary)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              minHeight: 'auto'
                            }}
                          >
                            {promoLoading ? '...' : 'Aplicar'}
                          </button>
                        </div>
                        {promoError && (
                          <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '6px', fontWeight: '500' }}>
                            {promoError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <p className={styles.instructionText} style={{ marginTop: '16px' }}>
                    Esta es una simulación de la pasarela de Mercado Pago Chile para probar el flujo completo localmente. 
                  </p>
                </div>
                <div className={styles.modalFooter}>
                  <button onClick={() => { setShowSimulatedModal(false); setAppliedPromo(null); }} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                  <button onClick={confirmSimulatedPayment} className={styles.confirmBtn}>
                    Pagar con Tarjeta (Demo)
                  </button>
                </div>
              </>
            )}

            {simulationStep === 'paying' && (
              <div className={styles.processingContainer}>
                <Dumbbell className={styles.spinningDumbbell} size={48} />
                <h3>Procesando Pago...</h3>
                <p>Por favor no cierres la ventana, conectando con el banco emisor.</p>
              </div>
            )}

            {simulationStep === 'success' && (
              <div className={styles.successContainer}>
                <ShieldCheck size={56} className={styles.paymentSuccessIcon} />
                <h3>¡Pago Aprobado!</h3>
                <p>Tu transacción por {formatCLP(appliedPromo ? selectedPlan.price * (1 - appliedPromo.discount_percent / 100) : selectedPlan.price)} ha sido exitosa.</p>
                <p className={styles.redirectText}>Redirigiendo a tu Dashboard de la Bestia...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
