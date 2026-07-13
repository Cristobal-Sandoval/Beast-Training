'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, Image, FileText, Plus, Check, Trash2, ShieldCheck, Sparkles, Users, UserCheck, MessageSquare, Scale, ChevronLeft, ArrowRight, Mail, TrendingUp, Edit, Calendar, UserPlus, Dumbbell } from 'lucide-react';
import { showToast } from '@/lib/toast';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alumnos'); // alumnos, banners, blog, announcements
  const [demoAdminMode, setDemoAdminMode] = useState(false);

  // General Lists
  const [alumnos, setAlumnos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Selected Alumno Edit State
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnoProgress, setAlumnoProgress] = useState([]);
  const [fichaTab, setFichaTab] = useState('routine'); // 'routine', 'evaluations', 'chat'

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  
  // Alumno physical form
  const [logWeight, setLogWeight] = useState('');
  const [logBodyFat, setLogBodyFat] = useState('');
  const [logMuscle, setLogMuscle] = useState('');
  const [logWaist, setLogWaist] = useState('');
  const [logChest, setLogChest] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Alumno workout plan
  const [workoutPlanText, setWorkoutPlanText] = useState('');

  // Alumno personal details states
  const [alumnoName, setAlumnoName] = useState('');
  const [alumnoAge, setAlumnoAge] = useState('');
  const [alumnoPhone, setAlumnoPhone] = useState('');
  const [alumnoStatus, setAlumnoStatus] = useState('inactive');

  // Direct Message states
  const [chatMessages, setChatMessages] = useState([]);
  const [newDirectMessage, setNewDirectMessage] = useState('');

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerTagline, setBannerTagline] = useState('beast training concepción');
  const [bannerAlign, setBannerAlign] = useState('center');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [editingBannerId, setEditingBannerId] = useState(null);

  // Top Announcement Bar settings
  const [annBarText, setAnnBarText] = useState('');
  const [annBarLink, setAnnBarLink] = useState('');
  const [annBarActive, setAnnBarActive] = useState(false);
  const [annBarId, setAnnBarId] = useState(null);

  // Discount Codes (promo_codes)
  const [promoCodes, setPromoCodes] = useState([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);
  
  // Blog Form State
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');

  // Proposed Slots form states
  const [proposedSlot1, setProposedSlot1] = useState('');
  const [proposedSlot2, setProposedSlot2] = useState('');
  const [proposedSlot3, setProposedSlot3] = useState('');
  const [postImg, setPostImg] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  // Mass Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('normal');

  // Nosotros / Coach Form State
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

  // Create Alumno Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlumnoName, setNewAlumnoName] = useState('');
  const [newAlumnoEmail, setNewAlumnoEmail] = useState('');
  const [newAlumnoPhone, setNewAlumnoPhone] = useState('');
  const [newAlumnoAge, setNewAlumnoAge] = useState('');
  const [newAlumnoPassword, setNewAlumnoPassword] = useState('beast123');

  // Gym Plans Form State
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

  // Override alert globally inside this component
  const alert = (msg) => {
    showToast(msg, 'error');
  };

  useEffect(() => {
    if (successMsg) {
      showToast(successMsg, 'success');
      setSuccessMsg(null);
    }
  }, [successMsg]);

  useEffect(() => {
    document.title = "Panel de Administración | Beast Training";
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
        router.push('/');
      }
    });
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
        if (data.role !== 'admin') {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lists
  useEffect(() => {
    if (demoAdminMode || profile?.role === 'admin') {
      fetchAlumnos();
      fetchBanners();
      fetchPosts();
      fetchAnnouncements();
      fetchAnnouncementBar();
      fetchPromoCodes();
      fetchAboutInfo();
      fetchPlansList();
    }
  }, [profile, demoAdminMode]);

  const fetchAlumnos = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (!error && data) {
        // filter out admin or show all
        setAlumnos(data.filter(p => p.role !== 'admin'));
      }
    } catch (err) {
      console.warn('Error fetching profiles:', err);
    }
  };

  const fetchPlansList = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });
      if (!error && data) {
        setPlansList(data);
      }
    } catch (err) {
      console.warn('Error fetching plans list:', err);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setBanners(data);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAnnouncementBar = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*');
      if (!error && data && data.length > 0) {
        const activeBar = data.find(b => b.active) || data[0];
        setAnnBarId(activeBar.id);
        setAnnBarText(activeBar.text);
        setAnnBarLink(activeBar.link_url || '');
        setAnnBarActive(activeBar.active);
      }
    } catch (err) {
      console.warn('Error fetching announcement bar config:', err);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPromoCodes(data);
      }
    } catch (err) {
      console.warn('Error fetching promo codes:', err);
    }
  };

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .single();
      if (!error && data) {
        setAboutSubtitle(data.subtitle || '');
        setAboutTitle(data.title || '');
        setAboutBioP1(data.bio_p1 || '');
        setAboutBioP2(data.bio_p2 || '');
        setAboutImgUrl(data.image_url || '');
        setAboutBadgeText(data.badge_text || '');
        setAboutSpec1(data.spec_1 || '');
        setAboutSpec2(data.spec_2 || '');
        setAboutSpec3(data.spec_3 || '');
        setAboutSpec4(data.spec_4 || '');
      }
    } catch (err) {
      console.warn('Error fetching about info:', err);
    }
  };

  const handleSaveAboutInfo = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('about_info')
        .update({
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
        })
        .eq('id', 'coach-settings');

      if (error) throw error;
      setSuccessMsg('Información de Nosotros/Coach actualizada con éxito.');
    } catch (err) {
      alert('Error al guardar la información: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data) setPosts(data);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setAnnouncements(data);
    } catch (err) {
      console.warn(err);
    }
  };

  // Toggle alumno active/inactive status
  const handleToggleStatus = async (alumno) => {
    const newStatus = alumno.status === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', alumno.id);

      if (error) throw error;
      
      // Update state
      setAlumnos(alumnos.map(a => a.id === alumno.id ? { ...a, status: newStatus } : a));
      if (selectedAlumno && selectedAlumno.id === alumno.id) {
        setSelectedAlumno({ ...selectedAlumno, status: newStatus });
      }
    } catch (err) {
      alert('Error al alternar estado: ' + err.message);
    }
  };

  const fetchDirectMessages = async (alumnoId) => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*');
      if (!error && data) {
        const filtered = data.filter(m => 
          (m.sender_id === 'admin-uuid-123' && m.receiver_id === alumnoId) ||
          (m.sender_id === alumnoId && m.receiver_id === 'admin-uuid-123')
        );
        setChatMessages(filtered);
      }
    } catch (err) {
      console.warn('Error fetching messages:', err);
    }
  };

  // Select user for detailed edit
  const handleSelectAlumno = async (alumno) => {
    setSelectedAlumno(alumno);
    setFichaTab('routine');
    setWorkoutPlanText(alumno.workout_plan || '');
    setAlumnoName(alumno.full_name || '');
    setAlumnoAge(alumno.age || '');
    setAlumnoPhone(alumno.phone || '');
    setAlumnoStatus(alumno.status || 'inactive');
    
    // Parse proposed slots
    const slots = (alumno.proposed_slots || '').split(',');
    setProposedSlot1(slots[0]?.trim() || '');
    setProposedSlot2(slots[1]?.trim() || '');
    setProposedSlot3(slots[2]?.trim() || '');

    setSuccessMsg(null);
    
    fetchDirectMessages(alumno.id);

    // Fetch this specific user's physical progress
    try {
      const { data, error } = await supabase
        .from('physical_progress')
        .select('*')
        .eq('user_id', alumno.id)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setAlumnoProgress(data);
      }
    } catch (err) {
      console.warn('Error fetching alumno progress:', err);
    }
  };

  // Send Direct Message
  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!newDirectMessage.trim()) return;

    const newMsg = {
      sender_id: 'admin-uuid-123',
      receiver_id: selectedAlumno.id,
      content: newDirectMessage.trim()
    };

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([newMsg])
        .select();

      if (error) throw error;
      if (data) {
        setChatMessages([...chatMessages, data[0]]);
      }
      setNewDirectMessage('');
    } catch (err) {
      alert('Error al enviar mensaje: ' + err.message);
    }
  };

  // Update Alumno Personal Details
  const handleUpdatePersonalDetails = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: alumnoName,
          age: alumnoAge ? parseInt(alumnoAge) : null,
          phone: alumnoPhone,
          status: alumnoStatus
        })
        .eq('id', selectedAlumno.id);

      if (error) throw error;

      // Update local state list
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? { 
        ...a, 
        full_name: alumnoName, 
        age: alumnoAge ? parseInt(alumnoAge) : null, 
        phone: alumnoPhone,
        status: alumnoStatus
      } : a));
      
      setSelectedAlumno({ 
        ...selectedAlumno, 
        full_name: alumnoName, 
        age: alumnoAge ? parseInt(alumnoAge) : null, 
        phone: alumnoPhone,
        status: alumnoStatus
      });
      
      setSuccessMsg('¡Datos personales del alumno actualizados con éxito!');
    } catch (err) {
      alert('Error al actualizar datos personales: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit physical evaluation for selected user
  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const newRecord = {
      user_id: selectedAlumno.id,
      date: logDate,
      weight: parseFloat(logWeight),
      body_fat: logBodyFat ? parseFloat(logBodyFat) : null,
      muscle_mass: logMuscle ? parseFloat(logMuscle) : null,
      waist: logWaist ? parseFloat(logWaist) : null,
      chest: logChest ? parseFloat(logChest) : null,
      notes: logNotes
    };

    try {
      const { data, error } = await supabase
        .from('physical_progress')
        .insert([newRecord])
        .select();

      if (error) throw error;

      if (data) {
        setAlumnoProgress([data[0], ...alumnoProgress]);
      }
      setSuccessMsg('¡Evaluación física guardada con éxito para el alumno!');
      setLogWeight('');
      setLogBodyFat('');
      setLogMuscle('');
      setLogWaist('');
      setLogChest('');
      setLogNotes('');
      setLogDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      alert('Error al guardar medición: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Update Monthly Training Plan
  const handleUpdateWorkoutPlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ workout_plan: workoutPlanText })
        .eq('id', selectedAlumno.id);

      if (error) throw error;

      // Update state
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? { ...a, workout_plan: workoutPlanText } : a));
      setSelectedAlumno({ ...selectedAlumno, workout_plan: workoutPlanText });
      setSuccessMsg('¡Plan de trabajo mensual actualizado con éxito!');
    } catch (err) {
      alert('Error al actualizar plan: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProposeSlots = async (e) => {
    e.preventDefault();
    if (!selectedAlumno) return;
    setActionLoading(true);
    setSuccessMsg(null);

    const slotsText = [proposedSlot1.trim(), proposedSlot2.trim(), proposedSlot3.trim()]
      .filter(s => s !== '')
      .join(', ');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          proposed_slots: slotsText || null,
          next_evaluation_date: null
        })
        .eq('id', selectedAlumno.id)
        .select();

      if (error) throw error;
      
      const updatedAlumno = {
        ...selectedAlumno,
        proposed_slots: slotsText || null,
        next_evaluation_date: null
      };
      
      setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? updatedAlumno : a));
      setSelectedAlumno(updatedAlumno);

      setSuccessMsg('¡Fechas y horas de evaluación propuestas con éxito al alumno!');
    } catch (err) {
      alert('Error al proponer fechas: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAlumno = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const emailLower = newAlumnoEmail.trim().toLowerCase();

    try {
      // Create user
      const { data, error } = await supabase.auth.signUp({
        email: emailLower,
        password: newAlumnoPassword,
        options: {
          data: {
            full_name: newAlumnoName.trim(),
            phone: newAlumnoPhone.trim(),
            age: newAlumnoAge ? parseInt(newAlumnoAge) : 20,
            role: 'user',
            status: 'active'
          }
        }
      });

      if (error) throw error;

      showToast('¡Alumno registrado con éxito! Se ha creado su perfil con membresía activa.', 'success');
      
      // Reset form
      setNewAlumnoName('');
      setNewAlumnoEmail('');
      setNewAlumnoPhone('');
      setNewAlumnoAge('');
      setNewAlumnoPassword('beast123');
      setShowCreateModal(false);
      
      // Reload alumnos list
      fetchAlumnos();
    } catch (err) {
      showToast('Error al crear alumno: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const featuresArray = planFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f !== '');

    const planData = {
      name: planName.trim(),
      category: planCategory,
      price: parseInt(planPrice),
      duration_months: parseInt(planDuration),
      description: planDesc.trim(),
      features: featuresArray,
      popular: planPopular
    };

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update(planData)
          .eq('id', editingPlan.id);
        if (error) throw error;
        showToast('¡Plan actualizado con éxito!', 'success');
      } else {
        const { error } = await supabase
          .from('plans')
          .insert([planData]);
        if (error) throw error;
        showToast('¡Nuevo plan creado con éxito!', 'success');
      }

      setShowPlanModal(false);
      fetchPlansList();
    } catch (err) {
      showToast('Error al guardar el plan: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan? Esto afectará lo que ven los clientes en la página de planes.')) {
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);
      if (error) throw error;
      showToast('¡Plan de entrenamiento eliminado!', 'success');
      fetchPlansList();
    } catch (err) {
      showToast('Error al eliminar el plan: ' + err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPlanClick = (plan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanCategory(plan.category || 'individual');
    setPlanPrice(plan.price);
    setPlanDuration(plan.duration_months);
    setPlanDesc(plan.description || '');
    setPlanFeatures(plan.features ? plan.features.join('\n') : '');
    setPlanPopular(plan.popular || false);
    setShowPlanModal(true);
  };

  const handleAddPlanClick = () => {
    setEditingPlan(null);
    setPlanName('');
    setPlanCategory('individual');
    setPlanPrice('');
    setPlanDuration(1);
    setPlanDesc('');
    setPlanFeatures('Clases ilimitadas\nAcceso a musculación y cardio\nEvaluación física mensual\nCasilleros y duchas');
    setPlanPopular(false);
    setShowPlanModal(true);
  };

  const handleDeleteProgress = async (recordId) => {
    if (!confirm('¿Eliminar este registro de evaluación?')) return;
    try {
      const { error } = await supabase
        .from('physical_progress')
        .delete()
        .eq('id', recordId);
      if (error) throw error;
      setAlumnoProgress(alumnoProgress.filter(p => p.id !== recordId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Broadcast Mass Announcement (Simulating Emails too)
  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const newAnn = {
      title: annTitle,
      content: annContent,
      priority: annPriority
    };

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([newAnn])
        .select();

      if (error) throw error;

      if (data) {
        setAnnouncements([data[0], ...announcements]);
      }

      // Simulate Email Dispatch Notification
      const activeCount = alumnos.filter(a => a.status === 'active').length;
      setSuccessMsg(`¡Mensaje publicado con éxito! Se simuló el envío a los correos electrónicos de los ${activeCount} alumnos activos.`);
      
      setAnnTitle('');
      setAnnContent('');
      setAnnPriority('normal');
    } catch (err) {
      alert('Error al enviar comunicado: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const bannerData = {
      title: bannerTitle,
      description: bannerDesc,
      h3_tagline: bannerTagline,
      text_align: bannerAlign,
      image_url: bannerImg || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
      link_url: bannerLink || '/planes',
      active: true
    };

    try {
      if (editingBannerId) {
        const { data, error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBannerId)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setBanners(banners.map(b => b.id === editingBannerId ? data[0] : b));
        }

        setSuccessMsg('¡Banner actualizado exitosamente!');
        setEditingBannerId(null);
      } else {
        const { data, error } = await supabase
          .from('banners')
          .insert([bannerData])
          .select();

        if (error) throw error;
        if (data) setBanners([data[0], ...banners]);

        setSuccessMsg('¡Banner creado exitosamente!');
      }

      setBannerTitle('');
      setBannerDesc('');
      setBannerTagline('beast training concepción');
      setBannerAlign('center');
      setBannerImg('');
      setBannerLink('');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditBannerSelect = (banner) => {
    setEditingBannerId(banner.id);
    setBannerTitle(banner.title || '');
    setBannerDesc(banner.description || '');
    setBannerTagline(banner.h3_tagline || 'beast training concepción');
    setBannerAlign(banner.text_align || 'center');
    setBannerImg(banner.image_url || '');
    setBannerLink(banner.link_url || '');

    const formElement = document.getElementById('bannerFormPanel');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveAnnouncementBar = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    try {
      let error;
      if (annBarId) {
        const { error: err } = await supabase
          .from('announcement_bar')
          .update({
            text: annBarText,
            link_url: annBarLink,
            active: annBarActive
          })
          .eq('id', annBarId);
        error = err;
      } else {
        const { data, error: err } = await supabase
          .from('announcement_bar')
          .insert([{
            text: annBarText,
            link_url: annBarLink,
            active: annBarActive
          }])
          .select();
        error = err;
        if (data && data.length > 0) setAnnBarId(data[0].id);
      }

      if (error) throw error;
      setSuccessMsg('¡Cintillo de anuncios superior guardado correctamente!');
    } catch (err) {
      alert('Error al guardar cintillo: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    setActionLoading(true);
    setSuccessMsg(null);

    const newPromo = {
      code: newPromoCode.trim().toUpperCase(),
      discount_percent: parseInt(newPromoDiscount) || 0,
      active: true
    };

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert([newPromo])
        .select();

      if (error) throw error;
      if (data) setPromoCodes([data[0], ...promoCodes]);

      setSuccessMsg(`¡Cupón ${newPromo.code} creado exitosamente!`);
      setNewPromoCode('');
      setNewPromoDiscount(20);
    } catch (err) {
      alert('Error al crear cupón: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePromoCode = async (promoId) => {
    if (!confirm('¿Estás seguro de eliminar este cupón de descuento?')) return;
    setActionLoading(true);
    setSuccessMsg(null);

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', promoId);

      if (error) throw error;
      setPromoCodes(promoCodes.filter(c => c.id !== promoId));
      setSuccessMsg('¡Cupón eliminado correctamente!');
    } catch (err) {
      alert('Error al eliminar cupón: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg(null);

    const slug = postTitle.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newPost = {
      title: postTitle,
      slug,
      excerpt: postExcerpt,
      content: postContent,
      image_url: postImg || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
      author: postAuthor || 'Staff Beast',
      published_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select();

      if (error) throw error;
      if (data) setPosts([data[0], ...posts]);

      setSuccessMsg('¡Artículo de blog publicado exitosamente!');
      setPostTitle('');
      setPostExcerpt('');
      setPostContent('');
      setPostImg('');
      setPostAuthor('');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('¿Deseas eliminar este banner?')) return;
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId);
      if (error) throw error;
      setBanners(banners.filter(b => b.id !== bannerId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Deseas eliminar este artículo?')) return;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (!confirm('¿Deseas eliminar este comunicado?')) return;
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', annId);
      if (error) throw error;
      setAnnouncements(announcements.filter(a => a.id !== annId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>Verificando credenciales de administrador...</p>
      </div>
    );
  }

  if (!demoAdminMode && profile?.role !== 'admin') {
    return (
      <div className={styles.unauthorizedWrapper}>
        <div className={`${styles.unauthorizedCard} glass glow-orange`}>
          <ShieldAlert size={48} className={styles.alertIcon} />
          <h2>Acceso Restringido</h2>
          <p>
            No tienes permisos de Administrador para ver esta página. Inicia sesión con la cuenta de administrador o usa el simulador local para pruebas.
          </p>
          <div className={styles.authActions}>
            <button onClick={() => router.push('/login')} className={styles.loginAdminBtn}>
              Iniciar Sesión Admin
            </button>
            <button onClick={() => setDemoAdminMode(true)} className={styles.simulateBtn}>
              <Sparkles size={16} /> Simular Modo Admin (Pruebas)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredAlumnos = alumnos.filter(alumno => {
    const matchesSearch = 
      (alumno.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumno.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && alumno.status === statusFilter;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Banner admin notification */}
        <div className={styles.adminIndicatorBar}>
          <div className={styles.indicatorLeft}>
            <ShieldCheck size={20} className={styles.successIcon} />
            <span>
              {demoAdminMode ? 'Modo de simulación de administrador activo (local)' : 'Conectado como Administrador de Beast Training'}
            </span>
          </div>
          {demoAdminMode && (
            <button onClick={() => setDemoAdminMode(false)} className={styles.exitDemoBtn}>
              Salir del Demo
            </button>
          )}
        </div>

        {/* Dashboard Title */}
        <section className={styles.header}>
          <div>
            <h1>Panel de Control Staff</h1>
            <p>Monitorea alumnos, edita rutinas, evalúa su físico y envía comunicados importantes.</p>
          </div>
        </section>

        {/* Success toast */}
        {successMsg && (
          <div className={`${styles.successAlert} glass`}>
            <Check size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Check if Alumno is selected for details */}
        {selectedAlumno ? (
          /* DETAILED STUDENT EDIT WINDOW */
          <div className={styles.alumnoDetailContainer}>
            <button onClick={() => setSelectedAlumno(null)} className={styles.backBtn}>
              <ChevronLeft size={16} /> Volver a la Lista de Alumnos
            </button>

            <div className={styles.alumnoDetailHeader}>
              <h2>Editar Ficha: <span className={styles.accent}>{selectedAlumno.full_name}</span></h2>
              <div className={styles.alumnoDetailActions}>
                <span className={selectedAlumno.status === 'active' ? styles.activeBadge : styles.inactiveBadge}>
                  {selectedAlumno.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={() => handleToggleStatus(selectedAlumno)}
                  className={selectedAlumno.status === 'active' ? styles.deactivateBtn : styles.activateBtn}
                >
                  {selectedAlumno.status === 'active' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                </button>
              </div>
            </div>

            {/* Horizontal Sub-Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '1px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFichaTab('routine')}
                style={{
                  background: fichaTab === 'routine' ? 'rgba(255, 87, 0, 0.1)' : 'none',
                  color: fichaTab === 'routine' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: fichaTab === 'routine' ? '2px solid var(--primary)' : '2px solid transparent',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: 'auto',
                  transition: 'all 0.2s'
                }}
              >
                Ficha & Rutina
              </button>
              <button
                onClick={() => setFichaTab('evaluations')}
                style={{
                  background: fichaTab === 'evaluations' ? 'rgba(255, 87, 0, 0.1)' : 'none',
                  color: fichaTab === 'evaluations' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: fichaTab === 'evaluations' ? '2px solid var(--primary)' : '2px solid transparent',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: 'auto',
                  transition: 'all 0.2s'
                }}
              >
                Historial & Evaluaciones
              </button>
              <button
                onClick={() => setFichaTab('chat')}
                style={{
                  background: fichaTab === 'chat' ? 'rgba(255, 87, 0, 0.1)' : 'none',
                  color: fichaTab === 'chat' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: fichaTab === 'chat' ? '2px solid var(--primary)' : '2px solid transparent',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: 'auto',
                  transition: 'all 0.2s'
                }}
              >
                Mensajes Privados
              </button>
            </div>

            {/* Sub-Tab Content: Ficha & Rutina */}
            {fichaTab === 'routine' && (
              <div>
                {/* CARD PANEL: DATOS PERSONALES */}
                <div className={`${styles.cardPanel} glass glow-orange`} style={{ marginBottom: '30px' }}>
                  <div className={styles.panelTitleWrapper}>
                    <UserCheck size={20} className={styles.accent} />
                    <h2>Datos Personales del Alumno</h2>
                  </div>
                  <p className={styles.panelInstructions}>Actualiza los datos personales básicos y el estado de la membresía (pago) del alumno.</p>
                  
                  <form onSubmit={handleUpdatePersonalDetails} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoName">Nombre Completo</label>
                        <input
                          id="alumnoName"
                          type="text"
                          value={alumnoName}
                          onChange={(e) => setAlumnoName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoEmail">Correo Electrónico (Solo Lectura)</label>
                        <input
                          id="alumnoEmail"
                          type="email"
                          value={selectedAlumno.email}
                          disabled
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoAge">Edad</label>
                        <input
                          id="alumnoAge"
                          type="number"
                          placeholder="Ej: 25"
                          value={alumnoAge}
                          onChange={(e) => setAlumnoAge(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoPhone">Teléfono</label>
                        <input
                          id="alumnoPhone"
                          type="text"
                          placeholder="Ej: +56 9 1234 5678"
                          value={alumnoPhone}
                          onChange={(e) => setAlumnoPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoStatus">Estado de Membresía (Pago)</label>
                        <select
                          id="alumnoStatus"
                          value={alumnoStatus}
                          onChange={(e) => setAlumnoStatus(e.target.value)}
                          className={styles.selectInput}
                        >
                          <option value="active">Activo (Membresía Pagada)</option>
                          <option value="inactive">Inactivo (Vencido / Sin Pago)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Guardar Datos Personales
                    </button>
                  </form>
                </div>

                {/* Edit workout plan */}
                <div className={`${styles.cardPanel} glass glow-orange`}>
                  <div className={styles.panelTitleWrapper}>
                    <FileText size={20} className={styles.accent} />
                    <h2>Plan de Trabajo del Mes</h2>
                  </div>
                  <p className={styles.panelInstructions}>Escribe las rutinas, series y metas físicas asignadas al alumno.</p>
                  <form onSubmit={handleUpdateWorkoutPlan} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <textarea
                        value={workoutPlanText}
                        onChange={(e) => setWorkoutPlanText(e.target.value)}
                        placeholder="• Press Banca: 4x8&#10;• Sentadilla: 4x10&#10;• Correr 20 min..."
                        rows={8}
                        className={styles.planTextarea}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                      Actualizar Plan de Trabajo
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-Tab Content: Historial & Evaluaciones */}
            {fichaTab === 'evaluations' && (
              <div>
                {/* Form to submit physical progress */}
                <div className={`${styles.cardPanel} glass glow-orange`}>
                  <div className={styles.panelTitleWrapper}>
                    <TrendingUp size={20} className={styles.accent} />
                    <h2>Registrar Nueva Evaluación Física</h2>
                  </div>
                  <p className={styles.panelInstructions}>Registra los resultados de las mediciones corporales mensuales realizadas al alumno.</p>

                  <form onSubmit={handleAddMeasurement} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logDate">Fecha de Evaluación</label>
                        <input
                          id="logDate"
                          type="date"
                          value={logDate}
                          onChange={(e) => setLogDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logWeight">Peso (kg)</label>
                        <input
                          id="logWeight"
                          type="number"
                          step="0.1"
                          placeholder="Ej: 78.5"
                          value={logWeight}
                          onChange={(e) => setLogWeight(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logBodyFat">Grasa Corporal (%)</label>
                        <input
                          id="logBodyFat"
                          type="number"
                          step="0.1"
                          placeholder="Ej: 16.4"
                          value={logBodyFat}
                          onChange={(e) => setLogBodyFat(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logMuscle">Masa Muscular (kg)</label>
                        <input
                          id="logMuscle"
                          type="number"
                          step="0.1"
                          placeholder="Ej: 34.2"
                          value={logMuscle}
                          onChange={(e) => setLogMuscle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logWaist">Cintura (cm)</label>
                        <input
                          id="logWaist"
                          type="number"
                          step="0.1"
                          placeholder="84"
                          value={logWaist}
                          onChange={(e) => setLogWaist(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="logChest">Pecho (cm)</label>
                        <input
                          id="logChest"
                          type="number"
                          step="0.1"
                          placeholder="104"
                          value={logChest}
                          onChange={(e) => setLogChest(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="logNotes">Notas de la evaluación</label>
                      <input
                        id="logNotes"
                        type="text"
                        placeholder="Mejora en masa muscular, bajar azúcares..."
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                      />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Guardar Mediciones
                    </button>
                  </form>
                </div>

                {/* CARD PANEL: PROPONER FECHAS DE EVALUACION */}
                <div className={`${styles.cardPanel} glass glow-orange`} style={{ marginTop: '30px' }}>
                  <div className={styles.panelTitleWrapper}>
                    <Calendar size={20} className={styles.accent} />
                    <h2>Proponer Fechas de Evaluación</h2>
                  </div>
                  <p className={styles.panelInstructions}>
                    Propón 3 opciones de fechas y horas para la próxima evaluación física de {selectedAlumno.full_name}. El alumno elegirá una desde su dashboard.
                  </p>
                  
                  {selectedAlumno.next_evaluation_date && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff' }}>
                        ¡Fecha confirmada por el alumno!: <strong>{selectedAlumno.next_evaluation_date}</strong>
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleProposeSlots} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="slot1">Opción 1</label>
                        <input
                          id="slot1"
                          type="text"
                          placeholder="Ej: Lunes 6 de Julio (10:00)"
                          value={proposedSlot1}
                          onChange={(e) => setProposedSlot1(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="slot2">Opción 2</label>
                        <input
                          id="slot2"
                          type="text"
                          placeholder="Ej: Miércoles 8 de Julio (15:30)"
                          value={proposedSlot2}
                          onChange={(e) => setProposedSlot2(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="slot3">Opción 3</label>
                        <input
                          id="slot3"
                          type="text"
                          placeholder="Ej: Viernes 10 de Julio (18:00)"
                          value={proposedSlot3}
                          onChange={(e) => setProposedSlot3(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Enviar Opciones al Alumno
                    </button>
                  </form>
                </div>

                {/* List past evaluations */}
                <div className={`${styles.cardPanel} glass`} style={{ marginTop: '30px' }}>
                  <h2>Historial de Mediciones del Alumno</h2>
                  {alumnoProgress.length === 0 ? (
                    <p className={styles.emptyText}>No hay evaluaciones cargadas para este alumno.</p>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Peso (kg)</th>
                            <th>Grasa (%)</th>
                            <th>Masa Musc. (kg)</th>
                            <th>Cintura (cm)</th>
                            <th>Pecho (cm)</th>
                            <th>Notas</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alumnoProgress.map((record) => (
                            <tr key={record.id}>
                              <td>{new Date(record.date).toLocaleDateString('es-CL')}</td>
                              <td>{record.weight}</td>
                              <td>{record.body_fat || '--'}</td>
                              <td>{record.muscle_mass || '--'}</td>
                              <td>{record.waist || '--'}</td>
                              <td>{record.chest || '--'}</td>
                              <td style={{ fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={record.notes}>
                                {record.notes || '--'}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleDeleteProgress(record.id)}
                                  className={styles.deleteBtn}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-Tab Content: Chat Privado */}
            {fichaTab === 'chat' && (
              <div className={`${styles.cardPanel} glass glow-orange`}>
                <div className={styles.panelTitleWrapper}>
                  <MessageSquare size={20} className={styles.accent} />
                  <h2>Mensajes Personales con el Alumno</h2>
                </div>
                <p className={styles.panelInstructions}>Bandeja de comunicación directa y privada con {selectedAlumno.full_name}.</p>

                <div className={styles.chatBox}>
                  {chatMessages.length === 0 ? (
                    <p className={styles.emptyText}>No hay mensajes registrados. Escribe uno abajo para iniciar la conversación.</p>
                  ) : (
                    <div className={styles.chatMessagesWrapper}>
                      {chatMessages.map((msg, idx) => {
                        const isAdminMsg = msg.sender_id === 'admin-uuid-123';
                        return (
                          <div
                            key={`${msg.id || idx}-${idx}`}
                            className={`${styles.chatMessage} ${isAdminMsg ? styles.chatMsgAdmin : styles.chatMsgUser}`}
                          >
                            <div className={styles.chatMsgHeader}>
                              <strong>{isAdminMsg ? 'Tú (Staff)' : selectedAlumno.full_name}</strong>
                              <span>{new Date(msg.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p>{msg.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendDirectMessage} className={styles.chatForm}>
                  <textarea
                    value={newDirectMessage}
                    onChange={(e) => setNewDirectMessage(e.target.value)}
                    placeholder="Escribe un mensaje para el alumno..."
                    rows={3}
                    required
                  />
                  <button type="submit" className={styles.submitBtn} style={{ marginTop: '10px' }}>
                    Enviar Mensaje Privado
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* GENERAL TABS NAVIGATION */
          <div className={styles.adminLayout}>
            {/* Sidebar navigation tabs */}
            <aside className={styles.sidebar}>
              <button
                onClick={() => { setActiveTab('alumnos'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'alumnos' ? styles.activeTab : ''}`}
              >
                <Users size={18} />
                <span>Gestión de Alumnos</span>
              </button>
              <button
                onClick={() => { setActiveTab('announcements'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'announcements' ? styles.activeTab : ''}`}
              >
                <MessageSquare size={18} />
                <span>Anuncios Masivos</span>
              </button>
              <button
                onClick={() => { setActiveTab('banners'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'banners' ? styles.activeTab : ''}`}
              >
                <Image size={18} />
                <span>Banners de Inicio</span>
              </button>
              <button
                onClick={() => { setActiveTab('blog'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'blog' ? styles.activeTab : ''}`}
              >
                <FileText size={18} />
                <span>Noticias (Blog)</span>
              </button>
              <button
                onClick={() => { setActiveTab('promos'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'promos' ? styles.activeTab : ''}`}
              >
                <Sparkles size={18} />
                <span>Promociones & Cupones</span>
              </button>
              <button
                onClick={() => { setActiveTab('plans'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'plans' ? styles.activeTab : ''}`}
              >
                <Dumbbell size={18} />
                <span>Planes de Gimnasio</span>
              </button>
              <button
                onClick={() => { setActiveTab('about'); setSuccessMsg(null); }}
                className={`${styles.tabBtn} ${activeTab === 'about' ? styles.activeTab : ''}`}
              >
                <UserCheck size={18} />
                <span>Nosotros (Coach)</span>
              </button>
            </aside>

            {/* main Content area */}
            <main className={styles.mainContent}>
              {/* Tab: Alumnos */}
              {activeTab === 'alumnos' && (
                <div className={`${styles.cardPanel} glass`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2>Directorio de Alumnos</h2>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      style={{
                        background: 'var(--primary)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(255, 87, 0, 0.25)'
                      }}
                      type="button"
                    >
                      <UserPlus size={16} />
                      Registrar Nuevo Alumno
                    </button>
                  </div>

                  {/* Modal: Crear Nuevo Alumno */}
                  {showCreateModal && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.75)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000,
                      padding: '20px'
                    }}>
                      <div className={`${styles.form} glass`} style={{
                        maxWidth: '500px',
                        width: '100%',
                        padding: '30px',
                        borderRadius: '12px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                          <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>Crear Nuevo Alumno</h2>
                          <button 
                            onClick={() => setShowCreateModal(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}
                            type="button"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleCreateAlumno} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className={styles.inputGroup}>
                            <label>Nombre Completo</label>
                            <input
                              type="text"
                              value={newAlumnoName}
                              onChange={(e) => setNewAlumnoName(e.target.value)}
                              placeholder="Ej: Cristóbal Sandoval"
                              required
                            />
                          </div>

                          <div className={styles.inputGroup}>
                            <label>Correo Electrónico</label>
                            <input
                              type="email"
                              value={newAlumnoEmail}
                              onChange={(e) => setNewAlumnoEmail(e.target.value)}
                              placeholder="Ej: alumno@gmail.com"
                              required
                            />
                          </div>

                          <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                              <label>Teléfono</label>
                              <input
                                type="text"
                                value={newAlumnoPhone}
                                onChange={(e) => setNewAlumnoPhone(e.target.value)}
                                placeholder="Ej: +56912345678"
                                required
                              />
                            </div>

                            <div className={styles.inputGroup}>
                              <label>Edad</label>
                              <input
                                type="number"
                                value={newAlumnoAge}
                                onChange={(e) => setNewAlumnoAge(e.target.value)}
                                placeholder="Ej: 24"
                                required
                              />
                            </div>
                          </div>

                          <div className={styles.inputGroup}>
                            <label>Contraseña de Acceso</label>
                            <input
                              type="text"
                              value={newAlumnoPassword}
                              onChange={(e) => setNewAlumnoPassword(e.target.value)}
                              placeholder="Contraseña inicial del alumno"
                              required
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              * Indícale esta contraseña al alumno para su primer ingreso. Podrá cambiarla después.
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                              type="button"
                              onClick={() => setShowCreateModal(false)}
                              className={styles.deactivateBtn}
                              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: '#ffffff' }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className={styles.submitBtn}
                              disabled={actionLoading}
                              style={{ flex: 1.5, margin: 0 }}
                            >
                              {actionLoading ? 'Registrando...' : 'Registrar Alumno'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  {alumnos.length === 0 ? (
                    <p className={styles.emptyText}>No hay alumnos registrados.</p>
                  ) : (
                    <div>
                      {/* Search Bar & Status Filters */}
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Buscar alumno por nombre o correo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            flex: 1,
                            minWidth: '240px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                        
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setStatusFilter('all')}
                            style={{
                              background: statusFilter === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                              color: '#ffffff',
                              border: '1px solid ' + (statusFilter === 'all' ? 'var(--primary)' : 'var(--border-light)'),
                              padding: '8px 14px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              minHeight: 'auto'
                            }}
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => setStatusFilter('active')}
                            style={{
                              background: statusFilter === 'active' ? 'var(--success)' : 'rgba(255,255,255,0.03)',
                              color: '#ffffff',
                              border: '1px solid ' + (statusFilter === 'active' ? 'var(--success)' : 'var(--border-light)'),
                              padding: '8px 14px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              minHeight: 'auto'
                            }}
                          >
                            Activos
                          </button>
                          <button
                            onClick={() => setStatusFilter('inactive')}
                            style={{
                              background: statusFilter === 'inactive' ? 'var(--error)' : 'rgba(255,255,255,0.03)',
                              color: '#ffffff',
                              border: '1px solid ' + (statusFilter === 'inactive' ? 'var(--error)' : 'var(--border-light)'),
                              padding: '8px 14px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              minHeight: 'auto'
                            }}
                          >
                            Inactivos
                          </button>
                        </div>
                      </div>

                      {filteredAlumnos.length === 0 ? (
                        <p className={styles.emptyText}>No se encontraron alumnos con los filtros aplicados.</p>
                      ) : (
                        <div className={styles.alumnosListGrid}>
                          {filteredAlumnos.map((alumno) => (
                            <div key={alumno.id} className={styles.alumnoCard}>
                              <div className={styles.alumnoCardInfo}>
                                <h3>{alumno.full_name}</h3>
                                <p>{alumno.email}</p>
                                <span className={alumno.status === 'active' ? styles.activeTextBadge : styles.inactiveTextBadge}>
                                  Membresía: {alumno.status === 'active' ? 'Activa' : 'Inactiva'}
                                </span>
                              </div>
                              
                              <div className={styles.alumnoCardBtns}>
                                <button
                                  onClick={() => handleToggleStatus(alumno)}
                                  className={alumno.status === 'active' ? styles.deactivateBtnSmall : styles.activateBtnSmall}
                                  title={alumno.status === 'active' ? 'Desactivar Alumno' : 'Activar Alumno'}
                                >
                                  <UserCheck size={16} />
                                </button>
                                <button
                                  onClick={() => handleSelectAlumno(alumno)}
                                  className={styles.viewEditBtn}
                                >
                                  Ver / Evaluar <ArrowRight size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Announcements */}
              {activeTab === 'announcements' && (
                <div className={styles.tabContent}>
                  {/* Send mass announcement */}
                  <div className={`${styles.cardPanel} glass`}>
                    <div className={styles.panelTitleWrapper}>
                      <Mail size={20} className={styles.accent} />
                      <h2>Enviar Comunicado Masivo</h2>
                    </div>
                    <p className={styles.panelInstructions}>Envía avisos a la bandeja de los paneles de alumnos y simula despachos a sus correos.</p>
                    <form onSubmit={handleBroadcastAnnouncement} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="annTitle">Título del comunicado</label>
                        <input
                          id="annTitle"
                          type="text"
                          placeholder="Ej: Cambio de Horario Festivo"
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="annPriority">Prioridad del Mensaje</label>
                          <select
                            id="annPriority"
                            value={annPriority}
                            onChange={(e) => setAnnPriority(e.target.value)}
                            className={styles.selectInput}
                          >
                            <option value="normal">Normal (Mensaje Gris)</option>
                            <option value="priority">Urgente / Prioritario (Mensaje Rojo)</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="annContent">Cuerpo del Mensaje</label>
                        <textarea
                          id="annContent"
                          placeholder="Escribe el comunicado para los alumnos..."
                          value={annContent}
                          onChange={(e) => setAnnContent(e.target.value)}
                          rows={4}
                          required
                        />
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        Publicar y Notificar Alumnos
                      </button>
                    </form>
                  </div>

                  {/* List sent announcements */}
                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Mensajes Emitidos</h2>
                    {announcements.length === 0 ? (
                      <p className={styles.emptyText}>No hay comunicados registrados.</p>
                    ) : (
                      <div className={styles.listGrid}>
                        {announcements.map((ann) => (
                          <div key={ann.id} className={styles.listItemCard}>
                            <div className={styles.itemInfo}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3>{ann.title}</h3>
                                <span className={ann.priority === 'priority' ? styles.prioBadgeRed : styles.prioBadgeGray}>
                                  {ann.priority === 'priority' ? 'Prioritario' : 'Normal'}
                                </span>
                              </div>
                              <p>{ann.content}</p>
                              <span className={styles.itemBadge}>Publicado: {new Date(ann.created_at || ann.published_at).toLocaleDateString('es-CL')}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id)}
                              className={styles.deleteBtn}
                              title="Eliminar Mensaje"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Banners */}
              {activeTab === 'banners' && (
                <div className={styles.tabContent}>
                  <div id="bannerFormPanel" className={`${styles.cardPanel} glass`}>
                    <h2>{editingBannerId ? 'Editar Banner' : 'Subir Nuevo Banner'}</h2>
                    <form onSubmit={handleCreateBanner} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="bannerTitle">Título del Banner (H1)</label>
                        <input
                          id="bannerTitle"
                          type="text"
                          placeholder="Ej: Saca la Bestia que Llevas Dentro"
                          value={bannerTitle}
                          onChange={(e) => setBannerTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="bannerDesc">Descripción Corta (H2 / Subtítulo)</label>
                        <input
                          id="bannerDesc"
                          type="text"
                          placeholder="Ej: Entrenamiento funcional en Concepción..."
                          value={bannerDesc}
                          onChange={(e) => setBannerDesc(e.target.value)}
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="bannerTagline">Tagline Superior (H3 / Micro-texto)</label>
                          <input
                            id="bannerTagline"
                            type="text"
                            placeholder="Ej: beast training concepción"
                            value={bannerTagline}
                            onChange={(e) => setBannerTagline(e.target.value)}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label htmlFor="bannerAlign">Alineación del Texto</label>
                          <select
                            id="bannerAlign"
                            value={bannerAlign}
                            onChange={(e) => setBannerAlign(e.target.value)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border-light)',
                              borderRadius: '6px',
                              padding: '10px 14px',
                              color: '#ffffff',
                              fontSize: '0.95rem',
                              outline: 'none',
                              minHeight: '44px'
                            }}
                          >
                            <option value="left" style={{ background: '#121212' }}>Izquierda</option>
                            <option value="center" style={{ background: '#121212' }}>Centro</option>
                            <option value="right" style={{ background: '#121212' }}>Derecha</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="bannerImg">URL de la Foto</label>
                          <input
                            id="bannerImg"
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={bannerImg}
                            onChange={(e) => setBannerImg(e.target.value)}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label htmlFor="bannerLink">Enlace (Redirección)</label>
                          <input
                            id="bannerLink"
                            type="text"
                            placeholder="Ej: /planes"
                            value={bannerLink}
                            onChange={(e) => setBannerLink(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <button type="submit" className={styles.submitBtn} style={{ flex: 1, minHeight: '44px' }}>
                          {editingBannerId ? 'Guardar Cambios' : 'Crear y Publicar Banner'}
                        </button>
                        {editingBannerId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBannerId(null);
                              setBannerTitle('');
                              setBannerDesc('');
                              setBannerTagline('beast training concepción');
                              setBannerAlign('center');
                              setBannerImg('');
                              setBannerLink('');
                            }}
                            className={styles.deactivateBtnSmall}
                            style={{ padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', height: 'auto', minHeight: '44px' }}
                          >
                            Cancelar Edición
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Banners Activos</h2>
                    {banners.length === 0 ? (
                      <p className={styles.emptyText}>No hay banners guardados.</p>
                    ) : (
                      <div className={styles.listGrid}>
                        {banners.map((banner) => (
                          <div key={banner.id} className={styles.listItemCard}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={banner.image_url} alt={banner.title} className={styles.itemImg} />
                            <div className={styles.itemInfo}>
                              <h3>{banner.title}</h3>
                              <p>{banner.description}</p>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                                <span className={styles.itemBadge} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                  Tagline: {banner.h3_tagline || 'Ninguno'}
                                </span>
                                <span className={styles.itemBadge} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                  Alineación: {banner.text_align === 'left' ? 'Izquierda' : banner.text_align === 'right' ? 'Derecha' : 'Centro'}
                                </span>
                                <span className={styles.itemBadge} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                  Destino: {banner.link_url}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <button
                                onClick={() => handleEditBannerSelect(banner)}
                                className={styles.viewEditBtn}
                                style={{ padding: '6px', borderRadius: '6px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Editar Banner"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(banner.id)}
                                className={styles.deleteBtn}
                                style={{ padding: '6px', borderRadius: '6px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Eliminar Banner"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Blog Noticias */}
              {activeTab === 'blog' && (
                <div className={styles.tabContent}>
                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Redactar Noticia / Artículo</h2>
                    <form onSubmit={handleCreatePost} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="postTitle">Título del Artículo</label>
                        <input
                          id="postTitle"
                          type="text"
                          placeholder="Ej: Mitos de la creatina"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="postAuthor">Autor</label>
                          <input
                            id="postAuthor"
                            type="text"
                            placeholder="Ej: Coach Felipe"
                            value={postAuthor}
                            onChange={(e) => setPostAuthor(e.target.value)}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label htmlFor="postImg">URL de la Foto</label>
                          <input
                            id="postImg"
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={postImg}
                            onChange={(e) => setPostImg(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="postExcerpt">Resumen Corto</label>
                        <input
                          id="postExcerpt"
                          type="text"
                          placeholder="Resumen corto..."
                          value={postExcerpt}
                          onChange={(e) => setPostExcerpt(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="postContent">Contenido completo</label>
                        <textarea
                          id="postContent"
                          placeholder="Redacta el contenido..."
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          rows={6}
                          required
                        />
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        Publicar Noticia
                      </button>
                    </form>
                  </div>

                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Noticias Publicadas</h2>
                    {posts.length === 0 ? (
                      <p className={styles.emptyText}>No hay artículos publicados.</p>
                    ) : (
                      <div className={styles.listGrid}>
                        {posts.map((post) => (
                          <div key={post.id} className={styles.listItemCard}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.image_url} alt={post.title} className={styles.itemImg} />
                            <div className={styles.itemInfo}>
                              <h3>{post.title}</h3>
                              <p>{post.excerpt}</p>
                              <span className={styles.itemBadge}>Por {post.author} • {new Date(post.published_at).toLocaleDateString('es-CL')}</span>
                            </div>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className={styles.deleteBtn}
                              title="Eliminar Noticia"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}
            {/* Tab: Promociones & Cupones */}
              {activeTab === 'promos' && (
                <div className={styles.tabContent}>
                  {/* Top Announcement Bar Customizer */}
                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Cintillo de Anuncios Superior</h2>
                    <p className={styles.panelInstructions}>
                      Configura el mensaje flotante que se muestra en la parte superior del sitio web (afuera de los paneles).
                    </p>
                    <form onSubmit={handleSaveAnnouncementBar} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="annBarText">Mensaje del Cintillo</label>
                        <input
                          id="annBarText"
                          type="text"
                          placeholder="Ej: ¡PROMO IMPERDIBLE: 20% DE DESCUENTO CON EL CÓDIGO BEAST20!"
                          value={annBarText}
                          onChange={(e) => setAnnBarText(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="annBarLink">Enlace de Redirección (Opcional)</label>
                          <input
                            id="annBarLink"
                            type="text"
                            placeholder="Ej: /planes"
                            value={annBarLink}
                            onChange={(e) => setAnnBarLink(e.target.value)}
                          />
                        </div>
                        <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label htmlFor="annBarActive" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                            <input
                              id="annBarActive"
                              type="checkbox"
                              checked={annBarActive}
                              onChange={(e) => setAnnBarActive(e.target.checked)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span>Mostrar Cintillo Activo</span>
                          </label>
                        </div>
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        Guardar Cintillo
                      </button>
                    </form>
                  </div>

                  {/* Promo Codes Manager */}
                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Crear Código de Descuento (Cupón)</h2>
                    <form onSubmit={handleCreatePromoCode} className={styles.form}>
                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="newPromoCode">Código del Cupón</label>
                          <input
                            id="newPromoCode"
                            type="text"
                            placeholder="Ej: BEAST20"
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value)}
                            required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label htmlFor="newPromoDiscount">Porcentaje de Descuento (%)</label>
                          <input
                            id="newPromoDiscount"
                            type="number"
                            min="1"
                            max="100"
                            placeholder="20"
                            value={newPromoDiscount}
                            onChange={(e) => setNewPromoDiscount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        Crear y Activar Cupón
                      </button>
                    </form>
                  </div>

                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Cupones de Descuento Activos</h2>
                    {promoCodes.length === 0 ? (
                      <p className={styles.emptyText}>No hay cupones creados.</p>
                    ) : (
                      <div className={styles.listGrid}>
                        {promoCodes.map((promo) => (
                          <div key={promo.id} className={styles.listItemCard}>
                            <div className={styles.itemInfo}>
                              <h3>{promo.code}</h3>
                              <p>Descuento: <strong>{promo.discount_percent}% OFF</strong></p>
                              <span className={styles.itemBadge}>Válido para la primera compra del alumno</span>
                            </div>
                            <button
                              onClick={() => handleDeletePromoCode(promo.id)}
                              className={styles.deleteBtn}
                              title="Eliminar Cupón"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className={styles.tabSection}>
                  <div className={styles.cardPanel} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                    <h2>Editar Sección Nosotros (Coach)</h2>
                    <p className={styles.emptyText} style={{ textAlign: 'left', marginBottom: '20px' }}>
                      Modifica la información, biografía, foto y certificaciones del Coach que se muestran en la página principal.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAboutInfo} className={`${styles.form} glass`} style={{ padding: '30px', borderRadius: '12px' }}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>Subtítulo de la Sección</label>
                        <input
                          type="text"
                          value={aboutSubtitle}
                          onChange={(e) => setAboutSubtitle(e.target.value)}
                          placeholder="Ej: sobre nosotros, nuestro coach"
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Título Principal</label>
                        <input
                          type="text"
                          value={aboutTitle}
                          onChange={(e) => setAboutTitle(e.target.value)}
                          placeholder="Ej: Entrenamiento Inteligente, Resultados Reales"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>Texto de Badge en Imagen</label>
                        <input
                          type="text"
                          value={aboutBadgeText}
                          onChange={(e) => setAboutBadgeText(e.target.value)}
                          placeholder="Ej: Coach Fundador"
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>URL de la Imagen de Perfil</label>
                        <input
                          type="text"
                          value={aboutImgUrl}
                          onChange={(e) => setAboutImgUrl(e.target.value)}
                          placeholder="Ej: /images/coach.png"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Párrafo de Biografía 1</label>
                      <textarea
                        rows={4}
                        value={aboutBioP1}
                        onChange={(e) => setAboutBioP1(e.target.value)}
                        placeholder="Escribe el primer párrafo sobre el coach..."
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Párrafo de Biografía 2</label>
                      <textarea
                        rows={4}
                        value={aboutBioP2}
                        onChange={(e) => setAboutBioP2(e.target.value)}
                        placeholder="Escribe el segundo párrafo (filosofía de entrenamiento)..."
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>Certificación / Especialidad 1</label>
                        <input
                          type="text"
                          value={aboutSpec1}
                          onChange={(e) => setAboutSpec1(e.target.value)}
                          placeholder="Ej: Certificación CrossFit L-2"
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Certificación / Especialidad 2</label>
                        <input
                          type="text"
                          value={aboutSpec2}
                          onChange={(e) => setAboutSpec2(e.target.value)}
                          placeholder="Ej: Preparación Física & Musculación (IPCH)"
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>Certificación / Especialidad 3</label>
                        <input
                          type="text"
                          value={aboutSpec3}
                          onChange={(e) => setAboutSpec3(e.target.value)}
                          placeholder="Ej: Especialista en Biomecánica aplicada al Fitness"
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Certificación / Especialidad 4</label>
                        <input
                          type="text"
                          value={aboutSpec4}
                          onChange={(e) => setAboutSpec4(e.target.value)}
                          placeholder="Ej: Asesoría Nutricional Deportiva Avanzada"
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={actionLoading} style={{ marginTop: '10px' }}>
                      {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className={styles.tabContent}>
                  {/* Header card panel */}
                  <div className={styles.cardPanel} style={{ border: 'none', background: 'transparent', padding: 0, marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h2>Planes de Entrenamiento</h2>
                        <p className={styles.emptyText} style={{ textAlign: 'left', margin: '4px 0 0 0' }}>
                          Modifica, elimina y agrega planes de gimnasio (Individual y Dúo) que se visualizan en la web.
                        </p>
                      </div>
                      <button
                        onClick={handleAddPlanClick}
                        style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(255, 87, 0, 0.25)'
                        }}
                        type="button"
                      >
                        <Plus size={16} />
                        Agregar Nuevo Plan
                      </button>
                    </div>
                  </div>

                  {/* Plans list */}
                  {plansList.length === 0 ? (
                    <p className={styles.emptyText}>No hay planes de entrenamiento registrados.</p>
                  ) : (
                    <div className={styles.listGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                      {plansList.map((plan) => (
                        <div key={plan.id} className={`${styles.listItemCard} glass`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: '24px', gap: '16px', position: 'relative' }}>
                          {plan.popular && (
                            <span style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              background: 'var(--primary)',
                              color: '#ffffff',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              letterSpacing: '0.05em'
                            }}>
                              Destacado
                            </span>
                          )}

                          <div className={styles.itemInfo} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              fontWeight: '600',
                              color: plan.category === 'duo' ? 'var(--success)' : 'var(--primary)',
                              display: 'inline-block',
                              marginBottom: '6px'
                            }}>
                              {plan.category === 'duo' ? 'Plan Dúo' : 'Membresía Individual'}
                            </span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>{plan.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', minHeight: '40px', lineHeight: '1.4' }}>{plan.description}</p>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valor del Plan</span>
                              <strong style={{ fontSize: '1.3rem', color: '#ffffff' }}>{formatCLP(plan.price)}</strong>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Duración</span>
                              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff' }}>
                                {plan.duration_months === 1 ? '1 Mes' : `${plan.duration_months} Meses`}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Características:</span>
                            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {plan.features?.slice(0, 3).map((f, idx) => (
                                <li key={idx}>{f}</li>
                              ))}
                              {plan.features?.length > 3 && (
                                <li style={{ listStyle: 'none', color: 'var(--text-muted)', fontStyle: 'italic' }}>+ {plan.features.length - 3} más</li>
                              )}
                            </ul>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: 'auto' }}>
                            <button
                              onClick={() => handleEditPlanClick(plan)}
                              className={styles.submitBtn}
                              style={{ flex: 1, margin: 0, padding: '8px 14px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)' }}
                              type="button"
                            >
                              <Edit size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className={styles.deleteBtn}
                              style={{ flex: 0.3, padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                              type="button"
                              title="Eliminar Plan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal: Agregar / Editar Plan */}
                  {showPlanModal && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.75)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000,
                      padding: '20px'
                    }}>
                      <div className={`${styles.form} glass`} style={{
                        maxWidth: '550px',
                        width: '100%',
                        padding: '30px',
                        borderRadius: '12px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                          <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>
                            {editingPlan ? 'Editar Plan de Entrenamiento' : 'Crear Nuevo Plan'}
                          </h2>
                          <button 
                            onClick={() => setShowPlanModal(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}
                            type="button"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className={styles.inputGroup}>
                            <label>Nombre del Plan</label>
                            <input
                              type="text"
                              value={planName}
                              onChange={(e) => setPlanName(e.target.value)}
                              placeholder="Ej: Mensual Individual"
                              required
                            />
                          </div>

                          <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                              <label>Categoría</label>
                              <select
                                className={styles.selectInput}
                                value={planCategory}
                                onChange={(e) => setPlanCategory(e.target.value)}
                                style={{ width: '100%' }}
                              >
                                <option value="individual">Membresía Individual</option>
                                <option value="duo">Plan Dúo</option>
                              </select>
                            </div>

                            <div className={styles.inputGroup}>
                              <label>Duración (en meses)</label>
                              <input
                                type="number"
                                min="1"
                                max="12"
                                value={planDuration}
                                onChange={(e) => setPlanDuration(e.target.value)}
                                placeholder="Ej: 3"
                                required
                              />
                            </div>
                          </div>

                          <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                              <label>Precio del Plan (CLP)</label>
                              <input
                                type="number"
                                min="1000"
                                value={planPrice}
                                onChange={(e) => setPlanPrice(e.target.value)}
                                placeholder="Ej: 35000"
                                required
                              />
                            </div>

                            <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                                <input
                                  type="checkbox"
                                  checked={planPopular}
                                  onChange={(e) => setPlanPopular(e.target.checked)}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span>¿Destacar como Más Popular?</span>
                              </label>
                            </div>
                          </div>

                          <div className={styles.inputGroup}>
                            <label>Descripción Corta del Plan</label>
                            <input
                              type="text"
                              value={planDesc}
                              onChange={(e) => setPlanDesc(e.target.value)}
                              placeholder="Ej: Acceso ilimitado a todas nuestras clases y sala de musculación."
                              required
                            />
                          </div>

                          <div className={styles.inputGroup}>
                            <label>Características / Lo que incluye (Una por línea)</label>
                            <textarea
                              rows={5}
                              value={planFeatures}
                              onChange={(e) => setPlanFeatures(e.target.value)}
                              placeholder="Ej:&#10;Clases ilimitadas&#10;Acceso a musculación y cardio&#10;Evaluación física mensual"
                              required
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              * Ingresa cada beneficio en una línea distinta. Se ordenarán automáticamente con un icono de ticket en la web.
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                              type="button"
                              onClick={() => setShowPlanModal(false)}
                              className={styles.deactivateBtn}
                              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: '#ffffff' }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className={styles.submitBtn}
                              disabled={actionLoading}
                              style={{ flex: 1.5, margin: 0 }}
                            >
                              {actionLoading ? 'Guardando...' : 'Guardar Plan'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
