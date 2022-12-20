import React from 'react';

import {
  AppstoreOutlined,
  AuditOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundOutlined,
  HomeFilled,
  ShopOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { IRouteConfig } from '../../typings/globelType.d';

import PassportLayout from '@/layouts/Passport';
import PassportForget from '@/pages/Passport/Forget';
import PassportLock from '@/pages/Passport/Lock';
import PassportLogin from '@/pages/Passport/Login';
import PassportRegister from '@/pages/Passport/Register';
import Redirect from '@/pages/Redirect';
import BasicLayout from '@/layouts/Basic';
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
    path: '/passport/lock',
    component: PassportLock,
    exact: true,
    title: '锁屏',
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
    component: React.lazy(() => import('@/pages/Chat')),
  },
];

/* 办事 */
const TodoRouter: IRouteConfig[] = [
  {
    path: '/todo',
    title: '办事',
    icon: 'icon-todo',
    component: React.lazy(() => import('@/pages/Todo')),
    routes: [
      {
        path: '/todo/friend',
        title: '好友申请',
        icon: <UserOutlined />,
        component: React.lazy(() => import('@/pages/Todo/Friend')),
      },
      {
        path: '/todo/org',
        title: '单位审核',
        icon: <AuditOutlined />,
        component: React.lazy(() => import('@/pages/Todo/Org')),
      },
      {
        path: '/todo/appAndStore',
        title: '商店审核',
        icon: <ShopOutlined />,
        // render: () => <div></div>,
        routes: [
          {
            path: '/todo/product',
            title: '应用上架',
            icon: <ShopOutlined />,
            component: React.lazy(() => import('@/pages/Todo/Product')),
          },
          {
            path: '/todo/store',
            title: '加入市场',
            icon: <ShopOutlined />,
            component: React.lazy(() => import('@/pages/Todo/Store')),
          },
        ],
      },
      {
        path: '/todo/app/:id',
        title: '应用上架',
        icon: <ShopOutlined />,
        hideInMenu: true,
        component: React.lazy(() => import('@/pages/Todo/App')),
      },
      {
        path: '/todo/product',
        title: '应用上架',
        icon: <ShopOutlined />,
        hideInMenu: true,
        component: React.lazy(() => import('@/pages/Todo/Product')),
      },
      {
        path: '/todo/store',
        title: '加入市场',
        icon: <ShopOutlined />,
        hideInMenu: true,
        component: React.lazy(() => import('@/pages/Todo/Store')),
      },
      {
        path: '/todo/order',
        title: '订单管理',
        icon: <UnorderedListOutlined />,
        component: React.lazy(() => import('@/pages/Todo/Order')),
      },
      {
        path: '/todo/',
        title: '应用待办',
        icon: <UnorderedListOutlined />,
        hideInMenu: true,
        component: React.lazy(() => import('@/pages/Todo/App')),
      },
    ],
  },
];

/* 仓库 */
const StoreRouter: IRouteConfig[] = [
  {
    path: '/store',
    title: '仓库',
    icon: 'icon-store',
    component: React.lazy(() => import('@/pages/Store')),
    routes: [
      {
        path: '/store/market/shop',
        title: '应用市场',
        icon: 'icon-message',
        component: React.lazy(() => import('@/pages/Store/Market/Shop')),
      },
      {
        path: '/store/app',
        title: '应用',
        icon: <AppstoreOutlined />,
        component: React.lazy(() => import('@/pages/Store/App')),
        routes: [
          {
            path: '/store/app/info',
            title: '应用信息',
            icon: '',
            component: React.lazy(() => import('@/pages/Store/App/Info')),
          },
          {
            path: '/store/app/manage',
            title: '应用管理',
            icon: '',
            component: React.lazy(() => import('@/pages/Store/App/Manage')),
          },
          {
            path: '/store/app/create',
            title: '应用注册',
            icon: '',
            component: React.lazy(() => import('@/pages/Store/App/CreatApp')),
          },
          {
            path: '/store/app/putaway',
            title: '应用上架',
            icon: '',
            component: React.lazy(() => import('@/pages/Store/App/Putaway')),
          },
        ],
      },

      {
        path: '/store/doc',
        title: '文档',
        icon: <FileTextOutlined />,
        component: React.lazy(() => import('@/pages/Store/Doc')),
      },
      {
        path: '/store/data',
        title: '数据',
        icon: <FundOutlined />,
        component: React.lazy(() => import('@/pages/Store/Data')),
      },
      {
        path: '/store/assets',
        title: '资源',
        icon: <DatabaseOutlined />,
        component: React.lazy(() => import('@/pages/Store/Assets')),
      },
    ],
  },
];

/* 市场 */
const MarketRouter: IRouteConfig[] = [
  {
    path: '/market',
    component: React.lazy(() => import('@/pages/Store/Market')),
    title: '市场',
    icon: 'icon-guangshangcheng',
    routes: [
      {
        path: '/market/shop',
        title: '应用市场',
        icon: 'icon-message',
        component: React.lazy(() => import('@/pages/Store/Market/Shop')),
      },
      {
        path: '/market',
        title: '应用市场',
        render: () => <RouterRedirect to="/market/shop" />,
      },
    ],
  },
];

const TeamRouter: IRouteConfig[] = [
  {
    path: '/team',
    title: '设置',
    icon: 'icon-setting',
    component: React.lazy(() => import('@/pages/Team')),
  },
];

const WelfareRouter: IRouteConfig[] = [
  {
    path: '/welfare',
    title: '公益仓',
    icon: 'icon-setting',
    component: React.lazy(() => import('@/pages/Welfare')),
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
      ...TeamRouter,
      ...WelfareRouter,
      {
        path: '/online',
        title: '第三方应用',
        component: React.lazy(() => import('@/pages/Online')),
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
