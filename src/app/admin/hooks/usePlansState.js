'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

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
      const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
      if (!error && data) setPlansList(data);
    } catch (err) { console.warn('Error fetching plans list:', err); }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const featuresArray = planFeatures.split('\n').map(f => f.trim()).filter(f => f !== '');
    const planData = { name: planName.trim(), category: planCategory, price: parseInt(planPrice), duration_months: parseInt(planDuration), description: planDesc.trim(), features: featuresArray, popular: planPopular };
    try {
      if (editingPlan) {
        const { error } = await supabase.from('plans').update(planData).eq('id', editingPlan.id);
        if (error) throw error;
        showToast('¡Plan actualizado con éxito!', 'success');
      } else {
        const { error } = await supabase.from('plans').insert([planData]);
        if (error) throw error;
        showToast('¡Nuevo plan creado con éxito!', 'success');
      }
      setShowPlanModal(false);
      fetchPlansList();
    } catch (err) { showToast('Error al guardar el plan: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  const handleDeletePlan = async (planId) => {
    if (!await confirmDialog('¿Estás seguro de que deseas eliminar este plan?')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('plans').delete().eq('id', planId);
      if (error) throw error;
      showToast('¡Plan de entrenamiento eliminado!', 'success');
      fetchPlansList();
    } catch (err) { showToast('Error al eliminar el plan: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  const handleEditPlanClick = (plan) => {
    // Normalize legacy category names from DB
    const catMap = { individual: 'solo', couple: 'duo', family: 'solo' };
    const cat = catMap[plan.category] || plan.category || 'solo';
    setEditingPlan(plan); setPlanName(plan.name); setPlanCategory(cat);
    setPlanPrice(plan.price); setPlanDuration(plan.duration_months);
    setPlanDesc(plan.description || '');
    // Remove 'Casilleros y duchas' from existing features when editing
    const features = (plan.features || []).filter(f => !f.toLowerCase().includes('casillero') && !f.toLowerCase().includes('ducha'));
    setPlanFeatures(features.join('\n'));
    setPlanPopular(plan.popular || false); setShowPlanModal(true);
  };

  const handleAddPlanClick = () => {
    setEditingPlan(null); setPlanName(''); setPlanCategory('solo'); setPlanPrice(''); setPlanDuration(1);
    setPlanDesc(''); setPlanFeatures('Clases ilimitadas\nAcceso a musculación y cardio\nEvaluación física mensual');
    setPlanPopular(false); setShowPlanModal(true);
  };

  return {
    plansList, showPlanModal, editingPlan, planName, planCategory, planPrice, planDuration, planDesc, planFeatures, planPopular,
    setPlansList, setShowPlanModal, setEditingPlan, setPlanName, setPlanCategory, setPlanPrice, setPlanDuration, setPlanDesc, setPlanFeatures, setPlanPopular,
    fetchPlansList, handleSavePlan, handleDeletePlan, handleEditPlanClick, handleAddPlanClick,
  };
}
