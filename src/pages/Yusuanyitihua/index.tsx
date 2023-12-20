import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Badge, Space, Divider, Menu } from 'antd';
import type { MenuProps } from 'antd';
const { Header } = Layout;
import ysytBg from './assets/ysytBg.png';
import logo from './assets/logo.png';
import { SettingOutlined } from '@ant-design/icons';
import ComApplication from './comApplications';
import AllApplication from './allAplications';
import Works from './works';
import cls from './index.module.less';
// import Navbar from './navbar';
import Navbar from '@/layouts/Basic/navbar';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import orgCtrl from '@/ts/controller';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { useHistory } from 'react-router-dom';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import Chats from '@/pages/Chats';
import Work from '@/pages/Work';
import Store from '@/pages/Store';
import Relation from '@/pages/Relation';

const Yusuanyitihua: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState('application');
  const history = useHistory();
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [renderConmponent, setRenderComponent] = useState<any>();
  const menuItems: MenuProps['items'] = [
    {
      label: <span style={{ color: '#fff' }}>菜单</span>,
      key: 'SubMenu',
      icon: null,
      children: [
        {
          label: '常用应用',
          key: 'application',
        },
        {
          label: '全部应用',
          key: 'allApplication',
        },
        {
          label: '办事',
          key: 'work',
        },
      ],
    },
  ];
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
  // const menuOnClick: MenuProps['onClick'] = (e) => {
  //   setCurrentMenu(e.key);
  // };
  const actions = [
    {
      text: '首页',
      icon: 'home',
      path: '/home',
      name: 'home',
      count: 0,
    },
    {
      text: '消息',
      icon: 'chat',
      path: '/chat',
      name: 'chats',
      // component: React.lazy(() => import('@/pages/Chats')),
      component: Chats,
      count: msgCount,
    },
    {
      text: '待办',
      icon: 'work',
      path: '/work',
      name: 'work',
      // component: React.lazy(() => import('@/pages/Work')),
      component: Work,
      count: 0,
    },
    {
      text: '管理',
      icon: 'store',
      path: '/store',
      name: 'store',
      // component: React.lazy(() => import('@/pages/Store')),
      component: Store,
      count: 0,
    },
    {
      text: '设置',
      icon: 'relation',
      path: '/relation',
      name: 'relation',
      // component: React.lazy(() => import('@/pages/Relation')),
      component: Relation,
      count: 0,
    },
  ];
  const NavItem = (item: any) => {
    const selected = location.hash.startsWith('#' + item.path);
    return (
      <a
        style={{ color: '#fff' }}
        key={item.path}
        onClick={() => {
          // history.push(item.path);
          // setRenderComponent(item.component);
          setCurrentMenu(item.name)
          orgCtrl.currentKey = '';
          orgCtrl.changCallback();
        }}>
        {/* className={selected ? styles.title_selected : styles.title} */}
        <div>{item.text}</div>
      </a>
    );
  };
  return (
    <div className={cls['ysyt']} style={{ backgroundImage: `url(${ysytBg})` }}>
      {/* <Spin spinning={!loaded} tip={'加载中...'}> */}
      <Layout>
        <Header className={cls['ysyt-header']}>
          <Row>
            <Col span={8} flex="row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} width="22px" height="22px" />
                <h3 style={{ color: '#fff', margin: 0, paddingLeft: '10px' }}>
                  预算管理一体化系统
                </h3>
                {/* <Menu
                  style={{ backgroundColor: `rgba(0, 0, 0, 0)`, color: '#fff' }}
                  onClick={menuOnClick}
                  selectedKeys={[currentMenu]}
                  mode="horizontal"
                  items={menuItems}
                /> */}
              </div>
              {/* <Navbar displayRow={true} /> */}
            </Col>
            <Col span={8} offset={8}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                  {actions.map((item) => NavItem(item))}
                  <Divider
                    type="vertical"
                    style={{
                      backgroundColor: '#fff',
                    }}
                  />
                  <div
                    className="ogo-space-item"
                    style={{ cursor: 'pointer', color: '#fefefe' }}
                    onClick={() => setOnlineVisible(!onlineVisible)}>
                    {/* <EntityIcon entityId={orgCtrl.user.id} size={45} /> */}
                    {orgCtrl.user.name}
                  </div>
                  <a
                    onClick={() => {
                      orgCtrl.exit();
                      window.location.reload();
                    }}>
                    <div style={{ color: '#fff' }}>退出</div>
                  </a>
                </Space>
              </div>
            </Col>
          </Row>
        </Header>
        <Layout
          className={cls['ysyt-layout']}
          style={{
            backgroundImage: `url(${ysytBg})`,
          }}>
          {currentMenu === 'home' && <ComApplication />}
          {currentMenu === 'chats' && <Chats />}
          {currentMenu === 'work' && <Work />}
          {currentMenu === 'store' && <Store />}
          {currentMenu === 'relation' && <Relation />}
        </Layout>
      </Layout>
      {/* </Spin> */}
    </div>
  );
};

export default Yusuanyitihua;
