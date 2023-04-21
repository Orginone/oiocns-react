import { Layout, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
import BasicHeader from './Header';
import styles from './index.module.less';
import orgCtrl from '@/ts/controller';
import { logger, LoggerLevel } from '@/ts/base/common';

type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const [inited, setInited] = useState(orgCtrl.provider.inited);
  const { route, history } = props;
  useEffect(() => {
    if (!orgCtrl.logined) {
      return history.push('/passport/login');
    }
    orgCtrl.subscribe(() => {
      if (inited != orgCtrl.provider.inited) {
        setInited(orgCtrl.provider.inited);
      }
    });
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
      {inited ? (
        <>
          {/* 公共头部 */}
          <BasicHeader />
          {/* 内Header />
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
