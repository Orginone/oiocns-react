import React from 'react';
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
} from '@ant-design/icons';
import BreadCrumb from '@/components/BreadCrumb';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';

import { MenuProps } from 'antd';

/* 信息中心菜单 */
const infoMenuItems = [
  { label: '单位信息', key: 'info', icon: <InfoCircleOutlined /> },
  { label: '部门设置', key: 'dept', icon: <ApartmentOutlined /> },
  { label: '集团设置', key: 'group', icon: <FundOutlined /> },
  { label: '帮助中心', key: 'help', icon: <SmileOutlined /> },
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
const muneItems: MenuProps[`items`] = [
  {
    type: 'group',
    label: '信息中心',
    children: infoMenuItems.map((n) => ({ ...n, key: '/setting/' + n.key })),
  },
  {
    type: 'group',
    label: '配置中心',
    children: configMenuItems.map((n) => ({ ...n, key: '/setting/' + n.key })),
  },
];

const Setting: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  // const sider = <SettingMenu></SettingMenu>;
  const contentTopLeft = <BreadCrumb></BreadCrumb>;
  const content = <>{renderRoutes(route.routes)}</>;

  return (
    <ContentTemplate
      siderMenuData={muneItems}
      // sider={sider}
      contentTopLeft={contentTopLeft}
      content={content}
    />
  );
};

export default Setting;
