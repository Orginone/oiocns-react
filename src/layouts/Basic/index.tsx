import { Layout, Spin, Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import Navbar from './navbar';
import Executor from '@/executor';
import { kernel } from '@/ts/base';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { route, history } = props;
  const [inited, setInited] = useState(false);
  const [connectStatus, setConnectStatus] = useState(false);
  useEffect(() => {
    if (!orgCtrl.logined) {
      return history.push('/passport/login');
    }
    setTimeout(() => {
      setInited(true);
    }, 500);
    kernel.onConnectedChanged((res: boolean) => {
      setConnectStatus(res);
    });
  }, []);
  return (
    <Layout className={styles['page-layout']}>
      {inited ? (
        <>
          <Navbar />
          <Layout>
            {/** 命令执行器 */}
            <Executor />
            {/* 连接掉线通知 */}
            {!connectStatus && (
              <Alert
                message="当前网络不可用，需检查你的网络设置"
                type="warning"
                showIcon
                closable
              />
            )}
            {/* 公共头部 */}
            {/* <BasicHeader /> */}
            {/* 内容区域 */}
            {renderRoutes(route.routes)}
          </Layout>
        </>
      ) : (
        <Spin
          tip="加载中,请稍后..."
          size="large"
          style={{ marginTop: 'calc(50vh - 50px)' }}></Spin>
      )}
    </Layout>
  );
};

export default BasicLayout;
