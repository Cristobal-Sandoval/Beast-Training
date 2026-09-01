'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Star, Eye, EyeOff, ShieldCheck, Sparkles, Check } from 'lucide-react';
import styles from '../admin.module.css';
import { MAX_PLANS_PER_CATEGORY } from '../hooks/usePlansState';

const formatCLP = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

const CATEGORIES = [
  { id: 'solo',   label: 'Solo',   emoji: '🧍', subtitle: 'Entrenamiento individual' },
  { id: 'duo',    label: 'Dúo',    emoji: '👥', subtitle: 'Entrenamiento en pareja' },
  { id: 'online', label: 'Online', emoji: '💻', subtitle: 'Entrenamiento a distancia' },
];

export default function PlansPanel({
  plansList, showPlanModal, editingPlan,
  planName, setPlanName, planCategory, setPlanCategory,
  planPrice, setPlanPrice, planDuration, setPlanDuration,
  planDesc, setPlanDesc, planFeatures, setPlanFeatures,
  planPopular, setPlanPopular, actionLoading,
  handleAddPlanClick, handleEditPlanClick, handleDeletePlan,
  handleSavePlan, handleTogglePopular, handleToggleVisible, setShowPlanModal,
}) {
  const [activeTabCat, setActiveTabCat] = useState('all'); // 'all' | 'solo' | 'duo' | 'online'

  const countCategory = (catId) => plansList.filter(p => p.category === catId).length;
  const countActiveCategory = (catId) => plansList.filter(p => p.category === catId && p.visible).length;
  const countOfflineCategory = (catId) => plansList.filter(p => p.category === catId && !p.visible).length;

  const categoriesData = CATEGORIES.map(cat => {
    const all = plansList.filter(p => p.category === cat.id);
    const active = all.filter(p => p.visible);
    const offline = all.filter(p => !p.visible);
    const popularPlan = all.find(p => p.popular);
    return {
      ...cat,
      all,
      active,
      offline,
      popularPlan,
      count: all.length,
      isFull: all.length >= MAX_PLANS_PER_CATEGORY,
    };
  });

  const displayedCategories = activeTabCat === 'all'
    ? categoriesData
    : categoriesData.filter(c => c.id === activeTabCat);

  return (
    <div className={styles.tabContent}>
      
      {/* ── Banner informativo minimalista ── */}
      <div style={{
        background: 'rgba(255, 87, 0, 0.05)',
        border: '1px solid rgba(255, 87, 0, 0.2)',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Gestión de Membresías & Planes
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Máximo <strong>6 planes por categoría</strong>. En la web se muestran solo los <strong>online/activos</strong> con el <strong>⭐ Más Popular</strong> resaltado.
          </p>
        </div>

        {/* Global category chips filter for mobile */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '2px',
          gap: '2px',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          <button
            type="button"
            onClick={() => setActiveTabCat('all')}
            style={{
              background: activeTabCat === 'all' ? 'var(--primary)' : 'transparent',
              border: 'none',
              color: activeTabCat === 'all' ? '#fff' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Todos ({plansList.length})
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveTabCat(c.id)}
              style={{
                background: activeTabCat === c.id ? 'var(--primary)' : 'transparent',
                border: 'none',
                color: activeTabCat === c.id ? '#fff' : 'var(--text-muted)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c.emoji} {c.label} ({countCategory(c.id)}/6)
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Sections ── */}
      {displayedCategories.map(cat => (
        <div key={cat.id} style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '18px 16px',
          marginBottom: '24px',
        }}>
          
          {/* Header de Categoría */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '14px',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>{cat.emoji}</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {cat.label}
                </h3>
                
                {/* Badge de cantidad */}
                <span style={{
                  background: cat.isFull ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 87, 0, 0.12)',
                  border: cat.isFull ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 87, 0, 0.3)',
                  color: cat.isFull ? '#ef4444' : 'var(--primary)',
                  borderRadius: '20px',
                  padding: '2px 9px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}>
                  {cat.count}/{MAX_PLANS_PER_CATEGORY} planes
                </span>
              </div>

              {/* Subtítulo con desglose activo/offline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.78rem' }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  ● {cat.active.length} activos en web
                </span>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  ○ {cat.offline.length} offline
                </span>
                {cat.popularPlan && (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                      ⭐ {cat.popularPlan.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Botón Agregar o Límite Alcanzado */}
            {cat.isFull ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🚫 Límite (6/6 planes) alcanzado
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleAddPlanClick(cat.id)}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 10px rgba(255, 87, 0, 0.25)'
                }}
              >
                <Plus size={15} /> Agregar Plan {cat.label} ({cat.count}/6)
              </button>
            )}
          </div>

          {/* Lista de planes de esta categoría */}
          {cat.all.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No hay planes creados en la categoría {cat.label}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.all.map((plan) => (
                <PlanCardAdmin
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlanClick}
                  onDelete={handleDeletePlan}
                  onToggleStar={handleTogglePopular}
                  onToggleVisible={handleToggleVisible}
                />
              ))}
            </div>
          )}

        </div>
      ))}

      {/* ── Modal de Creación / Edición ── */}
      {showPlanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{editingPlan ? 'Editar Plan de Entrenamiento' : 'Crear Nuevo Plan'}</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Máximo {MAX_PLANS_PER_CATEGORY} planes por categoría.
                </p>
              </div>
              <button type="button" onClick={() => setShowPlanModal(false)} className={styles.modalCloseBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planName">Nombre del Plan</label>
                  <input
                    id="planName"
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    required
                    placeholder="Ej: Plan Trimestral Solo"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planCategory">Categoría</label>
                  <select
                    id="planCategory"
                    value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value)}
                    className={styles.selectInput}
                  >
                    {CATEGORIES.map(c => {
                      const count = countCategory(c.id);
                      const isFull = count >= MAX_PLANS_PER_CATEGORY && (!editingPlan || editingPlan.category !== c.id);
                      return (
                        <option key={c.id} value={c.id} disabled={isFull}>
                          {c.emoji} {c.label} {isFull ? `(6/6 LLENO - no disponible)` : `(${count}/6 planes)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planPrice">Precio (CLP)</label>
                  <input
                    id="planPrice"
                    type="number"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    required
                    placeholder="Ej: 90000"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planDuration">Duración (meses)</label>
                  <input
                    id="planDuration"
                    type="number"
                    min="1"
                    max="24"
                    value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="planDesc">Descripción Corta</label>
                <textarea
                  id="planDesc"
                  rows={2}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Ej: La opción más recomendada para ver cambios reales."
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="planFeatures">Características (una por línea, sin casilleros/duchas)</label>
                <textarea
                  id="planFeatures"
                  rows={4}
                  value={planFeatures}
                  onChange={(e) => setPlanFeatures(e.target.value)}
                  placeholder={'Clases ilimitadas\nAcceso a musculación y cardio\nEvaluación física mensual'}
                />
              </div>

              {/* Botón Destacado / Más Popular */}
              <button
                type="button"
                onClick={() => setPlanPopular(!planPopular)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: planPopular ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: planPopular ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid var(--border-light)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: planPopular ? '#fbbf24' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  marginTop: '6px'
                }}
              >
                <Star size={18} fill={planPopular ? '#fbbf24' : 'none'} color={planPopular ? '#fbbf24' : 'currentColor'} />
                {planPopular ? '⭐ MÁS POPULAR (Saldrá primero en mobile y al medio en desktop)' : 'Marcar como el Más Popular de esta categoría'}
              </button>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={actionLoading}
                style={{ marginTop: '16px' }}
              >
                {actionLoading ? 'Guardando...' : editingPlan ? 'Guardar Cambios del Plan' : 'Crear Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Card individual de plan para admin ── */
function PlanCardAdmin({ plan, onEdit, onDelete, onToggleStar, onToggleVisible }) {
  const isOnline = plan.visible;
  const isPopular = plan.popular;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      background: isPopular
        ? 'rgba(251, 191, 36, 0.05)'
        : isOnline
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(255, 255, 255, 0.01)',
      border: isPopular
        ? '1px solid rgba(251, 191, 36, 0.35)'
        : isOnline
          ? '1px solid rgba(74, 222, 128, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      padding: '12px 14px',
      transition: 'all 0.2s ease',
      boxShadow: isPopular ? '0 4px 16px rgba(251, 191, 36, 0.08)' : 'none',
    }}>
      
      {/* Información del plan */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px', minWidth: 0 }}>
        {/* Dot de estado */}
        <span
          title={isOnline ? 'Online (Visible en web)' : 'Offline (Oculto)'}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isOnline ? '#4ade80' : 'rgba(255, 255, 255, 0.2)',
            boxShadow: isOnline ? '0 0 8px rgba(74, 222, 128, 0.7)' : 'none',
            flexShrink: 0,
          }}
        />

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{
              margin: 0,
              fontSize: '0.92rem',
              fontWeight: 700,
              color: isOnline ? '#fff' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {plan.name}
            </h4>

            {/* Badges */}
            {isPopular && (
              <span style={{
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#fbbf24',
                borderRadius: '50px',
                padding: '1px 8px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
              }}>
                ⭐ MÁS POPULAR
              </span>
            )}

            <span style={{
              background: isOnline ? 'rgba(74, 222, 128, 0.12)' : 'rgba(255, 255, 255, 0.06)',
              color: isOnline ? '#4ade80' : 'var(--text-muted)',
              borderRadius: '50px',
              padding: '1px 7px',
              fontSize: '0.68rem',
              fontWeight: 700,
            }}>
              {isOnline ? 'ONLINE EN WEB' : 'OFFLINE'}
            </span>
          </div>

          <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--primary)' }}>{formatCLP(plan.price)}</strong>
            {' · '}{plan.duration_months} mes{plan.duration_months > 1 ? 'es' : ''}
            {plan.description && ` · ${plan.description}`}
          </p>
        </div>
      </div>

      {/* Botones de acción minimalistas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        
        {/* Toggle ⭐ Estrella (Más Popular) */}
        <button
          type="button"
          onClick={() => onToggleStar(plan)}
          title={isPopular ? 'Plan Más Popular actual' : 'Hacer este el Más Popular'}
          style={{
            background: isPopular ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            border: isPopular ? '1px solid #fbbf24' : '1px solid var(--border-light)',
            color: isPopular ? '#fbbf24' : 'var(--text-muted)',
            borderRadius: '8px',
            padding: '7px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            transition: 'all 0.15s',
          }}
        >
          <Star size={14} fill={isPopular ? '#fbbf24' : 'none'} />
          <span style={{ display: isPopular ? 'inline' : 'none' }}>Popular</span>
        </button>

        {/* Toggle 👁 Ojo (Online / Offline) */}
        <button
          type="button"
          onClick={() => onToggleVisible(plan)}
          title={isOnline ? 'Desactivar (dejar Offline)' : 'Activar (mostrar Online en la web)'}
          style={{
            background: isOnline ? 'rgba(74, 222, 128, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: isOnline ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid var(--border-light)',
            color: isOnline ? '#4ade80' : 'var(--text-muted)',
            borderRadius: '8px',
            padding: '7px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            transition: 'all 0.15s',
          }}
        >
          {isOnline ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        {/* Editar */}
        <button
          type="button"
          onClick={() => onEdit(plan)}
          title="Editar plan"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s',
          }}
        >
          <Edit size={14} />
        </button>

        {/* Eliminar */}
        <button
          type="button"
          onClick={() => onDelete(plan.id)}
          title="Eliminar plan"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            borderRadius: '8px',
            padding: '7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s',
          }}
        >
          <Trash2 size={14} />
        </button>

      </div>
    </div>
  );
}
