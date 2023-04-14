import React from 'react';
import * as im from 'react-icons/im';
import { IsSuperAdmin } from '@/utils/authority';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { ITarget } from '@/ts/core';
import setting from '@/ts/controller/setting';

/** 加载类型更多操作 */
export const loadTypeMenus = async (item: ITarget) => {
  const menus: OperateMenuType[] = [
    {
      key: '新建页面',
      icon: <im.ImPlus />,
      label: '新建页面',
    },
    // {
    //   key: '编辑页面',
    //   icon: <im.ImPlus />,
    //   label: '编辑页面',
    // },
    // {
    //   key: '查看页面',
    //   icon: <im.ImPlus />,
    //   label: '查看页面',
    // },
  ];
  // let isAdmin = await IsSuperAdmin(item);
  // if (item.subTeamTypes.length > 0) {
  //   if (isAdmin) {
  //     menus.push({
  //       key: '删除页面',
  //       icon: <im.ImPlus />,
  //       label: '删除页面',
  //     });
  //   }
  // }
  return menus;
};
