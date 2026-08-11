'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

export default function useAnnouncementsState({ setSuccessMsg, actionLoading, setActionLoading, alumnos }) {
  const [announcements, setAnnouncements] = useState([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('normal');

  const alert = (msg) => { showToast(msg, 'error'); };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (!error && data) setAnnouncements(data);
    } catch (err) { console.warn(err); }
  };

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const newAnn = { title: annTitle, content: annContent, priority: annPriority };
    try {
      const { data, error } = await supabase.from('announcements').insert([newAnn]).select();
      if (error) throw error;
      if (data) setAnnouncements([data[0], ...announcements]);
      const activeCount = alumnos.filter(a => a.status === 'active').length;
      setSuccessMsg(`¡Mensaje publicado con éxito! Se simuló el envío a los correos electrónicos de los ${activeCount} alumnos activos.`);
      setAnnTitle(''); setAnnContent(''); setAnnPriority('normal');
    } catch (err) { alert('Error al enviar comunicado: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (!await confirmDialog('¿Deseas eliminar este comunicado?')) return;
    try { const { error } = await supabase.from('announcements').delete().eq('id', annId); if (error) throw error; setAnnouncements(announcements.filter(a => a.id !== annId)); } catch (err) { alert(err.message); }
  };

  return {
    announcements, annTitle, annContent, annPriority,
    setAnnouncements, setAnnTitle, setAnnContent, setAnnPriority,
    fetchAnnouncements, handleBroadcastAnnouncement, handleDeleteAnnouncement,
  };
}
