'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';
import { DEFAULT_PLANS, MAX_PLANS_PER_CATEGORY } from '@/lib/defaultPlans';

export { MAX_PLANS_PER_CATEGORY };

const CAT_MAP = { individual: 'solo', couple: 'duo', family: 'solo' };

const normalizePlan = (plan) => ({
  ...plan,
  category: CAT_MAP[plan.category] || plan.category || 'solo',
  visible: plan.visible !== false,
  features: (plan.features || []).filter(
    f => !f.toLowerCase().includes('casillero') && !f.toLowerCase().includes('ducha')
  ),
});

export default function usePlansState({ setSuccessMsg, actionLoading, setActionLoading }) {
  const [plansList, setPlansList] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planCategory, setPlanCategory] = useState('solo');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState(1);
  const [planDesc, setPlanDesc] = useState('');
  const [planFeatures, setPlanFeatures] = useState('');
  const [planPopular, setPlanPopular] = useState(false);

  // Helper to count plans in a category
  const countCategory = (cat, list = plansList) => list.filter(p => p.category === cat).length;

  const fetchPlansList = async () => {
    try {
      const { data, error } = await supabase.from('plans').select('*');
      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizePlan);
        const categoriesInDb = new Set(normalized.map(p => p.category));
        // If any category has 0 plans in DB, supplement from defaults
        const supplements = DEFAULT_PLANS.filter(dp => !categoriesInDb.has(dp.category));
        const combined = [...normalized, ...supplements];
        
        // Enforce max 6 per category
        const capped = ['solo', 'duo', 'online'].flatMap(cat =>
          combined.filter(p => p.category === cat).slice(0, MAX_PLANS_PER_CATEGORY)
        );
        setPlansList(capped);
      } else {
        setPlansList(DEFAULT_PLANS);
      }
    } catch (err) {
      setPlansList(DEFAULT_PLANS);
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    const currentCategoryCount = countCategory(planCategory);

    // Enforce 6 plans per category limit when creating a new plan
    if (!editingPlan && currentCategoryCount >= MAX_PLANS_PER_CATEGORY) {
      showToast(
        `Límite alcanzado: Ya tienes ${MAX_PLANS_PER_CATEGORY} planes en la categoría ${planCategory.toUpperCase()}. Elimina o edita uno existente.`,
        'error'
      );
      return;
    }

    setActionLoading(true);
    setSuccessMsg(null);
    const featuresArray = planFeatures.split('\n').map(f => f.trim()).filter(f => f !== '');
    const planData = {
      name: planName.trim(),
      category: planCategory,
      price: parseInt(planPrice),
      duration_months: parseInt(planDuration),
      description: planDesc.trim(),
      features: featuresArray,
      popular: planPopular,
      visible: editingPlan ? editingPlan.visible : true,
    };

    try {
      if (editingPlan) {
        // If marked as popular, unset other plans in same category
        if (planPopular) {
          await supabase.from('plans').update({ popular: false }).eq('category', planCategory);
        }
        const { error } = await supabase.from('plans').update(planData).eq('id', editingPlan.id);
        if (error) throw error;
        showToast('¡Plan actualizado con éxito!', 'success');
      } else {
        if (planPopular) {
          await supabase.from('plans').update({ popular: false }).eq('category', planCategory);
        }
        const { error } = await supabase.from('plans').insert([planData]);
        if (error) throw error;
        showToast('¡Nuevo plan creado con éxito!', 'success');
      }
      setShowPlanModal(false);
      fetchPlansList();
    } catch (err) {
      // If DB failed (e.g. offline ID or mock), update local state
      setPlansList(prev => {
        if (editingPlan) {
          return prev.map(p => {
            if (p.id === editingPlan.id) return { ...p, ...planData };
            if (planPopular && p.category === planCategory) return { ...p, popular: false };
            return p;
          });
        } else {
          const newP = { id: 'p-' + Date.now(), ...planData };
          const updated = prev.map(p => (planPopular && p.category === planCategory ? { ...p, popular: false } : p));
          return [...updated, newP];
        }
      });
      setShowPlanModal(false);
      showToast(editingPlan ? 'Plan actualizado' : 'Plan creado', 'success');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!await confirmDialog('¿Estás seguro de que deseas eliminar este plan?')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('plans').delete().eq('id', planId);
      if (error) throw error;
      showToast('Plan eliminado correctamente', 'success');
      fetchPlansList();
    } catch (err) {
      // Local fallback
      setPlansList(prev => prev.filter(p => p.id !== planId));
      showToast('Plan eliminado', 'success');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle ⭐ popular — exactly 1 popular per category
  const handleTogglePopular = async (plan) => {
    const newVal = !plan.popular;
    try {
      if (newVal) {
        // Unset popular on other plans in the same category
        await supabase.from('plans').update({ popular: false }).eq('category', plan.category);
        await supabase.from('plans').update({ popular: true }).eq('id', plan.id);
        setPlansList(prev =>
          prev.map(p => {
            if (p.id === plan.id) return { ...p, popular: true };
            if (p.category === plan.category) return { ...p, popular: false };
            return p;
          })
        );
        showToast(`⭐ "${plan.name}" es ahora el plan MÁS POPULAR de ${plan.category.toUpperCase()}`, 'success');
      } else {
        await supabase.from('plans').update({ popular: false }).eq('id', plan.id);
        setPlansList(prev => prev.map(p => (p.id === plan.id ? { ...p, popular: false } : p)));
        showToast('Destacado removido', 'success');
      }
    } catch (err) {
      // Local fallback
      setPlansList(prev =>
        prev.map(p => {
          if (p.id === plan.id) return { ...p, popular: newVal };
          if (newVal && p.category === plan.category) return { ...p, popular: false };
          return p;
        })
      );
      showToast(newVal ? '⭐ Plan marcado como el más popular' : 'Destacado removido', 'success');
    }
  };

  // Toggle 👁 visible (online/offline on public page) — one tap
  const handleToggleVisible = async (plan) => {
    const newVal = !plan.visible;
    try {
      const { error } = await supabase.from('plans').update({ visible: newVal }).eq('id', plan.id);
      if (error) throw error;
      setPlansList(prev => prev.map(p => (p.id === plan.id ? { ...p, visible: newVal } : p)));
      showToast(newVal ? '✅ Plan activado (visible en la web)' : '🔕 Plan desactivado (offline)', 'success');
    } catch (err) {
      setPlansList(prev => prev.map(p => (p.id === plan.id ? { ...p, visible: newVal } : p)));
      showToast(newVal ? '✅ Plan activado (visible en web)' : '🔕 Plan desactivado (offline)', 'success');
    }
  };

  const handleEditPlanClick = (plan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanCategory(plan.category);
    setPlanPrice(plan.price);
    setPlanDuration(plan.duration_months);
    setPlanDesc(plan.description || '');
    setPlanFeatures((plan.features || []).join('\n'));
    setPlanPopular(plan.popular || false);
    setShowPlanModal(true);
  };

  const handleAddPlanClick = (preCategory = 'solo') => {
    const count = countCategory(preCategory);
    if (count >= MAX_PLANS_PER_CATEGORY) {
      showToast(`La categoría ${preCategory.toUpperCase()} ya tiene el máximo de ${MAX_PLANS_PER_CATEGORY} planes.`, 'error');
      return;
    }
    setEditingPlan(null);
    setPlanName('');
    setPlanCategory(preCategory);
    setPlanPrice('');
    setPlanDuration(1);
    setPlanDesc('');
    setPlanFeatures('Clases ilimitadas\nAcceso a musculación y cardio\nEvaluación física mensual');
    setPlanPopular(false);
    setShowPlanModal(true);
  };

  return {
    plansList, showPlanModal, editingPlan,
    planName, planCategory, planPrice, planDuration, planDesc, planFeatures, planPopular,
    setPlansList, setShowPlanModal, setEditingPlan,
    setPlanName, setPlanCategory, setPlanPrice, setPlanDuration, setPlanDesc, setPlanFeatures, setPlanPopular,
    fetchPlansList, handleSavePlan, handleDeletePlan,
    handleEditPlanClick, handleAddPlanClick,
    handleTogglePopular, handleToggleVisible, countCategory,
  };
}
