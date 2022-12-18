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
import { MenuProps } from 'antd';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { emitter } from '@/ts/core';
const spaceMap = new Map();
/* 信息中心菜单 */
const infoMenuItems = [
  {
    label: '单位信息',
    space: 'company',
    key: '/setting/info',
    icon: <InfoCircleOutlined />,
  },
  {
    label: '团队设置',
    key: '/setting/dept',
    space: 'company',
    icon: <ApartmentOutlined />,
    children: [],
    render: <></>,
  },
  {
    label: '集团设置',
    key: '/setting/group',
    space: 'company',
    icon: <FundOutlined />,
    children: [],
    render: <></>,
  },
  {
    label: '岗位设置',
    key: '/setting/position',
    space: 'company',
    icon: <ApartmentOutlined />,
    children: [],
    render: <></>,
  },
  { label: '个人信息', space: 'user', key: '/setting/user', icon: <UserOutlined /> },
  { label: '好友设置', space: 'user', key: '/setting/friend', icon: <UserOutlined /> },
  { label: '群组设置', space: 'all', key: '/setting/cohort', icon: <TeamOutlined /> },
  {
    label: '个人首页',
    key: '/setting/home',
    space: 'user',
    icon: <HomeOutlined />,
  },
  {
    label: '单位首页',
    key: '/setting/homeset',
    space: 'company',
    icon: <HomeOutlined />,
  },
  { label: '帮助中心', space: 'all', key: '/setting/help', icon: <SmileOutlined /> },
];

/* 自定义设置菜单 */
const configMenuItems = [
  {
    label: '标准制定',
    key: '/setting/standard',
    space: 'all',
    icon: <SettingOutlined />,
    children: [],
    render: <></>,
  },
  { label: '流程设置', key: '/setting/flow', space: 'company', icon: <ForkOutlined /> },
  { label: '语言设置', key: '/setting/lang', space: 'user', icon: <SettingOutlined /> },
  { label: '主题设置', key: '/setting/theme', space: 'user', icon: <SettingOutlined /> },
  {
    label: '消息设置',
    key: '/setting/message',
    space: 'user',
    icon: <AppstoreOutlined />,
  },
  {
    label: '卡包设置',
    key: '/setting/wallet',
    space: 'user',
    icon: <AppstoreOutlined />,
  },
  {
    label: '通行设置',
    key: '/setting/passport',
    space: 'user',
    icon: <SettingOutlined />,
  },
  { label: '数据设置', key: '/setting/data', space: 'all', icon: <SettingOutlined /> },
  { label: '资源设置', key: '/setting/src', space: 'all', icon: <SettingOutlined /> },
  { label: '应用设置', key: '/setting/app', space: 'all', icon: <AppstoreOutlined /> },
  { label: '权限设置', key: '/setting/auth', space: 'all', icon: <SettingOutlined /> },
  {
    label: '地址管理',
    key: '/setting/address',
    space: 'user',
    icon: <AppstoreOutlined />,
  },
  { label: '安全设置', key: '/setting/safe', space: 'user', icon: <SettingOutlined /> },
];

const getMenuItems = (spaces: string[]) => {
  spaceMap.clear();
  return [
    {
      type: 'group',
      label: '组织设置',
      children: infoMenuItems.filter((i) => {
        spaceMap.set(i.key, i.space);
        return spaces.includes(i.space);
      }),
    },
    {
      type: 'group',
      label: '配置中心',
      children: configMenuItems.filter((i) => {
        spaceMap.set(i.key, i.space);
        return spaces.includes(i.space);
      }),
    },
  ];
};

const Setting: React.FC<any> = ({ route, history }: { route: any; history: any }) => {
  const toNext = (e: any) => {
    history.push(`${e.key}`);
  };
  const [menus, setMenu] = useState(getMenuItems(['all', 'user']));

  const changeMenu = () => {
    const key = location.hash.replace('#', '');
    if (userCtrl.isCompanySpace) {
      setMenu(getMenuItems(['all', 'company']));
      if (spaceMap.get(key) === 'user') {
        history.push({ pathname: '/setting/info' });
      }
    } else {
      setMenu(getMenuItems(['all', 'user']));
      if (spaceMap.get(key) === 'company') {
        history.push({ pathname: '/setting/user' });
      }
    }
  };
  useEffect(() => {
    const id = emitter.subscribe(changeMenu);
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return (
    <ContentTemplate siderMenuData={menus as MenuProps['items']} menuClick={toNext}>
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Setting;
