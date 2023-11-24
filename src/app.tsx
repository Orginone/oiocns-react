import { ConfigProvider, Spin, notification } from 'antd';
import React, { Suspense, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';
import message from '@/utils/message';

import routes from './routes';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './global.less';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import orgCtrl from '@/ts/controller';
import config from 'devextreme/core/config';
import { loadMessages, locale } from 'devextreme/localization';
import zhMessage from 'devextreme/localization/messages/zh.json';
import { LoggerLevel, logger } from '@/ts/base/common';
import { useAudio } from 'react-use';

moment.locale('cn');
config({ defaultCurrency: 'zh' });
loadMessages(zhMessage);
locale('zh');

ConfigProvider.config({
  prefixCls: 'ogo',
});

notification.config({
  prefixCls: 'ogo-notification',
});

const App = () => {
  const [locale] = useState(zhCN);
  const [audio, , controls] = useAudio({
    src: '/media/bone.mp3',
  });
  logger.onLogger = (level, msg) => {
    switch (level) {
      case LoggerLevel.msg:
        controls.play();
        message.info(msg);
        break;
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
        message.error(msg);
        orgCtrl.exit();
        window.location.reload();
        break;
      case LoggerLevel.qrauthed:
        message.info(msg);
        window.location.href = '/#/home';
        window.location.reload();
        break;
    }
  };
  return (
    <HashRouter>
      <ConfigProvider prefixCls="ogo" locale={locale}>
        <Suspense fallback={<Spin size="large" className="layout__loading" />}>
          {renderRoutes(routes)}
        </Suspense>
      </ConfigProvider>
      {audio}
    </HashRouter>
  );
};

export default App;
