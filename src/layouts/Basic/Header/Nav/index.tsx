import { Space } from 'antd';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';

import cls from './index.module.less';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const navs = [
    {
      path: '/chat',
      title: '聊天',
      icon: 'icon-message',
    },
    {
      path: '/todo/friend',
      title: '待办',
      icon: 'icon-todo',
    },
    {
      path: '/store/app',
      title: '仓库',
      icon: 'icon-store',
    },
    {
      path: '/setting/info',
      title: '设置',
      icon: 'icon-setting',
    },
  ];
  return (
    <div className={cls['header-nav-container']}>
      <Space size={36}>
        {navs.map((item) => {
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.title}
              className={`${
                location.pathname.includes(item.path)
                  ? `${cls['active-icon']}`
                  : `${cls['un-active-icon']}`
              }`}>
              {typeof item.icon !== 'string' ? item.icon : <IconFont type={item.icon} />}
            </Link>
          );
        })}
      </Space>
    </div>
  );
};
export default withRouter(HeaderNav);
