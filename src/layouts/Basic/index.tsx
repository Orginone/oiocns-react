import { Layout, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
import BasicHeader from './Header';
import styles from './index.module.less';
import orgCtrl from '@/ts/controller';

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
          {/* 公共头部 */}
          <BasicHeader />
          {/* 内容区域 */}
          <Layout className={styles['main-content']}>{renderRoutes(route.routes)}</Layout>
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
