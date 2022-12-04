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
import { Badge, Breadcrumb, MenuProps } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { TargetType } from '@/ts/core/enum';

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
  const [key] = useCtrlUpdate(todoCtrl);

  const systemMenu = async () => {
    const orgCount = await todoCtrl.OrgTodo.getCount();
    const data = await todoCtrl.OrgTodo.getTodoList(false);
    const friend = data.filter((n) => n.Data.team.typeName === TargetType.Person);
    let new_system = [...systemTodo];
    new_system[0].icon = <Badge dot={friend.length !== 0}>{systemTodo[0].icon}</Badge>;
    new_system[1].icon = (
      <Badge dot={orgCount - friend.length !== 0}>{systemTodo[1].icon}</Badge>
    );
    new_system[2].icon = (
      <Badge
        dot={
          (await todoCtrl.MarketTodo.getCount()) +
            (await todoCtrl.PublishTodo.getCount()) !==
          0
        }>
        {systemTodo[2].icon}
      </Badge>
    );
    new_system[3].icon = (
      <Badge dot={(await todoCtrl.OrderTodo.getCount()) !== 0}>
        {systemTodo[3].icon}
      </Badge>
    );
    return new_system;
  };

  const renderMenu = async () => {
    console.log('yingyongdaiban', todoCtrl.AppTodo);
    const todos = todoCtrl.AppTodo.map(async (m) => {
      return {
        key: '/todo/app/' + m.id,
        label: m.name,
        icon: (
          <Badge dot={(await m.getCount()) !== 0}>
            <FundOutlined />
          </Badge>
        ),
      };
    });

    const muneItems = [
      {
        type: 'group',
        label: '平台待办',
        children: systemMenu(),
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
    if (todoCtrl.OrgTodo) {
      renderMenu();
    }
    const todo =
      location.pathname.indexOf('/todo/app/') > -1
        ? location.pathname.replace('/todo/app/', '')
        : '';
    setCurrentTodo(todo !== '' ? todoCtrl.currentAppTodo(todo) : undefined);
  }, [key]);

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
        currentTodo
          ? [
              <Breadcrumb.Item key="yingyongdaiban">应用待办</Breadcrumb.Item>,
              <Breadcrumb.Item key={currentTodo?.id}>
                {currentTodo?.name}
              </Breadcrumb.Item>,
            ]
          : ''
      }>
      <div id={key} style={{ height: '100%' }}>
        {renderRoutes(route.routes)}
      </div>
    </ContentTemplate>
  );
};

export default Todo;
