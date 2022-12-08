import './index.less';

import React from 'react';
import { renderRoutes } from 'react-router-config';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from 'typings/globelType';
import MarketClassify from './Classify';
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
  return (
    <ContentTemplate sider={<MarketClassify history={history} />} type="market">
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Market;
