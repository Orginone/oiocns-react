import { Layout, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import Navbar from './navbar';
import Executor from '@/executor';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { route, history } = props;
  const [inited, setInited] = useState(false);
  useEffect(() => {
    if (!orgCtrl.logined) {
      return history.push('/passport/login');
    }
    setTimeout(() => {
      setInited(true);
    }, 500);
  }, []);
  return (
    <Layout className={styles['page-layout']}>
      {inited ? (
        <>
          <Navbar />
          <Layout
            style={{
              overflow: 'auto',
            }}>
            {/** 命令执行器 */}
            <Executor />
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
