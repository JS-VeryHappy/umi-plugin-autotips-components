import React from 'react';
import styles from './index.css';
import TestCustom from './TestCustom';
import Test1Custom from './Test1Custom';
import InputAutoCompleteCustom from './FormGroup/InputAutoCompleteCustom';
import InputSelectCustom from './FormGroup/InputSelectCustom';
import InputTooltipCustom from './FormGroup/InputTooltipCustom';

export default () => (
  <div className={styles.normal}>
    <TestCustom />
    <InputAutoCompleteCustom />
    <div>Hello Umi!</div>
    <InputTooltipCustom />
    <Test1Custom />
    <InputSelectCustom />
  </div>
);
