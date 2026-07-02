'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, Image, FileText, Plus, Check, Trash2, ShieldCheck, Sparkles, Users, UserCheck, MessageSquare, Scale, ChevronLeft, ArrowRight, Mail, TrendingUp } from 'lucide-react';
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
  const [postImg, setPostImg] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  // Mass Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('normal');

  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const router = useRouter();

  useEffect(() => {
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

    const newBanner = {
      title: bannerTitle,
      description: bannerDesc,
      h3_tagline: bannerTagline,
      text_align: bannerAlign,
      image_url: bannerImg || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
      link_url: bannerLink || '/planes',
      active: true
    };

    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([newBanner])
        .select();

      if (error) throw error;
      if (data) setBanners([data[0], ...banners]);

      setSuccessMsg('¡Banner creado exitosamente!');
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
            </aside>

            {/* main Content area */}
            <main className={styles.mainContent}>
              {/* Tab: Alumnos */}
              {activeTab === 'alumnos' && (
                <div className={`${styles.cardPanel} glass`}>
                  <h2>Directorio de Alumnos</h2>
                  
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
                  <div className={`${styles.cardPanel} glass`}>
                    <h2>Subir Nuevo Banner</h2>
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

                      <button type="submit" className={styles.submitBtn}>
                        Crear y Publicar Banner
                      </button>
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
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className={styles.deleteBtn}
                              title="Eliminar Banner"
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
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
