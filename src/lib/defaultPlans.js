// Mapping between UI categories ('solo', 'duo', 'online') and DB categories ('individual', 'couple', 'family')
export const toDbCategory = (uiCat) => {
  const map = { solo: 'individual', duo: 'couple', online: 'family' };
  return map[uiCat] || uiCat || 'individual';
};

export const fromDbCategory = (dbCat) => {
  const map = { individual: 'solo', couple: 'duo', family: 'online', solo: 'solo', duo: 'duo', online: 'online' };
  return map[dbCat] || dbCat || 'solo';
};

export const MAX_PLANS_PER_CATEGORY = 6;

export const DEFAULT_PLANS = [
  // ── SOLO (4 activos, 2 offline, 1 popular) ──
  {
    id: 'solo-1',
    name: 'Plan Mensual Solo',
    description: 'Acceso ilimitado a todas nuestras clases y sala de musculación.',
    price: 35000,
    duration_months: 1,
    category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física inicial'],
    popular: false,
    visible: true,
  },
  {
    id: 'solo-2',
    name: 'Plan Trimestral Solo',
    description: 'La opción más recomendada para consolidar tu cambio físico y ver resultados reales.',
    price: 90000,
    duration_months: 3,
    category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica'],
    popular: true, // ⭐ MÁS POPULAR
    visible: true,
  },
  {
    id: 'solo-3',
    name: 'Plan Semestral Solo',
    description: 'Seis meses de progreso continuo con congelamiento de membresía por 15 días.',
    price: 170000,
    duration_months: 6,
    category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional básica', 'Congelamiento por 15 días'],
    popular: false,
    visible: true,
  },
  {
    id: 'solo-4',
    name: 'Plan Anual Solo',
    description: 'Compromiso total con tu salud y rendimiento físico al mejor precio mensual.',
    price: 320000,
    duration_months: 12,
    category: 'solo',
    features: ['Clases ilimitadas', 'Acceso a musculación y cardio', 'Evaluación física mensual', 'Asesoría nutricional avanzada', '1 polera oficial Beast Training'],
    popular: false,
    visible: true,
  },
  {
    id: 'solo-5',
    name: 'Plan Pase Diario Solo',
    description: 'Pase por el día completo para entrenar cuando estés de paso o quieras probar.',
    price: 5000,
    duration_months: 1,
    category: 'solo',
    features: ['Acceso por 1 sesión', 'Uso completo de máquinas y cardio', 'Orientación de coach de turno'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },
  {
    id: 'solo-6',
    name: 'Plan Estudiante Solo',
    description: 'Tarifa especial presentando pase escolar o credencial universitaria en horario valle.',
    price: 28000,
    duration_months: 1,
    category: 'solo',
    features: ['Horario valle (10:00 a 17:00)', 'Acceso a musculación y cardio', 'Evaluación física inicial'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },

  // ── DÚO (4 activos, 2 offline, 1 popular) ──
  {
    id: 'duo-1',
    name: 'Plan Mensual Dúo',
    description: 'Acceso completo para dos personas. Entrenen juntos y motívense día a día.',
    price: 50000,
    duration_months: 1,
    category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Acceso a musculación y cardio', 'Evaluación física inicial c/u'],
    popular: false,
    visible: true,
  },
  {
    id: 'duo-2',
    name: 'Plan Trimestral Dúo',
    description: 'La opción recomendada en pareja para crear el hábito y ver resultados juntos.',
    price: 135000,
    duration_months: 3,
    category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional básica'],
    popular: true, // ⭐ MÁS POPULAR
    visible: true,
  },
  {
    id: 'duo-3',
    name: 'Plan Semestral Dúo',
    description: 'Medio año de entrenamiento en pareja con descuento preferencial y congelamiento.',
    price: 250000,
    duration_months: 6,
    category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación mensual c/u', 'Asesoría nutricional', 'Congelamiento 15 días'],
    popular: false,
    visible: true,
  },
  {
    id: 'duo-4',
    name: 'Plan Anual Dúo',
    description: 'Máximo ahorro para dos. Un año entero de entrenamiento con regalos oficiales.',
    price: 480000,
    duration_months: 12,
    category: 'duo',
    features: ['2 membresías incluidas', 'Clases ilimitadas para ambos', 'Evaluación física mensual c/u', 'Asesoría nutricional avanzada', '2 poleras oficiales Beast Training'],
    popular: false,
    visible: true,
  },
  {
    id: 'duo-5',
    name: 'Plan Pase Diario Dúo',
    description: 'Acceso por el día para 2 personas para entrenar juntos en una sesión.',
    price: 8000,
    duration_months: 1,
    category: 'duo',
    features: ['Acceso por 1 día para 2 personas', 'Uso completo de instalaciones', 'Orientación de coach'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },
  {
    id: 'duo-6',
    name: 'Plan Dúo Fin de Semana',
    description: 'Membresía especial de viernes a domingo para dos personas.',
    price: 40000,
    duration_months: 1,
    category: 'duo',
    features: ['Acceso viernes, sábado y domingo', '2 personas incluidas', 'Clases grupales de fin de semana'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },

  // ── ONLINE (4 activos, 2 offline, 1 popular) ──
  {
    id: 'online-1',
    name: 'Plan Online Mensual',
    description: 'Entrenamiento 100% personalizado desde donde estés, guiado por tu coach.',
    price: 25000,
    duration_months: 1,
    category: 'online',
    features: ['Rutina personalizada en app', 'Seguimiento semanal vía WhatsApp', 'Evaluación inicial por videollamada'],
    popular: false,
    visible: true,
  },
  {
    id: 'online-2',
    name: 'Plan Online Trimestral',
    description: 'El plan más elegido: rutinas progresivas, corrección de técnica por video y nutrición.',
    price: 65000,
    duration_months: 3,
    category: 'online',
    features: ['Rutinas actualizadas cada mes', 'Seguimiento continuo vía WhatsApp', 'Ajuste de cargas y técnica por video', 'Guía nutricional personalizada'],
    popular: true, // ⭐ MÁS POPULAR
    visible: true,
  },
  {
    id: 'online-3',
    name: 'Plan Online Semestral',
    description: 'Planificación por fases a mediano plazo para una transformación física completa.',
    price: 120000,
    duration_months: 6,
    category: 'online',
    features: ['Planificación por bloques de 6 semanas', 'Feedback técnico constante', 'Plan nutricional adaptativo', 'Videollamada mensual de revisión'],
    popular: false,
    visible: true,
  },
  {
    id: 'online-4',
    name: 'Plan Online Anual',
    description: 'Acompañamiento anual completo con tu coach en el bolsillo los 365 días del año.',
    price: 220000,
    duration_months: 12,
    category: 'online',
    features: ['Acompañamiento anual completo', 'Rutinas progresivas mes a mes', 'Asesoría de suplementación y nutrición', 'Soporte prioritario del coach'],
    popular: false,
    visible: true,
  },
  {
    id: 'online-5',
    name: 'Plan Online Express Rutina',
    description: 'Rutina prediseñada de 4 semanas en formato digital para entrenar por tu cuenta.',
    price: 15000,
    duration_months: 1,
    category: 'online',
    features: ['Rutina fija de 4 semanas', 'Videos demostrativos por ejercicio', 'Sin seguimiento semanal'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },
  {
    id: 'online-6',
    name: 'Plan Online Asesoría Nutricional',
    description: 'Pauta alimentaria según tus objetivos y requerimientos calóricos.',
    price: 18000,
    duration_months: 1,
    category: 'online',
    features: ['Pauta según tus macros y objetivo', 'Lista de compras recomendada', '1 ajuste a los 15 días'],
    popular: false,
    visible: false, // 🔕 OFFLINE
  },
];
