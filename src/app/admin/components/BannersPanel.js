'use client';

import { Edit, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

export default function BannersPanel({
  editingBannerId, setEditingBannerId,
  bannerTitle, setBannerTitle, bannerDesc, setBannerDesc,
  bannerTagline, setBannerTagline, bannerAlign, setBannerAlign,
  bannerImg, setBannerImg, bannerLink, setBannerLink,
  banners, actionLoading,
  handleCreateBanner, handleEditBannerSelect, handleDeleteBanner
}) {
  return (
    <div className={styles.tabContent}>
      <div className={`${styles.cardPanel} glass`} id="bannerFormPanel">
        <h2>{editingBannerId ? 'Editar Banner Existente' : 'Publicar Nuevo Banner'}</h2>
        <form onSubmit={handleCreateBanner} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerTitle">Título del Banner (H1)</label>
              <input id="bannerTitle" type="text" placeholder="Ej: Saca la Bestia que Llevas Dentro" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerDesc">Descripción (H2 / Subtítulo)</label>
              <input id="bannerDesc" type="text" placeholder="Ej: Entrenamiento funcional de alta intensidad" value={bannerDesc} onChange={(e) => setBannerDesc(e.target.value)} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerTagline">Tagline (H3 / Badge)</label>
              <input id="bannerTagline" type="text" value={bannerTagline} onChange={(e) => setBannerTagline(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerAlign">Alineación del Texto</label>
              <select id="bannerAlign" value={bannerAlign} onChange={(e) => setBannerAlign(e.target.value)} className={styles.selectInput}>
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="bannerImg">URL de Imagen de Fondo (1920x1080 recomendado)</label>
            <input id="bannerImg" type="text" placeholder="https://images.unsplash.com/..." value={bannerImg} onChange={(e) => setBannerImg(e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerLink">Enlace del Botón CTA</label>
              <input id="bannerLink" type="text" placeholder="Ej: /planes" value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button type="submit" className={styles.submitBtn} style={{ flex: 1, minHeight: '44px' }} disabled={actionLoading}>
              {actionLoading ? 'Guardando...' : editingBannerId ? 'Guardar Cambios' : 'Crear y Publicar Banner'}
            </button>
            {editingBannerId && (
              <button type="button" onClick={() => { setEditingBannerId(null); setBannerTitle(''); setBannerDesc(''); setBannerTagline('beast training concepción'); setBannerAlign('center'); setBannerImg(''); setBannerLink(''); }}
                className={styles.cancelBtn} style={{ minHeight: '44px' }}>Cancelar Edición</button>
            )}
          </div>
        </form>
      </div>

      <div className={`${styles.cardPanel} glass`}>
        <h2>Banners Activos en la Página de Inicio</h2>
        {banners.length === 0 ? (
          <p className={styles.emptyText}>No hay banners publicados. Crea uno usando el formulario de arriba.</p>
        ) : (
          <div className={styles.listGrid}>
            {banners.map((banner) => (
              <div key={banner.id} className={styles.listItemCard}>
                <div className={styles.itemInfo}>
                  <h3>{banner.title}</h3>
                  <p>{banner.description}</p>
                  <span className={styles.itemBadge}>Creado: {new Date(banner.created_at).toLocaleDateString('es-CL')}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleEditBannerSelect(banner)} className={styles.viewEditBtn} title="Editar Banner"><Edit size={16} /></button>
                  <button type="button" onClick={() => handleDeleteBanner(banner.id)} className={styles.deleteBtn} title="Eliminar Banner"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
