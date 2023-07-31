import React from 'react';
import { Avatar, Layout } from 'antd';
import { Link } from 'react-router-dom';
import cls from './index.module.less';
import Navigation from '@/layouts/Basic/GlobalSidebar/Navigation';

const GlobalSidebar: React.FC = () => {
  return (
    <Layout.Sider width={88}>
      <div className={cls.globalSlider}>
        <Link to="/home" style={{ fontSize: 16, fontWeight: 'bold' }}>
          <Avatar
            shape="square"
            src="/img/logo/logo3.jpg"
            alt="首页"
            size={30}
            style={{ marginRight: 10 }}
          />
        </Link>
        <Navigation></Navigation>
        <div></div>
      </div>
    </Layout.Sider>
  );
};

export default GlobalSidebar;
