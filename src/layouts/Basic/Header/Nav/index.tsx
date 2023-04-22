import { Badge, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';

import cls from './index.module.less';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { msgNotify } from '@/ts/core';
// import { HeartFilled } from '@ant-design/icons';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const [msgKey, setMsgKey] = useState('');
  const [msgCount, setMsgCount] = useState(0);
  useEffect(() => {
    const id = msgNotify.subscribe((key) => {
      let noReadCount = 0;
      for (const item of orgCtrl.user.allChats()) {
        noReadCount += item.noReadCount;
      }
      setMsgCount(noReadCount);
      setMsgKey(key);
    });
    return () => {
      msgNotify.unsubscribe(id);
    };
  }, []);
  // TODO 加载未读消息数量
  const [taskNum, setTaskNum] = useState(0);
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
        history.push('/chat');
      },
    },
    {
      key: 'todo',
      path: '/todo',
      title: '办事',
      icon: 'icon-todo',
      count: taskNum,
      fath: '/todo',
      onClick: () => {
        todoCtrl.currentKey = '';
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
      title: '商店',
      icon: 'icon-guangshangcheng',
      count: 0,
      fath: '/store',
      onClick: () => {},
    },
    {
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.teamName,
      icon: <TeamIcon share={orgCtrl.user.shareInfo} size={28} title="设置" />,
      count: 0,
      fath: '/setting',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
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
