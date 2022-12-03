import { Badge, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';

import cls from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import todoCtrl from '@/ts/controller/todo/todoCtrl';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const [chatNum, setChatNum] = useState(0);
  const [taskNum, setTaskNum] = useState(0);
  const navs = [
    {
      path: '/chat',
      title: '聊天',
      icon: 'icon-message',
      count: chatNum,
      fath: '/chat',
    },
    {
      path: '/todo/friend',
      title: '待办',
      icon: 'icon-todo',
      count: taskNum,
      fath: '/todo',
    },
    {
      path: '/store/app',
      title: '仓库',
      icon: 'icon-store',
      count: 0,
      fath: '/store',
    },
    {
      path: '/setting/info',
      title: '设置',
      icon: 'icon-setting',
      count: 0,
      fath: '/setting',
    },
  ];
  useEffect(() => {
    const id = chatCtrl.subscribe(() => {
      setChatNum(chatCtrl.getNoReadCount());
    });
    const tid = todoCtrl.subscribe(async () => {
      setTaskNum(await todoCtrl.TaskCount());
    });
    return () => {
      chatCtrl.unsubscribe(id);
      todoCtrl.unsubscribe(tid);
    };
  }, []);
  return (
    <div className={cls['header-nav-container']}>
      <Space size={36}>
        {navs.map((item) => {
          return (
            <Badge key={item.path} count={item.count} size="small">
              <Link
                key={item.path}
                to={item.path}
                title={item.title}
                className={`${
                  location.pathname.includes(item.fath)
                    ? `${cls['active-icon']}`
                    : `${cls['un-active-icon']}`
                }`}>
                {typeof item.icon !== 'string' ? (
                  item.icon
                ) : (
                  <IconFont type={item.icon} />
                )}
              </Link>
            </Badge>
          );
        })}
      </Space>
    </div>
  );
};
export default withRouter(HeaderNav);
