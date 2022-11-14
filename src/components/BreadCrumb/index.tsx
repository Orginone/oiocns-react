import { Breadcrumb, Menu, Space, Typography } from 'antd';
import React, { ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import routes, { IRouteConfig } from '../../routes/config';
import { IconFont } from '../IconFont';
import cls from './index.module.less';

const breadcrumbNameMap: Record<string, IRouteConfig> = {};

/**
 * 遍历路由，初始化映射关系
 * @param routes 路由
 */
const initMap = (routes: IRouteConfig[]) => {
  routes.forEach((route) => {
    breadcrumbNameMap[route.path] = route;
    if (route.routes && route.routes.length > 0) {
      initMap(route.routes);
    }
  });
};

// 根据数据类型渲染icon
const createIcon = (icon?: string | React.Component | ReactNode) => {
  return typeof icon == 'string' ? (
    <IconFont type={(icon as string) || ''} className={cls['comp-breadcrumb-icon']} />
  ) : (
    <span className={cls['comp-breadcrumb-icon']}>{icon as ReactNode}</span> || ''
  );
};

/**
 * 全局面包屑
 * @returns
 */
const BreadCrumb: React.FC = () => {
  initMap(routes);

  const location = useLocation();
  const history = useHistory();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  // TODO 面包屑下拉菜单
  const items = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let menu = undefined;
    if (breadcrumbNameMap[url].routes) {
      const items = breadcrumbNameMap[url].routes?.map((r) => {
        return {
          key: r.path,
          label: (
            <Space onClick={() => history.push(r.path)}>
              {/* <Link to={r.path}> */}
              {createIcon(r.icon)}
              {r.title}
              {/* </Link> */}
            </Space>
          ),
        };
      });
      menu = <Menu items={items}></Menu>;
    }
    return (
      <Breadcrumb.Item key={url} className={cls['comp-breadcrumb']} overlay={menu}>
        {location.pathname === url && createIcon(breadcrumbNameMap[url].icon)}
        <Typography.Text>{breadcrumbNameMap[url].title}</Typography.Text>
      </Breadcrumb.Item>
    );
  });
  return (
    <div className={cls['comp-breadcrumb-comtainer']}>
      <Breadcrumb>{items}</Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
