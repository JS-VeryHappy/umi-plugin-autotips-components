import React from 'react';
import styles from './index.css';
import Test1Custom from './Test1Custom';

export default () => (
  <div className={styles.normal}>
    Hello Umi1!
    <Test1Custom />
  </div>
);
