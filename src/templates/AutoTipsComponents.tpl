import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { EyeOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { history } from 'umi';

export const AutoTipsComponents = function AutoTipsComponents(props) {

  const [visible, setVisible] = useState(() => {
    const visibleAutotips = localStorage.getItem('visibleAutotips');
    if (visibleAutotips === 'true') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleMessage = function (event) {
      if (event.data.source === 'autotips.components' && event.data.payload.event === 'visible') {
        setVisible(event.data.payload.payload);
      }
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener("message", handleMessage, false);
    }
  }, [])

  if (
    location.pathname.indexOf('~docs') !== -1 ||
    location.pathname.indexOf('~demos') !== -1 ||
    !visible
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
      payload: { event: "click", payload: _source },
      source: "autotips.components"
    });
  }
  return (
    <>
      <div className={styles.main} >
        <EyeOutlined className={styles.icon} onClick={onClick} />
        {props.children}
      </div>
    </>
  );
}