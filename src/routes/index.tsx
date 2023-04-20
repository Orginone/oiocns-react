import React from 'react';

import { HomeFilled } from '@ant-design/icons';
import { IRouteConfig } from '../../typings/globelType.d';

import PassportLayout from '@/layouts/Passport';
import PassportForget from '@/pages/Passport/Forget';
import PassportLogin from '@/pages/Passport/Login';
import PassportRegister from '@/pages/Passport/Register';
import Redirect from '@/pages/Redirect';
import BasicLayout from '@/layouts/Basic';
// import PageDesign from '@/pages/PageDesign';
export interface RouteComponentConfig extends Omit<IRouteConfig, 'component' | 'routes'> {
  routes?: RouteComponentConfig[];
  component?: React.LazyExoticComponent<React.FC<Record<string, unknown>>>;
}
/* 通行证 */
const PassportRouter: IRouteConfig[] = [
  {
    path: '/passport/login',
    component: PassportLogin,
    exact: true,
    title: '登录',
  },
  {
    path: '/passport/register',
    component: PassportRegister,
    exact: true,
    title: '注册',
  },
  {
    path: '/passport/forget',
    component: PassportForget,
    exact: true,
    title: '忘记密码',
  },
];

/* 首页 */
const HomeRouter: IRouteConfig[] = [
  {
    path: '/home',
    title: '首页',
    icon: <HomeFilled />,
    component: React.lazy(() => import('@/pages/Home')),
  },
];

/* 沟通 */
const ChatRouter: IRouteConfig[] = [
  {
    path: '/chat',
    title: '沟通',
    icon: 'icon-message',
    component: React.lazy(() => import('@/pages/Chats')),
  },
];

/* 办事 */
const TodoRouter: IRouteConfig[] = [
  {
    path: '/todo',
    title: '办事',
    icon: 'icon-todo',
    component: React.lazy(() => import('@/pages/Todo')),
  },
];

/* 市场 */
const MarketRouter: IRouteConfig[] = [
  {
    path: '/market',
    component: React.lazy(() => import('@/pages/Store/Market')),
    title: '市场',
    icon: 'icon-guangshangcheng',
  },
];

const StoreRouter: IRouteConfig[] = [
  {
    path: '/store',
    title: '仓库',
    icon: 'icon-setting',
    component: React.lazy(() => import('@/pages/Store')),
    routes: [
      {
        path: '/store/market/shop',
        title: '应用市场',
        icon: 'icon-message',
        component: React.lazy(() => import('@/pages/Store/Market/Shop')),
      },
    ],
  },
];

const SettingRouter: IRouteConfig[] = [
  {
    path: '/setting',
    title: '设置',
    icon: 'icon-setting',
    component: React.lazy(() => import('@/pages/Setting')),
  },
];

// 路由汇总
const Routers: IRouteConfig[] = [
  {
    path: '/',
    title: '/',
    exact: true,
    component: Redirect,
  },
  {
    path: '/passport',
    component: PassportLayout,
    title: '通行证',
    redirect: '/passport/login',
    routes: [...PassportRouter],
  },
  {
    path: '/',
    component: BasicLayout,
    title: '通用',
    routes: [
      ...HomeRouter,
      ...ChatRouter,
      ...TodoRouter,
      ...StoreRouter,
      ...MarketRouter,
      ...SettingRouter,
      {
        path: '/online',
        title: '第三方应用',
        component: React.lazy(() => import('@/pages/Online')),
      },
      {
        path: '/pageDesign',
        title: '门户设置',
        component: React.lazy(() => import('@/pages/PageDesign')),
      },
      {
        path: '*',
        title: '页面不存在',
        component: React.lazy(() => import('@/pages/NoFond')),
        // render: () => <RouterRedirect to="/noFond" />,
      },
    ],
  },
  {
    path: '/noFond',
    title: '页面不存在',
    component: React.lazy(() => import('@/pages/NoFond')),
  },
];

// interface rType {
//   path: string;
//   title: string;
//   icon?: string | React.ReactNode;
//   routes?: rType[];
// }
// function handleInfo(routeArr: IRouteConfig[]): rType[] {
//   return routeArr.map((r: IRouteConfig) => {
//     let obj: rType = {
//       path: r.path,
//       title: r.title,
//       icon: r?.icon || '',
//     };
//     if (r.routes && r.routes?.length > 0) {
//       obj.routes = handleInfo(r.routes);
//     }
//     return obj;
//   });
// }
// 处理 向外导出的 路由目录树 不携带组件信息
// console.log(handleInfo(Routers));

export default Routers;
