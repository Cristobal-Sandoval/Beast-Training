'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';

export default function useAboutState({ setSuccessMsg, actionLoading, setActionLoading }) {
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBioP1, setAboutBioP1] = useState('');
  const [aboutBioP2, setAboutBioP2] = useState('');
  const [aboutImgUrl, setAboutImgUrl] = useState('');
  const [aboutImgPosition, setAboutImgPosition] = useState('50% 50%');
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

  const alert = (msg) => { showToast(msg, 'error'); };

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase.from('about_info').select('*').single();
      if (!error && data) {
        setAboutSubtitle(data.subtitle || ''); setAboutTitle(data.title || '');
        setAboutBioP1(data.bio_p1 || ''); setAboutBioP2(data.bio_p2 || '');
        setAboutImgUrl(data.image_url || ''); setAboutBadgeText(data.badge_text || '');
        setAboutImgPosition(data.image_position || 'center');
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
        image_position: aboutImgPosition,
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

  return {
    aboutSubtitle, aboutTitle, aboutBioP1, aboutBioP2, aboutImgUrl, aboutImgPosition, aboutBadgeText,
    aboutSpec1, aboutSpec2, aboutSpec3, aboutSpec4,
    coachInstagram, coachTiktok, gymInstagram, gymFacebook, whatsappNumber, showCoachSocials, showGymSocials,
    setAboutSubtitle, setAboutTitle, setAboutBioP1, setAboutBioP2, setAboutImgUrl, setAboutImgPosition, setAboutBadgeText,
    setAboutSpec1, setAboutSpec2, setAboutSpec3, setAboutSpec4,
    setCoachInstagram, setCoachTiktok, setGymInstagram, setGymFacebook, setWhatsappNumber, setShowCoachSocials, setShowGymSocials,
    fetchAboutInfo, handleSaveAboutInfo,
  };
}
