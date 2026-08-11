'use client';

import { ShieldAlert, ShieldCheck, Check, Sparkles, ChevronLeft, Trash2, Calendar, MessageSquare, TrendingUp, ArrowRight, UserPlus, X } from 'lucide-react';
import useAdminState from './useAdminState';
import Sidebar from './components/Sidebar';
import AnnouncementsPanel from './components/AnnouncementsPanel';
import PromosPanel from './components/PromosPanel';
import AboutPanel from './components/AboutPanel';
import BannersPanel from './components/BannersPanel';
import BlogPanel from './components/BlogPanel';
import PlansPanel from './components/PlansPanel';
import IntegrationsPanel from './components/IntegrationsPanel';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const s = useAdminState();

  if (s.loading) {
    return <div className={styles.loadingWrapper}><div className={styles.spinner} /><p>Verificando credenciales de administrador...</p></div>;
  }

  if (!s.demoAdminMode && s.profile?.role !== 'admin') {
    return (
      <div className={styles.unauthorizedWrapper}>
        <div className={`${styles.unauthorizedCard} glass glow-orange`}>
          <ShieldAlert size={48} className={styles.alertIcon} />
          <h2>Acceso Restringido</h2>
          <p>No tienes permisos de Administrador para ver esta página. Inicia sesión con la cuenta de administrador o usa el simulador local para pruebas.</p>
          <div className={styles.authActions}>
            <button type="button" onClick={() => s.router.push('/login')} className={styles.loginAdminBtn}>Iniciar Sesión Admin</button>
            <button type="button" onClick={() => s.setDemoAdminMode(true)} className={styles.simulateBtn}><Sparkles size={16} /> Simular Modo Admin (Pruebas)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ConfirmDialog />
      <div className={styles.container}>
        <div className={styles.adminIndicatorBar}>
          <div className={styles.indicatorLeft}>
            <ShieldCheck size={20} className={styles.successIcon} />
            <span>{s.demoAdminMode ? 'Modo de simulación de administrador activo (local)' : 'Conectado como Administrador de Beast Training'}</span>
          </div>
          {s.demoAdminMode && <button type="button" onClick={() => s.setDemoAdminMode(false)} className={styles.exitDemoBtn}>Salir del Demo</button>}
        </div>

        <section className={styles.header}>
          <div>
            <h1>Panel de Control Staff</h1>
            <p>Monitorea alumnos, edita rutinas, evalúa su físico y envía comunicados importantes.</p>
          </div>
        </section>

        {s.successMsg && (
          <div className={`${styles.successAlert} glass`}>
            <Check size={20} />
            <span>{s.successMsg}</span>
          </div>
        )}

        {s.selectedAlumno ? (
          /* Student Detail View */
          <div className={styles.alumnoDetailContainer}>
            <button type="button" onClick={() => s.setSelectedAlumno(null)} className={styles.backBtn}>
              <ChevronLeft size={16} /> Volver a la Lista de Alumnos
            </button>

            {/* Detail Header */}
            <div className={styles.detailHeader}>
              <div className={styles.detailInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h2>{s.selectedAlumno.full_name || 'Sin Nombre'}</h2>
                  <span className={s.selectedAlumno.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeInactive}>
                    {s.selectedAlumno.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p>{s.selectedAlumno.email || ''}</p>
              </div>
              <button type="button" onClick={() => s.handleToggleStatus(s.selectedAlumno)}
                className={s.selectedAlumno.status === 'active' ? styles.deactivateBtn : styles.activateBtn}>
                {s.selectedAlumno.status === 'active' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
              </button>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '1px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['routine', 'evaluations', 'chat'].map((tab) => (
                <button key={tab} type="button" onClick={() => s.setFichaTab(tab)}
                  style={{
                    background: s.fichaTab === tab ? 'rgba(255, 87, 0, 0.1)' : 'none',
                    border: s.fichaTab === tab ? '1px solid var(--primary)' : '1px solid transparent',
                    color: s.fichaTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  {tab === 'routine' ? 'Ficha & Rutina' : tab === 'evaluations' ? 'Historial & Evaluaciones' : 'Mensajes Privados'}
                </button>
              ))}
            </div>

            {/* Routine Tab */}
            {s.fichaTab === 'routine' && (
              <>
                <div className={`${styles.cardPanel} glass`}>
                  <h2>Datos Personales del Alumno</h2>
                  <form onSubmit={s.handleUpdatePersonalDetails} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoName">Nombre Completo</label>
                        <input id="alumnoName" type="text" value={s.alumnoName} onChange={(e) => s.setAlumnoName(e.target.value)} required />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoAge">Edad</label>
                        <input id="alumnoAge" type="number" min="10" max="100" value={s.alumnoAge} onChange={(e) => s.setAlumnoAge(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoPhone">Teléfono</label>
                        <input id="alumnoPhone" type="text" value={s.alumnoPhone} onChange={(e) => s.setAlumnoPhone(e.target.value)} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="alumnoStatus">Estado</label>
                        <select id="alumnoStatus" value={s.alumnoStatus} onChange={(e) => s.setAlumnoStatus(e.target.value)} className={styles.selectInput}>
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Guardar Datos Personales</button>
                  </form>
                </div>

                <div className={`${styles.cardPanel} glass`}>
                  <h2>Plan de Trabajo Mensual (Rutina)</h2>
                  <form onSubmit={s.handleUpdateWorkoutPlan} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <textarea value={s.workoutPlanText} onChange={(e) => s.setWorkoutPlanText(e.target.value)} rows={8}
                        placeholder="Ej: Hipertrofia - Pecho/Bíceps:&#10;• Press Banca Plano: 4x8&#10;• Press Banca Inclinado: 3x10&#10;• Aperturas: 3x12&#10;• Curl con barra: 4x10&#10;• Curl martillo: 3x12" />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Actualizar Plan de Trabajo</button>
                  </form>
                </div>
              </>
            )}

            {/* Evaluations Tab */}
            {s.fichaTab === 'evaluations' && (
              <>
                <div className={`${styles.cardPanel} glass`}>
                  <div className={styles.panelTitleWrapper}>
                    <TrendingUp size={20} className={styles.accent} />
                    <h2>Registrar Nueva Evaluación Física</h2>
                  </div>
                  <form onSubmit={s.handleAddMeasurement} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="logDate">Fecha de la Medición</label>
                      <input id="logDate" type="date" value={s.logDate} onChange={(e) => s.setLogDate(e.target.value)} required />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}><label htmlFor="logWeight">Peso (kg)</label><input id="logWeight" type="number" step="0.01" value={s.logWeight} onChange={(e) => s.setLogWeight(e.target.value)} required /></div>
                      <div className={styles.inputGroup}><label htmlFor="logBodyFat">% Grasa Corporal</label><input id="logBodyFat" type="number" step="0.01" value={s.logBodyFat} onChange={(e) => s.setLogBodyFat(e.target.value)} /></div>
                      <div className={styles.inputGroup}><label htmlFor="logMuscle">Masa Muscular (kg)</label><input id="logMuscle" type="number" step="0.01" value={s.logMuscle} onChange={(e) => s.setLogMuscle(e.target.value)} /></div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}><label htmlFor="logWaist">Cintura (cm)</label><input id="logWaist" type="number" step="0.1" value={s.logWaist} onChange={(e) => s.setLogWaist(e.target.value)} /></div>
                      <div className={styles.inputGroup}><label htmlFor="logChest">Pecho (cm)</label><input id="logChest" type="number" step="0.1" value={s.logChest} onChange={(e) => s.setLogChest(e.target.value)} /></div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="logNotes">Notas / Observaciones</label>
                      <textarea id="logNotes" rows={2} value={s.logNotes} onChange={(e) => s.setLogNotes(e.target.value)} placeholder="Ej: Buena progresión en press banca, mejorar técnica en sentadilla." />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={s.actionLoading}>{s.actionLoading ? 'Guardando...' : 'Guardar Mediciones'}</button>
                  </form>
                </div>

                <div className={`${styles.cardPanel} glass`}>
                  <Calendar size={20} className={styles.accent} />
                  <h2>Proponer Fechas de Evaluación al Alumno</h2>
                  <form onSubmit={s.handleProposeSlots} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}><label>Opción 1</label><input type="text" placeholder="Ej: Lunes 7 de Julio (10:00)" value={s.proposedSlot1} onChange={(e) => s.setProposedSlot1(e.target.value)} /></div>
                      <div className={styles.inputGroup}><label>Opción 2</label><input type="text" placeholder="Ej: Martes 8 de Julio (15:00)" value={s.proposedSlot2} onChange={(e) => s.setProposedSlot2(e.target.value)} /></div>
                      <div className={styles.inputGroup}><label>Opción 3</label><input type="text" placeholder="Ej: Miércoles 9 de Julio (18:00)" value={s.proposedSlot3} onChange={(e) => s.setProposedSlot3(e.target.value)} /></div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px', marginBottom: '16px' }}>
                      <label htmlFor="invitationEmailMessage">Mensaje del Correo de Invitación (Sincronizado con Google Calendar)</label>
                      <textarea id="invitationEmailMessage" rows={4} value={s.invitationEmailMessage} onChange={(e) => s.setInvitationEmailMessage(e.target.value)} placeholder="Escribe el cuerpo de la invitación..." style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '6px', color: '#fff', padding: '10px', fontSize: '0.85rem', width: '100%', resize: 'vertical', fontFamily: 'inherit' }} />
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Usa <code>{"{nombre}"}</code> y <code>{"{fechas}"}</code> para insertar dinámicamente el nombre del alumno y los horarios seleccionados arriba.
                      </p>
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={s.actionLoading}>{s.actionLoading ? 'Guardando...' : 'Guardar y Enviar Correo de Invitación'}</button>
                  </form>
                </div>

                <div className={`${styles.cardPanel} glass`}>
                  <h2>Historial de Mediciones</h2>
                  {s.alumnoProgress.length === 0 ? (
                    <p className={styles.emptyText}>No hay evaluaciones registradas para este alumno aún.</p>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr><th>Fecha</th><th>Peso</th><th>% Grasa</th><th>Masa Musc.</th><th>Cintura</th><th>Pecho</th><th>Notas</th><th>Acción</th></tr>
                        </thead>
                        <tbody>
                          {s.alumnoProgress.map(record => (
                            <tr key={record.id}>
                              <td>{new Date(record.date).toLocaleDateString('es-CL')}</td>
                              <td>{record.weight} kg</td>
                              <td>{record.body_fat != null ? record.body_fat + '%' : '-'}</td>
                              <td>{record.muscle_mass != null ? record.muscle_mass + ' kg' : '-'}</td>
                              <td>{record.waist != null ? record.waist + ' cm' : '-'}</td>
                              <td>{record.chest != null ? record.chest + ' cm' : '-'}</td>
                              <td>{record.notes || '-'}</td>
                              <td><button type="button" onClick={() => s.handleDeleteProgress(record.id)} className={styles.deleteBtn} title="Eliminar registro"><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Chat Tab */}
            {s.fichaTab === 'chat' && (
              <div className={`${styles.cardPanel} glass glow-orange`}>
                <div className={styles.panelTitleWrapper}>
                  <MessageSquare size={20} className={styles.accent} />
                  <h2>Mensajes Personales con el Alumno</h2>
                </div>
                <p className={styles.panelInstructions}>Bandeja de comunicación directa y privada con {s.selectedAlumno.full_name}.</p>
                <div className={styles.chatBox}>
                  {s.chatMessages.length === 0 ? (
                    <p className={styles.emptyText}>No hay mensajes registrados. Escribe uno abajo para iniciar la conversación.</p>
                  ) : (
                    <div className={styles.chatMessagesWrapper}>
                      {s.chatMessages.map((msg, idx) => {
                        const isAdminMsg = msg.sender_id === s.user?.id;
                        return (
                          <div key={`${msg.id || idx}-${idx}`}
                            className={`${styles.chatMessage} ${isAdminMsg ? styles.chatMsgAdmin : styles.chatMsgUser}`}>
                            <div className={styles.chatMsgBubble}>
                              <p>{msg.content}</p>
                              <span className={styles.chatMsgTime}>{new Date(msg.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <form onSubmit={s.handleSendDirectMessage} className={styles.chatForm}>
                  <textarea value={s.newDirectMessage} onChange={(e) => s.setNewDirectMessage(e.target.value)} rows={2}
                    placeholder="Escribe un mensaje privado para el alumno..." style={{ flex: 1 }} />
                  <button type="submit" className={styles.submitBtn} style={{ alignSelf: 'flex-end' }}>Enviar Mensaje</button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* General Tab View */
          <div className={styles.dashboardLayout}>
            <Sidebar activeTab={s.activeTab} setActiveTab={s.setActiveTab} setSuccessMsg={s.setSuccessMsg} />

            <main className={styles.mainContent}>
              {/* ALUMNOS TAB */}
              {s.activeTab === 'alumnos' && (
                <div className={styles.tabContent}>
                  <div className={styles.tabHeader}>
                    <div className={styles.toolbar}>
                      <div className={styles.filterGroup}>
                        <input type="text" placeholder="Buscar alumno por nombre o email..." value={s.searchTerm} onChange={(e) => s.setSearchTerm(e.target.value)} className={styles.searchInput} />
                        <div className={styles.statusFilterGroup}>
                          {['all', 'active', 'inactive'].map((f) => (
                            <button key={f} type="button" onClick={() => s.setStatusFilter(f)}
                              className={`${styles.filterBtn} ${s.statusFilter === f ? styles.activeFilterBtn : ''}`}>
                              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => s.setShowCreateModal(true)} className={styles.primaryBtn}>
                        <UserPlus size={18} /> Nuevo Alumno
                      </button>
                    </div>
                  </div>

                  <div className={styles.listGrid}>
                    {s.filteredAlumnos.map(alumno => (
                      <div key={alumno.id} className={`${styles.studentCard} glass`}>
                        <div className={styles.cardTopRow}>
                          <div className={styles.studentAvatar}>{alumno.full_name?.charAt(0) || '?'}</div>
                          <div>
                            <h3>{alumno.full_name || 'Sin nombre'}</h3>
                            <p>{alumno.email}</p>
                          </div>
                          <span className={alumno.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeInactive}>
                            {alumno.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className={styles.cardActions}>
                          <button type="button" onClick={() => s.handleToggleStatus(alumno)}
                            className={alumno.status === 'active' ? styles.deactivateBtn : styles.activateBtn}>
                            {alumno.status === 'active' ? 'Desactivar' : 'Activar'}
                          </button>
                          <button type="button" onClick={() => s.handleSelectAlumno(alumno)} className={styles.viewEditBtn}>
                            <ArrowRight size={16} /> Ver Ficha
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Create Alumno Modal */}
                  {s.showCreateModal && (
                    <div className={styles.modalOverlay} onClick={() => s.setShowCreateModal(false)}>
                      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                          <h2>Registrar Nuevo Alumno</h2>
                          <button type="button" onClick={() => s.setShowCreateModal(false)} className={styles.modalCloseBtn}><X size={20} /></button>
                        </div>
                        <form onSubmit={s.handleCreateAlumno} className={styles.form}>
                          <div className={styles.inputGroup}>
                            <label htmlFor="newAlumnoName">Nombre Completo</label>
                            <input id="newAlumnoName" type="text" value={s.newAlumnoName} onChange={(e) => s.setNewAlumnoName(e.target.value)} required />
                          </div>
                          <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                              <label htmlFor="newAlumnoEmail">Email (será el usuario de login)</label>
                              <input id="newAlumnoEmail" type="email" value={s.newAlumnoEmail} onChange={(e) => s.setNewAlumnoEmail(e.target.value)} required />
                            </div>
                            <div className={styles.inputGroup}>
                              <label htmlFor="newAlumnoPhone">Teléfono</label>
                              <input id="newAlumnoPhone" type="text" value={s.newAlumnoPhone} onChange={(e) => s.setNewAlumnoPhone(e.target.value)} />
                            </div>
                          </div>
                          <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                              <label htmlFor="newAlumnoAge">Edad</label>
                              <input id="newAlumnoAge" type="number" min="10" max="100" value={s.newAlumnoAge} onChange={(e) => s.setNewAlumnoAge(e.target.value)} />
                            </div>
                            <div className={styles.inputGroup}>
                              <label htmlFor="newAlumnoPassword">Contraseña Inicial</label>
                              <input id="newAlumnoPassword" type="text" value={s.newAlumnoPassword} onChange={(e) => s.setNewAlumnoPassword(e.target.value)} required />
                            </div>
                          </div>
                          <div className={styles.inputGroup} style={{ marginTop: '8px', marginBottom: '16px' }}>
                            <label htmlFor="welcomeEmailMessage">Mensaje Personalizado de Bienvenida (Se enviará por correo)</label>
                            <textarea id="welcomeEmailMessage" rows={4} value={s.welcomeEmailMessage} onChange={(e) => s.setWelcomeEmailMessage(e.target.value)} placeholder="Escribe el cuerpo del correo de bienvenida..." style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '6px', color: '#fff', padding: '10px', fontSize: '0.85rem', width: '100%', resize: 'vertical', fontFamily: 'inherit' }} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Usa <code>{"{nombre}"}</code>, <code>{"{email}"}</code> y <code>{"{clave}"}</code> para insertar dinámicamente los datos del alumno.
                            </p>
                          </div>
                          <button type="submit" className={styles.submitBtn} disabled={s.actionLoading}>
                            {s.actionLoading ? 'Registrando...' : 'Registrar Alumno'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {s.activeTab === 'announcements' && (
                <AnnouncementsPanel
                  annTitle={s.annTitle} setAnnTitle={s.setAnnTitle}
                  annPriority={s.annPriority} setAnnPriority={s.setAnnPriority}
                  annContent={s.annContent} setAnnContent={s.setAnnContent}
                  announcements={s.announcements}
                  actionLoading={s.actionLoading}
                  handleBroadcastAnnouncement={s.handleBroadcastAnnouncement}
                  handleDeleteAnnouncement={s.handleDeleteAnnouncement}
                />
              )}

              {/* BANNERS TAB */}
              {s.activeTab === 'banners' && (
                <BannersPanel
                  editingBannerId={s.editingBannerId} setEditingBannerId={s.setEditingBannerId}
                  bannerTitle={s.bannerTitle} setBannerTitle={s.setBannerTitle}
                  bannerDesc={s.bannerDesc} setBannerDesc={s.setBannerDesc}
                  bannerTagline={s.bannerTagline} setBannerTagline={s.setBannerTagline}
                  bannerAlign={s.bannerAlign} setBannerAlign={s.setBannerAlign}
                  bannerTextVerticalAlign={s.bannerTextVerticalAlign} setBannerTextVerticalAlign={s.setBannerTextVerticalAlign}
                  bannerImg={s.bannerImg} setBannerImg={s.setBannerImg}
                  bannerImgPosition={s.bannerImgPosition} setBannerImgPosition={s.setBannerImgPosition}
                  bannerLink={s.bannerLink} setBannerLink={s.setBannerLink}
                  banners={s.banners} actionLoading={s.actionLoading}
                  handleCreateBanner={s.handleCreateBanner}
                  handleEditBannerSelect={s.handleEditBannerSelect}
                  handleDeleteBanner={s.handleDeleteBanner}
                />
              )}

              {/* BLOG TAB */}
              {s.activeTab === 'blog' && (
                <BlogPanel
                  postTitle={s.postTitle} setPostTitle={s.setPostTitle}
                  postAuthor={s.postAuthor} setPostAuthor={s.setPostAuthor}
                  postImg={s.postImg} setPostImg={s.setPostImg}
                  postExcerpt={s.postExcerpt} setPostExcerpt={s.setPostExcerpt}
                  postContent={s.postContent} setPostContent={s.setPostContent}
                  posts={s.posts} actionLoading={s.actionLoading}
                  handleCreatePost={s.handleCreatePost}
                  handleDeletePost={s.handleDeletePost}
                />
              )}

              {/* PROMOS TAB */}
              {s.activeTab === 'promos' && (
                <PromosPanel
                  annBarText={s.annBarText} setAnnBarText={s.setAnnBarText}
                  annBarLink={s.annBarLink} setAnnBarLink={s.setAnnBarLink}
                  annBarActive={s.annBarActive} setAnnBarActive={s.setAnnBarActive}
                  newPromoCode={s.newPromoCode} setNewPromoCode={s.setNewPromoCode}
                  newPromoDiscount={s.newPromoDiscount} setNewPromoDiscount={s.setNewPromoDiscount}
                  promoCodes={s.promoCodes}
                  handleSaveAnnouncementBar={s.handleSaveAnnouncementBar}
                  handleCreatePromoCode={s.handleCreatePromoCode}
                  handleDeletePromoCode={s.handleDeletePromoCode}
                />
              )}

              {/* PLANS TAB */}
              {s.activeTab === 'plans' && (
                <PlansPanel
                  plansList={s.plansList} showPlanModal={s.showPlanModal} editingPlan={s.editingPlan}
                  planName={s.planName} setPlanName={s.setPlanName}
                  planCategory={s.planCategory} setPlanCategory={s.setPlanCategory}
                  planPrice={s.planPrice} setPlanPrice={s.setPlanPrice}
                  planDuration={s.planDuration} setPlanDuration={s.setPlanDuration}
                  planDesc={s.planDesc} setPlanDesc={s.setPlanDesc}
                  planFeatures={s.planFeatures} setPlanFeatures={s.setPlanFeatures}
                  planPopular={s.planPopular} setPlanPopular={s.setPlanPopular}
                  actionLoading={s.actionLoading}
                  handleAddPlanClick={s.handleAddPlanClick}
                  handleEditPlanClick={s.handleEditPlanClick}
                  handleDeletePlan={s.handleDeletePlan}
                  handleSavePlan={s.handleSavePlan}
                  setShowPlanModal={s.setShowPlanModal}
                />
              )}

              {/* ABOUT TAB */}
              {s.activeTab === 'about' && (
                <AboutPanel
                  aboutSubtitle={s.aboutSubtitle} setAboutSubtitle={s.setAboutSubtitle}
                  aboutTitle={s.aboutTitle} setAboutTitle={s.setAboutTitle}
                  aboutBadgeText={s.aboutBadgeText} setAboutBadgeText={s.setAboutBadgeText}
                  aboutImgUrl={s.aboutImgUrl} setAboutImgUrl={s.setAboutImgUrl}
                  aboutImgPosition={s.aboutImgPosition} setAboutImgPosition={s.setAboutImgPosition}
                  aboutBioP1={s.aboutBioP1} setAboutBioP1={s.setAboutBioP1}
                  aboutBioP2={s.aboutBioP2} setAboutBioP2={s.setAboutBioP2}
                  aboutSpec1={s.aboutSpec1} setAboutSpec1={s.setAboutSpec1}
                  aboutSpec2={s.aboutSpec2} setAboutSpec2={s.setAboutSpec2}
                  aboutSpec3={s.aboutSpec3} setAboutSpec3={s.setAboutSpec3}
                  aboutSpec4={s.aboutSpec4} setAboutSpec4={s.setAboutSpec4}
                  coachInstagram={s.coachInstagram} setCoachInstagram={s.setCoachInstagram}
                  coachTiktok={s.coachTiktok} setCoachTiktok={s.setCoachTiktok}
                  gymInstagram={s.gymInstagram} setGymInstagram={s.setGymInstagram}
                  gymFacebook={s.gymFacebook} setGymFacebook={s.setGymFacebook}
                  whatsappNumber={s.whatsappNumber} setWhatsappNumber={s.setWhatsappNumber}
                  showCoachSocials={s.showCoachSocials} setShowCoachSocials={s.setShowCoachSocials}
                  showGymSocials={s.showGymSocials} setShowGymSocials={s.setShowGymSocials}
                  actionLoading={s.actionLoading}
                  handleSaveAboutInfo={s.handleSaveAboutInfo}
                />
              )}

              {/* INTEGRATIONS TAB */}
              {s.activeTab === 'integrations' && (
                <IntegrationsPanel actionLoading={s.actionLoading} />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
