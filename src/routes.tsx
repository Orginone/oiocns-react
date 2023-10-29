import React from 'react';

import { AiFillHome } from '@/icons/ai';
import { IRouteConfig } from '../typings/globelType';
import PassportLayout from '@/layouts/Passport';
import PassportForget from '@/pages/Passport/Forget';
import PassportLogin from '@/pages/Passport/Login';
import PassportRegister from '@/pages/Passport/Register';
import NotFound from '@/layouts/NotFound';
import BasicLayout from '@/layouts/Basic';
import { Redirect } from 'react-router-dom';
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
    icon: <AiFillHome />,
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
    path: '/work',
    title: '办事',
    icon: 'icon-todo',
    component: React.lazy(() => import('@/pages/Work')),
  },
];

const StoreRouter: IRouteConfig[] = [
  {
    path: '/store',
    title: '存储',
    icon: 'icon-setting',
    component: React.lazy(() => import('@/pages/Store')),
    routes: [],
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
    render: () => <Redirect to="/passport/login" />,
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
      ...SettingRouter,
      {
        path: '*',
        title: '页面不存在',
        component: NotFound,
        // render: () => <RouterRedirect to="/noFond" />,
      },
    ],
  },
  {
    path: '/noFond',
    title: '页面不存在',
    component: NotFound,
  },
];

export default Routers;
