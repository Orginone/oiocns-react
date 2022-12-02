import React from 'react';
import { renderRoutes } from 'react-router-config';

import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';

import { mainMenu } from './Menu';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

/**
 * 个人
 * @returns
 */
const Person: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  // const sider = <PersonMenu></PersonMenu>;
  return (
    <ContentTemplate siderMenuData={mainMenu as ItemType[]}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Person;
