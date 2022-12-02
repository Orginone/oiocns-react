import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import * as Icon from '@ant-design/icons';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
import todoService from '@/ts/controller/todo';
import siderBar from '@/ts/controller/todo/sidebar';

// import TodoMenu, { muneItems } from './Menu';
import './index.less';
import { Breadcrumb, MenuProps } from 'antd';

const Todo: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  const [todoMenu, setTodoMenu] = useState<MenuProps[`items`]>();
  const renderMenu = (menu: any[]) => {
    return menu.map((m) => {
      const icon =
        m.icon && typeof m.icon === 'string' ? React.createElement(Icon[m.icon]) : m.icon;
      let children = m.children || null;
      if (children) {
        children = renderMenu(m.children);
      }
      return {
        ...m,
        icon: icon,
        children,
      };
    });
  };

  useEffect(() => {
    const data = siderBar.menuItems.map((n) => {
      if (n.type && n.children) {
        const menuChildren = renderMenu(n.children);
        n = {
          ...n,
          children: menuChildren,
        };
      }
      return n;
    });
    setTodoMenu(data as MenuProps[`items`]);
  }, []);

  // 菜单跳转
  const toNext = (e: any) => {
    const splitKey = e.key.split('/');
    todoService.currentModel = splitKey[splitKey.length - 1]; // 设置当前模块
    history.push(`${e.key}`);
    siderBar.handleClickMenu(e.item?.props.node); // 出发控制器事件 生成面包屑数据
  };

  return (
    <ContentTemplate
      siderMenuData={todoMenu}
      menuClick={toNext}
      contentTopLeft={siderBar.curentBread.map((n) => (
        <Breadcrumb.Item key={n}>{n}</Breadcrumb.Item>
      ))}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Todo;
