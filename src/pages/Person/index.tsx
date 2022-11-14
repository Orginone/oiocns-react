import React from 'react';
import { renderRoutes } from 'react-router-config';

import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';

import PersonMenu from './Menu';

/**
 * 个人
 * @returns
 */
const Person: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const sider = <PersonMenu></PersonMenu>;
  return <ContentTemplate sider={sider}> {renderRoutes(route.routes)} </ContentTemplate>;
};

export default Person;
