import React from 'react';
import styles from './index.css';
import InputAutoCompleteCustom from './FormGroup/InputAutoCompleteCustom';
import InputSelectCustom from './FormGroup/InputSelectCustom';
import InputTooltipCustom from './FormGroup/InputTooltipCustom';

export default () => (
  <div className={styles.normal}>
    <InputAutoCompleteCustom />
    <div>Hello Umi!</div>
    <InputTooltipCustom />
    <InputSelectCustom />
  </div>
);
