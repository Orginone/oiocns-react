import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { IAuthority } from '@/ts/core';
/** 加载右侧菜单 */
const loadAuthorityMenus = (item: IAuthority) => {
  const items: OperateMenuType[] = [
    {
      key: '新增权限',
      icon: <im.ImPlus />,
      label: '新增权限',
    },
  ];
  if (item.metadata.belongId == item.space.id && item.space.hasRelationAuth()) {
    items.push(
      {
        key: '编辑权限',
        icon: <im.ImCog />,
        label: '编辑权限',
      },
      {
        key: '删除权限',
        icon: <im.ImBin />,
        label: '删除权限',
        beforeLoad: async () => {
          return await item.delete();
        },
      },
    );
  }
  return items;
};

/** 创建团队菜单 */
const createMenu = (authoritys: IAuthority[]): MenuItemType[] => {
  const result: any[] = [];
  for (const auth of authoritys) {
    result.push({
      key: auth.key,
      item: auth,
      label: auth.name,
      itemType: '权限',
      menus: loadAuthorityMenus(auth),
      icon: <EntityIcon notAvatar={true} entityId={auth.id} size={18} />,
      children: createMenu(auth.children),
    });
  }
  return result;
};

/** 加载设置模块菜单 */
export const loadSettingMenu = (authority: IAuthority): MenuItemType => {
  return {
    key: '超级管理权',
    label: '超级管理权',
    itemType: 'Tab',
    item: authority,
    menus: loadAuthorityMenus(authority),
    children: createMenu(authority.children),
    icon: <EntityIcon notAvatar={true} entityId={authority.metadata.id} size={18} />,
  };
};
