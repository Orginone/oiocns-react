import { Layout, message } from 'antd';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
import BasicHeader from './Header';
import styles from './index.module.less';
import userCtrl from '@/ts/controller/setting';
import { logger, LoggerLevel } from '@/ts/base/common';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { route, history } = props;
  useEffect(() => {
    if (!userCtrl.logined) {
      return history.push('/passport/login');
    }
  }, []);

  logger.onLogger = (level, msg) => {
    switch (level) {
      case LoggerLevel.info:
        message.info(msg);
        break;
      case LoggerLevel.warn:
        message.warn(msg);
        break;
      case LoggerLevel.error:
        message.error(msg);
        break;
      case LoggerLevel.unauth:
        message.warn(msg);
        return history.push('/passport/login');
    }
  };
  return (
    <Layout className={styles['page-layout']}>
      {userCtrl.logined ? (
        <>
          {/* 公共头部 */}
          <BasicHeader />
          {/* 内容区域 */}
          <Layout className={styles['main-content']}>{renderRoutes(route.routes)}</Layout>
        </>
      ) : (
        ''
      )}
    </Layout>
  );
};

export default BasicLayout;
