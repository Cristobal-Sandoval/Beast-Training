import styles from '../dashboard/loading.module.css';

export default function AdminLoading() {
  return (
    <div className={styles.container}>
      {/* Header Skeleton */}
      <div className={styles.headerSkeleton}>
        <div className={`${styles.skeleton} ${styles.title}`} style={{ width: '320px' }} />
        <div className={`${styles.skeleton} ${styles.subtitle}`} style={{ width: '450px' }} />
      </div>

      {/* Columns Grid Skeleton */}
      <div className={styles.dashboardGrid} style={{ gridTemplateColumns: '250px 1fr' }}>
        <div className={styles.sideCol}>
          <div className={`${styles.skeletonPanel} glass`} style={{ height: '350px', gap: '20px' }}>
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ height: '40px', borderRadius: '8px' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ height: '40px', borderRadius: '8px' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ height: '40px', borderRadius: '8px' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ height: '40px', borderRadius: '8px' }} />
          </div>
        </div>
        <div className={styles.mainCol}>
          <div className={`${styles.skeletonPanel} glass`} style={{ minHeight: '450px' }}>
            <div className={`${styles.skeleton} ${styles.panelHeader}`} style={{ width: '220px', height: '26px' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '40%' }} />
            <div className={styles.chartBoxSkeleton} style={{ flexGrow: 1, height: 'auto', minHeight: '300px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
