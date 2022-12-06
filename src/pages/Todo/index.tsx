import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from 'typings/globelType';
import './index.less';
import {
  FundOutlined,
  UserOutlined,
  AuditOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { Badge, BadgeProps, Breadcrumb, MenuProps } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { TargetType } from '@/ts/core/enum';

const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  const [todoMenu, setTodoMenu] = useState<MenuProps[`items`]>();
  const [key] = useCtrlUpdate(todoCtrl);

  // 加载左侧平台待办菜单数据
  const loadLeftMenus = async () => {
    const orgCount = await todoCtrl.OrgTodo.getCount();
    const data = await todoCtrl.OrgTodo.getTodoList(false);
    const friend = data.filter((n) => n.Data.team.target.typeName === TargetType.Person);
    const mcount = await todoCtrl.MarketTodo.getCount();
    const pcount = await todoCtrl.PublishTodo.getCount();
    const ocount = await todoCtrl.OrderTodo.getCount();
    let newtodos = [];
    const getBadgeProps = (count: number) => {
      return { size: 'small', offset: [10, 0], count: count } as BadgeProps;
    };
    for (const m of todoCtrl.AppTodo) {
      const count = await m.getCount();
      newtodos.push({
        key: '/todo/app/' + m.id,
        label: <Badge {...getBadgeProps(count)}>{m.name}</Badge>,
        icon: <FundOutlined />,
      });
    }
    setTodoMenu([
      {
        type: 'group',
        label: '平台待办',
        children: [
          {
            label: <Badge {...getBadgeProps(friend.length)}>好友申请</Badge>,
            key: '/todo/friend',
            icon: <UserOutlined />,
          },
          {
            label: <Badge {...getBadgeProps(orgCount - friend.length)}>组织审核</Badge>,
            key: '/todo/org',
            icon: <AuditOutlined />,
          },
          {
            label: <Badge {...getBadgeProps(pcount + mcount)}>商店审核</Badge>,
            key: 'appAndStore',
            icon: <ShopOutlined />,
            children: [
              {
                label: <Badge {...getBadgeProps(pcount)}>上架审核</Badge>,
                key: '/todo/product',
                icon: <ShopOutlined />,
              },
              {
                label: <Badge {...getBadgeProps(mcount)}>加入商店</Badge>,
                key: '/todo/store',
                icon: <ShopOutlined />,
              },
            ],
          },
          {
            label: <Badge {...getBadgeProps(ocount)}>订单管理</Badge>,
            key: '/todo/order',
            icon: <UnorderedListOutlined />,
          },
        ],
      },
      {
        type: 'group',
        label: '应用待办',
        children: newtodos,
      },
    ]);
  };
  useEffect(() => {
    setTimeout(async () => {
      if (todoCtrl.OrgTodo) {
        await loadLeftMenus();
      }
    }, 10);
  }, [key]);

  return (
    <ContentTemplate
      siderMenuData={todoMenu}
      menuClick={(item) => {
        if (item.key.startsWith('#/todo/app/')) {
          todoCtrl.setCurrentAppTodo(item.key.substring(10));
        }
        if (location.hash.replace('#', '') === item.key) {
          history.replace(item.key);
        } else {
          history.push(item.key);
        }
      }}
      contentTopLeft={
        todoCtrl.CurAppTodo
          ? [
              <Breadcrumb.Item key="yingyongdaiban">应用待办</Breadcrumb.Item>,
              <Breadcrumb.Item key={todoCtrl.CurAppTodo.id}>
                {todoCtrl.CurAppTodo.name}
              </Breadcrumb.Item>,
            ]
          : ''
      }>
      <div style={{ height: '100%' }}>{renderRoutes(route.routes)}</div>
    </ContentTemplate>
  );
};

export default Todo;
