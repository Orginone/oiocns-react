import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IApplication } from '@/ts/core';
import React from 'react';

import { MenuItemType } from 'typings/globelType';

/** 获取个人菜单 */
const getApplicationMenu = (applications: IApplication[]) => {
  const menus: MenuItemType[] = [];
  for (const app of applications) {
    menus.push({
      key: app.key,
      item: app,
      label: app.name,
      itemType: app.typeName,
      menus: [],
      icon: <EntityIcon notAvatar={true} entityId={app.id} size={18} />,
      children: getApplicationMenu(app.children),
      beforeLoad: async () => {
        await app.loadWorks();
      },
    });
  }
  return menus;
};

/** 加载设置模块菜单 */
export const loadAppMenu = (application: IApplication) => {
  return {
    key: '应用',
    label: '应用',
    itemType: 'group',
    children: getApplicationMenu([application]),
    icon: <EntityIcon notAvatar={true} entityId={application.id} size={18} />,
  };
};
