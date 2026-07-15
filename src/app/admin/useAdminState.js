'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';

export default function useAdminState() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alumnos');
  const [demoAdminMode, setDemoAdminMode] = useState(false);

  const [alumnos, setAlumnos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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

  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerTagline, setBannerTagline] = useState('beast training concepción');
  const [bannerAlign, setBannerAlign] = useState('center');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [editingBannerId, setEditingBannerId] = useState(null);

  const [annBarText, setAnnBarText] = useState('');
  const [annBarLink, setAnnBarLink] = useState('');
  const [annBarActive, setAnnBarActive] = useState(false);
  const [annBarId, setAnnBarId] = useState(null);

  const [promoCodes, setPromoCodes] = useState([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);

  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImg, setPostImg] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  const [proposedSlot1, setProposedSlot1] = useState('');
  const [proposedSlot2, setProposedSlot2] = useState('');
  const [proposedSlot3, setProposedSlot3] = useState('');

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('normal');

  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBioP1, setAboutBioP1] = useState('');
  const [aboutBioP2, setAboutBioP2] = useState('');
  const [aboutImgUrl, setAboutImgUrl] = useState('');
  const [aboutBadgeText, setAboutBadgeText] = useState('');
  const [aboutSpec1, setAboutSpec1] = useState('');
  const [aboutSpec2, setAboutSpec2] = useState('');
  const [aboutSpec3, setAboutSpec3] = useState('');
  const [aboutSpec4, setAboutSpec4] = useState('');
  const [coachInstagram, setCoachInstagram] = useState('');
  const [coachTiktok, setCoachTiktok] = useState('');
  const [gymInstagram, setGymInstagram] = useState('');
  const [gymFacebook, setGymFacebook] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('56948925193');
  const [showCoachSocials, setShowCoachSocials] = useState(true);
  const [showGymSocials, setShowGymSocials] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlumnoName, setNewAlumnoName] = useState('');
  const [newAlumnoEmail, setNewAlumnoEmail] = useState('');
  const [newAlumnoPhone, setNewAlumnoPhone] = useState('');
  const [newAlumnoAge, setNewAlumnoAge] = useState('');
  const [newAlumnoPassword, setNewAlumnoPassword] = useState('beast123');

  const [plansList, setPlansList] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planCategory, setPlanCategory] = useState('individual');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState(1);
  const [planDesc, setPlanDesc] = useState('');
  const [planFeatures, setPlanFeatures] = useState('');
  const [planPopular, setPlanPopular] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const router = useRouter();

  const alert = (msg) => { showToast(msg, 'error'); };

  useEffect(() => {
    if (successMsg) {
      showToast(successMsg, 'success');
      setSuccessMsg(null);
    }
  }, [successMsg]);

  useEffect(() => {
    document.title = "Panel de Administración | Beast Training";
    document.querySelector('meta[name="robots"]')?.remove();
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); fetchProfile(session.user.id); }
      else { setLoading(false); }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); router.push('/'); }
    });
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) {
        setProfile(data);
        if (data.role !== 'admin') router.push('/dashboard');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (demoAdminMode || profile?.role === 'admin') {
      fetchAlumnos(); fetchBanners(); fetchPosts(); fetchAnnouncements();
      fetchAnnouncementBar(); fetchPromoCodes(); fetchAboutInfo(); fetchPlansList();
    }
  }, [profile, demoAdminMode]);

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

  const fetchPlansList = async () => {
    try {
      const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
      if (!error && data) setPlansList(data);
    } catch (err) { console.warn('Error fetching plans list:', err); }
  };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      if (!error && data) setBanners(data);
    } catch (err) { console.warn(err); }
  };

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

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase.from('about_info').select('*').single();
      if (!error && data) {
        setAboutSubtitle(data.subtitle || ''); setAboutTitle(data.title || '');
        setAboutBioP1(data.bio_p1 || ''); setAboutBioP2(data.bio_p2 || '');
        setAboutImgUrl(data.image_url || ''); setAboutBadgeText(data.badge_text || '');
        setAboutSpec1(data.spec_1 || ''); setAboutSpec2(data.spec_2 || '');
        setAboutSpec3(data.spec_3 || ''); setAboutSpec4(data.spec_4 || '');
        setCoachInstagram(data.coach_instagram || ''); setCoachTiktok(data.coach_tiktok || '');
        setGymInstagram(data.gym_instagram || ''); setGymFacebook(data.gym_facebook || '');
        setWhatsappNumber(data.whatsapp_number || '56948925193');
        setShowCoachSocials(data.show_coach_socials !== false);
        setShowGymSocials(data.show_gym_socials !== false);
      }
    } catch (err) { console.warn('Error fetching about info:', err); }
  };

  const handleSaveAboutInfo = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    try {
      const { error } = await supabase.from('about_info').update({
        subtitle: aboutSubtitle,
        title: aboutTitle,
        bio_p1: aboutBioP1,
        bio_p2: aboutBioP2,
        image_url: aboutImgUrl,
        badge_text: aboutBadgeText,
        spec_1: aboutSpec1,
        spec_2: aboutSpec2,
        spec_3: aboutSpec3,
        spec_4: aboutSpec4,
        coach_instagram: coachInstagram,
        coach_tiktok: coachTiktok,
        gym_instagram: gymInstagram,
        gym_facebook: gymFacebook,
        whatsapp_number: whatsappNumber,
        show_coach_socials: showCoachSocials,
        show_gym_socials: showGymSocials,
      }).eq('id', 'coach-settings');

      if (error) throw error;
      setSuccessMsg('¡Configuración de Nosotros y WhatsApp guardada con éxito!');
    } catch (err) { alert('Error al guardar configuración: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (!error && data) setPosts(data);
    } catch (err) { console.warn(err); }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (!error && data) setAnnouncements(data);
    } catch (err) { console.warn(err); }
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
      setSuccessMsg('¡Fechas y horas de evaluación propuestas con éxito al alumno!');
    } catch (err) { alert('Error al proponer fechas: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleCreateAlumno = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const emailLower = newAlumnoEmail.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signUp({ email: emailLower, password: newAlumnoPassword, options: { data: { full_name: newAlumnoName.trim(), phone: newAlumnoPhone.trim(), age: newAlumnoAge ? parseInt(newAlumnoAge) : 20, role: 'user', status: 'active' } } });
      if (error) throw error;
      
      const isGcalConnected = typeof window !== 'undefined' && localStorage.getItem('beast_gcal_connected') === 'true';
      if (emailLower.endsWith('@gmail.com') && isGcalConnected) {
        showToast('¡Alumno registrado! Google Calendar: Invitación agendada y correo Gmail vinculado con éxito.', 'success');
      } else {
        showToast('¡Alumno registrado con éxito! Se ha creado su perfil con membresía activa.', 'success');
      }
      
      setNewAlumnoName(''); setNewAlumnoEmail(''); setNewAlumnoPhone(''); setNewAlumnoAge(''); setNewAlumnoPassword('beast123');
      setShowCreateModal(false);
      fetchAlumnos();
    } catch (err) { showToast('Error al crear alumno: ' + err.message, 'error'); }
    finally { setActionLoading(false); }
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
    if (!confirm('¿Estás seguro de que deseas eliminar este plan?')) return;
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
    setEditingPlan(plan); setPlanName(plan.name); setPlanCategory(plan.category || 'individual');
    setPlanPrice(plan.price); setPlanDuration(plan.duration_months);
    setPlanDesc(plan.description || ''); setPlanFeatures(plan.features ? plan.features.join('\n') : '');
    setPlanPopular(plan.popular || false); setShowPlanModal(true);
  };

  const handleAddPlanClick = () => {
    setEditingPlan(null); setPlanName(''); setPlanCategory('individual'); setPlanPrice(''); setPlanDuration(1);
    setPlanDesc(''); setPlanFeatures('Clases ilimitadas\nAcceso a musculación y cardio\nEvaluación física mensual\nCasilleros y duchas');
    setPlanPopular(false); setShowPlanModal(true);
  };

  const handleDeleteProgress = async (recordId) => {
    if (!confirm('¿Eliminar este registro de evaluación?')) return;
    try {
      const { error } = await supabase.from('physical_progress').delete().eq('id', recordId);
      if (error) throw error;
      setAlumnoProgress(alumnoProgress.filter(p => p.id !== recordId));
    } catch (err) { alert(err.message); }
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

  const handleCreateBanner = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const bannerData = { title: bannerTitle, description: bannerDesc, h3_tagline: bannerTagline, text_align: bannerAlign, image_url: bannerImg || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop', link_url: bannerLink || '/planes', active: true };
    try {
      if (editingBannerId) {
        const { data, error } = await supabase.from('banners').update(bannerData).eq('id', editingBannerId).select();
        if (error) throw error;
        if (data && data.length > 0) setBanners(banners.map(b => b.id === editingBannerId ? data[0] : b));
        setSuccessMsg('¡Banner actualizado exitosamente!'); setEditingBannerId(null);
      } else {
        const { data, error } = await supabase.from('banners').insert([bannerData]).select();
        if (error) throw error;
        if (data) setBanners([data[0], ...banners]);
        setSuccessMsg('¡Banner creado exitosamente!');
      }
      setBannerTitle(''); setBannerDesc(''); setBannerTagline('beast training concepción'); setBannerAlign('center'); setBannerImg(''); setBannerLink('');
    } catch (err) { alert(err.message); }
    finally { setActionLoading(false); }
  };

  const handleEditBannerSelect = (banner) => {
    setEditingBannerId(banner.id); setBannerTitle(banner.title || ''); setBannerDesc(banner.description || '');
    setBannerTagline(banner.h3_tagline || 'beast training concepción'); setBannerAlign(banner.text_align || 'center');
    setBannerImg(banner.image_url || ''); setBannerLink(banner.link_url || '');
    const formElement = document.getElementById('bannerFormPanel');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
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
    if (!confirm('¿Estás seguro de eliminar este cupón de descuento?')) return;
    setActionLoading(true); setSuccessMsg(null);
    try {
      const { error } = await supabase.from('promo_codes').delete().eq('id', promoId);
      if (error) throw error;
      setPromoCodes(promoCodes.filter(c => c.id !== promoId));
      setSuccessMsg('¡Cupón eliminado correctamente!');
    } catch (err) { alert('Error al eliminar cupón: ' + err.message); }
    finally { setActionLoading(false); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const slug = postTitle.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    const newPost = { title: postTitle, slug, excerpt: postExcerpt, content: postContent, image_url: postImg || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', author: postAuthor || 'Staff Beast', published_at: new Date().toISOString() };
    try {
      const { data, error } = await supabase.from('blog_posts').insert([newPost]).select();
      if (error) throw error;
      if (data) setPosts([data[0], ...posts]);
      setSuccessMsg('¡Artículo de blog publicado exitosamente!');
      setPostTitle(''); setPostExcerpt(''); setPostContent(''); setPostImg(''); setPostAuthor('');
    } catch (err) { alert(err.message); }
    finally { setActionLoading(false); }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('¿Deseas eliminar este banner?')) return;
    try { const { error } = await supabase.from('banners').delete().eq('id', bannerId); if (error) throw error; setBanners(banners.filter(b => b.id !== bannerId)); } catch (err) { alert(err.message); }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Deseas eliminar este artículo?')) return;
    try { const { error } = await supabase.from('blog_posts').delete().eq('id', postId); if (error) throw error; setPosts(posts.filter(p => p.id !== postId)); } catch (err) { alert(err.message); }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (!confirm('¿Deseas eliminar este comunicado?')) return;
    try { const { error } = await supabase.from('announcements').delete().eq('id', annId); if (error) throw error; setAnnouncements(announcements.filter(a => a.id !== annId)); } catch (err) { alert(err.message); }
  };

  const filteredAlumnos = alumnos.filter(a => {
    const matchesSearch = !searchTerm || (a.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    // State
    router, user, profile, loading, activeTab, demoAdminMode,
    alumnos, banners, posts, announcements,
    selectedAlumno, alumnoProgress, fichaTab, searchTerm, statusFilter,
    logWeight, logBodyFat, logMuscle, logWaist, logChest, logNotes, logDate,
    workoutPlanText, alumnoName, alumnoAge, alumnoPhone, alumnoStatus,
    chatMessages, newDirectMessage,
    bannerTitle, bannerDesc, bannerTagline, bannerAlign, bannerImg, bannerLink, editingBannerId,
    annBarText, annBarLink, annBarActive, annBarId,
    promoCodes, newPromoCode, newPromoDiscount,
    postTitle, postExcerpt, postContent, postImg, postAuthor,
    proposedSlot1, proposedSlot2, proposedSlot3,
    annTitle, annContent, annPriority,
    aboutSubtitle, aboutTitle, aboutBioP1, aboutBioP2, aboutImgUrl, aboutBadgeText,
    aboutSpec1, aboutSpec2, aboutSpec3, aboutSpec4,
    coachInstagram, coachTiktok, gymInstagram, gymFacebook, whatsappNumber, showCoachSocials, showGymSocials,
    showCreateModal, newAlumnoName, newAlumnoEmail, newAlumnoPhone, newAlumnoAge, newAlumnoPassword,
    plansList, showPlanModal, editingPlan, planName, planCategory, planPrice, planDuration, planDesc, planFeatures, planPopular,
    actionLoading, successMsg,
    filteredAlumnos,
    // Setters
    setUser, setProfile, setLoading, setActiveTab, setDemoAdminMode,
    setAlumnos, setBanners, setPosts, setAnnouncements,
    setSelectedAlumno, setAlumnoProgress, setFichaTab, setSearchTerm, setStatusFilter,
    setLogWeight, setLogBodyFat, setLogMuscle, setLogWaist, setLogChest, setLogNotes, setLogDate,
    setWorkoutPlanText, setAlumnoName, setAlumnoAge, setAlumnoPhone, setAlumnoStatus,
    setChatMessages, setNewDirectMessage,
    setBannerTitle, setBannerDesc, setBannerTagline, setBannerAlign, setBannerImg, setBannerLink, setEditingBannerId,
    setAnnBarText, setAnnBarLink, setAnnBarActive, setAnnBarId,
    setPromoCodes, setNewPromoCode, setNewPromoDiscount,
    setPostTitle, setPostExcerpt, setPostContent, setPostImg, setPostAuthor,
    setProposedSlot1, setProposedSlot2, setProposedSlot3,
    setAnnTitle, setAnnContent, setAnnPriority,
    setAboutSubtitle, setAboutTitle, setAboutBioP1, setAboutBioP2, setAboutImgUrl, setAboutBadgeText,
    setAboutSpec1, setAboutSpec2, setAboutSpec3, setAboutSpec4,
    setCoachInstagram, setCoachTiktok, setGymInstagram, setGymFacebook, setWhatsappNumber, setShowCoachSocials, setShowGymSocials,
    setShowCreateModal, setNewAlumnoName, setNewAlumnoEmail, setNewAlumnoPhone, setNewAlumnoAge, setNewAlumnoPassword,
    setPlansList, setShowPlanModal, setEditingPlan, setPlanName, setPlanCategory, setPlanPrice, setPlanDuration, setPlanDesc, setPlanFeatures, setPlanPopular,
    setActionLoading, setSuccessMsg,
    // Handlers
    fetchAlumnos, fetchPlansList, fetchBanners, fetchAnnouncementBar, fetchPromoCodes, fetchAboutInfo, fetchPosts, fetchAnnouncements, fetchDirectMessages,
    handleToggleStatus, handleSelectAlumno, handleSendDirectMessage, handleUpdatePersonalDetails,
    handleAddMeasurement, handleUpdateWorkoutPlan, handleProposeSlots, handleCreateAlumno,
    handleSavePlan, handleDeletePlan, handleEditPlanClick, handleAddPlanClick, handleDeleteProgress,
    handleBroadcastAnnouncement, handleCreateBanner, handleEditBannerSelect, handleSaveAnnouncementBar,
    handleCreatePromoCode, handleDeletePromoCode, handleCreatePost, handleDeleteBanner, handleDeletePost, handleDeleteAnnouncement,
    handleSaveAboutInfo,
  };
}
