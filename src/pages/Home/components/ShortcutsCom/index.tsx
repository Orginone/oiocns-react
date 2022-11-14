import './index.less';

import { SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import CardWidthTitle from '@/components/CardWidthTitle';

interface ShortcutsComType {
  props: []; //入口列表
}
const btns = [
  { label: '加好友', icon: <SendOutlined /> },
  { label: '创单位', icon: <SendOutlined /> },
  { label: '邀成员', icon: <SendOutlined /> },
  { label: '建应用', icon: <SendOutlined /> },
  { label: '逛商场', icon: <SendOutlined /> },
  { label: '添数据', icon: <SendOutlined /> },
];
const BannerCom: React.FC<ShortcutsComType> = () => {
  return (
    <CardWidthTitle className="shortcuts-wrap" title={'快捷入口'}>
      {btns.map((item) => {
        return (
          <Button
            className="shortcuts-btn"
            key={item.label}
            size="large"
            icon={item.icon}>
            {item.label}
          </Button>
        );
      })}
    </CardWidthTitle>
  );
};

export default BannerCom;
