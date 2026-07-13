'use client';

import { Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

export default function PromosPanel({
  annBarText, setAnnBarText, annBarLink, setAnnBarLink, annBarActive, setAnnBarActive,
  newPromoCode, setNewPromoCode, newPromoDiscount, setNewPromoDiscount, promoCodes,
  handleSaveAnnouncementBar, handleCreatePromoCode, handleDeletePromoCode
}) {
  return (
    <div className={styles.tabContent}>
      <div className={`${styles.cardPanel} glass`}>
        <h2>Cintillo de Anuncios Superior</h2>
        <p className={styles.panelInstructions}>Configura el mensaje flotante que se muestra en la parte superior del sitio web.</p>
        <form onSubmit={handleSaveAnnouncementBar} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="annBarText">Mensaje del Cintillo</label>
            <input id="annBarText" type="text" placeholder="Ej: ¡PROMO IMPERDIBLE: 20% DE DESCUENTO CON EL CÓDIGO BEAST20!" value={annBarText} onChange={(e) => setAnnBarText(e.target.value)} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="annBarLink">Enlace de Redirección (Opcional)</label>
              <input id="annBarLink" type="text" placeholder="Ej: /planes" value={annBarLink} onChange={(e) => setAnnBarLink(e.target.value)} />
            </div>
            <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label htmlFor="annBarActive" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input id="annBarActive" type="checkbox" checked={annBarActive} onChange={(e) => setAnnBarActive(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <span>Mostrar Cintillo Activo</span>
              </label>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>Guardar Cintillo</button>
        </form>
      </div>

      <div className={`${styles.cardPanel} glass`}>
        <h2>Crear Código de Descuento (Cupón)</h2>
        <form onSubmit={handleCreatePromoCode} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPromoCode">Código del Cupón</label>
              <input id="newPromoCode" type="text" placeholder="Ej: BEAST20" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="newPromoDiscount">Porcentaje de Descuento (%)</label>
              <input id="newPromoDiscount" type="number" min="1" max="100" placeholder="20" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>Crear y Activar Cupón</button>
        </form>
      </div>

      <div className={`${styles.cardPanel} glass`}>
        <h2>Cupones de Descuento Activos</h2>
        {promoCodes.length === 0 ? (
          <p className={styles.emptyText}>No hay cupones creados.</p>
        ) : (
          <div className={styles.listGrid}>
            {promoCodes.map((promo) => (
              <div key={promo.id} className={styles.listItemCard}>
                <div className={styles.itemInfo}>
                  <h3>{promo.code}</h3>
                  <p>Descuento: <strong>{promo.discount_percent}% OFF</strong></p>
                </div>
                <button type="button" onClick={() => handleDeletePromoCode(promo.id)} className={styles.deleteBtn} title="Eliminar Cupón">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
