import userCtrl, { UserPartTypes } from '@/ts/controller/setting/userCtrl';
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';
/**
 * 用户头像
 * @returns
 */
const UserAvatar: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState(userCtrl.User);
  useEffect(() => {
    const id = userCtrl.subscribePart(UserPartTypes.User, () => {
      if (userCtrl.User) {
        setUser({ ...userCtrl.User });
      }
    });
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);
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
      {user && user.target.avatar ? (
        <Avatar src={user.target.avatar} alt={user.target.name} size={28}></Avatar>
      ) : (
        <Avatar className={cls['header-user-avatar']} alt={user?.target.name}>
          {user?.target.name.substring(0, 1)}
        </Avatar>
      )}
    </Dropdown>
  );
};

export default UserAvatar;
