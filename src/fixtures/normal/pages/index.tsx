import React from 'react';
import styles from './index.css';
import InputAutoCompleteCustom from './FormGroup/InputAutoCompleteCustom';
import InputSelectCustom from './FormGroup/InputSelectCustom';
import InputTooltipCustom from './FormGroup/InputTooltipCustom';

export default () => (
  <div className={styles.normal}>
    <InputAutoCompleteCustom />
    <h1>Hello autotips components!</h1>
    <InputTooltipCustom />
    <InputSelectCustom />
  </div>
);
