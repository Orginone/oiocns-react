import React from 'react';
import * as im from 'react-icons/im';
import { IBelong } from '@/ts/core';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { IconFont } from '@/components/IconFont';
import { GroupMenuType } from './menuType';

/** 加载右键菜单 */
const loadSpeciesMenus = () => {
  const items: OperateMenuType[] = [];
  items.push({
    key: '发起办事',
    icon: <im.ImPlus />,
    label: '发起办事',
    model: 'outside',
  });
  return items;
};
const loadChildren = (team: IBelong) => {
  return [
    {
      key: team.key + GroupMenuType.Start,
      item: team,
      label: GroupMenuType.Start,
      itemType: GroupMenuType.Apply,
      menus: loadSpeciesMenus(),
      children: [],
    },
    {
      key: team.key + GroupMenuType.Todo,
      item: team,
      label: GroupMenuType.Todo,
      itemType: GroupMenuType.Todo,
      menus: [],
      children: [],
    },
    {
      key: team.key + GroupMenuType.Done,
      item: team,
      label: GroupMenuType.Done,
      itemType: GroupMenuType.Done,
      menus: [],
      children: [],
    },
    {
      key: team.key + GroupMenuType.Apply,
      item: team,
      label: GroupMenuType.Apply,
      itemType: GroupMenuType.Apply,
      menus: [],
      children: [],
    },
  ];
};

/** 创建团队菜单 */
const createMenu = (team: IBelong) => {
  return {
    key: team.key,
    item: team,
    label: team.metadata.name,
    itemType: team.metadata.typeName,
    menus: [],
    icon: <TeamIcon notAvatar={true} share={team.share} size={18} fontSize={16} />,
    children: loadChildren(team),
  };
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(orgCtrl.user);
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(createMenu(company));
  }
  return children;
};

export const loadWorkMenu = (): MenuItemType => {
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <IconFont type={'icon-todo'} />,
    children: [getUserMenu(), ...getTeamMenu()],
  };
};
