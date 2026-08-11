'use client';

import { Edit, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

export default function BannersPanel({
  editingBannerId, setEditingBannerId,
  bannerTitle, setBannerTitle, bannerDesc, setBannerDesc,
  bannerTagline, setBannerTagline, bannerAlign, setBannerAlign,
  bannerTextVerticalAlign, setBannerTextVerticalAlign,
  bannerImg, setBannerImg, bannerImgPosition, setBannerImgPosition, bannerLink, setBannerLink,
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
              <label htmlFor="bannerAlign">Texto: Alineación Horizontal</label>
              <select id="bannerAlign" value={bannerAlign} onChange={(e) => setBannerAlign(e.target.value)} className={styles.selectInput}>
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bannerTextVerticalAlign">Texto: Alineación Vertical</label>
              <select id="bannerTextVerticalAlign" value={bannerTextVerticalAlign} onChange={(e) => setBannerTextVerticalAlign(e.target.value)} className={styles.selectInput}>
                <option value="top">Arriba</option>
                <option value="center">Centro (Medio)</option>
                <option value="bottom">Abajo</option>
              </select>
            </div>
          </div>
          
          {/* Logic to parse image position for sliders */}
          {(() => {
            const parsePosition = (pos) => {
              if (!pos) return { x: 50, y: 50 };
              if (pos === 'center') return { x: 50, y: 50 };
              if (pos === 'top') return { x: 50, y: 0 };
              if (pos === 'bottom') return { x: 50, y: 100 };
              if (pos === 'left') return { x: 0, y: 50 };
              if (pos === 'right') return { x: 100, y: 50 };
              const parts = pos.split(' ').map(p => p.trim());
              if (parts.length >= 2) {
                const px = parseInt(parts[0]);
                const py = parseInt(parts[1]);
                return { 
                  x: isNaN(px) ? 50 : px, 
                  y: isNaN(py) ? 50 : py 
                };
              }
              if (parts.length === 1) {
                const val = parseInt(parts[0]);
                if (!isNaN(val)) return { x: val, y: 50 };
              }
              return { x: 50, y: 50 };
            };
            
            const { x: imgX, y: imgY } = parsePosition(bannerImgPosition);
            
            return (
              <div className={styles.formRowFlex}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label htmlFor="bannerImg">URL de Imagen de Fondo (Desde servidor externo)</label>
                  <input id="bannerImg" type="text" placeholder="https://images.unsplash.com/..." value={bannerImg || ''} onChange={(e) => setBannerImg(e.target.value)} />
                  
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Ajustar Horizontal (Izquierda / Derecha)</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{imgX}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Izq</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={imgX} 
                          onChange={(e) => setBannerImgPosition(`${e.target.value}% ${imgY}%`)} 
                          style={{ flexGrow: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Der</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Ajustar Vertical (Arriba / Abajo)</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{imgY}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arriba</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={imgY} 
                          onChange={(e) => setBannerImgPosition(`${imgX}% ${e.target.value}%`)} 
                          style={{ flexGrow: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Abajo</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {bannerImg && (
                  <div className={`${styles.inputGroup} ${styles.previewContainerBanner}`}>
                    <label>Previsualización del Banner</label>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-light)',
                      background: 'rgba(0,0,0,0.2)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: bannerTextVerticalAlign === 'top' ? 'flex-start' : bannerTextVerticalAlign === 'bottom' ? 'flex-end' : 'center',
                      justifyContent: bannerAlign === 'left' ? 'flex-start' : bannerAlign === 'right' ? 'flex-end' : 'center',
                      padding: '12px'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={bannerImg} alt="Preview Banner" style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${imgX}% ${imgY}%`,
                        zIndex: 0
                      }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.75))',
                        zIndex: 1
                      }} />
                      
                      <div style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: bannerAlign,
                        maxWidth: '85%',
                        color: 'white'
                      }}>
                        {bannerTagline && (
                          <span style={{
                            display: 'inline-block',
                            background: 'rgba(255, 87, 0, 0.2)',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            padding: '2px 6px',
                            borderRadius: '50px',
                            fontSize: '0.55rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            marginBottom: '4px'
                          }}>
                            {bannerTagline}
                          </span>
                        )}
                        <h4 style={{
                          fontSize: '0.85rem',
                          fontWeight: '800',
                          margin: 0,
                          lineHeight: '1.2',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}>
                          {bannerTitle || 'Título del Banner'}
                        </h4>
                        {bannerDesc && (
                          <p style={{
                            fontSize: '0.65rem',
                            color: '#ccc',
                            margin: '2px 0 0 0',
                            lineHeight: '1.2',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                          }}>
                            {bannerDesc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
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
