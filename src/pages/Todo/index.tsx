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
import { Badge, Breadcrumb, MenuProps } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { TargetType } from '@/ts/core/enum';

const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  const [todoMenu, setTodoMenu] = useState<MenuProps[`items`]>([]);
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
    const getLabel = (count: number, name: string) => {
      if (count > 0) {
        return (
          <Badge size="small" offset={[10, 0]} count={count}>
            {name}
          </Badge>
        );
      }
      return name;
    };
    for (const m of todoCtrl.AppTodo) {
      const count = await m.getCount();
      newtodos.push({
        key: '/todo/app/' + m.id,
        label: getLabel(count, m.name),
        icon: <FundOutlined />,
      });
    }
    setTodoMenu([
      {
        type: 'group',
        label: '平台待办',
        children: [
          {
            label: getLabel(friend.length, '好友申请'),
            key: '/todo/friend',
            icon: <UserOutlined />,
          },
          {
            label: getLabel(orgCount - friend.length, '组织审核'),
            key: '/todo/org',
            icon: <AuditOutlined />,
          },
          {
            label: getLabel(pcount + mcount, '商店审核'),
            key: 'appAndStore',
            icon: <ShopOutlined />,
            children: [
              {
                label: getLabel(pcount, '上架审核'),
                key: '/todo/product',
                icon: <ShopOutlined />,
              },
              {
                label: getLabel(mcount, '加入商店'),
                key: '/todo/store',
                icon: <ShopOutlined />,
              },
            ],
          },
          {
            label: getLabel(ocount, '订单管理'),
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
    loadLeftMenus();
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
