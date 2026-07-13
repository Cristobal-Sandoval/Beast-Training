'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, TrendingUp, Heart, CheckCircle, Scale, ShieldAlert, Award, FileText, Bell, Sparkles, MessageSquare, Check } from 'lucide-react';
import { showToast } from '@/lib/toast';
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
  // Appointment slot selection state
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submittingConfirm, setSubmittingConfirm] = useState(false);
  const [apptConfirmSuccess, setApptConfirmSuccess] = useState(false);

  // Dismissed Announcements state
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

  // Chart range filter state
  const [chartRange, setChartRange] = useState('all');

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
        
        // Load dismissed announcements
        const dismissed = JSON.parse(localStorage.getItem('beast_dismissed_announcements') || '[]');
        setDismissedAnnouncements(dismissed);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/');
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

  const handleConfirmSlot = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmittingConfirm(true);
    setApptConfirmSuccess(false);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          next_evaluation_date: selectedSlot,
          proposed_slots: null
        })
        .eq('id', user.id)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setProfile(data[0]);
      }
      setApptConfirmSuccess(true);
      showToast('¡Cita de evaluación confirmada!', 'success');
    } catch (err) {
      showToast('Error al confirmar cita: ' + err.message, 'error');
    } finally {
      setSubmittingConfirm(false);
    }
  };

  const handleDismissAnnouncement = (annId) => {
    const updated = [...dismissedAnnouncements, annId];
    setDismissedAnnouncements(updated);
    localStorage.setItem('beast_dismissed_announcements', JSON.stringify(updated));
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
    const slicedData = chartRange === '3' ? data.slice(-3) : data;
    
    if (slicedData.length < 2) {
      return (
        <div className={styles.noChartData}>
          <TrendingUp size={20} />
          <span>Faltan registros suficientes para graficar ({chartRange === '3' ? 'Prueba seleccionando "Todo el Historial"' : 'Carga más evaluaciones'})</span>
        </div>
      );
    }

    const width = 450;
    const height = 220;
    const padding = 35;

    // Calculate dynamic scales
    const maxVal = Math.max(...slicedData.map((d) => d[dataKey] || 0)) * 1.05;
    const minVal = Math.min(...slicedData.map((d) => d[dataKey] || 0)) * 0.95;
    const range = maxVal - minVal || 1;

    const getX = (index) => padding + (index * (width - 2 * padding)) / (slicedData.length - 1);
    const getY = (value) => height - padding - ((value - minVal) * (height - 2 * padding)) / range;

    // Build SVG Path
    let pathD = '';
    slicedData.forEach((d, i) => {
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

          {slicedData.map((d, i) => {
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
      const prefix = diff > 0 ? '+' : '';
      const isGood = isFat ? diff < 0 : diff > 0;
      return {
        diff,
        text: `${prefix}${diff}`,
        isGood
      };
    };

    return {
      weight: {
        value: `${latest.weight} kg`,
        diff: previous ? computeDiff(latest.weight, previous.weight) : null,
        text: previous ? computeDiff(latest.weight, previous.weight).text : '',
        isGood: previous ? latest.weight < previous.weight : true // losing weight usually preferred but simple fallback
      },
      bodyFat: {
        value: latest.body_fat ? `${latest.body_fat}%` : '--',
        diff: previous && latest.body_fat && previous.body_fat ? computeDiff(latest.body_fat, previous.body_fat, true) : null,
        text: previous && latest.body_fat && previous.body_fat ? computeDiff(latest.body_fat, previous.body_fat, true).text : '',
        isGood: previous && latest.body_fat && previous.body_fat ? latest.body_fat < previous.body_fat : true
      },
      muscleMass: {
        value: latest.muscle_mass ? `${latest.muscle_mass} kg` : '--',
        diff: previous && latest.muscle_mass && previous.muscle_mass ? computeDiff(latest.muscle_mass, previous.muscle_mass) : null,
        text: previous && latest.muscle_mass && previous.muscle_mass ? computeDiff(latest.muscle_mass, previous.muscle_mass).text : '',
        isGood: previous && latest.muscle_mass && previous.muscle_mass ? latest.muscle_mass > previous.muscle_mass : true
      },
      evaluationNumber: progressData.length
    };
  };

  const statComp = getStatsWithComparatives();
  const visibleAnnouncements = announcements.filter(a => !dismissedAnnouncements.includes(a.id));

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

        {/* Member status card — only for regular users */}
        {profile?.role !== 'admin' && (
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
        )}
      </section>

      {/* Comunicados Beast (Urgentes/Normales) */}
      {visibleAnnouncements.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <div className={`${styles.cardPanel} glass glow-orange`} style={{ padding: '16px 20px', marginBottom: 0 }}>
            <div className={styles.panelTitleWrapper} style={{ marginBottom: '12px' }}>
              <Bell className={styles.accent} size={20} />
              <h2 style={{ fontSize: '1.2rem', borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>Comunicados de Beast Training</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visibleAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`${styles.annCard} ${ann.priority === 'priority' ? styles.annPriority : styles.annNormal}`}
                  style={{ padding: '14px', borderRadius: '6px', margin: 0 }}
                >
                  <div className={styles.annHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>{ann.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {ann.priority === 'priority' && <span className={styles.priorityBadge}>Urgente</span>}
                      <button
                        onClick={() => handleDismissAnnouncement(ann.id)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-light)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          minHeight: 'auto',
                          fontWeight: '600'
                        }}
                        title="Ocultar comunicado"
                      >
                        Entendido
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{ann.content}</p>
                  <span className={styles.annDate} style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    {new Date(ann.created_at || ann.published_at).toLocaleDateString('es-CL')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                <div style={{ textAlign: 'center', padding: '20px 12px' }}>
                  <FileText size={36} style={{ opacity: 0.12, marginBottom: '12px' }} />
                  <p className={styles.emptyText}>No hay plan cargado aún para este mes</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '4px' }}>Acércate a tus entrenadores en tu próxima clase para que te diseñen una rutina personalizada.</p>
                </div>
              )}
            </div>
          </div>

          {/* Charts Panel */}
          <div className={`${styles.cardPanel} glass`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '8px' }}>
              <h2 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>Tu Evolución Física</h2>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setChartRange('3')}
                  style={{
                    background: chartRange === '3' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    border: '1px solid ' + (chartRange === '3' ? 'var(--primary)' : 'var(--border-light)'),
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minHeight: 'auto'
                  }}
                >
                  Últimos 3
                </button>
                <button
                  onClick={() => setChartRange('all')}
                  style={{
                    background: chartRange === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    border: '1px solid ' + (chartRange === 'all' ? 'var(--primary)' : 'var(--border-light)'),
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minHeight: 'auto'
                  }}
                >
                  Historial
                </button>
              </div>
            </div>

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
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <MessageSquare size={36} style={{ opacity: 0.15, marginBottom: '12px' }} />
                  <p className={styles.emptyText} style={{ marginBottom: '6px' }}>No hay mensajes aún</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Escribe tu primera consulta al Coach. Te responderá en breve.</p>
                </div>
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

          {/* Appointment request panel (Slots model) */}
          <div className={`${styles.cardPanel} glass`}>
            <div className={styles.panelTitleWrapper}>
              <Calendar className={styles.accent} size={20} />
              <h2>Próxima Evaluación</h2>
            </div>

            {profile?.next_evaluation_date ? (
              <div className={styles.apptAlertPending} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '16px', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>Tu próxima evaluación física está programada para el:</p>
                <div style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 'bold', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} /> {profile.next_evaluation_date}
                </div>
                <p className={styles.apptDetails} style={{ marginTop: '12px', fontSize: '0.85rem', opacity: 0.8 }}>Si necesitas cambiar la fecha, comunícate directamente con tu entrenador.</p>
              </div>
            ) : profile?.proposed_slots ? (
              <div>
                <p className={styles.panelSubtitle}>Tu entrenador ha propuesto las siguientes fechas y horas para tu medición mensual. Selecciona la opción que más te acomode:</p>
                
                <form onSubmit={handleConfirmSlot} className={styles.apptForm}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    {profile.proposed_slots.split(',').map((slot, index) => {
                      const trimmedSlot = slot.trim();
                      if (!trimmedSlot) return null;
                      return (
                        <label 
                          key={index} 
                          style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            background: selectedSlot === trimmedSlot ? 'rgba(255, 87, 0, 0.08)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid ' + (selectedSlot === trimmedSlot ? 'var(--primary)' : 'var(--border-light)'),
                            padding: '12px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#ffffff',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="radio"
                            name="proposedSlot"
                            value={trimmedSlot}
                            checked={selectedSlot === trimmedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                          />
                          <span>{trimmedSlot}</span>
                        </label>
                      );
                    })}
                  </div>
                  
                  {apptConfirmSuccess && <p className={styles.successFormText} style={{ marginTop: '8px', color: 'var(--success)' }}>¡Cita confirmada y programada con éxito!</p>}
                  
                  <button 
                    type="submit" 
                    disabled={submittingConfirm || !selectedSlot} 
                    className={styles.apptBtn} 
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    {submittingConfirm ? 'Confirmando...' : 'Confirmar Fecha de Cita'}
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.apptAlertPending} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>No tienes evaluaciones programadas ni propuestas por el staff para este mes.</p>
                <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Tus preparadores configurarán tus opciones pronto.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DashboardClient() {
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
