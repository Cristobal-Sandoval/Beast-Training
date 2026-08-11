'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

export default function useBannersState({ setSuccessMsg, actionLoading, setActionLoading }) {
  const [banners, setBanners] = useState([]);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerTagline, setBannerTagline] = useState('beast training concepción');
  const [bannerAlign, setBannerAlign] = useState('center');
  const [bannerTextVerticalAlign, setBannerTextVerticalAlign] = useState('center');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerImgPosition, setBannerImgPosition] = useState('50% 50%');
  const [bannerLink, setBannerLink] = useState('');
  const [editingBannerId, setEditingBannerId] = useState(null);

  const alert = (msg) => { showToast(msg, 'error'); };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      if (!error && data) setBanners(data);
    } catch (err) { console.warn(err); }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const bannerData = { 
      title: bannerTitle, 
      description: bannerDesc, 
      h3_tagline: bannerTagline, 
      text_align: bannerAlign, 
      text_vertical_align: bannerTextVerticalAlign,
      image_url: bannerImg || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop', 
      image_position: bannerImgPosition || '50% 50%', 
      link_url: bannerLink || '/planes', 
      active: true 
    };
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
      setBannerTitle(''); setBannerDesc(''); setBannerTagline('beast training concepción'); setBannerAlign('center'); setBannerTextVerticalAlign('center'); setBannerImg(''); setBannerImgPosition('50% 50%'); setBannerLink('');
    } catch (err) { alert(err.message); }
    finally { setActionLoading(false); }
  };

  const handleEditBannerSelect = (banner) => {
    setEditingBannerId(banner.id); setBannerTitle(banner.title || ''); setBannerDesc(banner.description || '');
    setBannerTagline(banner.h3_tagline || 'beast training concepción'); setBannerAlign(banner.text_align || 'center');
    setBannerTextVerticalAlign(banner.text_vertical_align || 'center');
    setBannerImg(banner.image_url || ''); setBannerImgPosition(banner.image_position || '50% 50%'); setBannerLink(banner.link_url || '');
    const formElement = document.getElementById('bannerFormPanel');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!await confirmDialog('¿Deseas eliminar este banner?')) return;
    try { const { error } = await supabase.from('banners').delete().eq('id', bannerId); if (error) throw error; setBanners(banners.filter(b => b.id !== bannerId)); } catch (err) { alert(err.message); }
  };

  return {
    banners, bannerTitle, bannerDesc, bannerTagline, bannerAlign, bannerTextVerticalAlign, bannerImg, bannerImgPosition, bannerLink, editingBannerId,
    setBanners, setBannerTitle, setBannerDesc, setBannerTagline, setBannerAlign, setBannerTextVerticalAlign, setBannerImg, setBannerImgPosition, setBannerLink, setEditingBannerId,
    fetchBanners, handleCreateBanner, handleEditBannerSelect, handleDeleteBanner,
  };
}
