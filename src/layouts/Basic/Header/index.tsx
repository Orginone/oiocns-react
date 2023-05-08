import { Avatar, Layout, Space, Typography } from 'antd';
import React from 'react';

import styles from './index.module.less';
import HeaderNav from './Nav';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const BasicHeader: React.FC = () => {
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
          <Typography.Text className={styles['space-list']}>资产共享云</Typography.Text>
        </Link>
      </Space>
      <Space size={32} align="center">
        <HeaderNav />
      </Space>
    </Header>
  );
};

export default BasicHeader;
