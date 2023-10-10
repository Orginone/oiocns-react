import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import { loadFileMenus } from '@/executor/fileOperate';
import { ITarget, orgAuth } from '@/ts/core';

/** 创建团队菜单 */
const createMenu = (target: ITarget) => {
  return {
    key: target.directory.key,
    item: target.directory,
    label: target.name,
    itemType: target.directory.typeName,
    menus: loadFileMenus(target.directory, 2),
    tag: [target.typeName],
    icon: <EntityIcon entity={target.metadata} size={18} />,
    children: [],
  };
};

/** 获取可管理用户的菜单 */
const getAdminMenu = () => {
  return [orgCtrl.user, ...orgCtrl.user.companys]
    .filter((i) => i.hasAuthoritys([orgAuth.SuperAuthId]))
    .map((i) => createMenu(i));
};

/** 加载设置模块菜单 */
export const loadBrowserMenu = () => {
  return {
    key: '设置',
    label: '设置',
    itemType: 'Tab',
    item: 'disk',
    children: getAdminMenu(),
    icon: <EntityIcon entity={orgCtrl.user.metadata} size={18} />,
  };
};
