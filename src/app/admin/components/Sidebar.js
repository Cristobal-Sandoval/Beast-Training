'use client';

import { Users, MessageSquare, Image, FileText, Sparkles, Dumbbell, UserCheck, Calendar } from 'lucide-react';
import styles from '../admin.module.css';

const tabs = [
  { id: 'alumnos', icon: Users, label: 'Gestión de Alumnos' },
  { id: 'announcements', icon: MessageSquare, label: 'Anuncios Masivos' },
  { id: 'banners', icon: Image, label: 'Banners de Inicio' },
  { id: 'blog', icon: FileText, label: 'Noticias (Blog)' },
  { id: 'promos', icon: Sparkles, label: 'Promociones & Cupones' },
  { id: 'plans', icon: Dumbbell, label: 'Planes de Gimnasio' },
  { id: 'about', icon: UserCheck, label: 'Nosotros (Coach)' },
  { id: 'integrations', icon: Calendar, label: 'Google Calendar' },
];

export default function Sidebar({ activeTab, setActiveTab, setSuccessMsg }) {
  return (
    <>
      {/* Mobile Tab Selector (Visible only on mobile/tablet <= 768px) */}
      <div className={styles.mobileTabSelector}>
        <label htmlFor="mobileTabSelect" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Sección del Panel Admin
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="mobileTabSelect"
            value={activeTab}
            onChange={(e) => { setActiveTab(e.target.value); setSuccessMsg(null); }}
            className={styles.selectInput}
            style={{ paddingRight: '40px', fontWeight: '600' }}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>▼</span>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Sidebar (Hidden on mobile <= 768px) */}
      <aside className={styles.sidebarDesktop}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setSuccessMsg(null); }}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>
    </>
  );
}
