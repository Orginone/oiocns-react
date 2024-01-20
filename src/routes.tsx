import React from 'react';

import { AiFillHome } from 'react-icons/ai';
import { IRouteConfig } from '../typings/globelType';
import NotFound from '@/layouts/NotFound';
import BasicLayout from '@/layouts/Basic';
import AuthPage from '@/layouts/Auth';
import DownLoad from '@/layouts/Download';
import PrivacyPolicy from '@/layouts/PrivacyPolicy';
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
    icon: 'icon-store',
    component: React.lazy(() => import('@/pages/Store')),
    routes: [],
  },
];

const RelationRouter: IRouteConfig[] = [
  {
    path: '/relation',
    title: '设置',
    icon: 'icon-relation',
    component: React.lazy(() => import('@/pages/Relation')),
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
    path: '/download',
    component: DownLoad,
    title: '下载移动端',
    redirect: '/download',
    routes: [],
  },
  {
    path: '/orginone_yinshi',
    component: PrivacyPolicy,
    title: '奥集能隐私政策',
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
      ...RelationRouter,
      {
        path: '*',
        title: '页面不存在',
        component: NotFound,
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
