'use client';

import styles from '../admin.module.css';

export default function AboutPanel({
  aboutSubtitle, setAboutSubtitle, aboutTitle, setAboutTitle,
  aboutBadgeText, setAboutBadgeText, aboutImgUrl, setAboutImgUrl,
  aboutBioP1, setAboutBioP1, aboutBioP2, setAboutBioP2,
  aboutSpec1, setAboutSpec1, aboutSpec2, setAboutSpec2, aboutSpec3, setAboutSpec3, aboutSpec4, setAboutSpec4,
  coachInstagram, setCoachInstagram, coachTiktok, setCoachTiktok,
  gymInstagram, setGymInstagram, gymFacebook, setGymFacebook,
  actionLoading, handleSaveAboutInfo
}) {
  return (
    <div className={styles.tabContent}>
      <div className={`${styles.cardPanel} glass`}>
        <h2>Configuración de Página "Nosotros" (Coach)</h2>
        <p className={styles.panelInstructions}>Personaliza la información del Coach y del gimnasio que se muestra en la página /nosotros.</p>
        <form onSubmit={handleSaveAboutInfo} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutSubtitle">Subtítulo (Badge Header)</label>
              <input id="aboutSubtitle" type="text" placeholder="Ej: conoce al coach" value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutTitle">Título Principal (H1)</label>
              <input id="aboutTitle" type="text" placeholder="Ej: Sobre Beast Training" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="aboutBadgeText">Texto de la Insignia (Badge)</label>
            <input id="aboutBadgeText" type="text" placeholder="Ej: entrenador certificado" value={aboutBadgeText} onChange={(e) => setAboutBadgeText(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="aboutImgUrl">URL de Imagen del Coach</label>
            <input id="aboutImgUrl" type="text" placeholder="https://images.unsplash.com/..." value={aboutImgUrl} onChange={(e) => setAboutImgUrl(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="aboutBioP1">Biografía - Párrafo 1</label>
            <textarea id="aboutBioP1" rows={3} placeholder="Describe la historia del gimnasio..." value={aboutBioP1} onChange={(e) => setAboutBioP1(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="aboutBioP2">Biografía - Párrafo 2</label>
            <textarea id="aboutBioP2" rows={3} placeholder="Segundo párrafo sobre el coach y el método..." value={aboutBioP2} onChange={(e) => setAboutBioP2(e.target.value)} />
          </div>
          <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>Especialidades (Separadas)</h3>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutSpec1">Especialidad 1</label>
              <input id="aboutSpec1" type="text" placeholder="Ej: CrossFit Nivel 2" value={aboutSpec1} onChange={(e) => setAboutSpec1(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutSpec2">Especialidad 2</label>
              <input id="aboutSpec2" type="text" placeholder="Ej: Nutrición Deportiva" value={aboutSpec2} onChange={(e) => setAboutSpec2(e.target.value)} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutSpec3">Especialidad 3</label>
              <input id="aboutSpec3" type="text" placeholder="Ej: Entrenamiento Funcional" value={aboutSpec3} onChange={(e) => setAboutSpec3(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="aboutSpec4">Especialidad 4</label>
              <input id="aboutSpec4" type="text" placeholder="Ej: Mobility & Stretching" value={aboutSpec4} onChange={(e) => setAboutSpec4(e.target.value)} />
            </div>
          </div>

          <h3 style={{ margin: '16px 0 8px', fontSize: '1rem' }}>Redes Sociales</h3>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="coachInstagram">Instagram del Coach</label>
              <input id="coachInstagram" type="text" placeholder="@coachjavier" value={coachInstagram} onChange={(e) => setCoachInstagram(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="coachTiktok">TikTok del Coach</label>
              <input id="coachTiktok" type="text" placeholder="@coachjavier" value={coachTiktok} onChange={(e) => setCoachTiktok(e.target.value)} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="gymInstagram">Instagram del Gimnasio</label>
              <input id="gymInstagram" type="text" placeholder="@beasttrainingcl" value={gymInstagram} onChange={(e) => setGymInstagram(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="gymFacebook">Facebook del Gimnasio</label>
              <input id="gymFacebook" type="text" placeholder="BeastTrainingCL" value={gymFacebook} onChange={(e) => setGymFacebook(e.target.value)} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={actionLoading}>
            {actionLoading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </form>
      </div>
    </div>
  );
}
