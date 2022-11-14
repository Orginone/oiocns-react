import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import React from 'react';
import { useHistory } from 'react-router-dom';

import useStore from '@/store';

import cls from './index.module.less';

/**
 * 用户头像
 * @returns
 */
const UserAvatar: React.FC = () => {
  const { user } = useStore((state) => ({ ...state }));
  const history = useHistory();

  /**
   * 退出登录
   *  1. 清空Token
   *  2. 清空用户信息
   */
  const logout = () => {
    localStorage.removeItem('Token');
    sessionStorage.clear();
    history.push('/passport/login');
  };

  /**
   * 锁屏
   */
  const lock = () => {
    history.push('/passport/lock');
  };

  /**
   * 前往个人中心
   */
  const personInfo = () => {
    history.push('/person/info');
  };

  /**
   * 下拉菜单点击
   * @param e
   */
  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'logout':
        logout();
        break;
      case 'person/info':
        personInfo();
        break;
      case 'lock':
        lock();
        break;
      default:
        break;
    }
  };

  /**
   * 下拉菜单项
   */
  const menuItems: ItemType[] = [
    {
      key: 'person/info',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'lock',
      icon: <LockOutlined />,
      label: '离开锁屏',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menu = <Menu items={menuItems} onClick={onClick}></Menu>;
  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      {user.avatar ? (
        <Avatar
          src={'https://joeschmoe.io/api/v1/random'}
          alt={user.userName}
          size={28}></Avatar>
      ) : (
        <Avatar className={cls['header-user-avatar']} alt={user.userName}>
          {user.userName?.substring(0, 1)}
        </Avatar>
      )}
    </Dropdown>
  );
};

export default UserAvatar;
