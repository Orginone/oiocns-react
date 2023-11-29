import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import { ITarget } from '@/ts/core';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

/** 创建团队菜单 */
const createMenu = (target: ITarget) => {
  return {
    key: target.key,
    item: target,
    label: target.name,
    itemType: target.typeName,
    menus: [],
    tag: [target.typeName],
    icon: <EntityIcon entity={target.metadata} size={18} />,
    children: [],
  };
};

/** 获取可管理用户的菜单 */
const getAdminMenu = () => {
  return [orgCtrl.user, ...orgCtrl.user.companys].map((i) => createMenu(i));
};

/** 加载办事模块菜单 */
export const loadBrowserMenu = () => {
  return {
    key: 'disk',
    label: '办事',
    itemType: 'Tab',
    item: 'disk',
    children: getAdminMenu(),
    icon: <OrgIcons work selected />,
  };
};
