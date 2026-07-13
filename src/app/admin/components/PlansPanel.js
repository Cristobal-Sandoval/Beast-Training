'use client';

import { Plus, Edit, Trash2, X } from 'lucide-react';
import styles from '../admin.module.css';

const formatCLP = (price) => {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
};

export default function PlansPanel({
  plansList, showPlanModal, editingPlan,
  planName, setPlanName, planCategory, setPlanCategory,
  planPrice, setPlanPrice, planDuration, setPlanDuration,
  planDesc, setPlanDesc, planFeatures, setPlanFeatures,
  planPopular, setPlanPopular, actionLoading,
  handleAddPlanClick, handleEditPlanClick, handleDeletePlan, handleSavePlan, setShowPlanModal
}) {
  return (
    <div className={styles.tabContent}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button type="button" onClick={handleAddPlanClick} className={styles.primaryBtn}>
          <Plus size={16} /> Nuevo Plan
        </button>
      </div>

      {plansList.map((plan) => (
        <div key={plan.id} className={`${styles.listItemCard} glass`} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className={styles.itemInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>{plan.name}</h3>
              {plan.popular && <span className={styles.prioBadgeRed} style={{ fontSize: '0.75rem' }}>Popular</span>}
            </div>
            <p>{plan.description}</p>
            <span className={styles.itemBadge}>{formatCLP(plan.price)} / {plan.duration_months} mes(es)</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => handleEditPlanClick(plan)} className={styles.viewEditBtn}><Edit size={16} /></button>
            <button type="button" onClick={() => handleDeletePlan(plan.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}

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
                  <input id="planName" type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planCategory">Categoría</label>
                  <select id="planCategory" value={planCategory} onChange={(e) => setPlanCategory(e.target.value)} className={styles.selectInput}>
                    <option value="individual">Individual</option>
                    <option value="couple">Pareja</option>
                    <option value="family">Familiar</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="planPrice">Precio (CLP)</label>
                  <input id="planPrice" type="number" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="planDuration">Duración (meses)</label>
                  <input id="planDuration" type="number" min="1" max="24" value={planDuration} onChange={(e) => setPlanDuration(e.target.value)} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planDesc">Descripción Corta</label>
                <textarea id="planDesc" rows={2} value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="planFeatures">Características (una por línea)</label>
                <textarea id="planFeatures" rows={5} value={planFeatures} onChange={(e) => setPlanFeatures(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={planPopular} onChange={(e) => setPlanPopular(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Marcar como Plan Popular (Destacado)
                </label>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={actionLoading} style={{ marginTop: '20px' }}>
                {actionLoading ? 'Guardando...' : editingPlan ? 'Guardar Cambios del Plan' : 'Crear Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
