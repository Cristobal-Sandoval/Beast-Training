'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Check, Dumbbell, AlertTriangle, ShieldCheck } from 'lucide-react';
import styles from './planes.module.css';

// Fallback plans if database is not seeded yet
const defaultPlans = [
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

export default function Planes() {
  const [plans, setPlans] = useState(defaultPlans);
  const [user, setUser] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [simulationStep, setSimulationStep] = useState('idle'); // idle, paying, success
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
      // Record simulated payment/subscription in Supabase or localStorage
      const paymentData = {
        user_id: user.id,
        plan_name: selectedPlan.name,
        price: selectedPlan.price,
        status: 'approved',
        created_at: new Date().toISOString(),
      };
      
      // Save simulation locally in user storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('beast_last_payment', JSON.stringify(paymentData));
      }

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icon-1024.png" alt="Mercado Pago" className={styles.mpLogo} style={{ height: '32px' }} />
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
                    <span>{formatCLP(selectedPlan.price)}</span>
                  </div>
                  <p className={styles.instructionText}>
                    Esta es una simulación de la pasarela de Mercado Pago Chile para probar el flujo completo localmente. 
                  </p>
                </div>
                <div className={styles.modalFooter}>
                  <button onClick={() => setShowSimulatedModal(false)} className={styles.cancelBtn}>
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
                <p>Tu transacción por {formatCLP(selectedPlan.price)} ha sido exitosa.</p>
                <p className={styles.redirectText}>Redirigiendo a tu Dashboard de la Bestia...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
