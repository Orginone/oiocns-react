import { Breadcrumb, Space, Typography } from 'antd';
import React, { ReactNode, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IRouteConfig } from 'typings/globelType';

import { routerInfo } from '../../routes/config';
import { IconFont } from '../IconFont';
import cls from './index.module.less';

const breadcrumbNameMap: Record<string, IRouteConfig> = {};
/**
 * 遍历路由，初始化映射关系
 * @param routerInfo 路由
 */
const initMap = (routes: any[]) => {
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
const BreadCrumb = (props: any) => {
  useMemo(() => initMap(routerInfo), []);

  const location = useLocation();
  const history = useHistory();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  // TODO 面包屑下拉菜单
  const items = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    if (breadcrumbNameMap[url]?.routes) {
      breadcrumbNameMap[url].routes
        ?.filter((n: any) => !n.hideInMenu)
        .map((r) => {
          return {
            key: r.path,
            label: (
              <Space onClick={() => !r.routes && history.push(r.path)}>
                {createIcon(r.icon)}
                {r.title}
              </Space>
            ),
            children: r.routes
              ? r.routes.map((m) => ({
                  key: m.path,
                  label: (
                    <Space onClick={() => history.push(m.path)}>
                      {createIcon(m.icon)}
                      {m.title}
                    </Space>
                  ),
                }))
              : null,
          };
        });
    }
    return (
      breadcrumbNameMap[url]?.title && (
        <Breadcrumb.Item
          key={url}
          className={cls['comp-breadcrumb']}
          // menu={menuItems ? { items: menuItems } : undefined}
        >
          {location.pathname === url && createIcon(breadcrumbNameMap[url]?.icon)}
          <Typography.Text>{breadcrumbNameMap[url]?.title}</Typography.Text>
        </Breadcrumb.Item>
      )
    );
  });
  return (
    <div className={cls['comp-breadcrumb-comtainer']}>
      <Breadcrumb>
        {items}
        {props?.children}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
