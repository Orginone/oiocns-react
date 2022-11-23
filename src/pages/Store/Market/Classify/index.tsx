import {
  AppstoreFilled,
  DatabaseFilled,
  FileTextFilled,
  FundFilled,
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import StoreSiderbar from '@/ts/controller/store/sidebar';
import StoreContent from '@/ts/controller/store/content';

const MarketClassify: React.FC<any> = ({ history }) => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    StoreSiderbar.curPageType = 'market';
    StoreSiderbar.TreeCallBack = setList;
    StoreSiderbar.getTreeData();
  }, []);
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
        { label: '数据市场', key: '/market/data', icon: <FundFilled /> },
        { label: '公益仓', key: '/market/publicProperty', icon: <DatabaseFilled /> },
      ],
    },
  ];

  const handleChange = (path: string) => {
    setSelectMenu(path);
    history.push(path);
  };
  /*******
   * @desc: 点击目录 触发事件
   * @param {any} item
   * @return {*}
   */
  const handleTitleClick = (item: any) => {
    // 触发内容去变化
    StoreContent.changeMenu(item);
  };
  /**
   * @desc: 创建新目录
   * @param {any} item
   * @return {*}
   */
  const handleAddShop = (item: any) => {
    console.log('handleAddShop', item);
  };
  /*******
   * @desc: 目录更多操作 触发事件
   * @param {object} param1
   * @return {*}
   */
  const handleMenuClick = ({ data, key }: { data: any; key: string }) => {
    console.log('handleMenuClick55', data, key);
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
      <MarketClassifyTree
        key={selectMenu}
        handleTitleClick={handleTitleClick}
        handleAddClick={handleAddShop}
        handleMenuClick={handleMenuClick}
        treeData={list}
      />
    </div>
  );
};

export default MarketClassify;
