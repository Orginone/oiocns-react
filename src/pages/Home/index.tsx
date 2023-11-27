import React, { useState } from 'react';
import NavigationBar, { allPages } from './components/NavigationBar';
export interface NavigationItem {
  key: string;
  label: string;
  backgroundImageUrl: string;
  type: string;
  component: any;
}

const Home: React.FC = () => {
  const [current, setCurrent] = useState(allPages[0]);
  return (
    <div className="homepage">
      {current.type == 'inner' && (
        <div
          className="headBanner"
          style={{ backgroundImage: `url(${current.backgroundImageUrl})` }}></div>
      )}
      <div className="content">
        {current.type == 'inner' && React.createElement(current.component)}
      </div>
      {current.type == 'page' && current.component}
      <NavigationBar
        list={allPages}
        onChange={(item) => {
          setCurrent(item);
        }}
      />
    </div>
  );
};
export default Home;
