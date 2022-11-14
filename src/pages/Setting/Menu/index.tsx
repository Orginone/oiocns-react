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
import { Menu } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';

/**
 * 单位设置页面菜单
 * @returns
 */
const SettingMenu: React.FC = () => {
  const history = useHistory();

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

  // 个人菜单跳转
  const to = (e: any) => {
    history.push(`/setting/${e.key}`);
  };

  return (
    <div className={cls.container}>
      {/* <div className={cls.top}>
        <div className={cls.title}>
          <SettingOutlined />
          <strong>设置</strong>
        </div>
      </div> */}
      <div>
        <div className={cls.subTitle}>信息中心</div>
        <Menu items={infoMenuItems} onClick={to} />
      </div>
      <div>
        <div className={cls.subTitle}>配置中心</div>
        <Menu items={configMenuItems} onClick={to} />
      </div>
    </div>
  );
};

export default SettingMenu;
