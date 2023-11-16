import React from 'react';

import { AiFillHome } from 'react-icons/ai';
import { IRouteConfig } from '../typings/globelType';
import NotFound from '@/layouts/NotFound';
import BasicLayout from '@/layouts/Basic';
import AuthPage from '@/layouts/Auth';
export interface RouteComponentConfig extends Omit<IRouteConfig, 'component' | 'routes'> {
  routes?: RouteComponentConfig[];
  component?: React.LazyExoticComponent<React.FC<Record<string, unknown>>>;
}

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
    path: '/auth',
    component: AuthPage,
    title: '授权页',
    redirect: '/auth',
    routes: [],
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
