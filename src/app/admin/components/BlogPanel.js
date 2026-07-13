'use client';

import { Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

export default function BlogPanel({
  postTitle, setPostTitle, postAuthor, setPostAuthor, postImg, setPostImg,
  postExcerpt, setPostExcerpt, postContent, setPostContent,
  posts, actionLoading, handleCreatePost, handleDeletePost
}) {
  return (
    <div className={styles.tabContent}>
      <div className={`${styles.cardPanel} glass`}>
        <h2>Publicar Nuevo Artículo en el Blog</h2>
        <form onSubmit={handleCreatePost} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="postTitle">Título del Artículo (genera slug automáticamente)</label>
            <input id="postTitle" type="text" placeholder="Ej: 5 Ejercicios Clave para Aumentar tu Fuerza" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="postAuthor">Autor</label>
              <input id="postAuthor" type="text" placeholder="Ej: Coach Javier" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="postImg">URL de Imagen de Portada</label>
              <input id="postImg" type="text" placeholder="https://images.unsplash.com/..." value={postImg} onChange={(e) => setPostImg(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="postExcerpt">Extracto / Descripción Corta</label>
            <textarea id="postExcerpt" rows={2} placeholder="Breve resumen que aparecerá en las vistas previas del blog..." value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="postContent">Contenido del Artículo</label>
            <textarea id="postContent" rows={10} placeholder="Escribe el contenido completo del artículo aquí..." value={postContent} onChange={(e) => setPostContent(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={actionLoading}>
            {actionLoading ? 'Publicando...' : 'Publicar Artículo'}
          </button>
        </form>
      </div>

      <div className={`${styles.cardPanel} glass`}>
        <h2>Artículos Publicados</h2>
        {posts.length === 0 ? (
          <p className={styles.emptyText}>No hay artículos publicados aún.</p>
        ) : (
          <div className={styles.listGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.listItemCard}>
                <div className={styles.itemInfo}>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className={styles.itemBadge}>Por {post.author} • {new Date(post.published_at).toLocaleDateString('es-CL')}</span>
                </div>
                <button type="button" onClick={() => handleDeletePost(post.id)} className={styles.deleteBtn} title="Eliminar Artículo"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
