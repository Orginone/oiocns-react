import { Badge, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';

import cls from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
// import { HeartFilled } from '@ant-design/icons';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const [chatKey] = useCtrlUpdate(chatCtrl);
  const [taskNum, setTaskNum] = useState(0);
  const navs = [
    {
      key: chatKey,
      path: '/chat',
      title: '沟通',
      icon: 'icon-message',
      count: chatCtrl.getNoReadCount(),
      fath: '/chat',
    },
    {
      key: 'todo',
      path: '/todo',
      title: '办事',
      icon: 'icon-todo',
      count: taskNum,
      fath: '/todo',
    },
    {
      key: 'store',
      path: '/store',
      title: '管理',
      icon: 'icon-store',
      count: 0,
      fath: '/store',
    },
    {
      key: 'setting',
      path: '/setting',
      title: '设置',
      icon: 'icon-setting',
      count: 0,
      fath: '/setting',
    },
  ];
  useEffect(() => {
    const id = todoCtrl.subscribe(async () => {
      setTaskNum(await todoCtrl.getTaskCount());
    });
    return () => {
      return todoCtrl.unsubscribe(id);
    };
  }, []);

  const getLinkItem = (item: any) => {
    return (
      <Link
        key={item.path}
        to={item.path}
        title={item.title}
        className={`${
          location.hash.startsWith('#' + item.fath)
            ? `${cls['active-icon']}`
            : `${cls['un-active-icon']}`
        }`}>
        {typeof item.icon !== 'string' ? item.icon : <IconFont type={item.icon} />}
      </Link>
    );
  };

  return (
    <div className={cls['header-nav-container']}>
      <Space size={30}>
        {navs.map((item) => {
          if (item.count > 0) {
            return (
              <Badge key={item.key} count={item.count} size="small">
                {getLinkItem(item)}
              </Badge>
            );
          } else {
            return getLinkItem(item);
          }
        })}
      </Space>
    </div>
  );
};
export default withRouter(HeaderNav);
