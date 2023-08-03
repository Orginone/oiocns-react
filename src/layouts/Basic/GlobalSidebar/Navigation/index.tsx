import React, { useEffect, useState } from 'react';
import { msgChatNotify } from '@/ts/core';
import orgCtrl from '@/ts/controller';

import cls from './index.module.less';
import { Badge, Image } from 'antd';
import { useHistory } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [workCount, setWorkCount] = useState(0);

  const [currentKey, setCurrentKey] = useState('home');

  const history = useHistory();

  const IconItem: React.FC<{ item: NavigationItem }> = (props) => {
    return (
      <Image
        className={cls.navigationItem__icon}
        preview={false}
        width={30}
        height={30}
        src={`/svg/${
          props.item.key === currentKey ? props.item.key + '-select' : props.item.key
        }.svg`}
      />
    );
  };
  interface NavigationItem {
    key: string;
    path: string;
    title: string;
    count?: number;
  }
  const navigationItems: NavigationItem[] = [
    {
      key: 'chat',
      path: '/chat',
      title: '沟通',
      count: messageCount,
    },
    {
      key: 'work',
      path: '/work',
      title: '办事',
      count: workCount,
    },
    {
      key: 'home',
      path: '/home',
      title: '首页',
    },
    {
      key: 'store',
      path: '/store',
      title: '存储',
    },
    {
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.name,
    },
  ];

  useEffect(() => {
    const id = msgChatNotify.subscribe(() => {
      let noReadCount = 0;
      for (const item of orgCtrl.chat.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMessageCount(noReadCount);
    });
    const workId = orgCtrl.work.notity.subscribe(async () => {
      setWorkCount(orgCtrl.work.todos.length);
    });

    navigationItems.forEach((item) => {
      location.hash.startsWith('#' + item.path) && setCurrentKey(item.key);
    });

    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);

  const renderItem = (item: NavigationItem) => {
    return (
      <div
        key={item.key}
        className={cls.navigationItem}
        onClick={() => {
          setCurrentKey(item.key);
          history.push(item.path);
          orgCtrl.currentKey = '';
          orgCtrl.changCallback();
        }}>
        {item.count ? (
          <Badge count={item.count}>
            <IconItem item={item}></IconItem>
          </Badge>
        ) : (
          <IconItem item={item}></IconItem>
        )}

        <div
          className={
            item.key === currentKey
              ? cls.navigationItem__titleActive
              : cls.navigationItem__title
          }>
          {item.title}
        </div>
      </div>
    );
  };

  return (
    <div className={cls.navigation}>
      {navigationItems.map((item) => {
        return renderItem(item);
      })}
    </div>
  );
};
export default Navigation;
