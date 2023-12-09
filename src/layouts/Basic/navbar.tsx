import { useEffect, useState } from 'react';
import { Badge, Drawer, Layout, List, Space, Tabs, Tag } from 'antd';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { showChatTime } from '@/utils/tools';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { useHistory } from 'react-router-dom';

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
      text: '门户',
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
      text: '数据',
      icon: 'store',
      path: '/store',
      count: 0,
    },
    {
      text: '关系',
      icon: 'relation',
      path: '/relation',
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
      <a
        key={item.path}
        onClick={() => {
          history.push(item.path);
          orgCtrl.currentKey = '';
          orgCtrl.changCallback();
        }}>
        {content}
        <div className={selected ? styles.title_selected : styles.title}>{item.text}</div>
      </a>
    );
  };

  return (
    <Layout.Sider className={styles.header} width={60}>
      <div
        className="ogo-space-item"
        style={{ cursor: 'pointer' }}
        onClick={() => setOnlineVisible(!onlineVisible)}>
        <EntityIcon entityId={orgCtrl.user.id} size={45} />
      </div>
      <Space direction="vertical" wrap align="center" size={25} className={styles.navbar}>
        {actions.map((item) => NavItem(item))}
        {onlineVisible && <OnlineInfo onClose={() => setOnlineVisible(false)} />}
      </Space>
      <a
        onClick={() => {
          orgCtrl.exit();
          window.location.reload();
        }}>
        <OrgIcons size={22} exit selected />
        <div className={styles.title_selected}>退出</div>
      </a>
    </Layout.Sider>
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
