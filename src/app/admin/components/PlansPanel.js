'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Star, Eye, EyeOff, List, LayoutGrid } from 'lucide-react';
import styles from '../admin.module.css';
import { MAX_TOTAL_PLANS } from '../hooks/usePlansState';

const formatCLP = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

const CATEGORIES = [
  { id: 'solo',   label: 'Solo',   emoji: '🧍' },
  { id: 'duo',    label: 'Dúo',    emoji: '👥' },
  { id: 'online', label: 'Online', emoji: '💻' },
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
  const [view, setView] = useState('active'); // 'active' | 'create'

  const totalPlans = plansList.length;
  const visiblePlans = plansList.filter(p => p.visible);
  const limitReached = totalPlans >= MAX_TOTAL_PLANS;

  const plansByCategory = CATEGORIES.map(cat => ({
    ...cat,
    all: plansList.filter(p => p.category === cat.id),
    visible: plansList.filter(p => p.category === cat.id && p.visible),
  }));

  return (
    <div className={styles.tabContent}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px', marginBottom: '20px', flexWrap: 'wrap',
      }}>
        {/* View toggle pill */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-light)', borderRadius: '10px',
          padding: '3px', gap: '3px', flexShrink: 0,
        }}>
          <ViewBtn active={view === 'active'} onClick={() => setView('active')} icon={<List size={13} />}>
            Planes{totalPlans > 0 && <CountBadge n={totalPlans} active={view === 'active'} />}
          </ViewBtn>
          <ViewBtn active={view === 'create'} onClick={() => setView('create')} icon={<LayoutGrid size={13} />}>
            Gestionar
          </ViewBtn>
        </div>

        {/* New plan button — disabled if at limit */}
        <button
          type="button"
          onClick={() => handleAddPlanClick()}
          disabled={limitReached}
          className={styles.primaryBtn}
          style={{ padding: '9px 16px', opacity: limitReached ? 0.45 : 1, cursor: limitReached ? 'not-allowed' : 'pointer' }}
          title={limitReached ? `Límite de ${MAX_TOTAL_PLANS} planes alcanzado` : 'Crear nuevo plan'}
        >
          <Plus size={15} /> Nuevo Plan
        </button>
      </div>

      {/* Global usage bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '6px', fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          <span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{visiblePlans.length}</span> activos en web
            <span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{totalPlans}</span>/{MAX_TOTAL_PLANS} planes creados
          </span>
          {limitReached && (
            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.72rem' }}>✕ Límite alcanzado</span>
          )}
        </div>
        {/* Progress bar */}
        <div style={{
          height: '4px', background: 'rgba(255,255,255,0.08)',
          borderRadius: '4px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '4px', transition: 'width 0.4s ease',
            background: limitReached ? '#ef4444' : 'var(--primary)',
            width: `${(totalPlans / MAX_TOTAL_PLANS) * 100}%`,
          }} />
        </div>
      </div>

      {/* ════════════════════════════════
          VIEW: ACTIVE PLANS (default)
      ════════════════════════════════ */}
      {view === 'active' && (
        <div>
          {totalPlans === 0 ? (
            <EmptyState onAdd={() => { setView('create'); handleAddPlanClick(); }} />
          ) : (
            plansByCategory.map(cat => {
              if (cat.all.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: '24px' }}>
                  {/* Category header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '8px', marginBottom: '10px',
                  }}>
                    <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {cat.label}
                    </span>
                    {/* Active count for this category */}
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700,
                      color: cat.visible.length > 0 ? '#4ade80' : 'var(--text-muted)',
                    }}>
                      {cat.visible.length > 0
                        ? `${cat.visible.length} online`
                        : 'sin activos'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cat.all.map(plan => (
                      <PlanRow
                        key={plan.id}
                        plan={plan}
                        onEdit={handleEditPlanClick}
                        onDelete={handleDeletePlan}
                        onToggleStar={handleTogglePopular}
                        onToggleVisible={handleToggleVisible}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ════════════════════════════════
          VIEW: CREATE / MANAGE
      ════════════════════════════════ */}
      {view === 'create' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '20px', lineHeight: 1.5 }}>
            Podés crear hasta <strong>{MAX_TOTAL_PLANS} planes en total</strong> entre todas las categorías.
            Usá el <Eye size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> ojo para activar o desactivar su visibilidad en la web.
          </p>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{ marginBottom: '28px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {cat.label}
                  </span>
                  <span style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)',
                    borderRadius: '20px', padding: '1px 8px', fontSize: '0.7rem',
                    color: 'var(--text-muted)', fontWeight: 600,
                  }}>
                    {cat.all.length}
                  </span>
                </div>
                {!limitReached && (
                  <button
                    type="button"
                    onClick={() => handleAddPlanClick(cat.id)}
                    style={{
                      background: 'rgba(255,87,0,0.1)', border: '1px solid var(--border-primary)',
                      color: 'var(--primary)', borderRadius: '8px', padding: '6px 12px',
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    <Plus size={13} /> Agregar
                  </button>
                )}
              </div>
              {cat.all.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingLeft: '2px' }}>Sin planes en esta categoría.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.all.map(plan => (
                    <PlanRow
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
        </div>
      )}

      {/* ── Modal ── */}
      {showPlanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? 'Editar Plan' : 'Nuevo Plan'}</h2>
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
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
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

              {/* Popular toggle */}
              <button
                type="button"
                onClick={() => setPlanPopular(!planPopular)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '12px',
                  background: planPopular ? 'rgba(255,200,0,0.1)' : 'rgba(255,255,255,0.03)',
                  border: planPopular ? '1px solid rgba(255,200,0,0.35)' : '1px solid var(--border-light)',
                  borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                  color: planPopular ? '#fbbf24' : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: '0.88rem',
                }}
              >
                <Star size={16} fill={planPopular ? '#fbbf24' : 'none'} />
                {planPopular ? 'Plan destacado — aparece primero en la web' : 'Marcar como plan destacado'}
              </button>

              <button type="submit" className={styles.submitBtn} disabled={actionLoading}
                style={{ marginTop: '14px' }}>
                {actionLoading ? 'Guardando...' : editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function ViewBtn({ active, onClick, icon, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: active ? 'var(--primary)' : 'transparent',
      border: 'none', color: active ? '#fff' : 'var(--text-secondary)',
      borderRadius: '8px', padding: '8px 13px', fontSize: '0.8rem',
      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    }}>
      {icon}{children}
    </button>
  );
}

function CountBadge({ n, active }) {
  return (
    <span style={{
      background: active ? 'rgba(255,255,255,0.22)' : 'var(--primary)',
      color: '#fff', borderRadius: '50px', padding: '0 7px',
      fontSize: '0.7rem', fontWeight: 800, minWidth: '18px', textAlign: 'center',
    }}>{n}</span>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
      <p style={{ fontSize: '1.8rem', marginBottom: '6px' }}>📋</p>
      <p style={{ marginBottom: '16px', fontSize: '0.9rem' }}>No hay planes creados aún.</p>
      <button type="button" onClick={onAdd} style={{
        background: 'var(--primary)', border: 'none', color: '#fff',
        borderRadius: '10px', padding: '10px 20px', fontWeight: 700,
        cursor: 'pointer', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px',
      }}>
        <Plus size={15} /> Crear primer plan
      </button>
    </div>
  );
}

function PlanRow({ plan, onEdit, onDelete, onToggleStar, onToggleVisible }) {
  const isOnline = plan.visible;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: isOnline ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.015)',
      border: isOnline ? '1px solid rgba(74,222,128,0.18)' : '1px solid var(--border-light)',
      borderRadius: '10px', padding: '11px 12px',
      opacity: isOnline ? 1 : 0.65,
      transition: 'all 0.2s',
    }}>
      {/* Online status dot */}
      <span title={isOnline ? 'Visible en la web' : 'Oculto de la web'} style={{
        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
        background: isOnline ? '#4ade80' : 'rgba(255,255,255,0.2)',
        boxShadow: isOnline ? '0 0 6px rgba(74,222,128,0.6)' : 'none',
      }} />

      {/* Plan info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontWeight: 700, fontSize: '0.86rem',
          color: isOnline ? '#fff' : 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {plan.name}
          {plan.popular && (
            <span style={{ marginLeft: '6px', color: '#fbbf24', fontSize: '0.7rem' }}>★</span>
          )}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {formatCLP(plan.price)} · {plan.duration_months} mes{plan.duration_months > 1 ? 'es' : ''}
          <span style={{
            marginLeft: '8px', fontWeight: 700, fontSize: '0.68rem',
            color: isOnline ? '#4ade80' : 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {isOnline ? '● Online' : '○ Oculto'}
          </span>
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '5px', flexShrink: 0, alignItems: 'center' }}>
        {/* Star */}
        <IconBtn
          onClick={() => onToggleStar(plan)}
          title={plan.popular ? 'Quitar destacado' : 'Marcar destacado'}
          color={plan.popular ? '#fbbf24' : 'var(--text-muted)'}
          bg={plan.popular ? 'rgba(251,191,36,0.08)' : 'transparent'}
        >
          <Star size={15} fill={plan.popular ? '#fbbf24' : 'none'} />
        </IconBtn>
        {/* Eye toggle */}
        <IconBtn
          onClick={() => onToggleVisible(plan)}
          title={isOnline ? 'Ocultar de la web' : 'Mostrar en la web'}
          color={isOnline ? '#4ade80' : 'var(--text-muted)'}
          bg={isOnline ? 'rgba(74,222,128,0.08)' : 'transparent'}
        >
          {isOnline ? <Eye size={15} /> : <EyeOff size={15} />}
        </IconBtn>
        {/* Edit */}
        <IconBtn onClick={() => onEdit(plan)} title="Editar" color="var(--text-secondary)">
          <Edit size={15} />
        </IconBtn>
        {/* Delete */}
        <IconBtn onClick={() => onDelete(plan.id)} title="Eliminar"
          color="#ef4444" bg="rgba(239,68,68,0.06)" borderColor="rgba(239,68,68,0.18)">
          <Trash2 size={15} />
        </IconBtn>
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, color, bg = 'rgba(255,255,255,0.04)', borderColor = 'var(--border-light)', children }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      background: bg, border: `1px solid ${borderColor}`,
      color, borderRadius: '7px', padding: '6px 8px',
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      transition: 'all 0.15s', minWidth: '32px', justifyContent: 'center',
    }}>
      {children}
    </button>
  );
}
