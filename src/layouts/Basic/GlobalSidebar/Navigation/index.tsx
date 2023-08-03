import React, { useEffect, useState } from 'react';
import { msgChatNotify } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { kernel, model, schema } from '@/ts/base';
import { Link } from 'react-router-dom';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import { Badge, Drawer, List, Tabs, Tag } from 'antd';
import { ImLink } from 'react-icons/im';
import { showChatTime } from '@/utils/tools';
import cls from './index.module.less';

const Navigation: React.FC = () => {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [msgKey, setMsgKey] = useState('');
  const [taskKey, setTaskKey] = useState('');
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [online, setOnline] = useState(0);
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
    kernel.onlineNotity.subscribe(() => {
      setOnline(kernel.onlineIds.length);
    });
    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);

  const navs = [
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
      key: 'home',
      path: '/home',
      title: '门户',
      icon: 'home',
      count: 0,
      fath: '/home',
      onClick: () => {},
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
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.name,
      count: 0,
      icon: 'setting',
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
        {item.key === 'setting' ? (
          <>
            <TeamIcon entityId={orgCtrl.user.id} size={28} title="设置" />
            <OrgIcons
              className={cls.settingIcon}
              size={13}
              type={item.icon}
              notAvatar
              selected={location.hash.startsWith('#' + item.fath)}
            />
          </>
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
    <div className={cls.navigation}>
      {online > 0 && (
        <div
          style={{ display: 'flex', cursor: 'pointer' }}
          onClick={() => setOnlineVisible(!onlineVisible)}>
          <Badge count={online} size="small">
            <ImLink size={22} color={'#4CAF50'} />
          </Badge>
        </div>
      )}
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
      {onlineVisible && <OnlineInfo onClose={() => setOnlineVisible(false)} />}
    </div>
  );
};
const OnlineInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [key, setKey] = useState('1');
  const [onlines, setOnlines] = useState<model.OnlineInfo[]>([]);
  useEffect(() => {
    const id = kernel.onlineNotity.subscribe((key) => {
      kernel.onlines().then((value) => {
        setOnlines(value);
        setKey(key);
      });
    });
    return () => {
      kernel.onlineNotity.unsubscribe(id);
    };
  }, []);

  const loadOnlineInfo = (onlines: model.OnlineInfo[]) => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={onlines.sort(
          (a, b) => new Date(b.onlineTime).getTime() - new Date(a.onlineTime).getTime(),
        )}
        renderItem={(item) => <OnlineItem data={item} />}
      />
    );
  };

  return (
    <Drawer open width={500} placement="right" onClose={() => onClose()}>
      <Tabs
        key={key}
        centered
        items={[
          {
            key: 'online_user',
            label: `在线用户(${onlines.filter((i) => i.userId != '0').length})`,
            children: loadOnlineInfo(onlines.filter((i) => i.userId != '0')),
          },
          {
            key: 'online_connection',
            label: `在线连接(${onlines.filter((i) => i.userId === '0').length})`,
            children: loadOnlineInfo(onlines.filter((i) => i.userId == '0')),
          },
        ]}
      />
    </Drawer>
  );
};
const OnlineItem: React.FC<{ data: model.OnlineInfo }> = ({ data }) => {
  const [target, setTarget] = useState<schema.XEntity>();
  useEffect(() => {
    if (data.userId != '0') {
      orgCtrl.user.findEntityAsync(data.userId).then((item) => {
        if (item) {
          setTarget(item);
        }
      });
    }
  }, []);
  return (
    <List.Item
      style={{ cursor: 'pointer', padding: 6 }}
      actions={[
        <div key={data.connectionId} title={data.onlineTime}>
          {showChatTime(data.userId === '0' ? data.onlineTime : data.authTime)}
        </div>,
      ]}>
      <List.Item.Meta
        title={
          <>
            <span style={{ marginRight: 10 }}>{target?.name || data.connectionId}</span>
            <Tag color="green" title={'请求次数'}>
              {data.requestCount}
            </Tag>
          </>
        }
        avatar={<>{target && <TeamIcon entity={target} size={42} />}</>}
        description={`使用地址:${data.remoteAddr}`}
      />
    </List.Item>
  );
};
export default Navigation;
