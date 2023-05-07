import { Badge, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';

import cls from './index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { msgChatNotify } from '@/ts/core';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const [msgKey, setMsgKey] = useState('');
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  useEffect(() => {
    const id = msgChatNotify.subscribe((key) => {
      let noReadCount = 0;
      for (const item of orgCtrl.user.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMsgCount(noReadCount);
      setMsgKey(key);
    });
    // const workId = workNotify.subscribe(async (key) => {
    //   let todos = await orgCtrl.user.work.loadTodo(true);
    //   setWorkCount(todos.length);
    //   setMsgKey(key);
    // });
    return () => {
      msgChatNotify.unsubscribe(id);
      // workNotify.unsubscribe(workId);
    };
  }, []);
  const navs = [
    {
      key: msgKey,
      path: '/chat',
      title: '沟通',
      icon: 'icon-message',
      count: msgCount,
      fath: '/chat',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'work',
      path: '/work',
      title: '办事',
      icon: 'icon-todo',
      count: workCount,
      fath: '/work',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'store',
      path: '/store',
      title: '仓库',
      icon: 'icon-store',
      count: 0,
      fath: '/store',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'market',
      path: '/market',
      title: '流通',
      icon: 'icon-guangshangcheng',
      count: 0,
      fath: '/store',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.metadata.name,
      icon: <TeamIcon share={orgCtrl.user.share} size={28} title="设置" />,
      count: 0,
      fath: '/setting',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
  ];

  const getLinkItem = (item: any) => {
    return (
      <Link
        key={item.key}
        to={item.path}
        title={item.title}
        onClick={() => {
          item.onClick();
        }}
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
