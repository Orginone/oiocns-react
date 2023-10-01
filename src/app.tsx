import { ConfigProvider, Spin, message, notification } from 'antd';
import React, { Suspense, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';

import routes from '@/routes';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './global.less';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import config from 'devextreme/core/config';
import { loadMessages, locale } from 'devextreme/localization';
import zhMessage from 'devextreme/localization/messages/zh.json';
import { LoggerLevel, logger } from '@/ts/base/common';
import './components/PageBuilder';

moment.locale('cn');
config({ defaultCurrency: 'zh' });
loadMessages(zhMessage);
locale('zh');

message.config({
  prefixCls: 'ogo-message',
});

ConfigProvider.config({
  prefixCls: 'ogo',
});

notification.config({
  prefixCls: 'ogo-notification',
});

const App = () => {
  const [locale] = useState(zhCN);
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
        sessionStorage.clear();
        location.reload();
    }
  };
  return (
    <HashRouter>
      <ConfigProvider prefixCls="ogo" locale={locale}>
        <Suspense fallback={<Spin size="large" className="layout__loading" />}>
          {renderRoutes(routes)}
          <div className="DialogTempalte" id="DialogTempalte"></div>
        </Suspense>
      </ConfigProvider>
    </HashRouter>
  );
};

export default App;
