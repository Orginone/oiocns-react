import cls from './index.module.less';
import React, { useState } from 'react';
import NavigationBar, { allPages } from './components/NavigationBar';
export interface NavigationItem {
  key: string;
  label: string;
  backgroundImageUrl: string;
  component: any;
}
const Home: React.FC = () => {
  const [current, setCurrent] = useState(allPages[0]);

  return (
    <div className={cls.homepage}>
      <NavigationBar
        list={allPages}
        onChange={(item) => {
          setCurrent(item);
        }}></NavigationBar>
      <div
        className={cls.headBanner}
        style={{ backgroundImage: `url(${current.backgroundImageUrl})` }}></div>
      {React.createElement(current.component)}
    </div>
  );
};
export default Home;
