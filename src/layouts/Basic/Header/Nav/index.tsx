import { Badge, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import cls from './index.module.less';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { msgChatNotify } from '@/ts/core';
import { FileExcelFilled } from '@ant-design/icons';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const [msgKey, setMsgKey] = useState('');
  const [taskKey, setTaskKey] = useState('');
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  useEffect(() => {
    const id = msgChatNotify.subscribe((key) => {
      let noReadCount = 0;
      for (const item of orgCtrl.chat.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMsgCount(noReadCount);
      setMsgKey(key);
    });
    const workId = orgCtrl.work.notity.subscribe(async (key) => {
      setWorkCount(orgCtrl.work.todos.length);
      setTaskKey(key);
    });
    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);
  const navs = [
    {
      key: 'home',
      path: '/home',
      title: '门户',
      icon: 'home',
      count: 0,
      fath: '/home',
      onClick: () => {},
    },
    {
      key: msgKey,
      path: '/chat',
      title: '沟通',
      icon: 'chat',
      count: msgCount,
      fath: '/chat',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: taskKey,
      path: '/work',
      title: '办事',
      icon: 'work',
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
      title: '存储',
      icon: 'store',
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
      icon: 'market',
      count: 0,
      fath: '/market',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'dowload',
      path: '/dowload',
      title: '下载',
      icon: 'myWork',
      count: 0,
      fath: '/dowload',
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
        }}>
        {typeof item.icon !== 'string' ? (
          item.icon
        ) : (
          <OrgIcons
            size={26}
            type={item.icon}
            selected={location.hash.startsWith('#' + item.fath)}
          />
        )}
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
