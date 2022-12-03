import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import * as Icon from '@ant-design/icons';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
// import todoService from '@/ts/controller/todo';
// import siderBar from './components/sidebar';

// import TodoMenu, { muneItems } from './Menu';
import './index.less';
import { Breadcrumb, MenuProps } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  FundOutlined,
  DatabaseOutlined,
  UserOutlined,
  AuditOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
// TODO 获取应用待办
const apps = [
  { label: '公益仓', key: '/todo/gyc', icon: <HomeOutlined /> },
  { label: '办公OA', key: '/todo/oa', icon: <FileTextOutlined /> },
  { label: '资产管理', key: '/todo/asset', icon: <FundOutlined /> },
  { label: '资产监控', key: '/todo/monitor', icon: <DatabaseOutlined />, children: [] },
];
// 平台待办
const systemTodo = [
  { label: '好友申请', key: '/todo/friend', icon: <UserOutlined /> },
  { label: '单位审核', key: '/todo/org', icon: <AuditOutlined /> },
  {
    label: '商店审核',
    key: 'appAndStore',
    icon: <ShopOutlined />,
    children: [
      {
        label: '应用上架',
        key: '/todo/app',
        icon: <ShopOutlined />,
      },
      { label: '加入市场', key: '/todo/store', icon: <ShopOutlined /> },
    ],
  },
  { label: '订单管理', key: '/todo/order', icon: <UnorderedListOutlined /> },
];
const muneItems = [
  {
    type: 'group',
    label: '平台待办',
    children: systemTodo,
  },
  {
    type: 'group',
    label: '应用待办',
    children: apps,
  },
];
const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  // const [todoMenu, setTodoMenu] = useState<MenuProps[`items`]>();
  // const renderMenu = (menu: any[]) => {
  //   return menu.map((m) => {
  //     const icon =
  //       m.icon && typeof m.icon === 'string' ? React.createElement(Icon[m.icon]) : m.icon;
  //     let children = m.children || null;
  //     if (children) {
  //       children = renderMenu(m.children);
  //     }
  //     return {
  //       ...m,
  //       icon: icon,
  //       children,
  //     };
  //   });
  // };

  // useEffect(() => {
  //   const data = siderBar.menuItems.map((n) => {
  //     if (n.type && n.children) {
  //       const menuChildren = renderMenu(n.children);
  //       n = {
  //         ...n,
  //         children: menuChildren,
  //       };
  //     }
  //     return n;
  //   });
  //   setTodoMenu(data as MenuProps[`items`]);
  // }, []);

  // 菜单跳转
  const toNext = (e: any) => {
    // const splitKey = e.key.split('/');
    // todoService.currentModel = splitKey[splitKey.length - 1]; // 设置当前模块
    history.push(`${e.key}`);
    // siderBar.handleClickMenu(e.item?.props.node); // 出发控制器事件 生成面包屑数据
  };

  return (
    <ContentTemplate
      siderMenuData={muneItems as ItemType[]}
      menuClick={toNext}
      // contentTopLeft={siderBar.curentBread.map((n) => (
      //   <Breadcrumb.Item key={n}>{n}</Breadcrumb.Item>
      // ))}
    >
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Todo;
