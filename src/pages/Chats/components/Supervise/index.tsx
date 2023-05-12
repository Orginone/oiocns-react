import React from 'react';
import Filtrate from '../Filtrate';
import { ICompany } from '@/ts/core';
import { orgAuth } from '@/ts/core/public/consts';
import { MenuItemType } from 'typings/globelType';

interface IProps {
  selectMenu: MenuItemType;
  current: ICompany | undefined;
  changeSupervise?: () => void;
}

const Supervise: React.FC<IProps> = ({ selectMenu, current, changeSupervise }) => {
  /**
   * @description: 检测个人在该单位是否具有超级管理权，如果没有，返回沟通页面
   * @return {*}
   */
  if (
    current === undefined ||
    current.hasAuthoritys([orgAuth.RelationAuthId]) === false
  ) {
    changeSupervise && changeSupervise();
  }

  return (
    <React.Fragment>
      {/* 筛选条件 */}
      <Filtrate chats={selectMenu.item} />
    </React.Fragment>
  );
};

export default Supervise;
