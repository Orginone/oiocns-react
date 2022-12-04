import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
import './index.less';
import {
  FundOutlined,
  UserOutlined,
  AuditOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { Breadcrumb, MenuProps } from 'antd';

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
        key: '/todo/product',
        icon: <ShopOutlined />,
      },
      { label: '加入市场', key: '/todo/store', icon: <ShopOutlined /> },
    ],
  },
  { label: '订单管理', key: '/todo/order', icon: <UnorderedListOutlined /> },
];

const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  const [todoMenu, setTodoMenu] = useState<MenuProps[`items`]>();
  const [currentTodo, setCurrentTodo] = useState<any>();
  const renderMenu = () => {
    console.log('yingyongdaiban', todoCtrl.AppTodo);
    const todos = todoCtrl.AppTodo.map((m) => {
      return {
        key: '/todo/app/' + m.id,
        label: m.name,
        icon: <FundOutlined />,
      };
    });
    const muneItems = [
      {
        type: 'group',
        label: '平台待办',
        children: systemTodo,
      },
      {
        type: 'group',
        label: '应用待办',
        children: todos,
      },
    ];
    setTodoMenu(muneItems as ItemType[]);
  };

  useEffect(() => {
    const id = todoCtrl.subscribe(renderMenu);
    return () => {
      todoCtrl.unsubscribe(id);
    };
  }, []);

  // 菜单跳转
  const toNext = (e: any) => {
    history.push(`${e.key}`);
    const todo = e.key.indexOf('/todo/app/') > -1 ? e.key.replace('/todo/app/', '') : '';
    setCurrentTodo(todo !== '' ? todoCtrl.currentAppTodo(todo) : undefined);
  };

  return (
    <ContentTemplate
      siderMenuData={todoMenu}
      menuClick={toNext}
      contentTopLeft={
        currentTodo && (
          <Breadcrumb.Item key={currentTodo?.id}>{currentTodo?.name}</Breadcrumb.Item>
        )
      }>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Todo;
