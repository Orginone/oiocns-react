/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-16 17:46:20
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-17 13:26:51
 * @FilePath: /oiocns-react/src/pages/Setting/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
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
import  TreeLeftPage  from '@/bizcomponents/TreeLeftPage';

import { MenuProps } from 'antd';

/* 信息中心菜单 */
const infoMenuItems = [
  { label: '单位信息', key: 'info', icon: <InfoCircleOutlined /> },
  {
    label: '部门设置',
    key: 'dept',
    icon: <ApartmentOutlined />,
  },
  {
    label: '集团设置',
    key: 'group',
    icon: <FundOutlined />,
    children: [],
    render: <TreeLeftPage />,
  },
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

const Setting: React.FC<{ route: IRouteConfig; history: any }> = ({ route, history }) => {
 

  const toNext = (e: any) => {
    history.push(`${e.key}`);
  };


  return (
    <ContentTemplate
      siderMenuData={muneItems}
      menuClick={toNext}
      // sider={updataDom}
      // contentTopLeft={contentTopLeft}
    >
      {renderRoutes(route.routes)}
    </ContentTemplate>
  );
};

export default Setting;
