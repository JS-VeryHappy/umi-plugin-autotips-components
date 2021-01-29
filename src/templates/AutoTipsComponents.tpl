import React from 'react';
import styles from './index.less';
import { SettingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { history } from 'umi';

export const AutoTipsComponents = function AutoTipsComponents(props) {

  if (
    location.pathname.indexOf('~docs') !== -1 ||
    location.pathname.indexOf('~demos') !== -1
  ) {
    return (
      <>
        {props.children}
      </>
    );
  }
  
  const onClick = () => {
    let _source = {};
    if (typeof props.children[0] === 'object') {
      _source = props.children[0]._source;
    } else {
      _source = props.children._source;
    }
    window.postMessage({
      payload: { event: "click-components", payload: _source },
      source: "autotips-components"
    });
  }
  return (
    <>
      <div className={styles.main} >
        <SettingOutlined className={styles.icon} onClick={onClick} />
        {props.children}
      </div>
    </>
  );
}