import styles from './loading.module.css';

export default function BlogLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSkeleton}>
        <div className={`${styles.skeleton} ${styles.title}`} />
        <div className={`${styles.skeleton} ${styles.subtitle}`} />
      </div>

      <div className={styles.gridSkeleton}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.skeletonCard} glass`}>
            <div className={`${styles.skeleton} ${styles.image}`} />
            <div className={styles.cardBody}>
              <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '70%' }} />
              <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '100%' }} />
              <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
