'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

export default function usePromosState({ setSuccessMsg, actionLoading, setActionLoading }) {
  const [promoCodes, setPromoCodes] = useState([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);

  const [annBarText, setAnnBarText] = useState('');
  const [annBarLink, setAnnBarLink] = useState('');
  const [annBarActive, setAnnBarActive] = useState(false);
  const [annBarId, setAnnBarId] = useState(null);

  const alert = (msg) => { showToast(msg, 'error'); };

  const fetchAnnouncementBar = async () => {
    try {
      const { data, error } = await supabase.from('announcement_bar').select('*');
      if (!error && data && data.length > 0) {
        const activeBar = data.find(b => b.active) || data[0];
        setAnnBarId(activeBar.id); setAnnBarText(activeBar.text);
        setAnnBarLink(activeBar.link_url || ''); setAnnBarActive(activeBar.active);
      }
    } catch (err) { console.warn('Error fetching announcement bar config:', err); }
  };

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
      if (!error && data) setPromoCodes(data);
    } catch (err) { console.warn('Error fetching promo codes:', err); }
  };

  const handleSaveAnnouncementBar = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    try {
      let error;
      if (annBarId) {
        const { error: err } = await supabase.from('announcement_bar').update({ text: annBarText, link_url: annBarLink, active: annBarActive }).eq('id', annBarId);
        error = err;
      } else {
        const { data, error: err } = await supabase.from('announcement_bar').insert([{ text: annBarText, link_url: annBarLink, active: annBarActive }]).select();
        error = err;
        if (data && data.length > 0) setAnnBarId(data[0].id);
      }
      if (error) throw error;
      setSuccessMsg('¡Cintillo de anuncios superior guardado correctamente!');
    } catch (err) { alert('Error al guardar cintillo: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault(); if (!newPromoCode.trim()) return;
    setActionLoading(true); setSuccessMsg(null);
    const newPromo = { code: newPromoCode.trim().toUpperCase(), discount_percent: parseInt(newPromoDiscount) || 0, active: true };
    try {
      const { data, error } = await supabase.from('promo_codes').insert([newPromo]).select();
      if (error) throw error;
      if (data) setPromoCodes([data[0], ...promoCodes]);
      setSuccessMsg(`¡Cupón ${newPromo.code} creado exitosamente!`);
      setNewPromoCode(''); setNewPromoDiscount(20);
    } catch (err) { alert('Error al crear cupón: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleDeletePromoCode = async (promoId) => {
    if (!await confirmDialog('¿Estás seguro de eliminar este cupón de descuento?')) return;
    setActionLoading(true); setSuccessMsg(null);
    try {
      const { error } = await supabase.from('promo_codes').delete().eq('id', promoId);
      if (error) throw error;
      setPromoCodes(promoCodes.filter(c => c.id !== promoId));
      setSuccessMsg('¡Cupón eliminado correctamente!');
    } catch (err) { alert('Error al eliminar cupón: ' + err.message); }
    finally { setActionLoading(false); }
  };

  return {
    promoCodes, newPromoCode, newPromoDiscount,
    annBarText, annBarLink, annBarActive, annBarId,
    setPromoCodes, setNewPromoCode, setNewPromoDiscount,
    setAnnBarText, setAnnBarLink, setAnnBarActive, setAnnBarId,
    fetchPromoCodes, fetchAnnouncementBar,
    handleSaveAnnouncementBar, handleCreatePromoCode, handleDeletePromoCode,
  };
}
