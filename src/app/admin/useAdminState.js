'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/lib/toast';

import useAuthState from './hooks/useAuthState';
import useAlumnosState from './hooks/useAlumnosState';
import useBannersState from './hooks/useBannersState';
import useAnnouncementsState from './hooks/useAnnouncementsState';
import usePromosState from './hooks/usePromosState';
import usePlansState from './hooks/usePlansState';
import useBlogState from './hooks/useBlogState';
import useAboutState from './hooks/useAboutState';

export default function useAdminState() {
  const [activeTab, setActiveTab] = useState('alumnos');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (successMsg) {
      showToast(successMsg, 'success');
      setSuccessMsg(null);
    }
  }, [successMsg]);

  const auth = useAuthState();

  const alumnos = useAlumnosState({
    user: auth.user,
    setSuccessMsg,
    actionLoading,
    setActionLoading,
  });

  const banners = useBannersState({ setSuccessMsg, actionLoading, setActionLoading });
  const announcements = useAnnouncementsState({ setSuccessMsg, actionLoading, setActionLoading, alumnos: alumnos.alumnos });
  const promos = usePromosState({ setSuccessMsg, actionLoading, setActionLoading });
  const plans = usePlansState({ setSuccessMsg, actionLoading, setActionLoading });
  const blog = useBlogState({ setSuccessMsg, actionLoading, setActionLoading });
  const about = useAboutState({ setSuccessMsg, actionLoading, setActionLoading });

  useEffect(() => {
    if (auth.demoAdminMode || auth.profile?.role === 'admin') {
      alumnos.fetchAlumnos();
      banners.fetchBanners();
      blog.fetchPosts();
      announcements.fetchAnnouncements();
      promos.fetchAnnouncementBar();
      promos.fetchPromoCodes();
      about.fetchAboutInfo();
      plans.fetchPlansList();
    }
  }, [auth.profile, auth.demoAdminMode]);

  return {
    router: auth.router, user: auth.user, profile: auth.profile, loading: auth.loading, activeTab, demoAdminMode: auth.demoAdminMode,
    alumnos: alumnos.alumnos, banners: banners.banners, posts: blog.posts, announcements: announcements.announcements,
    selectedAlumno: alumnos.selectedAlumno, alumnoProgress: alumnos.alumnoProgress, fichaTab: alumnos.fichaTab, searchTerm: alumnos.searchTerm, statusFilter: alumnos.statusFilter,
    logWeight: alumnos.logWeight, logBodyFat: alumnos.logBodyFat, logMuscle: alumnos.logMuscle, logWaist: alumnos.logWaist, logChest: alumnos.logChest, logNotes: alumnos.logNotes, logDate: alumnos.logDate,
    workoutPlanText: alumnos.workoutPlanText, alumnoName: alumnos.alumnoName, alumnoAge: alumnos.alumnoAge, alumnoPhone: alumnos.alumnoPhone, alumnoStatus: alumnos.alumnoStatus,
    chatMessages: alumnos.chatMessages, newDirectMessage: alumnos.newDirectMessage,
    bannerTitle: banners.bannerTitle, bannerDesc: banners.bannerDesc, bannerTagline: banners.bannerTagline, bannerAlign: banners.bannerAlign, bannerTextVerticalAlign: banners.bannerTextVerticalAlign, bannerImg: banners.bannerImg, bannerImgPosition: banners.bannerImgPosition, bannerLink: banners.bannerLink, editingBannerId: banners.editingBannerId,
    annBarText: promos.annBarText, annBarLink: promos.annBarLink, annBarActive: promos.annBarActive, annBarId: promos.annBarId,
    promoCodes: promos.promoCodes, newPromoCode: promos.newPromoCode, newPromoDiscount: promos.newPromoDiscount,
    postTitle: blog.postTitle, postExcerpt: blog.postExcerpt, postContent: blog.postContent, postImg: blog.postImg, postAuthor: blog.postAuthor,
    proposedSlot1: alumnos.proposedSlot1, proposedSlot2: alumnos.proposedSlot2, proposedSlot3: alumnos.proposedSlot3,
    annTitle: announcements.annTitle, annContent: announcements.annContent, annPriority: announcements.annPriority,
    aboutSubtitle: about.aboutSubtitle, aboutTitle: about.aboutTitle, aboutBioP1: about.aboutBioP1, aboutBioP2: about.aboutBioP2, aboutImgUrl: about.aboutImgUrl, aboutImgPosition: about.aboutImgPosition, aboutBadgeText: about.aboutBadgeText,
    aboutSpec1: about.aboutSpec1, aboutSpec2: about.aboutSpec2, aboutSpec3: about.aboutSpec3, aboutSpec4: about.aboutSpec4,
    coachInstagram: about.coachInstagram, coachTiktok: about.coachTiktok, gymInstagram: about.gymInstagram, gymFacebook: about.gymFacebook, whatsappNumber: about.whatsappNumber, showCoachSocials: about.showCoachSocials, showGymSocials: about.showGymSocials,
    showCreateModal: alumnos.showCreateModal, newAlumnoName: alumnos.newAlumnoName, newAlumnoEmail: alumnos.newAlumnoEmail, newAlumnoPhone: alumnos.newAlumnoPhone, newAlumnoAge: alumnos.newAlumnoAge, newAlumnoPassword: alumnos.newAlumnoPassword,
    welcomeEmailMessage: alumnos.welcomeEmailMessage, invitationEmailMessage: alumnos.invitationEmailMessage,
    plansList: plans.plansList, showPlanModal: plans.showPlanModal, editingPlan: plans.editingPlan, planName: plans.planName, planCategory: plans.planCategory, planPrice: plans.planPrice, planDuration: plans.planDuration, planDesc: plans.planDesc, planFeatures: plans.planFeatures, planPopular: plans.planPopular,
    actionLoading, successMsg,
    filteredAlumnos: alumnos.filteredAlumnos,

    setUser: auth.setUser, setProfile: auth.setProfile, setLoading: auth.setLoading, setActiveTab, setDemoAdminMode: auth.setDemoAdminMode,
    setAlumnos: alumnos.setAlumnos, setBanners: banners.setBanners, setPosts: blog.setPosts, setAnnouncements: announcements.setAnnouncements,
    setSelectedAlumno: alumnos.setSelectedAlumno, setAlumnoProgress: alumnos.setAlumnoProgress, setFichaTab: alumnos.setFichaTab, setSearchTerm: alumnos.setSearchTerm, setStatusFilter: alumnos.setStatusFilter,
    setLogWeight: alumnos.setLogWeight, setLogBodyFat: alumnos.setLogBodyFat, setLogMuscle: alumnos.setLogMuscle, setLogWaist: alumnos.setLogWaist, setLogChest: alumnos.setLogChest, setLogNotes: alumnos.setLogNotes, setLogDate: alumnos.setLogDate,
    setWorkoutPlanText: alumnos.setWorkoutPlanText, setAlumnoName: alumnos.setAlumnoName, setAlumnoAge: alumnos.setAlumnoAge, setAlumnoPhone: alumnos.setAlumnoPhone, setAlumnoStatus: alumnos.setAlumnoStatus,
    setChatMessages: alumnos.setChatMessages, setNewDirectMessage: alumnos.setNewDirectMessage,
    setBannerTitle: banners.setBannerTitle, setBannerDesc: banners.setBannerDesc, setBannerTagline: banners.setBannerTagline, setBannerAlign: banners.setBannerAlign, setBannerTextVerticalAlign: banners.setBannerTextVerticalAlign, setBannerImg: banners.setBannerImg, setBannerImgPosition: banners.setBannerImgPosition, setBannerLink: banners.setBannerLink, setEditingBannerId: banners.setEditingBannerId,
    setAnnBarText: promos.setAnnBarText, setAnnBarLink: promos.setAnnBarLink, setAnnBarActive: promos.setAnnBarActive, setAnnBarId: promos.setAnnBarId,
    setPromoCodes: promos.setPromoCodes, setNewPromoCode: promos.setNewPromoCode, setNewPromoDiscount: promos.setNewPromoDiscount,
    setPostTitle: blog.setPostTitle, setPostExcerpt: blog.setPostExcerpt, setPostContent: blog.setPostContent, setPostImg: blog.setPostImg, setPostAuthor: blog.setPostAuthor,
    setProposedSlot1: alumnos.setProposedSlot1, setProposedSlot2: alumnos.setProposedSlot2, setProposedSlot3: alumnos.setProposedSlot3,
    setAnnTitle: announcements.setAnnTitle, setAnnContent: announcements.setAnnContent, setAnnPriority: announcements.setAnnPriority,
    setAboutSubtitle: about.setAboutSubtitle, setAboutTitle: about.setAboutTitle, setAboutBioP1: about.setAboutBioP1, setAboutBioP2: about.setAboutBioP2, setAboutImgUrl: about.setAboutImgUrl, setAboutImgPosition: about.setAboutImgPosition, setAboutBadgeText: about.setAboutBadgeText,
    setAboutSpec1: about.setAboutSpec1, setAboutSpec2: about.setAboutSpec2, setAboutSpec3: about.setAboutSpec3, setAboutSpec4: about.setAboutSpec4,
    setCoachInstagram: about.setCoachInstagram, setCoachTiktok: about.setCoachTiktok, setGymInstagram: about.setGymInstagram, setGymFacebook: about.setGymFacebook, setWhatsappNumber: about.setWhatsappNumber, setShowCoachSocials: about.setShowCoachSocials, setShowGymSocials: about.setShowGymSocials,
    setShowCreateModal: alumnos.setShowCreateModal, setNewAlumnoName: alumnos.setNewAlumnoName, setNewAlumnoEmail: alumnos.setNewAlumnoEmail, setNewAlumnoPhone: alumnos.setNewAlumnoPhone, setNewAlumnoAge: alumnos.setNewAlumnoAge, setNewAlumnoPassword: alumnos.setNewAlumnoPassword,
    setWelcomeEmailMessage: alumnos.setWelcomeEmailMessage, setInvitationEmailMessage: alumnos.setInvitationEmailMessage,
    setPlansList: plans.setPlansList, setShowPlanModal: plans.setShowPlanModal, setEditingPlan: plans.setEditingPlan, setPlanName: plans.setPlanName, setPlanCategory: plans.setPlanCategory, setPlanPrice: plans.setPlanPrice, setPlanDuration: plans.setPlanDuration, setPlanDesc: plans.setPlanDesc, setPlanFeatures: plans.setPlanFeatures, setPlanPopular: plans.setPlanPopular,
    setActionLoading, setSuccessMsg,

    fetchAlumnos: alumnos.fetchAlumnos, fetchPlansList: plans.fetchPlansList, fetchBanners: banners.fetchBanners, fetchAnnouncementBar: promos.fetchAnnouncementBar, fetchPromoCodes: promos.fetchPromoCodes, fetchAboutInfo: about.fetchAboutInfo, fetchPosts: blog.fetchPosts, fetchAnnouncements: announcements.fetchAnnouncements, fetchDirectMessages: alumnos.fetchDirectMessages,
    handleToggleStatus: alumnos.handleToggleStatus, handleSelectAlumno: alumnos.handleSelectAlumno, handleSendDirectMessage: alumnos.handleSendDirectMessage, handleUpdatePersonalDetails: alumnos.handleUpdatePersonalDetails,
    handleAddMeasurement: alumnos.handleAddMeasurement, handleUpdateWorkoutPlan: alumnos.handleUpdateWorkoutPlan, handleProposeSlots: alumnos.handleProposeSlots, handleCreateAlumno: alumnos.handleCreateAlumno,
    handleSavePlan: plans.handleSavePlan, handleDeletePlan: plans.handleDeletePlan, handleEditPlanClick: plans.handleEditPlanClick, handleAddPlanClick: plans.handleAddPlanClick, handleDeleteProgress: alumnos.handleDeleteProgress,
    handleBroadcastAnnouncement: announcements.handleBroadcastAnnouncement, handleCreateBanner: banners.handleCreateBanner, handleEditBannerSelect: banners.handleEditBannerSelect, handleSaveAnnouncementBar: promos.handleSaveAnnouncementBar,
    handleCreatePromoCode: promos.handleCreatePromoCode, handleDeletePromoCode: promos.handleDeletePromoCode, handleCreatePost: blog.handleCreatePost, handleDeleteBanner: banners.handleDeleteBanner, handleDeletePost: blog.handleDeletePost, handleDeleteAnnouncement: announcements.handleDeleteAnnouncement,
    handleSaveAboutInfo: about.handleSaveAboutInfo,
  };
}
