import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { IForm, IGroup, ITarget } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import { loadFileMenus } from '@/executor/fileOperate';

/** 创建团队菜单 */
const createMenu = (team: ITarget, children: MenuItemType[]) => {
  return {
    key: team.key,
    item: team.directory,
    label: team.name,
    itemType: team.directory.typeName,
    menus: loadFileMenus(team.directory, 1),
    tag: [team.typeName],
    icon: <EntityIcon notAvatar={true} entityId={team.id} size={18} />,
    children: children,
    beforeLoad: async () => {
      if ('directory' in team) {
        await (team as ITarget).directory.loadContent();
      }
    },
  };
};
/** 编译组织集群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(item, [
      ...buildGroupTree(item.children),
    ]),
  );
};

/** 获取组织菜单 */
const getTeamMenu = (company: any) => {
  const children: MenuItemType[] = [];
  children.push(
    createMenu(company, [
      ...buildGroupTree(company.groups),
    ]),
  );
  return children;
};

/** 加载设置模块菜单 */
export const loadStoreMenu = (current: IForm): MenuItemType => {
  return {
    key: current.key,
    label: current.name,
    itemType: 'Tab',
    children: [...getTeamMenu(current.directory.target)],
    icon: <EntityIcon notAvatar={true} entityId={orgCtrl.user.id} size={18} />,
  };
};
