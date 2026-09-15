'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function useAuthState() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoAdminMode, setDemoAdminMode] = useState(false);

  const router = useRouter();

  // Email del dueño: solo se usa como bootstrap (reparar rol una vez), nunca como bypass.
  // La única fuente de verdad para admin es profiles.role = 'admin' (forzado por RLS).
  const ADMIN_BOOTSTRAP_EMAIL = 'btrainingchile@gmail.com';

  const fetchProfile = async (userId, userEmail) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const isBootstrapEmail = userEmail?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL;
      if (data) {
        if (isBootstrapEmail && data.role !== 'admin') {
          const { error: repairError } = await supabase
            .from('profiles')
            .update({ role: 'admin', status: 'active' })
            .eq('id', userId);
          if (!repairError) {
            setProfile({ ...data, role: 'admin', status: 'active' });
            return;
          }
          // Si RLS bloquea la reparación, se deniega igual: sin bypass por email.
          setProfile(data);
          router.push('/dashboard');
          return;
        }
        setProfile(data);
        if (data.role !== 'admin') router.push('/dashboard');
      } else if (isBootstrapEmail) {
        // Sin fila (trigger aún no corrió): acceso provisional de bootstrap.
        // Las escrituras siguen bloqueadas por RLS hasta que exista el rol en DB.
        setProfile({ id: userId, email: userEmail, role: 'admin', status: 'active', full_name: 'Admin Beast' });
      } else {
        setProfile(null);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    document.title = "Panel de Administración | Beast Training";
    document.querySelector('meta[name="robots"]')?.remove();
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.head.appendChild(robotsMeta);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); fetchProfile(session.user.id, session.user.email); }
      else { setLoading(false); }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user.email);
      else { setProfile(null); setLoading(false); router.push('/'); }
    });
  }, []);

  return {
    user, profile, loading, demoAdminMode, router,
    setUser, setProfile, setLoading, setDemoAdminMode,
    fetchProfile,
  };
}
