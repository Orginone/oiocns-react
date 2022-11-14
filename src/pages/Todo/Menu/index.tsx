import {
  AuditOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundOutlined,
  HomeOutlined,
  // PlusOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
// import { Menu } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import cls from './index.module.less';
// TODO 获取应用待办
const apps = [
  { label: '公益仓', key: 'gyc', icon: <HomeOutlined /> },
  { label: '办公OA', key: 'oa', icon: <FileTextOutlined /> },
  { label: '资产管理', key: 'asset', icon: <FundOutlined /> },
  { label: '资产监控', key: 'monitor', icon: <DatabaseOutlined /> },
];
/* 待办页面菜单 */
export const muneItems = [
  {
    type: 'group',
    label: '平台待办',
    children: [
      { label: '好友申请', key: 'friend', icon: <UserOutlined /> },
      { label: '单位审核', key: 'org', icon: <AuditOutlined /> },
      {
        label: '商店审核',
        key: 'appAndStore',
        icon: <ShopOutlined />,
        children: [
          {
            label: '应用上架',
            key: 'app',
            icon: <ShopOutlined />,
          },
          { label: '加入市场', key: 'store', icon: <ShopOutlined /> },
        ],
      },
      { label: '订单审核', key: 'order', icon: <UnorderedListOutlined /> },
    ],
  },
  {
    type: 'group',
    label: '应用待办',
    children: apps,
  },
];

/**
 * 待办页面菜单
 * @returns
 */
const TodoMenu: React.FC<RouteComponentProps> = () => {
  // const { location, history } = props;
  // const currentKey = location.pathname.split('/')[2];
  // const [menukeys, setMenuKeys] = useState<string[]>([currentKey || 'friend']);

  /* 应用待办 */

  // 菜单跳转
  // const toNext = (e: any) => {
  //   setMenuKeys(e.keyPath);
  //   history.push(`/todo/${e.key}`);
  //   // console.log(menukeys);
  // };
  // const handleClickMenu = (e: any) => {
  //   setMenuKeys(e.keyPath);
  // };
  return (
    <div className={cls.container}>
      {/* <div>
        <div className={cls[`sub-title`]}>平台待办</div>
        <Menu
          mode="inline"
          items={muneItems}
          onClick={toNext}
          defaultOpenKeys={['appAndStore']}
          selectedKeys={menukeys}
          defaultSelectedKeys={menukeys}
        />
      </div> */}
      {/* <div>
        <div className={cls[`sub-title`]}>
          应用待办 <PlusOutlined className={cls[`add-icon`]} />
        </div>
        <Menu items={apps} selectedKeys={menukeys} onClick={handleClickMenu} />
      </div> */}
    </div>
  );
};

export default withRouter(TodoMenu);
