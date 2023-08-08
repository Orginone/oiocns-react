import React from 'react';
import { Avatar, Layout } from 'antd';
import { Link } from 'react-router-dom';
import cls from './index.module.less';
import Navigation from '@/layouts/Basic/GlobalSidebar/Navigation';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

const GlobalSidebar: React.FC = () => {
  return (
    <Layout.Sider width={56}>
      <div className={cls.globalSlider}>
        <Link to="/home" style={{ fontSize: 16, fontWeight: 'bold' }}>
          <Avatar shape="square" src="/img/logo/logo3.jpg" alt="首页" size={40} />
        </Link>
        <Navigation></Navigation>
        <div
          onClick={() => {
            sessionStorage.clear();
            location.reload();
          }}
          style={{ cursor: 'pointer' }}>
          <OrgIcons size={26} type="exit" title="注销" selected />
        </div>
      </div>
    </Layout.Sider>
  );
};

export default GlobalSidebar;
