'use client';

import { Plus, Edit, Trash2, X, Wifi } from 'lucide-react';
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

const MAX_PLANS_PER_CATEGORY = 6;

export default function PlansPanel({
  plansList, showPlanModal, editingPlan,
  planName, setPlanName, planCategory, setPlanCategory,
  planPrice, setPlanPrice, planDuration, setPlanDuration,
  planDesc, setPlanDesc, planFeatures, setPlanFeatures,
  planPopular, setPlanPopular, actionLoading,
  handleAddPlanClick, handleEditPlanClick, handleDeletePlan, handleSavePlan, setShowPlanModal
}) {
  // Count how many plans exist per category to enforce limit
  const countByCategory = (cat) => plansList.filter(p => p.category === cat).length;

  const canAddPlan = !editingPlan && CATEGORIES.every(c => countByCategory(c.id) < MAX_PLANS_PER_CATEGORY)
    || editingPlan;

  // Plans grouped by category
  const plansByCategory = CATEGORIES.map(cat => ({
    ...cat,
    plans: plansList.filter(p => p.category === cat.id),
  }));

  return (
    <div className={styles.tabContent}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          Máximo <strong>6 planes</strong> por categoría (Solo, Dúo y Online).
        </p>
        <button type="button" onClick={handleAddPlanClick} className={styles.primaryBtn}>
          <Plus size={16} /> Nuevo Plan
        </button>
      </div>

      {/* Plans by category */}
      {plansByCategory.map(cat => (
        <div key={cat.id} style={{ marginBottom: '28px' }}>
          {/* Category header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {cat.label}
              </h3>
              <span style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)',
                borderRadius: '20px', padding: '1px 8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600
              }}>
                {cat.plans.length}/{MAX_PLANS_PER_CATEGORY}
              </span>
            </div>
            {/* Per-category add button if category isn't full */}
            {cat.plans.length < MAX_PLANS_PER_CATEGORY && (
              <button
                type="button"
                onClick={() => { handleAddPlanClick(); setPlanCategory(cat.id); }}
                style={{
                  background: 'rgba(255,87,0,0.1)', border: '1px solid var(--border-primary)',
                  color: 'var(--primary)', borderRadius: '8px', padding: '6px 12px',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Plus size={14} /> Agregar
              </button>
            )}
            {cat.plans.length >= MAX_PLANS_PER_CATEGORY && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                ✓ Límite alcanzado
              </span>
            )}
          </div>

          {/* Plans list */}
          {cat.plans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '4px' }}>
              No hay planes en esta categoría aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.plans.map((plan) => (
                <div key={plan.id} className={`${styles.listItemCard} glass`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '10px', padding: '14px 16px'
                }}>
                  <div className={styles.itemInfo} style={{ gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{plan.name}</h3>
                      {plan.popular && <span className={styles.prioBadgeRed} style={{ fontSize: '0.7rem' }}>Popular</span>}
                    </div>
                    <span className={styles.itemBadge}>{formatCLP(plan.price)} / {plan.duration_months} mes(es)</span>
                    {plan.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{plan.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button type="button" onClick={() => handleEditPlanClick(plan)} className={styles.viewEditBtn} title="Editar">
                      <Edit size={16} />
                    </button>
                    <button type="button" onClick={() => handleDeletePlan(plan.id)} className={styles.deleteBtn} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {showPlanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</h2>
              <button type="button" onClick={() => setShowPlanModal(false)} className={styles.modalCloseBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSavePlan} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planName">Nombre del Plan</label>
                  <input id="planName" type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="Ej: Plan Mensual Solo" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planCategory">Categoría</label>
                  <select id="planCategory" value={planCategory} onChange={(e) => setPlanCategory(e.target.value)} className={styles.selectInput}>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} disabled={!editingPlan && countByCategory(c.id) >= MAX_PLANS_PER_CATEGORY}>
                        {c.emoji} {c.label}{!editingPlan && countByCategory(c.id) >= MAX_PLANS_PER_CATEGORY ? ' (lleno)' : ` (${countByCategory(c.id)}/${MAX_PLANS_PER_CATEGORY})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planPrice">Precio (CLP)</label>
                  <input id="planPrice" type="number" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} required placeholder="Ej: 35000" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planDuration">Duración (meses)</label>
                  <input id="planDuration" type="number" min="1" max="24" value={planDuration} onChange={(e) => setPlanDuration(e.target.value)} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planDesc">Descripción Corta</label>
                <textarea id="planDesc" rows={2} value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} placeholder="Ej: Plan ideal para empezar desde cero." />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planFeatures">Características (una por línea)</label>
                <textarea id="planFeatures" rows={5} value={planFeatures} onChange={(e) => setPlanFeatures(e.target.value)} placeholder={'Clases ilimitadas\nEvaluación física mensual\nAsesoría nutricional básica'} />
              </div>
              <div className={styles.inputGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={planPopular} onChange={(e) => setPlanPopular(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Marcar como Plan Popular (Destacado)
                </label>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={actionLoading} style={{ marginTop: '20px' }}>
                {actionLoading ? 'Guardando...' : editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
