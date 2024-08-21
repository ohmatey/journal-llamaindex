import React from 'react';

import styles from '../page.module.css';

export interface ResponseUIProps {
  ui: React.ReactNode;
}

const ResponseUI = ({ ui }: ResponseUIProps) => {
  return (
    <div className={styles.response}>
      {ui ? (
        <div>
          {ui}
        </div>
      ) : (
        <div>
          <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="140" cy="80" r="3" fill="#FFD700"/>
            <circle cx="250" cy="70" r="5" fill="#FFD700"/>
            <circle cx="180" cy="50" r="2" fill="#FFD700"/>
            <circle cx="220" cy="90" r="2" fill="#FFD700"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export default ResponseUI;