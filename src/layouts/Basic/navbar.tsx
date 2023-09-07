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
import { showChatTime } from '@/utils/tools';

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
      text: '首页',
      icon: 'home',
      path: '/home',
      count: 0,
    },
    {
      text: '沟通',
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
      text: '设置',
      icon: 'setting',
      path: '/setting',
      count: 0,
    },
  ];

  const NavItem = (item: any) => {
    const selected = location.hash.startsWith('#' + item.path);
    let content = <OrgIcons size={26} type={item.icon} notAvatar selected={selected} />;
    if (item.count > 0) {
      content = (
        <Badge count={item.count} size="small">
          {content}
        </Badge>
      );
    }
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => {
          orgCtrl.currentKey = '';
          orgCtrl.changCallback();
        }}>
        {content}
        <div className={selected ? styles.title_selected : styles.title}>{item.text}</div>
      </Link>
    );
  };

  return (
    <Layout.Sider className={styles.header} width={60}>
      <div className="ogo-space-item" onClick={() => setOnlineVisible(!onlineVisible)}>
        {online > 0 ? (
          <Badge count={online} size="small" offset={[-15, 0]}>
            <EntityIcon entityId={orgCtrl.user.id} size={45} />
          </Badge>
        ) : (
          <EntityIcon entityId={orgCtrl.user.id} size={45} />
        )}
      </div>
      <Space direction="vertical" wrap align="center" size={25} className={styles.navbar}>
        {actions.map((item) => NavItem(item))}
        {onlineVisible && <OnlineInfo onClose={() => setOnlineVisible(false)} />}
      </Space>
      <Link
        to={'/passport/login'}
        onClick={() => {
          sessionStorage.clear();
          location.reload();
        }}>
        <OrgIcons size={26} exit selected />
      </Link>
    </Layout.Sider>
  );
};

const OnlineInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [key, setKey] = useState('1');
  const [onlines, setOnlines] = useState<model.OnlineSet>();
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
  if (!onlines) return <></>;

  const loadOnlineInfo = (onlines: model.OnlineInfo[]) => {
    var unAuth: model.OnlineInfo[] = [];
    onlines
      .filter((i) => i.userId === '0')
      .forEach((item) => {
        var index = unAuth.findIndex((i) => i.remoteAddr === item.remoteAddr);
        if (index === -1) {
          item.requestCount = 1;
          unAuth.push(item);
        } else {
          unAuth[index].requestCount = unAuth[index].requestCount + 1;
        }
      });
    return (
      <List
        itemLayout="horizontal"
        dataSource={[
          ...unAuth,
          ...onlines
            .filter((i) => i.userId != '0')
            .sort(
              (a, b) =>
                new Date(b.onlineTime).getTime() - new Date(a.onlineTime).getTime(),
            ),
        ]}
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
            label: `在线用户(${onlines.users.length})`,
            children: loadOnlineInfo(onlines.users),
          },
          {
            key: 'online_connection',
            label: `在线数据核(${onlines.storages.length})`,
            children: loadOnlineInfo(onlines.storages),
          },
        ]}
      />
    </Drawer>
  );
};

const OnlineItem: React.FC<{ data: model.OnlineInfo }> = ({ data }) => {
  data.remoteAddr = data.remoteAddr === '[' ? '127.0.0.1' : data.remoteAddr;
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
