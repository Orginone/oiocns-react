import { useEffect, useState } from 'react';
import { Badge, Divider, Drawer, Layout, List, Space, Tabs, Tag } from 'antd';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { showChatTime } from '@/utils/tools';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { useHistory } from 'react-router-dom';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

const Navbar: React.FC = () => {
  const history = useHistory();
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [onlineVisible, setOnlineVisible] = useState(false);
  useFlagCmdEmitter('session', () => {
    setMsgCount(
      orgCtrl.chats
        .filter((i) => i.isMyChat)
        .reduce((sum, i) => sum + i.chatdata.noReadCount, 0),
    );
  });
  useEffect(() => {
    const workId = orgCtrl.work.notity.subscribe(async () => {
      setWorkCount(orgCtrl.work.todos.length);
    });
    return () => {
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);
  const actions = [
    {
      text: '首页',
      count: 0,
      path: '/home',
      onClick: () => {
        history.push('/home');
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      text: '消息',
      path: '/chat',
      count: msgCount,
      onClick: () => {
        history.push('/chat');
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      text: '待办',
      path: '/work',
      count: workCount,
      onClick: () => {
        history.push('/work');
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      text: '管理',
      path: '/store',
      count: 0,
      onClick: () => {
        history.push('/store');
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      text: '设置',
      path: '/relation',
      count: 0,
      onClick: () => {
        history.push('/relation');
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      text: '年度：' + new Date().getFullYear(),
      count: 0,
      path: '/x',
      onClick: () => {},
    },
    {
      text: orgCtrl.user.name,
      count: 0,
      path: '/a',
      onClick: () => {
        setOnlineVisible(!onlineVisible);
      },
    },
    {
      text: '退出',
      count: 0,
      icon: <OrgIcons exit />,
      onClick: () => {
        orgCtrl.exit();
        window.location.reload();
      },
    },
  ];

  const NavItem = (item: any) => {
    const titleClass = location.hash.startsWith('#' + item.path)
      ? styles.title_selected
      : styles.title;
    let content = <div className={titleClass}>{item.text}</div>;
    if (item.icon) {
      content = item.icon;
    }
    if (item.count > 0) {
      content = (
        <Badge count={item.count} size="small" offset={[2, -5]}>
          <div className={titleClass}>{item.text}</div>
        </Badge>
      );
    }
    return (
      <div className={styles.barItem} key={item.text} onClick={item.onClick}>
        {content}
      </div>
    );
  };

  return (
    <Layout.Header
      style={{
        padding: 6,
        background: 'linear-gradient(45deg, #506cfa, #358bff)',
        color: 'white',
        height: 52,
      }}>
      <div className={styles.header}>
        <div
          className={styles.budget}
          onClick={() => {
            history.push('/home');
            orgCtrl.currentKey = '';
            orgCtrl.changCallback();
          }}>
          <img src="/img/budget.png" width={28} height={28} />
          <div style={{ fontSize: 22, marginLeft: 10, fontWeight: 'bold' }}>
            预算管理一体化系统
          </div>
        </div>
        <Space
          direction="horizontal"
          size={6}
          className={styles.navbar}
          split={
            <Divider type="vertical" style={{ backgroundColor: '#999', height: 30 }} />
          }>
          {actions.map((item) => NavItem(item))}
          {onlineVisible && <OnlineInfo onClose={() => setOnlineVisible(false)} />}
        </Space>
      </div>
    </Layout.Header>
  );
};

const OnlineInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [key, setKey] = useState('1');
  const [onlines, setOnlines] = useState<model.OnlineSet>();
  useEffect(() => {
    kernel.onlines().then((value) => {
      setOnlines(value);
      setKey(key);
    });
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
