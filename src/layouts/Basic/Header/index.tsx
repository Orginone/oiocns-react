import { Avatar, Layout, Space, Typography } from 'antd';
import React from 'react';

import styles from './index.module.less';
import HeaderNav from './Nav';
import UserAvatar from './UserAvatar';
import userCtrl from '@/ts/controller/setting';
import { PageLoading } from '@ant-design/pro-layout';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const BasicHeader: React.FC = () => {
  if (!userCtrl.user) return <PageLoading />;
  return (
    <Header className={styles['basic-header']}>
      <Space>
        <Link to="/home" style={{ fontSize: 16, fontWeight: 'bold' }}>
          <Avatar
            shape="square"
            src="/img/logo/logo3.jpg"
            alt="首页"
            size={22}
            style={{ marginRight: 10 }}
          />
          <Typography.Text className={styles['space-list']}>奥集能</Typography.Text>
        </Link>
      </Space>
      <Space size={32} align="center">
        <HeaderNav />
        <UserAvatar></UserAvatar>
      </Space>
    </Header>
  );
};

export default BasicHeader;
