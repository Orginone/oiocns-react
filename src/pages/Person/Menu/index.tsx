import {
  DatabaseOutlined,
  GiftOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  SafetyOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
  VerifiedOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';

/**
 * 个人页面菜单
 * @returns
 */
const PersonMenu: React.FC = () => {
  const history = useHistory();

  /* 信息中心菜单 */
  const infoMenuItems = [
    { label: '个人信息', key: 'info', icon: <InfoCircleOutlined /> },
    { label: '通行设置', key: 'passport', icon: <IdcardOutlined /> },
    { label: '好友设置', key: 'friend', icon: <UserOutlined /> },
    { label: '群组设置', key: 'cohort', icon: <TeamOutlined /> },
    { label: '卡包设置', key: 'wallet', icon: <WalletOutlined /> },
    { label: '首页设置', key: 'homeset', icon: <HomeOutlined /> },
    { label: '帮助中心', key: 'help', icon: <SmileOutlined /> },
  ];
  /* 自定义设置菜单 */
  const customMenuItems = [
    { label: '地址管理', key: 'address', icon: <HomeOutlined /> },
    { label: '证书管理', key: 'certificate', icon: <VerifiedOutlined /> },
    { label: '安全管理', key: 'safe', icon: <SafetyOutlined /> },
    { label: '消息设置', key: 'message', icon: <MessageOutlined /> },
    { label: '主题设置', key: 'theme', icon: <GiftOutlined /> },
    { label: '语言设置', key: 'lang', icon: <GlobalOutlined /> },
    { label: '标准设置', key: 'standard', icon: <DatabaseOutlined /> },
  ];

  // 个人菜单跳转
  const to = (e: any) => {
    history.push(`/person/${e.key}`);
  };

  return (
    <div className={cls.container}>
      <div>
        <div className={cls.subTitle}>信息中心</div>
        <Menu items={infoMenuItems} onClick={to} />
      </div>
      <div>
        <div className={cls.subTitle}>自定义设置</div>
        <Menu items={customMenuItems} onClick={to} />
      </div>
    </div>
  );
};

export default PersonMenu;
