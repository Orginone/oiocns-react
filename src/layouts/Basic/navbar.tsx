import { useEffect, useState } from 'react';
import { Badge, Layout, Space, Tabs, Drawer, Popover, Row, Col, List, Tag } from 'antd';
import { msgChatNotify } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import styles from './index.module.less';
import navStyles from './navbar.module.less';
import { Link } from 'react-router-dom';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import QrCode from 'qrcode.react';
import React from 'react';
import { BsFillPaletteFill } from 'react-icons/bs';
import { AiFillHome, AiFillCreditCard, AiOutlineSecurityScan } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';
import { showChatTime } from '@/utils/tools';
import { kernel, model, schema } from '@/ts/base';

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
  const content = (
    <div style={{ width: '200px' }}>
      <div className={navStyles['nav-head']}>
        <div className={navStyles['nav-left']}>
          <Col>
            <EntityIcon entityId={orgCtrl.user.id} size={45} />
          </Col>
          <Col className={navStyles['left-box']}>
            <p>{orgCtrl.user.name}</p>
            <div className={navStyles['nav-introduction']}>
              {orgCtrl.user.information}
            </div>
          </Col>
        </div>
        <QrCode
          level="H"
          size={40}
          fgColor={'#204040'}
          value={`${location.origin}/${orgCtrl.user.id}`}
          imageSettings={{
            src: '',
            width: 30,
            height: 30,
            excavate: true,
          }}
        />
      </div>
      <Row gutter={16} align="middle" className={navStyles['row-style']}>
        <AiOutlineSecurityScan size={16} color="#888" />
        <div>账号与安全</div>
      </Row>
      <Row gutter={16} align="middle" className={navStyles['row-style']}>
        <AiFillCreditCard size={16} color="#888" />
        <div>卡包设置</div>
      </Row>
      <Row gutter={16} align="middle" className={navStyles['row-style']}>
        <AiFillHome size={16} color="#888" />
        <div>门户设置</div>
      </Row>
      <Row gutter={16} align="middle" className={navStyles['row-style']}>
        <BsFillPaletteFill size={16} color="#888" />
        <div>主题设置</div>
      </Row>
      <Link
        to={'/passport/login'}
        onClick={() => {
          sessionStorage.clear();
          location.reload();
        }}>
        <Row gutter={16} align="middle" className={navStyles['row-style']}>
          <ImExit size={16} color="#888" />
          <div>退出设置</div>
        </Row>
      </Link>
    </div>
  );
  return (
    <Layout.Sider className={styles.header} width={60}>
      <div className="ogo-space-item">
        <div className="ogo-space-item" onClick={() => setOnlineVisible(!onlineVisible)}>
          {online > 0 ? (
            <Badge count={online} size="small" offset={[-15, 0]}>
              <Popover
                content={content}
                trigger="hover"
                placement="right"
                animation="false"
                overlayClassName={navStyles['popover-style']}>
                <div>
                  <EntityIcon entityId={orgCtrl.user.id} size={45} />
                </div>
              </Popover>
            </Badge>
          ) : (
            <Popover
              content={content}
              trigger="hover"
              placement="right"
              animation="false"
              overlayClassName={navStyles['popover-style']}>
              <div>
                <EntityIcon entityId={orgCtrl.user.id} size={45} />
              </div>
            </Popover>
          )}
        </div>
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
