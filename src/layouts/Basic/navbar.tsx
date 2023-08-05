import { useEffect, useState } from 'react';
import { Badge, Drawer, Layout, List, Space, Tabs, Tag } from 'antd';
import { msgChatNotify } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import { Link } from 'react-router-dom';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { ImLink } from 'react-icons/im';
import { showChatTime } from '@/utils/tools';
const { Sider } = Layout;

const Navbar: React.FC = () => {
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [online, setOnline] = useState(0);
  const [onlineVisible, setOnlineVisible] = useState(false);
  useEffect(() => {
    const id = msgChatNotify.subscribe(() => {
      let noReadCount = 0;
      for (const item of orgCtrl.chat.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMsgCount(noReadCount);
    });
    const workId = orgCtrl.work.notity.subscribe(async () => {
      setWorkCount(orgCtrl.work.todos.length);
    });
    kernel.onlineNotity.subscribe(() => {
      setOnline(kernel.onlineIds.length);
    });
    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);
  const actions = [
    {
      text: '设置',
      icon: 'setting',
      path: '/setting',
      count: 0,
    },
    {
      text: '消息',
      icon: 'chat',
      path: '/chat',
      count: msgCount,
    },
    {
      text: '办事',
      icon: 'work',
      path: '/work',
      count: workCount,
    },
    {
      text: '存储',
      icon: 'store',
      path: '/store',
      count: 0,
    },
    {
      text: '门户',
      icon: 'home',
      path: '/home',
      count: 0,
    },
  ];

  return (
    <Sider className={styles.header} width={60}>
      <Space
        direction="vertical"
        wrap
        align="center"
        size={30}
        style={{ width: '100%', marginTop: 15 }}>
        {actions.map((item) => {
          return (
            <Link
              key={item.path}
              title={item.text}
              to={item.path}
              onClick={() => {
                orgCtrl.currentKey = '';
                orgCtrl.changCallback();
              }}>
              <Badge count={item.count} size="small">
                {item.icon === 'setting' ? (
                  <EntityIcon entityId={orgCtrl.user.id} size={40} />
                ) : (
                  <OrgIcons
                    size={26}
                    type={item.icon}
                    notAvatar
                    selected={location.hash.startsWith('#' + item.path)}
                  />
                )}
              </Badge>
            </Link>
          );
        })}
        {online > 0 ? (
          <div
            style={{ display: 'flex', cursor: 'pointer' }}
            onClick={() => setOnlineVisible(!onlineVisible)}>
            <Badge count={online} size="small">
              <ImLink size={22} color={'#4CAF50'} />
            </Badge>
            <div style={{ height: 'calc(100vh - 380px)' }}></div>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 380px)' }}></div>
        )}
        <Link
          to={'/passport/login'}
          title="注销"
          onClick={() => {
            sessionStorage.clear();
            location.reload();
          }}>
          <OrgIcons size={26} exit selected />
        </Link>
        {onlineVisible && <OnlineInfo onClose={() => setOnlineVisible(false)} />}
      </Space>
    </Sider>
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
        avatar={<>{target && <EntityIcon entity={target} size={42} />}</>}
        description={`使用地址:${data.remoteAddr}`}
      />
    </List.Item>
  );
};

export default Navbar;
