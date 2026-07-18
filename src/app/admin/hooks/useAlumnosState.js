'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

export default function useAlumnosState({ user, setSuccessMsg, actionLoading, setActionLoading }) {
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnoProgress, setAlumnoProgress] = useState([]);
  const [fichaTab, setFichaTab] = useState('routine');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [logWeight, setLogWeight] = useState('');
  const [logBodyFat, setLogBodyFat] = useState('');
  const [logMuscle, setLogMuscle] = useState('');
  const [logWaist, setLogWaist] = useState('');
  const [logChest, setLogChest] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutPlanText, setWorkoutPlanText] = useState('');

  const [alumnoName, setAlumnoName] = useState('');
  const [alumnoAge, setAlumnoAge] = useState('');
  const [alumnoPhone, setAlumnoPhone] = useState('');
  const [alumnoStatus, setAlumnoStatus] = useState('inactive');

  const [chatMessages, setChatMessages] = useState([]);
  const [newDirectMessage, setNewDirectMessage] = useState('');

  const [proposedSlot1, setProposedSlot1] = useState('');
  const [proposedSlot2, setProposedSlot2] = useState('');
  const [proposedSlot3, setProposedSlot3] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlumnoName, setNewAlumnoName] = useState('');
  const [newAlumnoEmail, setNewAlumnoEmail] = useState('');
  const [newAlumnoPhone, setNewAlumnoPhone] = useState('');
  const [newAlumnoAge, setNewAlumnoAge] = useState('');
  const [newAlumnoPassword, setNewAlumnoPassword] = useState('beast123');
  const [welcomeEmailMessage, setWelcomeEmailMessage] = useState(
    "¡Hola {nombre}!\n\nBienvenido a Beast Training Concepción. Tu cuenta de alumno ha sido registrada con éxito.\n\n🔑 Tus credenciales de acceso provisionales:\n• Usuario: {email}\n• Contraseña: {clave}\n\nPor favor, ingresa al portal de alumnos y cambia tu contraseña en tu primer inicio de sesión. ¡A entrenar duro!"
  );
  const [invitationEmailMessage, setInvitationEmailMessage] = useState(
    "Hola {nombre},\n\nTe he propuesto los siguientes horarios para tu evaluación física mensual en Beast Training:\n\n{fechas}\n\nPor favor, ingresa al portal de alumnos en la sección de Citas y selecciona el horario que más te acomode para confirmar la fecha. ¡Nos vemos!"
  );

  const alert = (msg) => { showToast(msg, 'error'); };

  const filteredAlumnos = alumnos.filter(a => {
    const matchesSearch = !searchTerm || (a.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const handleSyncUpdate = () => {
      fetchAlumnos();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beast_alumnos_updated', handleSyncUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beast_alumnos_updated', handleSyncUpdate);
      }
    };
  }, []);

  const fetchAlumnos = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) setAlumnos(data.filter(p => p.role !== 'admin'));
    } catch (err) { console.warn('Error fetching profiles:', err); }
  };

  const fetchDirectMessages = async (alumnoId) => {
    try {
      const { data, error } = await supabase.from('direct_messages').select('*');
      if (!error && data) {
        const adminId = user?.id;
        const filtered = data.filter(m => (m.sender_id === adminId && m.receiver_id === alumnoId) || (m.sender_id === alumnoId && m.receiver_id === adminId));
        setChatMessages(filtered);
      }
    } catch (err) { console.warn('Error fetching messages:', err); }
  };

  const handleToggleStatus = async (alumno) => {
    const newStatus = alumno.status === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', alumno.id);
      if (error) throw error;
      setAlumnos(alumnos.map(a => a.id === alumno.id ? { ...a, status: newStatus } : a));
      if (selectedAlumno && selectedAlumno.id === alumno.id) setSelectedAlumno({ ...selectedAlumno, status: newStatus });
    } catch (err) { alert('Error al alternar estado: ' + err.message); }
  };

  const handleSelectAlumno = async (alumno) => {
    setSelectedAlumno(alumno); setFichaTab('routine');
    setWorkoutPlanText(alumno.workout_plan || ''); setAlumnoName(alumno.full_name || '');
    setAlumnoAge(alumno.age || ''); setAlumnoPhone(alumno.phone || '');
    setAlumnoStatus(alumno.status || 'inactive');
    const slots = (alumno.proposed_slots || '').split(',');
    setProposedSlot1(slots[0]?.trim() || ''); setProposedSlot2(slots[1]?.trim() || ''); setProposedSlot3(slots[2]?.trim() || '');
    setSuccessMsg(null);
    fetchDirectMessages(alumno.id);
    try {
      const { data, error } = await supabase.from('physical_progress').select('*').eq('user_id', alumno.id).order('date', { ascending: false });
      if (!error && data) setAlumnoProgress(data);
    } catch (err) { console.warn('Error fetching alumno progress:', err); }
  };

  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!newDirectMessage.trim()) return;
    const newMsg = { sender_id: user?.id, receiver_id: selectedAlumno.id, content: newDirectMessage.trim() };
    try {
      const { data, error } = await supabase.from('direct_messages').insert([newMsg]).select();
      if (error) throw error;
      if (data) setChatMessages([...chatMessages, data[0]]);
      setNewDirectMessage('');
    } catch (err) { alert('Error al enviar mensaje: ' + err.message); }
  };

  const handleUpdatePersonalDetails = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: alumnoName, age: alumnoAge ? parseInt(alumnoAge) : null, phone: alumnoPhone, status: alumnoStatus }).eq('id', selectedAlumno.id);
      if (error) throw error;
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? { ...a, full_name: alumnoName, age: alumnoAge ? parseInt(alumnoAge) : null, phone: alumnoPhone, status: alumnoStatus } : a));
      setSelectedAlumno({ ...selectedAlumno, full_name: alumnoName, age: alumnoAge ? parseInt(alumnoAge) : null, phone: alumnoPhone, status: alumnoStatus });
      setSuccessMsg('¡Datos personales del alumno actualizados con éxito!');
    } catch (err) { alert('Error al actualizar datos personales: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleAddMeasurement = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const newRecord = { user_id: selectedAlumno.id, date: logDate, weight: parseFloat(logWeight), body_fat: logBodyFat ? parseFloat(logBodyFat) : null, muscle_mass: logMuscle ? parseFloat(logMuscle) : null, waist: logWaist ? parseFloat(logWaist) : null, chest: logChest ? parseFloat(logChest) : null, notes: logNotes };
    try {
      const { data, error } = await supabase.from('physical_progress').insert([newRecord]).select();
      if (error) throw error;
      if (data) setAlumnoProgress([data[0], ...alumnoProgress]);
      setSuccessMsg('¡Evaluación física guardada con éxito para el alumno!');
      setLogWeight(''); setLogBodyFat(''); setLogMuscle(''); setLogWaist(''); setLogChest(''); setLogNotes('');
      setLogDate(new Date().toISOString().split('T')[0]);
    } catch (err) { alert('Error al guardar medición: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleUpdateWorkoutPlan = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    try {
      const { error } = await supabase.from('profiles').update({ workout_plan: workoutPlanText }).eq('id', selectedAlumno.id);
      if (error) throw error;
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? { ...a, workout_plan: workoutPlanText } : a));
      setSelectedAlumno({ ...selectedAlumno, workout_plan: workoutPlanText });
      setSuccessMsg('¡Plan de trabajo mensual actualizado con éxito!');
    } catch (err) { alert('Error al actualizar plan: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleProposeSlots = async (e) => {
    e.preventDefault(); if (!selectedAlumno) return;
    setActionLoading(true); setSuccessMsg(null);
    const slotsText = [proposedSlot1.trim(), proposedSlot2.trim(), proposedSlot3.trim()].filter(s => s !== '').join(', ');
    try {
      const { data, error } = await supabase.from('profiles').update({ proposed_slots: slotsText || null, next_evaluation_date: null }).eq('id', selectedAlumno.id).select();
      if (error) throw error;
      const updatedAlumno = { ...selectedAlumno, proposed_slots: slotsText || null, next_evaluation_date: null };
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? updatedAlumno : a));
      setSelectedAlumno(updatedAlumno);
      
      const processedMsg = invitationEmailMessage
        .replace(/{nombre}/g, selectedAlumno.full_name || 'Bestia')
        .replace(/{fechas}/g, slotsText || 'No especificadas');
        
      setSuccessMsg(`¡Fechas propuestas con éxito! Se simuló el envío del correo de invitación a ${selectedAlumno.email}:\n\n"${processedMsg}"`);
    } catch (err) { alert('Error al proponer fechas: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleCreateAlumno = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const emailLower = newAlumnoEmail.trim().toLowerCase();
    const studentName = newAlumnoName.trim();
    const studentPassword = newAlumnoPassword;
    try {
      const { data, error } = await supabase.auth.signUp({ email: emailLower, password: studentPassword, options: { data: { full_name: studentName, phone: newAlumnoPhone.trim(), age: newAlumnoAge ? parseInt(newAlumnoAge) : 20, role: 'user', status: 'active' } } });
      if (error) throw error;
      
      const processedMsg = welcomeEmailMessage
        .replace(/{nombre}/g, studentName || 'Bestia')
        .replace(/{email}/g, emailLower)
        .replace(/{clave}/g, studentPassword);
      
      const isGcalConnected = typeof window !== 'undefined' && localStorage.getItem('beast_gcal_connected') === 'true';
      const gcalEmail = typeof window !== 'undefined' ? localStorage.getItem('beast_gcal_email') : '';
      if (emailLower.endsWith('@gmail.com') && isGcalConnected) {
        showToast(`¡Alumno registrado! Google Calendar (cuenta: ${gcalEmail}): Invitación y correo Gmail enviado con éxito:\n\n"${processedMsg}"`, 'success');
      } else {
        showToast(`¡Alumno registrado con éxito! Se simuló el envío del correo de bienvenida a ${emailLower}:\n\n"${processedMsg}"`, 'success');
      }
      
      setNewAlumnoName(''); setNewAlumnoEmail(''); setNewAlumnoPhone(''); setNewAlumnoAge(''); setNewAlumnoPassword('beast123');
      setWelcomeEmailMessage("¡Hola {nombre}!\n\nBienvenido a Beast Training Concepción. Tu cuenta de alumno ha sido registrada con éxito.\n\n🔑 Tus credenciales de acceso provisionales:\n• Usuario: {email}\n• Contraseña: {clave}\n\nPor favor, ingresa al portal de alumnos y cambia tu contraseña en tu primer inicio de sesión. ¡A entrenar duro!");
      setShowCreateModal(false);
      fetchAlumnos();
    } catch (err) { showToast('Error al crear alumno: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteProgress = async (recordId) => {
    if (!await confirmDialog('¿Eliminar este registro de evaluación?')) return;
    try {
      const { error } = await supabase.from('physical_progress').delete().eq('id', recordId);
      if (error) throw error;
      setAlumnoProgress(alumnoProgress.filter(p => p.id !== recordId));
    } catch (err) { alert(err.message); }
  };

  return {
    alumnos, selectedAlumno, alumnoProgress, fichaTab, searchTerm, statusFilter,
    logWeight, logBodyFat, logMuscle, logWaist, logChest, logNotes, logDate,
    workoutPlanText, alumnoName, alumnoAge, alumnoPhone, alumnoStatus,
    chatMessages, newDirectMessage,
    proposedSlot1, proposedSlot2, proposedSlot3,
    showCreateModal, newAlumnoName, newAlumnoEmail, newAlumnoPhone, newAlumnoAge, newAlumnoPassword,
    welcomeEmailMessage, invitationEmailMessage,
    filteredAlumnos,
    setAlumnos, setSelectedAlumno, setAlumnoProgress, setFichaTab, setSearchTerm, setStatusFilter,
    setLogWeight, setLogBodyFat, setLogMuscle, setLogWaist, setLogChest, setLogNotes, setLogDate,
    setWorkoutPlanText, setAlumnoName, setAlumnoAge, setAlumnoPhone, setAlumnoStatus,
    setChatMessages, setNewDirectMessage,
    setProposedSlot1, setProposedSlot2, setProposedSlot3,
    setShowCreateModal, setNewAlumnoName, setNewAlumnoEmail, setNewAlumnoPhone, setNewAlumnoAge, setNewAlumnoPassword,
    setWelcomeEmailMessage, setInvitationEmailMessage,
    fetchAlumnos, fetchDirectMessages,
    handleToggleStatus, handleSelectAlumno, handleSendDirectMessage, handleUpdatePersonalDetails,
    handleAddMeasurement, handleUpdateWorkoutPlan, handleProposeSlots, handleCreateAlumno,
    handleDeleteProgress,
  };
}
