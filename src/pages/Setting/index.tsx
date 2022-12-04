import React, { useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  ForkOutlined,
  FundOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
// import TreeLeftDeptPage from '@/bizcomponents/TreeLeftDeptPage';
import TreeLeftGroupPage from '@/bizcomponents/TreeLeftGroupPage';
// import TreeLeftPosPage from '@/bizcomponents/TreeLeftPosPage';

import { MenuProps } from 'antd';
import userCtrl from '@/ts/controller/setting/userCtrl';

/* 信息中心菜单 */
const infoMenuItems = [
  { label: '单位信息', key: 'info', icon: <InfoCircleOutlined /> },
  {
    label: '部门设置',
    key: 'dept',
    icon: <ApartmentOutlined />,
    children: [],
    render: <></>, //<TreeLeftDeptPage />
  },
  {
    label: '集团设置',
    key: 'group',
    icon: <FundOutlined />,
    children: [],
    render: <TreeLeftGroupPage />,
  },
  {
    label: '岗位设置',
    key: 'position',
    icon: <ApartmentOutlined />,
    children: [],
    render: <></>,
    // render: <TreeLeftPosPage />,
  },
  { label: '帮助中心', key: 'help', icon: <SmileOutlined /> },
];

const userInfoMenuItems = [
  { label: '好友设置', key: '/person/friend', icon: <UserOutlined /> },
  { label: '群组设置', key: '/person/cohort', icon: <TeamOutlined /> },
];

/* 自定义设置菜单 */
const configMenuItems = [
  { label: '单位首页', key: 'homeset', icon: <HomeOutlined /> },
  { label: '数据设置', key: 'data', icon: <SettingOutlined /> },
  { label: '资源设置', key: 'src', icon: <SettingOutlined /> },
  { label: '应用设置', key: 'app', icon: <AppstoreOutlined /> },
  { label: '流程设置', key: 'flow', icon: <ForkOutlined /> },
  { label: '标准设置', key: 'standard', icon: <SettingOutlined /> },
  { label: '权限设置', key: 'auth', icon: <SettingOutlined /> },
];
const muneItems = [
  {
    type: 'group',
    label: '组织设置',
    children: infoMenuItems.map((n) => ({ ...n, key: '/setting/' + n.key })),
  },
  {
    type: 'group',
    label: '配置中心',
    children: configMenuItems.map((n) => ({ ...n, key: '/setting/' + n.key })),
  },
];

const Setting: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
  const toNext = (e: any) => {
    history.push(`${e.key}`);
  };
  const [menus, setMenu] = useState(muneItems);
  const changeMenu = () => {
    let [_newMenu, ...other] = [...muneItems];

    _newMenu.children = !userCtrl?.IsCompanySpace
      ? userInfoMenuItems
      : infoMenuItems.map((n) => ({ ...n, key: '/setting/' + n.key }));
    setMenu([{ ..._newMenu }, ...other]);
  };
  useEffect(() => {
    const id = userCtrl.subscribe(changeMenu);
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);
  return (
    <ContentTemplate siderMenuData={menus as MenuProps['items']} menuClick={toNext}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Setting;
