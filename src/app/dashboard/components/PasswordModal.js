'use client';

import styles from '../dashboard.module.css';

export default function PasswordModal({ show, onClose, onSubmit, newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, loading }) {
  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
      className={styles.passwordModalOverlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.cardPanel} glass ${styles.passwordModal}`}>
        <div className={styles.passwordModalHeader}>
          <h2 id="password-modal-title" className={styles.passwordModalTitle}>Actualizar Contraseña</h2>
          <button type="button" onClick={onClose} className={styles.passwordModalClose} aria-label="Cerrar modal de cambio de contraseña">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.passwordModalForm}>
          <div className={styles.inputGroup}>
            <label className={styles.passwordModalLabel}>Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número"
              required
              className={styles.passwordModalInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.passwordModalLabel}>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              required
              className={styles.passwordModalInput}
            />
          </div>

          <div className={styles.passwordModalActions}>
            <button type="button" onClick={onClose} className={styles.passwordModalCancel}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.passwordModalSubmit}>
              {loading ? 'Actualizando...' : 'Guardar Nueva Clave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
