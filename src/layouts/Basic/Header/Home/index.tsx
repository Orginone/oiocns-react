import { Avatar } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 首页导航
 * @returns
 */
const HeaderHome: React.FC = () => {
  return (
    <Link to="/home">
      <Avatar shape="square" src="/img/logo/logo3.jpg" alt="首页" size={22} />
    </Link>
  );
};

export default HeaderHome;
