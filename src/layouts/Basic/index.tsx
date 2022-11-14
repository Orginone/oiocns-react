import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';

import { chat } from '@/module/chat/orgchat';
import { IRouteConfig } from '@/routes/config';
import useStore from '@/store';
import useChatStore from '@/store/chat';

import BasicHeader from './Header';
import styles from './index.module.less';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const token: any = sessionStorage.getItem('Token');
  const { route, history } = props;
  const { getUserInfo } = useStore((state) => ({ ...state }));
  const { RecvMsg, getChats }: any = useChatStore();
  useEffect(() => {
    if (!token) {
      history.push('/passport/login');
    } else {
      getUserInfo();
    }
    if (token) {
      RecvMsg();
      getChats();
    }
  }, []);
  chat.start(token);

  return (
    <Layout className={styles['page-layout']}>
      {/* 公共头部 */}
      <BasicHeader />
      {/* 内容区域 */}
      <Layout>{renderRoutes(route.routes)}</Layout>
    </Layout>
  );
};

export default BasicLayout;
