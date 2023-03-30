import './index.less';
import React from 'react';
import { renderRoutes } from 'react-router-config';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from 'typings/globelType';
interface PageType {
  route: IRouteConfig;
  history: any;
}

/**
 * @desc: 市场 容器页面
 * @return {*}
 */
const Market: React.FC<PageType> = (props) => {
  const { route } = props;
  return (
    <ContentTemplate sider={<div></div>} type="market">
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Market;
