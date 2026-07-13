'use client';

import { Users, MessageSquare, Image, FileText, Sparkles, Dumbbell, UserCheck } from 'lucide-react';
import styles from '../admin.module.css';

const tabs = [
  { id: 'alumnos', icon: Users, label: 'Gestión de Alumnos' },
  { id: 'announcements', icon: MessageSquare, label: 'Anuncios Masivos' },
  { id: 'banners', icon: Image, label: 'Banners de Inicio' },
  { id: 'blog', icon: FileText, label: 'Noticias (Blog)' },
  { id: 'promos', icon: Sparkles, label: 'Promociones & Cupones' },
  { id: 'plans', icon: Dumbbell, label: 'Planes de Gimnasio' },
  { id: 'about', icon: UserCheck, label: 'Nosotros (Coach)' },
];

export default function Sidebar({ activeTab, setActiveTab, setSuccessMsg }) {
  return (
    <aside className={styles.sidebar}>
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
  );
}
