import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.less';
import {
  Drawer,
  Divider,
  Col,
  Row,
  Typography,
  Space,
  Descriptions,
  Tooltip,
  Checkbox,
  Table,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import autoTipsCounts from '@/.umi/plugin-autotips-components/data.json';
import { dateFormatFn, winPath } from '../utils/index';
// import { socketClient, socketCallSend } from './socketClient';

const { Paragraph, Text, Link, Title } = Typography;

const mainStyle = {
  position: 'fixed',
  bottom: '50px',
  right: 0,
  background: 'rgba(255, 255, 255, 0.3)',
  boxShadow:
    '0 6px 16px -8px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)',
  padding: '10px',
  zIndex: 999,
};

function App(props) {
  const [visible, setVisible] = useState(false);
  const [visibleChecked, setVisibleChecked] = useState(() => {
    const visibleAutotips = localStorage.getItem('visibleAutotips');
    if (visibleAutotips === 'true') {
      return true;
    }
    return false;
  });

  const [componentInfo, setComponentInfo] = useState({});
  const { hasDumi, socketPort } = props;

  //组件初始化监听消息事件
  useEffect(() => {
    //预留未来做props动态插入
    //启动连接websocket
    // const { hostname, protocol } = window.location;
    // (async () => {
    //     await socketClient(`${protocol}//${hostname}:${socketPort}/autotips`)
    // })()

    const handleMessage = event => {
      if (
        event.data.source === 'autotips.components' &&
        event.data.payload.event === 'click'
      ) {
        //预留未来做props动态插入
        // socketCallSend({
        //     type: 'autotips.components.get.types',
        //     payload: {
        //         filePath: winPath(event.data.payload.payload.fileName)
        //     }
        // }).then((payload) => {
        //     setComponentInfo(event.data.payload.payload);
        //     setVisible(true);
        // }).catch();
        ReactDOM.unstable_batchedUpdates(() => {
          setComponentInfo(event.data.payload.payload);
          setVisible(true);
        });
      }
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, []);

  //关闭弹窗
  const onClose = () => {
    setVisible(false);
  };
  //切换显示状态
  const onChange = e => {
    setVisibleChecked(e.target.checked);
    localStorage.setItem('visibleAutotips', e.target.checked);
    window.postMessage({
      payload: { event: 'visible', payload: e.target.checked },
      source: 'autotips.components',
    });
  };

  //取指定组件值
  const counts = autoTipsCounts || null;

  let fileName = componentInfo.fileName || '';
  fileName = fileName.indexOf('\\') > -1 ? winPath(fileName) : fileName;
  const arr = fileName.split('/');
  const title = arr[arr.length - 2];
  const { count = 0, paths = [], dumiDocPath = [], fileStats = {}, docs = {} } =
    counts[title] || {};

  const DumiDom = () => {
    if (!hasDumi) {
      return <Text type="warning">未开启Dumi</Text>;
    }
    if (!dumiDocPath) {
      return <Text type="danger">未编写文档</Text>;
    }
    return (
      <Link href={dumiDocPath} target="_blank">
        <Tooltip title={dumiDocPath}>查看文档</Tooltip>
      </Link>
    );
  };

  const ComplexityDom = () => {
    if (fileStats.size > 5) {
      return <Text type="danger">困难</Text>;
    }
    if (fileStats.size > 3) {
      return <Text type="warning">一般</Text>;
    }
    return <Text type="success">正常</Text>;
  };

  const columns = [
    {
      title: '属性',
      dataIndex: 'fieldName',
      width: 100,
    },
    {
      title: '必填',
      dataIndex: 'required',
      render: text =>
        text ? <Text type="danger">是</Text> : <Text type="secondary">否</Text>,
      width: 70,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ];

  let columnsData = [];
  if (docs.props) {
    columnsData = Object.keys(docs.props).map(key => {
      const defaultValue =
        docs.props[key].description &&
        docs.props[key].description.match(/@default.*/g);
      let type = docs.props[key].flowType.name;
      if (docs.props[key].flowType.raw) {
        type = docs.props[key].flowType.raw;
      }
      return {
        key: key,
        fieldName: key,
        description: docs.props[key].description,
        required: docs.props[key].required ? true : false,
        defaultValue: defaultValue && defaultValue[0].replace('@default', ''),
        type: type,
      };
    });
  }

  return (
    <>
      <div className="autotips-components-main" style={mainStyle}>
        <div className={styles.setting}>
          <Checkbox onChange={onChange} checked={visibleChecked}>
            显示
          </Checkbox>
        </div>
      </div>
      <Drawer
        className={styles.drawer}
        width={800}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Descriptions title={title} bordered>
          <Descriptions.Item label="组件路径">
            <Link href={`vscode://file/${fileName}`} target="_blank">
              <Tooltip title={fileName}>打开文件</Tooltip>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="被引用次数">
            <Text type="warning">{count}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="dumi文档地址">
            <DumiDom />
          </Descriptions.Item>
          <Descriptions.Item label="引用页面" span={3}>
            {paths.map((item, index) => {
              return (
                <div key={index}>
                  <Space size="large">
                    <Link href={item.pageRoute} target="_blank">
                      <Tooltip title={item.pageRoute}>
                        {item.pageRouteName || item.pagePath}(跳转页面)
                      </Tooltip>
                    </Link>
                    <Link href={`vscode://file${item.path}`} target="_blank">
                      <Tooltip title={item.path}>
                        <Text type="success">打开文件</Text>
                      </Tooltip>
                    </Link>
                  </Space>
                </div>
              );
            })}
          </Descriptions.Item>
          <Descriptions.Item label="文件大小" span={2}>
            {fileStats.size}(KB)
          </Descriptions.Item>
          <Descriptions.Item label="复杂度" span={1}>
            <Space size={5}>
              <ComplexityDom />
              <Tooltip title="文件大小>5KB(困难);文件大小>3KB(一般);否则(正常)">
                <QuestionCircleOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="最后修改时间" span={3}>
            {dateFormatFn(new Date(parseInt(fileStats.mtimeMs)))}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Title level={5}>组件Props</Title>
        <Table
          columns={columns}
          dataSource={columnsData}
          bordered
          title={docs.description}
          pagination={false}
        />
      </Drawer>
    </>
  );
}

const doc = window.document;
const node = doc.createElement('div');
node.style.display = 'unset';
node.id = 'autotips-components';
doc.body.appendChild(node);

export default props => {
  ReactDOM.render(<App {...props} />, node);
};
