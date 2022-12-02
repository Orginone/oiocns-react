import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from '@/routes/config';
import BasicHeader from './Header';
import styles from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { route, history } = props;
  useEffect(() => {
    if (!userCtrl.User) {
      history.push('/passport/login');
    }
  }, []);

  return (
    <Layout className={styles['page-layout']}>
      {/* 公共头部 */}
      {userCtrl.User ? <BasicHeader /> : ''}
      {/* 内容区域 */}
      <Layout>{renderRoutes(route.routes)}</Layout>
    </Layout>
  );
};

export default BasicLayout;
