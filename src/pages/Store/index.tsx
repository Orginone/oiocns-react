import React from 'react';

import { renderRoutes } from 'react-router-config';
import {
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundOutlined,
} from '@ant-design/icons';
import ContentTemplate from '@/components/ContentTemplate';
import { IRouteConfig } from '@/routes/config';
import StoreClassify from './Classify';
import { MenuProps } from 'antd';
import StoreSiderbar from '@/ts/controller/store/sidebar';

const navItems: MenuProps[`items`] = [
  {
    type: 'group',
    label: '常用分类',
    children: [
      {
        label: '应用',
        key: 'app',
        icon: <AppstoreOutlined />,
        onClick: () => {
          // StoreSiderbar.handleMenuClick('app');
        },
      }, // 菜单项务必填写 key
      {
        label: '文档',
        key: 'doc',
        icon: <FileTextOutlined />,
        onClick: () => {
          // StoreSiderbar.handleMenuClick('docx');
        },
      },
      {
        label: '数据',
        key: 'data',
        icon: <FundOutlined />,
        onClick: () => {
          // StoreSiderbar.handleMenuClick('data');
        },
      },
      {
        label: '资源',
        key: 'assets',
        icon: <DatabaseOutlined />,
        onClick: () => {
          // StoreSiderbar.handleMenuClick('assets');
        },
      },
    ].map((n) => ({ ...n, key: '/store/' + n.key })),
  },
];
const Store: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  return (
    <ContentTemplate
      siderMenuData={navItems}
      sider={<StoreClassify />}
      content={renderRoutes(route.routes)}
    />
  );
};

export default Store;
