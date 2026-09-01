'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Star, List, LayoutGrid } from 'lucide-react';
import styles from '../admin.module.css';

const formatCLP = (price) => {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
};

const CATEGORIES = [
  { id: 'solo',   label: 'Solo',   emoji: '🧍' },
  { id: 'duo',    label: 'Dúo',    emoji: '👥' },
  { id: 'online', label: 'Online', emoji: '💻' },
];

const MAX_PLANS = 6;

export default function PlansPanel({
  plansList, showPlanModal, editingPlan,
  planName, setPlanName, planCategory, setPlanCategory,
  planPrice, setPlanPrice, planDuration, setPlanDuration,
  planDesc, setPlanDesc, planFeatures, setPlanFeatures,
  planPopular, setPlanPopular, actionLoading,
  handleAddPlanClick, handleEditPlanClick, handleDeletePlan,
  handleSavePlan, handleTogglePopular, setShowPlanModal,
}) {
  const [view, setView] = useState('create'); // 'create' | 'active'

  const countByCategory = (cat) => plansList.filter(p => p.category === cat).length;

  const plansByCategory = CATEGORIES.map(cat => ({
    ...cat,
    plans: plansList
      .filter(p => p.category === cat.id)
      .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.price - b.price),
  }));

  return (
    <div className={styles.tabContent}>

      {/* ── Top action bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px', marginBottom: '20px', flexWrap: 'wrap'
      }}>
        {/* View toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-light)', borderRadius: '10px',
          padding: '3px', gap: '3px'
        }}>
          <button
            type="button"
            onClick={() => setView('create')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: view === 'create' ? 'var(--primary)' : 'transparent',
              border: 'none', color: view === 'create' ? '#fff' : 'var(--text-secondary)',
              borderRadius: '8px', padding: '8px 14px', fontSize: '0.82rem',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            <LayoutGrid size={14} /> Agregar
          </button>
          <button
            type="button"
            onClick={() => setView('active')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: view === 'active' ? 'var(--primary)' : 'transparent',
              border: 'none', color: view === 'active' ? '#fff' : 'var(--text-secondary)',
              borderRadius: '8px', padding: '8px 14px', fontSize: '0.82rem',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            <List size={14} />
            Planes Activos
            {plansList.length > 0 && (
              <span style={{
                background: view === 'active' ? 'rgba(255,255,255,0.25)' : 'var(--primary)',
                color: '#fff', borderRadius: '50px', padding: '0px 7px',
                fontSize: '0.72rem', fontWeight: 800, minWidth: '20px', textAlign: 'center'
              }}>
                {plansList.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick add */}
        <button
          type="button"
          onClick={() => handleAddPlanClick()}
          className={styles.primaryBtn}
          style={{ padding: '9px 16px' }}
        >
          <Plus size={15} /> Nuevo Plan
        </button>
      </div>

      {/* ════════════════════════════════
          VIEW: CREATE — grouped by category
      ════════════════════════════════ */}
      {view === 'create' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '20px' }}>
            Máximo <strong>6 planes</strong> por categoría. El ⭐ destacado aparece primero en la web.
          </p>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{ marginBottom: '28px' }}>
              {/* Category header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {cat.label}
                  </span>
                  <span style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)',
                    borderRadius: '20px', padding: '1px 8px', fontSize: '0.72rem',
                    color: 'var(--text-muted)', fontWeight: 600
                  }}>
                    {countByCategory(cat.id)}/{MAX_PLANS}
                  </span>
                </div>
                {countByCategory(cat.id) < MAX_PLANS ? (
                  <button
                    type="button"
                    onClick={() => handleAddPlanClick(cat.id)}
                    style={{
                      background: 'rgba(255,87,0,0.1)', border: '1px solid var(--border-primary)',
                      color: 'var(--primary)', borderRadius: '8px', padding: '6px 12px',
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    <Plus size={13} /> Agregar
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Límite alcanzado
                  </span>
                )}
              </div>

              {countByCategory(cat.id) === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', paddingLeft: '4px' }}>
                  Sin planes aún.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plansByCategory.find(c => c.id === cat.id)?.plans.map(plan => (
                    <PlanRow
                      key={plan.id}
                      plan={plan}
                      onEdit={handleEditPlanClick}
                      onDelete={handleDeletePlan}
                      onToggleStar={handleTogglePopular}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════
          VIEW: ACTIVE PLANS — full list
      ════════════════════════════════ */}
      {view === 'active' && (
        <div>
          {plansList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</p>
              <p>No hay planes creados aún.</p>
              <button
                type="button"
                onClick={() => { setView('create'); handleAddPlanClick(); }}
                className={styles.primaryBtn}
                style={{ marginTop: '16px' }}
              >
                <Plus size={15} /> Crear primer plan
              </button>
            </div>
          ) : (
            CATEGORIES.map(cat => {
              const catPlans = plansByCategory.find(c => c.id === cat.id)?.plans || [];
              if (catPlans.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '8px', marginBottom: '10px'
                  }}>
                    <span>{cat.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {cat.label}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)',
                      borderRadius: '20px', padding: '1px 7px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600
                    }}>
                      {catPlans.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {catPlans.map(plan => (
                      <PlanRow
                        key={plan.id}
                        plan={plan}
                        onEdit={handleEditPlanClick}
                        onDelete={handleDeletePlan}
                        onToggleStar={handleTogglePopular}
                        showPrice
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Edit/Create Modal ── */}
      {showPlanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? 'Editar Plan' : 'Crear Plan'}</h2>
              <button type="button" onClick={() => setShowPlanModal(false)} className={styles.modalCloseBtn}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePlan} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planName">Nombre del Plan</label>
                  <input id="planName" type="text" value={planName}
                    onChange={(e) => setPlanName(e.target.value)} required
                    placeholder="Ej: Plan Mensual Solo" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planCategory">Categoría</label>
                  <select id="planCategory" value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value)} className={styles.selectInput}>
                    {CATEGORIES.map(c => (
                      <option
                        key={c.id} value={c.id}
                        disabled={!editingPlan && countByCategory(c.id) >= MAX_PLANS}
                      >
                        {c.emoji} {c.label}
                        {!editingPlan && countByCategory(c.id) >= MAX_PLANS ? ' (lleno)' : ` (${countByCategory(c.id)}/${MAX_PLANS})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planPrice">Precio (CLP)</label>
                  <input id="planPrice" type="number" value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)} required placeholder="35000" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planDuration">Duración (meses)</label>
                  <input id="planDuration" type="number" min="1" max="24" value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planDesc">Descripción Corta</label>
                <textarea id="planDesc" rows={2} value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Ej: Ideal para comenzar desde cero." />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planFeatures">Características (una por línea)</label>
                <textarea id="planFeatures" rows={4} value={planFeatures}
                  onChange={(e) => setPlanFeatures(e.target.value)}
                  placeholder={'Clases ilimitadas\nEvaluación física mensual\nAsesoría nutricional'} />
              </div>
              {/* Popular toggle — prominent */}
              <button
                type="button"
                onClick={() => setPlanPopular(!planPopular)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '12px',
                  background: planPopular ? 'rgba(255,200,0,0.12)' : 'rgba(255,255,255,0.04)',
                  border: planPopular ? '1px solid rgba(255,200,0,0.4)' : '1px solid var(--border-light)',
                  borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                  color: planPopular ? '#fbbf24' : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: '0.9rem'
                }}
              >
                <Star size={18} fill={planPopular ? '#fbbf24' : 'none'} />
                {planPopular ? '⭐ Destacado (aparece primero en la web)' : 'Marcar como plan destacado'}
              </button>

              <button type="submit" className={styles.submitBtn} disabled={actionLoading}
                style={{ marginTop: '16px' }}>
                {actionLoading ? 'Guardando...' : editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Reusable compact plan row ── */
function PlanRow({ plan, onEdit, onDelete, onToggleStar, showPrice = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: plan.popular ? 'rgba(255,200,0,0.04)' : 'rgba(255,255,255,0.02)',
      border: plan.popular ? '1px solid rgba(255,200,0,0.25)' : '1px solid var(--border-light)',
      borderRadius: '10px', padding: '12px 14px',
      transition: 'all 0.2s',
    }}>
      {/* Star toggle */}
      <button
        type="button"
        onClick={() => onToggleStar(plan)}
        title={plan.popular ? 'Quitar destacado' : 'Marcar como destacado'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          color: plan.popular ? '#fbbf24' : 'var(--text-muted)',
          flexShrink: 0, display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
        }}
      >
        <Star size={18} fill={plan.popular ? '#fbbf24' : 'none'} />
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {plan.name}
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(plan.price)}
          {' · '}{plan.duration_months} mes{plan.duration_months > 1 ? 'es' : ''}
          {plan.popular && <span style={{ marginLeft: '6px', color: '#fbbf24', fontWeight: 700 }}>★ Destacado</span>}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onEdit(plan)}
          title="Editar"
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)', borderRadius: '8px', padding: '7px 10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}
        >
          <Edit size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(plan.id)}
          title="Eliminar"
          style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', borderRadius: '8px', padding: '7px 10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
