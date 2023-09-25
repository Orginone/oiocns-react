import cls from './index.module.less';
import React, { useState } from 'react';
import HeadBanner from '@/pages/Home/components/HeadBanner';
import NavigationBar from '@/pages/Home/components/NavigationBar';

export interface NavigationItem {
  key: string;
  label: string;
  backgroundImageUrl: string;
  component: any;
}
const navigationList: NavigationItem[] = [
  {
    key: 'app',
    label: '工作台',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/WorkBench')),
  },
  {
    key: 'activity',
    label: '群动态',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/Activity')),
  },
  {
    key: 'circle',
    label: '好友圈',
    backgroundImageUrl: '/img/banner/circle-bg.jpeg',
    component: React.lazy(() => import('@/pages/Home/components/Content/Circle')),
  },
  {
    key: 'warehouse',
    label: '公物仓',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/Warehouse')),
  },
  {
    key: 'digital-asset',
    label: '数据资产',
    backgroundImageUrl: '/img/banner/digital-asset-bg.png',
    component: React.lazy(() => import('@/pages/Home/components/Content/DigitalAsset')),
  },
];
const Home: React.FC = () => {
  const [current, setCurrent] = useState(navigationList[0]);

  return (
    <div className={cls.homepage}>
      <NavigationBar
        list={navigationList}
        onChange={(item) => {
          setCurrent(item);
        }}></NavigationBar>
      <HeadBanner
        backgroundImageUrl={current.backgroundImageUrl}
        title={current.label}></HeadBanner>
      {React.createElement(current.component)}
    </div>
  );
};
export default Home;
