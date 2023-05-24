/*
 * @Author: zhangqiang
 * @Date: 2023-05-15 14:10:01
 * @LastEditors: zhangqiang
 * @LastEditTime: 2023-05-15 15:27:02
 * @Description: 请填写简介
 */
import React from 'react';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 存储模块 */
const Package: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadMarketMenu);
  console.log('rootMenu', rootMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Package;
