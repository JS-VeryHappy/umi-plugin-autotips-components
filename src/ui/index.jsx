import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.less';
import { Drawer, Divider, Col, Row, Typography, Space, Descriptions, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import autoTipsCounts from '@/.umi/autotips-components/data.json';
import { dateFormatFn } from '../utils/index';

const { Paragraph, Text, Link, Title } = Typography;

function App(props) {
   
    const [visible, setVisible] = useState(true);
    const [componentInfo, setComponentInfo] = useState({ fileName: "/Applications/MAMP/htdocs/myframework/umi-plugin-autotips-components/example/pages/Test1Custom/index.tsx" });
    const { hasDumi } = props;

    const onClose = () => {
        setVisible(false);
    }

    useEffect(() => {
        const handleMessage = function (event) {
            if (event.data.source === 'autotips-components' && event.data.payload.event === 'click-components') {
                setComponentInfo(event.data.payload.payload);
                setVisible(true);
            }
        };
        window.addEventListener('message', handleMessage, false);
        return () => {
            window.removeEventListener("message", handleMessage, false);
        }
    }, [])

    const counts = autoTipsCounts || null;
    const fileName = componentInfo.fileName || '';
    const arr = fileName.split('/');
    const title = arr[arr.length - 2];
    const { count = 0, paths = [], dumiDocPath = [], fileStats = {} } = counts[title] || {};
   
    const DumiDom = () => {
        if (!hasDumi) {
            return <Text type="warning">未开启Dumi</Text>;
        }
        if (!dumiDocPath) {
            return <Text type="danger">未编写文档</Text>;
        }
        return (
            <Link href={dumiDocPath} target="_blank">
                <Tooltip title={dumiDocPath}>
                    查看文档
                </Tooltip>
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

    return (
        <>
            <Drawer
                className={styles.drawer}
                width={800}
                placement="right"
                onClose={onClose}
                visible={visible}
            >
                <Descriptions title={title} bordered >
                    <Descriptions.Item label="组件路径">
                        <Link href={`vscode://file/${fileName}`} target="_blank">
                            <Tooltip title={fileName}>
                                打开文件
                            </Tooltip>
                        </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="被引用次数">
                        <Text type="warning">{count}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="dumi文档地址">
                        <DumiDom />
                    </Descriptions.Item>
                    <Descriptions.Item label="引用页面" span={3}>
                        {
                            paths.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Space size="large">
                                            <Link href={item.pageRoute} target="_blank" >
                                                <Tooltip title={item.pageRoute}>
                                                    {item.pageRouteName || item.pagePath}(跳转页面)
                                                </Tooltip>
                                            </Link>
                                            <Link href={`vscode://file${item.path}`} target="_blank" >
                                                <Tooltip title={item.path}>
                                                    <Text type="success">打开文件</Text>
                                                </Tooltip>
                                            </Link>
                                        </Space>
                                    </div>
                                )
                            })
                        }
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

            </Drawer>
        </>
    );
}

const doc = window.document;
const node = doc.createElement('div');
doc.body.appendChild(node);

export default (props) => {
    ReactDOM.render(
        <App {...props} />,
        node,
    );
};