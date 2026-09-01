'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

const CAT_MAP = { individual: 'solo', couple: 'duo', family: 'solo' };

const normalizePlan = (plan) => ({
  ...plan,
  category: CAT_MAP[plan.category] || plan.category || 'solo',
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

  const fetchPlansList = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('popular', { ascending: false }) // popular first
        .order('price', { ascending: true });
      if (!error && data) {
        setPlansList(data.map(normalizePlan));
      }
    } catch (err) { /* silent */ }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const featuresArray = planFeatures.split('\n').map(f => f.trim()).filter(f => f !== '');
    const planData = {
      name: planName.trim(),
      category: planCategory,
      price: parseInt(planPrice),
      duration_months: parseInt(planDuration),
      description: planDesc.trim(),
      features: featuresArray,
      popular: planPopular,
    };
    try {
      if (editingPlan) {
        const { error } = await supabase.from('plans').update(planData).eq('id', editingPlan.id);
        if (error) throw error;
        showToast('¡Plan actualizado!', 'success');
      } else {
        const { error } = await supabase.from('plans').insert([planData]);
        if (error) throw error;
        showToast('¡Plan creado!', 'success');
      }
      setShowPlanModal(false);
      fetchPlansList();
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  const handleDeletePlan = async (planId) => {
    if (!await confirmDialog('¿Eliminar este plan?')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('plans').delete().eq('id', planId);
      if (error) throw error;
      showToast('Plan eliminado', 'success');
      fetchPlansList();
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  // Toggle popular flag directly from the list (one tap)
  const handleTogglePopular = async (plan) => {
    const newPopular = !plan.popular;
    try {
      const { error } = await supabase
        .from('plans')
        .update({ popular: newPopular })
        .eq('id', plan.id);
      if (error) throw error;
      setPlansList(prev =>
        prev.map(p => p.id === plan.id ? { ...p, popular: newPopular } : p)
          .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.price - b.price)
      );
      showToast(newPopular ? '⭐ Plan marcado como destacado' : 'Destacado removido', 'success');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
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
    fetchPlansList, handleSavePlan, handleDeletePlan, handleEditPlanClick, handleAddPlanClick, handleTogglePopular,
  };
}
