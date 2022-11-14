import { Layout, Space } from 'antd';
import React from 'react';

import OrganizationalUnits from './WorkSpace';

import HeaderHome from './Home';
import cls from './index.module.less';
import HeaderNav from './Nav';
import UserAvatar from './UserAvatar';

const { Header } = Layout;

const BasicHeader: React.FC = () => {
  return (
    <Header className={cls[`basic-header`]}>
      <OrganizationalUnits />
      <Space size={32} align="center">
        <HeaderHome />
        <HeaderNav />
        <UserAvatar></UserAvatar>
      </Space>
    </Header>
  );
};

export default BasicHeader;
