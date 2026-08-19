'use client';

import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Link2, ExternalLink, PlusCircle, CheckCircle2, Info, Eye, Clock, ShieldCheck, Mail } from 'lucide-react';
import { showToast } from '@/lib/toast';
import styles from '../admin.module.css';

export default function IntegrationsPanel() {
  const [connected, setConnected] = useState(false);
  const [gmailAccount, setGmailAccount] = useState('');
  const [adminGmailInput, setAdminGmailInput] = useState('btrainingchile@gmail.com');
  const [viewMode, setViewMode] = useState('WEEK'); // WEEK, MONTH, AGENDA
  const [calendarKey, setCalendarKey] = useState(0);

  // Quick Event Scheduler State
  const [eventTitle, setEventTitle] = useState('Evaluación Física - Beast Training');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');
  const [eventDuration, setEventDuration] = useState('60'); // minutes
  const [eventStudentEmail, setEventStudentEmail] = useState('');
  const [eventDescription, setEventDescription] = useState('Evaluación física, medición de pliegues corporales y ajuste de rutina personalizada en Beast Training.');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('beast_gcal_email') || 'btrainingchile@gmail.com';
      const isConnected = localStorage.getItem('beast_gcal_connected') === 'true' || !!savedEmail;
      setConnected(isConnected);
      setGmailAccount(savedEmail);
      setAdminGmailInput(savedEmail);
      // Default to AGENDA view on mobile (narrower rendering, no horizontal overflow)
      if (window.innerWidth < 768) {
        setViewMode('AGENDA');
      }
    }
  }, []);

  const handleConnect = (e) => {
    e?.preventDefault();
    const cleanEmail = adminGmailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Ingresa un correo de Google válido (ej: btrainingchile@gmail.com)', 'error');
      return;
    }

    setGmailAccount(cleanEmail);
    setConnected(true);
    localStorage.setItem('beast_gcal_connected', 'true');
    localStorage.setItem('beast_gcal_email', cleanEmail);
    setCalendarKey(prev => prev + 1);
    showToast(`Google Calendar vinculado a ${cleanEmail}`, 'success');
  };

  const handleDisconnect = () => {
    if (window.confirm('¿Deseas desconectar o cambiar la cuenta de Google Calendar?')) {
      setConnected(false);
      setGmailAccount('');
      localStorage.setItem('beast_gcal_connected', 'false');
      localStorage.removeItem('beast_gcal_email');
      showToast('Google Calendar desconectado', 'info');
    }
  };

  // Generate official Google Calendar event creation URL
  const handleCreateGoogleEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showToast('Por favor ingresa un título para el evento', 'error');
      return;
    }

    // Format dates to ISO / Google Calendar format (YYYYMMDDTHHmmSS)
    const [startHour, startMin] = (eventTime || '10:00').split(':').map(Number);
    const startDate = new Date(`${eventDate}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`);
    const endDate = new Date(startDate.getTime() + parseInt(eventDuration || '60') * 60 * 1000);

    const formatGCalDate = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    const datesParam = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;
    const locationParam = encodeURIComponent("Libertador Bernardo O'Higgins 940, Piso 4, Oficina 404, Concepción");
    const detailsParam = encodeURIComponent(eventDescription);
    const titleParam = encodeURIComponent(eventTitle);
    const addParam = eventStudentEmail ? `&add=${encodeURIComponent(eventStudentEmail.trim())}` : '';

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleParam}&dates=${datesParam}&details=${detailsParam}&location=${locationParam}${addParam}&sf=true&output=xml`;

    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
    showToast('Abriendo creador de evento en Google Calendar...', 'success');
  };

  const calendarSrc = gmailAccount
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(gmailAccount)}&ctz=America%2FSantiago&bgcolor=%230d0d0f&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&mode=${viewMode}`
    : '';

  return (
    <div className={styles.tabContent}>
      {/* Header Panel */}
      <div className={`${styles.cardPanel} glass glow-orange`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={28} style={{ color: 'var(--primary)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Google Calendar Oficial</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Visualiza y gestiona tu calendario real de Google directamente en tu panel de control.
              </p>
            </div>
          </div>

          <a
            href="https://calendar.google.com/calendar/r"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <ExternalLink size={14} />
            <span>Abrir Calendar</span>
          </a>
        </div>

        {/* Connection Setup Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          overflow: 'hidden',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: connected ? '#10b981' : '#ef4444',
              boxShadow: connected ? '0 0 10px #10b981' : '0 0 10px #ef4444',
              flexShrink: 0
            }} />
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                {connected ? 'Cuenta Conectada:' : 'Ingresa tu Cuenta de Google:'}
              </span>
              {connected && (
                <span style={{ marginLeft: '8px', color: 'var(--primary)', fontWeight: '600', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }}>
                  {gmailAccount}
                </span>
              )}
            </div>
          </div>

          {!connected ? (
            <form onSubmit={handleConnect} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="email"
                value={adminGmailInput}
                onChange={(e) => setAdminGmailInput(e.target.value)}
                placeholder="ej: btrainingchile@gmail.com"
                required
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  width: '100%',
                  flex: 1
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Link2 size={16} />
                <span>Vincular Calendario</span>
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setCalendarKey(prev => prev + 1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-light)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} />
                <span>Refrescar</span>
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cambiar Cuenta
              </button>
            </div>
          )}
        </div>

        {/* Live Google Calendar Embed */}
        {connected && (
          <div style={{ marginTop: '24px' }}>
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'WEEK', label: 'Semana' },
                  { id: 'MONTH', label: 'Mensual' },
                  { id: 'AGENDA', label: 'Agenda' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => { setViewMode(mode.id); setCalendarKey(prev => prev + 1); }}
                    style={{
                      background: viewMode === mode.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                      border: viewMode === mode.id ? '1px solid var(--border-primary)' : '1px solid var(--border-light)',
                      color: viewMode === mode.id ? '#ffffff' : 'var(--text-secondary)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Zona Horaria: America/Santiago (Chile)
              </span>
            </div>

            {/* Calendar Iframe — scrollable on mobile */}
            <div style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              background: '#0d0d0f',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Scroll wrapper: lets iframe scroll horizontally on phones without breaking the page layout */}
              <div style={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch'
              }}>
                <iframe
                  key={`${calendarKey}-${viewMode}`}
                  src={calendarSrc}
                  style={{
                    /* min-width keeps Google Calendar usable; wrapper scrolls it on narrow screens */
                    minWidth: viewMode === 'AGENDA' ? '320px' : '600px',
                    width: '100%',
                    height: 'clamp(380px, 60vh, 560px)',
                    border: 0,
                    display: 'block'
                  }}
                  title="Google Calendar Beast Training"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Scheduler Section */}
      <div className={`${styles.cardPanel} glass glow-orange`} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <PlusCircle size={22} style={{ color: 'var(--primary)' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Agendar Nueva Clase o Evaluación</h3>
        </div>
        <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Crea el evento con un clic. Google Calendar invitará automáticamente al alumno por correo y generará el recordatorio.
        </p>

        <form onSubmit={handleCreateGoogleEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Título del Evento
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="ej: Evaluación Física - Juan Pérez"
              required
              className={styles.textInput}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Correo del Alumno (Invitado Google)
            </label>
            <input
              type="email"
              value={eventStudentEmail}
              onChange={(e) => setEventStudentEmail(e.target.value)}
              placeholder="alumno@gmail.com (opcional)"
              className={styles.textInput}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Fecha
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Hora de Inicio
            </label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Duración
            </label>
            <select
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff' }}
            >
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora (Recomendado)</option>
              <option value="90">1 hora y media</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
              Notas / Descripción
            </label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(230, 74, 0, 0.4)'
              }}
            >
              <Calendar size={18} />
              <span>Crear Evento en Google Calendar 🚀</span>
            </button>
          </div>
        </form>
      </div>

      {/* Permissions / Tips Guide */}
      <div className={`${styles.cardPanel} glass`} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Info size={18} style={{ color: 'var(--primary)' }} />
          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>¿Cómo asegurar que el calendario se vea correctamente?</h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          Google Calendar requiere que el calendario de tu cuenta (ej: <strong>btrainingchile@gmail.com</strong>) tenga habilitada la visibilidad para poder incrustarse. Si ves un mensaje de autorización de Google en el recuadro, asegúrate en <a href="https://calendar.google.com/calendar/r/settings" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Configuración de Google Calendar</a> de tener marcado <em>&quot;Permisos de acceso para eventos: Compartir públicamente / Ver todos los detalles&quot;</em>.
        </p>
      </div>
    </div>
  );
}

