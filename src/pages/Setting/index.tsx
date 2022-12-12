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

/* 信息中心菜单 */
const infoMenuItems = [
  {
    label: '单位信息',
    space: 'company',
    key: '/setting/info',
    icon: <InfoCircleOutlined />,
  },
  {
    label: '内设机构',
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
  { label: '个人信息', space: 'user', key: '/person/info', icon: <UserOutlined /> },
  { label: '好友设置', space: 'user', key: '/setting/friend', icon: <UserOutlined /> },
  { label: '群组设置', space: 'all', key: '/setting/cohort', icon: <TeamOutlined /> },
  { label: '帮助中心', space: 'all', key: '/setting/help', icon: <SmileOutlined /> },
];

/* 自定义设置菜单 */
const configMenuItems = [
  {
    label: '标准制定',
    key: '/setting/standard',
    space: 'company',
    icon: <SettingOutlined />,
    children: [],
    render: <></>,
  },
  { label: '流程设置', key: '/setting/flow', space: 'company', icon: <ForkOutlined /> },
  {
    label: '单位首页',
    key: '/setting/homeset',
    space: 'company',
    icon: <HomeOutlined />,
  },
  { label: '数据设置', key: '/setting/data', space: 'all', icon: <SettingOutlined /> },
  { label: '资源设置', key: '/setting/src', space: 'all', icon: <SettingOutlined /> },
  { label: '应用设置', key: '/setting/app', space: 'all', icon: <AppstoreOutlined /> },
  { label: '权限设置', key: '/setting/auth', space: 'all', icon: <SettingOutlined /> },
];

const getMenuItems = (spaces: string[]) => {
  return [
    {
      type: 'group',
      label: '组织设置',
      children: infoMenuItems.filter((i) => {
        return spaces.includes(i.space);
      }),
    },
    {
      type: 'group',
      label: '配置中心',
      children: configMenuItems.filter((i) => {
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
    if (userCtrl.isCompanySpace) {
      setMenu(getMenuItems(['all', 'company']));
      if (location.hash.endsWith('/friend')) {
        history.push({ pathname: '/setting/info' });
      }
    } else {
      setMenu(getMenuItems(['all', 'user']));
      if (!location.hash.endsWith('/cohort')) {
        history.push({ pathname: '/setting/friend' });
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
