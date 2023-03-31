import React from 'react';
import { Redirect } from 'react-router-dom';

// 设置默认进入登录页面
const RedirectPage: React.FC = () => {
  return <Redirect to="/passport/login" />;
};
export default RedirectPage;
