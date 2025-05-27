import React from 'react';
import styles from './loading-animation.module.css';

const LoadingGrid: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className={styles.loadingDots}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.dot} />
        ))}
      </div>
    </div>
  );
};

export default LoadingGrid;
