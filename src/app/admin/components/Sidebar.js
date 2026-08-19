'use client';

import { Users, MessageSquare, Image, FileText, Sparkles, Dumbbell, UserCheck, Calendar } from 'lucide-react';
import styles from '../admin.module.css';

const tabs = [
  { id: 'alumnos', icon: Users, label: 'Alumnos' },
  { id: 'integrations', icon: Calendar, label: 'Google Calendar' },
  { id: 'announcements', icon: MessageSquare, label: 'Anuncios' },
  { id: 'banners', icon: Image, label: 'Banners' },
  { id: 'blog', icon: FileText, label: 'Noticias' },
  { id: 'promos', icon: Sparkles, label: 'Cupones' },
  { id: 'plans', icon: Dumbbell, label: 'Planes' },
  { id: 'about', icon: UserCheck, label: 'Nosotros' },
];

export default function Sidebar({ activeTab, setActiveTab, setSuccessMsg }) {
  return (
    <>
      {/* Mobile Tab Scrollable Chips (Visible on mobile/tablet <= 768px) */}
      <div className={styles.mobileTabSelector}>
        <div className={styles.mobileTabChips}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setSuccessMsg(null); }}
                className={`${styles.mobileTabChip} ${isActive ? styles.mobileTabChipActive : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
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
