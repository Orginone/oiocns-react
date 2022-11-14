import { Avatar } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import logo from '@/assets/img/logo.png';

/**
 * 首页导航
 * @returns
 */
const HeaderHome: React.FC = () => {
  return (
    <Link to="/home">
      <Avatar shape="square" src={logo} alt="首页" size={22} />
    </Link>
  );
};

export default HeaderHome;
