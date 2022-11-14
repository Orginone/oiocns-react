import './index.less';

import React from 'react';
import { renderRoutes } from 'react-router-config';

import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';

import MarketClassify from './components/Classify';

interface PageType {
  route: IRouteConfig;
  history: any;
}

/**
 * @desc: 市场 容器页面
 * @return {*}
 */
const Market: React.FC<PageType> = (props) => {
  const { route, history } = props;
  // console.log(renderRoutes(route.routes));
  return (
    <ContentTemplate sider={<MarketClassify history={history} />}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Market;
