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

  const fetchProfile = async (userId, userEmail) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const isAdminEmail = userEmail?.toLowerCase() === 'btrainingchile@gmail.com';
      if (data) {
        const updatedProfile = isAdminEmail ? { ...data, role: 'admin', status: 'active' } : data;
        setProfile(updatedProfile);
        if (updatedProfile.role !== 'admin') router.push('/dashboard');
      } else if (isAdminEmail) {
        setProfile({ id: userId, email: userEmail, role: 'admin', status: 'active', full_name: 'Admin Beast' });
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
