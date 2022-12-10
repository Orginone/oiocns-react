import userCtrl from '@/ts/controller/setting/userCtrl';
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';
/**
 * 用户头像
 * @returns
 */
const UserAvatar: React.FC = () => {
  const history = useHistory();
  /**
   * 下拉菜单项
   */
  const menuItems: MenuProps = {
    onClick: (info) => {
      if (info.key) {
        if (info.key === '/passport/login') {
          sessionStorage.clear();
        }
        history.push(info.key);
      }
    },
    items: [
      {
        key: '/person/info',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        type: 'divider' as const,
      },
      {
        key: '/passport/lock',
        icon: <LockOutlined />,
        label: '离开锁屏',
      },
      {
        key: '/passport/login',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
  };

  return (
    <Dropdown menu={menuItems} placement="bottomLeft">
      {userCtrl.user.avatar ? (
        <Avatar
          src={userCtrl.user.avatar.thumbnail}
          alt={userCtrl.user.name}
          size={28}></Avatar>
      ) : (
        <Avatar className={cls['header-user-avatar']} alt={userCtrl.user.name}>
          {userCtrl.user.name?.substring(0, 1)}
        </Avatar>
      )}
    </Dropdown>
  );
};

export default UserAvatar;
