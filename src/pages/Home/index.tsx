import cls from './index.module.less';
import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
    component: React.lazy(() => import('./components/Content/WorkBench')),
  },
  {
    key: 'cohort',
    label: '群动态',
    backgroundImageUrl: '/img/banner/activity-bg.png',
    component: React.lazy(() => import('./components/Content/Activity/cohort')),
  },
  {
    key: 'friends',
    label: '好友圈',
    backgroundImageUrl: '/img/banner/circle-bg.jpeg',
    component: React.lazy(() => import('./components/Content/Activity/friends')),
  },
];
const Home: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(navigationList[0]);

  return (
    <div className={cls.homepage}>
      <NavigationBar
        list={navigationList}
        onChange={(item) => {
          setCurrent(item);
        }}></NavigationBar>
      <div
        className={cls.headBanner}
        style={{ backgroundImage: `url(${current.backgroundImageUrl})` }}>
        <Input.Search
          className={cls.search}
          placeholder="请输入你要搜索的内容"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchValue}
          onSearch={(value) => setSearchValue(value)}
        />
      </div>
      {React.createElement(current.component)}
    </div>
  );
};
export default Home;
