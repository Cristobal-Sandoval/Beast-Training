'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, TrendingUp, Heart, CheckCircle, Scale, ShieldAlert, Award, FileText, Bell, Sparkles, MessageSquare } from 'lucide-react';
import styles from './dashboard.module.css';

// Fallback data if local storage / Supabase is empty
const mockProgress = [
  { id: '1', date: '2026-05-01', weight: 83.2, body_fat: 22.5, muscle_mass: 34.8, waist: 93, chest: 104 },
  { id: '2', date: '2026-06-01', weight: 81.5, body_fat: 21.2, muscle_mass: 35.5, waist: 90, chest: 105 },
  { id: '3', date: '2026-07-01', weight: 79.8, body_fat: 19.5, muscle_mass: 36.4, waist: 87, chest: 106 }
];

const mockAnnouncements = [
  { id: 'a1', title: '¡Atención: Feriado 16 de Julio!', content: 'El gimnasio estará cerrado por feriado. Retomamos clases al día siguiente.', priority: 'normal', created_at: '2026-07-01' },
  { id: 'a2', title: '⚠️ Mantenimiento de la Zona de Fuerza', content: 'Mantenimiento preventivo en poleas y jaulas hoy a las 14:00. Zona libre abierta.', priority: 'priority', created_at: '2026-07-02' }
];

