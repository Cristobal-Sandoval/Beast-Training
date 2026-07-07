import styles from './loading.module.css';

export default function DashboardLoading() {
  return (
    <div className={styles.container}>
      {/* Header Skeleton */}
      <div className={styles.headerSkeleton}>
        <div className={`${styles.skeleton} ${styles.title}`} />
        <div className={`${styles.skeleton} ${styles.subtitle}`} />
      </div>

      {/* Stats Grid Skeleton */}
      <div className={styles.statsGrid}>
        <div className={`${styles.skeletonCard} glass`}>
          <div className={`${styles.skeleton} ${styles.icon}`} />
          <div className={styles.statInfo}>
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '60px' }} />
            <div className={`${styles.skeleton} ${styles.number}`} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '100px' }} />
          </div>
        </div>
        <div className={`${styles.skeletonCard} glass`}>
          <div className={`${styles.skeleton} ${styles.icon}`} />
          <div className={styles.statInfo}>
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '60px' }} />
            <div className={`${styles.skeleton} ${styles.number}`} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '100px' }} />
          </div>
        </div>
        <div className={`${styles.skeletonCard} glass`}>
          <div className={`${styles.skeleton} ${styles.icon}`} />
          <div className={styles.statInfo}>
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '60px' }} />
            <div className={`${styles.skeleton} ${styles.number}`} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '100px' }} />
          </div>
        </div>
      </div>

      {/* Columns Grid Skeleton */}
      <div className={styles.dashboardGrid}>
        <div className={styles.mainCol}>
          <div className={`${styles.skeletonPanel} glass`}>
            <div className={`${styles.skeleton} ${styles.panelHeader}`} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '80%' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '90%' }} />
            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '70%' }} />
          </div>
          <div className={`${styles.skeletonPanel} glass`}>
            <div className={`${styles.skeleton} ${styles.panelHeader}`} />
            <div className={styles.chartBoxSkeleton} />
          </div>
        </div>
        <div className={styles.sideCol}>
          <div className={`${styles.skeletonPanel} glass`}>
            <div className={`${styles.skeleton} ${styles.panelHeader}`} />
            <div className={styles.chatSkeleton} />
          </div>
        </div>
      </div>
    </div>
  );
}
