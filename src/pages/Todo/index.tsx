import React from 'react';
import { renderRoutes } from 'react-router-config';
import {
  AuditOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundOutlined,
  HomeOutlined,
  // PlusOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
import todoService, { tabStatus } from '@/ts/controller/todo';
import siderBar from '@/ts/controller/todo/sidebar';

// import TodoMenu, { muneItems } from './Menu';
import './index.less';
import { MenuProps } from 'rc-menu';
import { Button } from 'antd';

// const appService = new todoService('app');

const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  // const sider = <TodoMenu></TodoMenu>;
  // 菜单跳转
  const toNext = (e: any) => {
    console.log(e);
    const splitKey = e.key.split('/');
    todoService.currentModel = splitKey[splitKey.length - 1];
    history.push(`${e.key}`);
    // console.log(menukeys);
  };
  return (
    <ContentTemplate
      // sider={sider}
      siderMenuData={siderBar.menuItems as MenuProps[`items`]}
      menuClick={toNext}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Todo;
