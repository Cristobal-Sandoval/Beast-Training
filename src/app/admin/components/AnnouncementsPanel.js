'use client';

import { Mail, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

export default function AnnouncementsPanel({
  annTitle, setAnnTitle, annPriority, setAnnPriority, annContent, setAnnContent,
  announcements, actionLoading, handleBroadcastAnnouncement, handleDeleteAnnouncement
}) {
  return (
    <div className={styles.tabContent}>
      <div className={`${styles.cardPanel} glass`}>
        <div className={styles.panelTitleWrapper}>
          <Mail size={20} className={styles.accent} />
          <h2>Enviar Comunicado Masivo</h2>
        </div>
        <p className={styles.panelInstructions}>Envía avisos a la bandeja de los paneles de alumnos y simula despachos a sus correos.</p>
        <form onSubmit={handleBroadcastAnnouncement} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="annTitle">Título del comunicado</label>
            <input id="annTitle" type="text" placeholder="Ej: Cambio de Horario Festivo" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="annPriority">Prioridad del Mensaje</label>
              <select id="annPriority" value={annPriority} onChange={(e) => setAnnPriority(e.target.value)} className={styles.selectInput}>
                <option value="normal">Normal (Mensaje Gris)</option>
                <option value="priority">Urgente / Prioritario (Mensaje Rojo)</option>
              </select>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="annContent">Cuerpo del Mensaje</label>
            <textarea id="annContent" placeholder="Escribe el comunicado para los alumnos..." value={annContent} onChange={(e) => setAnnContent(e.target.value)} rows={4} required />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={actionLoading}>
            {actionLoading ? 'Publicando...' : 'Publicar y Notificar Alumnos'}
          </button>
        </form>
      </div>

      <div className={`${styles.cardPanel} glass`}>
        <h2>Mensajes Emitidos</h2>
        {announcements.length === 0 ? (
          <p className={styles.emptyText}>No hay comunicados registrados.</p>
        ) : (
          <div className={styles.listGrid}>
            {announcements.map((ann) => (
              <div key={ann.id} className={styles.listItemCard}>
                <div className={styles.itemInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>{ann.title}</h3>
                    <span className={ann.priority === 'priority' ? styles.prioBadgeRed : styles.prioBadgeGray}>
                      {ann.priority === 'priority' ? 'Prioritario' : 'Normal'}
                    </span>
                  </div>
                  <p>{ann.content}</p>
                  <span className={styles.itemBadge}>Publicado: {new Date(ann.created_at || ann.published_at).toLocaleDateString('es-CL')}</span>
                </div>
                <button type="button" onClick={() => handleDeleteAnnouncement(ann.id)} className={styles.deleteBtn} title="Eliminar Mensaje">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
