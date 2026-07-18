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

  return {
    user, profile, loading, demoAdminMode, router,
    setUser, setProfile, setLoading, setDemoAdminMode,
    fetchProfile,
  };
}
