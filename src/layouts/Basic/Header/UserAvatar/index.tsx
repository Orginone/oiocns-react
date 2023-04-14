import userCtrl from '@/ts/controller/setting';
import { LockOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
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
      switch (info.key) {
        case '/passport/login':
          sessionStorage.clear();
          break;
        case '/setting':
          if (userCtrl.currentKey != '个人设置') {
            userCtrl.currentKey = '个人设置';
            userCtrl.changCallback();
          }
          break;
      }
      history.push(info.key);
    },
    items: [
      {
        key: '/setting',
        icon: <UserOutlined />,
        label: '个人设置',
      },
      { key: '/pageDesign', icon: <SettingOutlined />, label: '门户设置' },
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
      {userCtrl.user.shareInfo.avatar ? (
        <Avatar
          src={userCtrl.user.shareInfo.avatar.thumbnail}
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
