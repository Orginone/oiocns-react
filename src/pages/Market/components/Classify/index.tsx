import {
  AppstoreFilled,
  DatabaseFilled,
  FileTextFilled,
  FundFilled,
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';

const MarketClassify: React.FC<any> = ({ history }) => {
  const [selectMenu, setSelectMenu] = useState<string>('');
  const items = [
    {
      label: '开放市场',
      key: 'openMarket',
      icon: <AppstoreFilled />,
      children: [
        {
          label: '应用市场',
          key: '/market/shop',
          icon: <AppstoreFilled />,
        }, // 菜单项务必填写 key
        {
          label: '文档共享库',
          key: '/market/docx',
          icon: <FileTextFilled />,
        },
        { label: '数据市场', key: '/data', icon: <FundFilled /> },
        { label: '公益仓', key: '/src', icon: <DatabaseFilled /> },
      ],
    },
  ];

  const handleChange = (path: string) => {
    setSelectMenu(path);
    history.push(path);
  };
  return (
    <div className={cls.container}>
      <div className={cls.subTitle}>常用分类</div>
      <Menu
        mode="inline"
        items={items}
        defaultOpenKeys={['openMarket']}
        onClick={({ key }) => handleChange(key)}
      />
      <MarketClassifyTree key={selectMenu} treeType={selectMenu} />
    </div>
  );
};

export default MarketClassify;