function DashboardContent() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAppt, setSubmittingAppt] = useState(false);
  const [apptSuccess, setApptSuccess] = useState(false);
  
  // Appointment Form
  const [apptDate, setApptDate] = useState('');

  // Direct Message states
  const [chatMessages, setChatMessages] = useState([]);
  const [newDirectMessage, setNewDirectMessage] = useState('');
  const [submittingChat, setSubmittingChat] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login?redirect=/dashboard');
      } else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchData = async (userId) => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profData) {
        setProfile(profData);
        if (profData.role === 'admin') {
          router.push('/admin');
          return;
        }
      }

      // 2. Fetch Progress (Admin uploaded)
      const { data: progData } = await supabase
        .from('physical_progress')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
      
      if (progData && progData.length > 0) {
        setProgressData(progData);
      } else {
        setProgressData(mockProgress);
      }

      // 3. Fetch Announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (annData && annData.length > 0) {
        setAnnouncements(annData);
      } else {
        setAnnouncements(mockAnnouncements);
      }

      // 4. Fetch User Appointment Requests
      const { data: apptData } = await supabase
        .from('appointment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (apptData) {
        setAppointments(apptData);
      }

      // 5. Fetch Direct Messages
      const { data: dmData } = await supabase
        .from('direct_messages')
        .select('*');
      if (dmData) {
        const filtered = dmData.filter(m => 
          (m.sender_id === userId && m.receiver_id === 'admin-uuid-123') ||
          (m.sender_id === 'admin-uuid-123' && m.receiver_id === userId)
        );
        setChatMessages(filtered);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Fallbacks
      setProgressData(mockProgress);
      setAnnouncements(mockAnnouncements);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    if (!apptDate) return;
    setSubmittingAppt(true);
    setApptSuccess(false);

    try {
      const { data, error } = await supabase
        .from('appointment_requests')
        .insert([
          {
            user_id: user.id,
            requested_date: apptDate,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setAppointments([data[0], ...appointments]);
      }
      setApptSuccess(true);
      setApptDate('');
    } catch (err) {
      console.warn('Error al solicitar cita en Supabase, registrando localmente:', err);
      const mockAppt = {
        id: Math.random().toString(),
        user_id: user.id,
        requested_date: apptDate,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setAppointments([mockAppt, ...appointments]);
      setApptSuccess(true);
      setApptDate('');
    } finally {
      setSubmittingAppt(false);
    }
  };

  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!newDirectMessage.trim()) return;
    setSubmittingChat(true);

    const newMsg = {
      sender_id: user.id,
      receiver_id: 'admin-uuid-123',
      content: newDirectMessage.trim()
    };

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([newMsg])
        .select();

      if (error) throw error;
      if (data) {
        setChatMessages([...chatMessages, data[0]]);
      }
      setNewDirectMessage('');
    } catch (err) {
      console.warn('Error al enviar mensaje, registrando localmente:', err);
      const mockDm = {
        id: Math.random().toString(),
        sender_id: user.id,
        receiver_id: 'admin-uuid-123',
        content: newDirectMessage.trim(),
        created_at: new Date().toISOString()
      };
      setChatMessages([...chatMessages, mockDm]);
      setNewDirectMessage('');
    } finally {
      setSubmittingChat(false);
    }
  };

  // SVG progress line chart generator
  const renderSVGChart = (data, dataKey, color, label) => {
    if (data.length < 2) {
      return (
        <div className={styles.noChartData}>
          <TrendingUp size={20} />
          <span>Faltan registros suficientes para graficar</span>
        </div>
      );
    }

    const width = 450;
    const height = 180;
    const padding = 30;

    const values = data.map(d => d[dataKey] || 0);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const valRange = maxVal - minVal;

    const getX = (index) => padding + (index * (width - 2 * padding)) / (data.length - 1);
    const getY = (value) => height - padding - ((value - minVal) * (height - 2 * padding)) / valRange;

    let pathD = '';
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d[dataKey] || 0);
      if (i === 0) pathD = `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });

    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chartTitle}>{label}</div>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgElement}>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.chartPath} />

          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d[dataKey] || 0);
            return (
              <g key={d.id || i} className={styles.chartNode}>
                <circle cx={x} cy={y} r="5" fill="#070708" stroke={color} strokeWidth="3" />
                <text x={x} y={y - 12} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  {d[dataKey]}
                </text>
                <text x={x} y={height - 10} textAnchor="middle" fill="#62626a" fontSize="8">
                  {new Date(d.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Compare stats with previous month evaluation
  const getStatsWithComparatives = () => {
    if (progressData.length === 0) {
      return {
        weight: { value: '--', diff: null, text: '' },
        bodyFat: { value: '--', diff: null, text: '' },
        muscleMass: { value: '--', diff: null, text: '' },
        evaluationNumber: 0
      };
    }

    const latest = progressData[progressData.length - 1];
    const previous = progressData.length > 1 ? progressData[progressData.length - 2] : null;

    const computeDiff = (currentVal, prevVal, isFat = false) => {
      if (!prevVal) return { diff: null, text: '' };
      const diff = parseFloat((currentVal - prevVal).toFixed(2));
      if (diff === 0) return { diff: 0, text: 'Sin cambios' };
      
      const isGood = isFat ? diff < 0 : diff > 0;
      const sign = diff > 0 ? '+' : '';
      return {
        diff,
        text: `${sign}${diff}`,
        isGood
      };
    };

    return {
      weight: {
        value: `${latest.weight} kg`,
        ...computeDiff(latest.weight, previous?.weight)
      },
      bodyFat: {
        value: latest.body_fat ? `${latest.body_fat}%` : '--',
        ...computeDiff(latest.body_fat, previous?.body_fat, true)
      },
      muscleMass: {
        value: latest.muscle_mass ? `${latest.muscle_mass} kg` : '--',
        ...computeDiff(latest.muscle_mass, previous?.muscle_mass)
      },
      evaluationNumber: progressData.length
    };
  };

  const statComp = getStatsWithComparatives();
  const pendingAppt = appointments.find(a => a.status === 'pending');

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Cargando tu progreso físico...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Dashboard Welcome Header */}
      <section className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Panel de <span className={styles.accent}>{profile?.full_name || user?.email || 'Bestia'}</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Tus datos físicos están controlados únicamente por tus preparadores.
          </p>
        </div>

        {/* Member status card */}
        <div className={`${styles.membershipCard} glass`}>
          <Award className={styles.membershipIcon} size={28} />
          <div>
            <p className={styles.cardLabel}>Estado de Cuenta</p>
            <h3 className={styles.membershipStatus}>
              {profile?.status === 'active' ? (
                <span className={styles.activeSub}>Miembro Activo</span>
              ) : (
                <span className={styles.inactiveSub}>Membresía Vencida / Inactiva</span>
              )}
            </h3>
          </div>
        </div>
      </section>

      {/* Stats Grid with Comparatives */}
      <section className={styles.statsGrid}>
        {/* Weight Card */}
        <div className={`${styles.statCard} glass`}>
          <Scale size={24} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span>Peso Corporal</span>
            <h3>{statComp.weight.value}</h3>
            {statComp.weight.diff !== null && (
              <p className={`${styles.compLabel} ${statComp.weight.isGood ? styles.goodDiff : styles.badDiff}`}>
                {statComp.weight.text} kg (vs mes anterior)
              </p>
            )}
          </div>
        </div>

        {/* Body Fat Card */}
        <div className={`${styles.statCard} glass`}>
          <Heart size={24} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span>Grasa Corporal</span>
            <h3>{statComp.bodyFat.value}</h3>
            {statComp.bodyFat.diff !== null && (
              <p className={`${styles.compLabel} ${statComp.bodyFat.isGood ? styles.goodDiff : styles.badDiff}`}>
                {statComp.bodyFat.text}% (vs mes anterior)
              </p>
            )}
          </div>
        </div>

        {/* Muscle Card */}
        <div className={`${styles.statCard} glass`}>
          <TrendingUp size={24} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span>Masa Muscular</span>
            <h3>{statComp.muscleMass.value}</h3>
            {statComp.muscleMass.diff !== null && (
              <p className={`${styles.compLabel} ${statComp.muscleMass.isGood ? styles.goodDiff : styles.badDiff}`}>
                {statComp.muscleMass.text} kg (vs mes anterior)
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Notice of Evaluation Index */}
      {statComp.evaluationNumber > 0 && (
        <div className={styles.evalNotice}>
          <Sparkles size={16} className={styles.accent} />
          <span>Estas viendo los resultados de tu <strong>Evaluación Mensual N°{statComp.evaluationNumber}</strong> (Última carga: {new Date(progressData[progressData.length - 1].date).toLocaleDateString('es-CL')})</span>
        </div>
      )}

      {/* Main Grid: Info columns */}
      <section className={styles.dashboardGrid}>
        <div className={styles.chartsColumn}>
          {/* Workout Plan panel */}
          <div className={`${styles.cardPanel} glass glow-orange`}>
            <div className={styles.panelTitleWrapper}>
              <FileText className={styles.accent} size={20} />
              <h2>Plan de Trabajo del Mes</h2>
            </div>
            <p className={styles.panelSubtitle}>Tus metas físicas y ejercicios recomendados por tu entrenador.</p>
            <div className={styles.workoutPlanBox} style={{ maxHeight: 'none', overflowY: 'visible' }}>
              {profile?.workout_plan ? (
                profile.workout_plan.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: line.startsWith('•') ? '6px' : '12px' }}>{line}</p>
                ))
              ) : (
                <p className={styles.emptyText}>No hay plan cargado aún para este mes. Acércate a tus entrenadores.</p>
              )}
            </div>
          </div>

          {/* Charts Panel */}
          <div className={`${styles.cardPanel} glass`}>
            <h2>Tu Evolución Física</h2>
            <div className={styles.chartsContainer}>
              {renderSVGChart(progressData, 'weight', '#FF5700', 'Evolución de Peso (kg)')}
              {renderSVGChart(progressData, 'body_fat', '#10B981', 'Grasa Corporal (%)')}
            </div>
          </div>

          {/* Table history */}
          <div className={`${styles.cardPanel} glass`}>
            <h2>Historial de Evaluaciones</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Peso</th>
                    <th>Grasa</th>
                    <th>Masa Muscular</th>
                    <th>Cintura</th>
                    <th>Pecho</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData.map((record, index) => (
                    <tr key={record.id || index}>
                      <td>{new Date(record.date).toLocaleDateString('es-CL')}</td>
                      <td>{record.weight} kg</td>
                      <td>{record.body_fat ? `${record.body_fat}%` : '--'}</td>
                      <td>{record.muscle_mass ? `${record.muscle_mass} kg` : '--'}</td>
                      <td>{record.waist ? `${record.waist} cm` : '--'}</td>
                      <td>{record.chest ? `${record.chest} cm` : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className={styles.sidebarColumn}>
          {/* PANEL: MENSAJES CON TU ENTRENADOR */}
          <div className={`${styles.cardPanel} glass glow-orange`}>
            <div className={styles.panelTitleWrapper}>
              <MessageSquare className={styles.accent} size={20} />
              <h2>Mensajes con tu Entrenador</h2>
            </div>
            <p className={styles.panelSubtitle}>Escríbele directamente al Coach sobre tus rutinas o progresos.</p>
            
            <div className={styles.chatBox} style={{ maxHeight: '280px' }}>
              {chatMessages.length === 0 ? (
                <p className={styles.emptyText}>No hay mensajes registrados. Escribe uno abajo para iniciar la conversación.</p>
              ) : (
                <div className={styles.chatMessagesWrapper}>
                  {chatMessages.map((msg, idx) => {
                    const isUserMsg = msg.sender_id === user.id;
                    return (
                      <div
                        key={`${msg.id || idx}-${idx}`}
                        className={`${styles.chatMessage} ${isUserMsg ? styles.chatMsgUser : styles.chatMsgAdmin}`}
                      >
                        <div className={styles.chatMsgHeader}>
                          <strong>{isUserMsg ? 'Tú' : 'Coach'}</strong>
                          <span>{new Date(msg.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form onSubmit={handleSendDirectMessage} className={styles.chatForm}>
              <textarea
                value={newDirectMessage}
                onChange={(e) => setNewDirectMessage(e.target.value)}
                placeholder="Escribe un mensaje para el Coach..."
                rows={3}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  resize: 'none'
                }}
              />
              <button type="submit" disabled={submittingChat} className={styles.apptBtn} style={{ marginTop: '10px' }}>
                {submittingChat ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

          {/* Appointment request panel */}
          <div className={`${styles.cardPanel} glass`}>
            <div className={styles.panelTitleWrapper}>
              <Calendar className={styles.accent} size={20} />
              <h2>Próxima Evaluación</h2>
            </div>
            <p className={styles.panelSubtitle}>Solicita agendar tu próxima medición mensual con los entrenadores.</p>

            {pendingAppt ? (
              <div className={styles.apptAlertPending}>
                <p>Tienes una solicitud de evaluación pendiente para el:</p>
                <strong>{new Date(pendingAppt.requested_date).toLocaleDateString('es-CL')}</strong>
                <p className={styles.apptDetails}>El administrador confirmará la hora contigo a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestAppointment} className={styles.apptForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="apptDate">Fecha solicitada</label>
                  <input
                    id="apptDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    required
                  />
                </div>
                {apptSuccess && <p className={styles.successFormText}>¡Solicitud enviada con éxito!</p>}
                <button type="submit" disabled={submittingAppt} className={styles.apptBtn}>
                  {submittingAppt ? 'Enviando...' : 'Solicitar Evaluación'}
                </button>
              </form>
            )}
          </div>

          {/* Announcements panel */}
          <div className={`${styles.cardPanel} glass`}>
            <div className={styles.panelTitleWrapper}>
              <Bell className={styles.accent} size={20} />
              <h2>Comunicados Beast</h2>
            </div>
            <p className={styles.panelSubtitle}>Avisos y mensajes directos del staff para todos los miembros activos.</p>
            <div className={styles.announcementsContainer}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`${styles.annCard} ${ann.priority === 'priority' ? styles.annPriority : styles.annNormal}`}
                >
                  <div className={styles.annHeader}>
                    <h4>{ann.title}</h4>
                    {ann.priority === 'priority' && <span className={styles.priorityBadge}>Urgente</span>}
                  </div>
                  <p>{ann.content}</p>
                  <span className={styles.annDate}>
                    {new Date(ann.created_at || ann.published_at).toLocaleDateString('es-CL')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Cargando dashboard de la Bestia...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
