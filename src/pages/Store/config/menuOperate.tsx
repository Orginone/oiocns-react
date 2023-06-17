import TypeIcon from '@/bizcomponents/GlobalComps/typeIcon';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { command, schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { IDirectory, IFileInfo, IGroup, ITarget } from '@/ts/core';
import React from 'react';
import { MenuItemType, OperateMenuType } from 'typings/globelType';

/** 操作到Menus */
export const loadMenus = (file: IFileInfo<schema.XEntity>, mode: number = 0) => {
  return file
    .operates(mode)
    .sort((a, b) => a.sort - b.sort)
    .map((o) => {
      return {
        key: o.cmd,
        label: o.label,
        icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={16} />,
        beforeLoad: () => {
          command.emitter('config', o.cmd, file);
        },
        children: o.menus
          ?.sort((a, b) => a.sort - b.sort)
          .map((s) => {
            return {
              key: s.cmd,
              label: s.label,
              icon: <TypeIcon iconType={s.iconType} size={16} />,
              beforeLoad: () => {
                command.emitter('config', s.cmd, file);
              },
            };
          }),
      } as OperateMenuType;
    });
};

/** 创建团队菜单 */
const createMenu = (team: ITarget, children: MenuItemType[]) => {
  return {
    key: team.key,
    item: team.directory,
    label: team.name,
    itemType: team.directory.typeName,
    menus: loadMenus(team.directory, 1),
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
      ...buildDirectoryTree(item.directory.children),
      ...buildGroupTree(item.children),
    ]),
  );
};

/** 编译目录树 */
const buildDirectoryTree = (directorys: IDirectory[]): MenuItemType[] => {
  return directorys.map((directory) => {
    return {
      key: directory.key,
      item: directory,
      label: directory.name,
      tag: [directory.typeName],
      icon: (
        <EntityIcon entityId={directory.id} typeName={directory.typeName} size={18} />
      ),
      itemType: directory.typeName,
      menus: loadMenus(directory, 2),
      children: buildDirectoryTree(directory.children),
      beforeLoad: async () => {
        await directory.loadContent();
      },
    };
  });
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(orgCtrl.user, [
    ...buildDirectoryTree(orgCtrl.user.directory.children),
    ...orgCtrl.user.cohorts.map((i) =>
      createMenu(i, buildDirectoryTree(i.directory.children)),
    ),
  ]);
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(
      createMenu(company, [
        ...buildDirectoryTree(company.directory.children),
        ...company.targets
          .filter((i) => i.isMyChat && i.id != company.id)
          .map((i) => createMenu(i, buildDirectoryTree(i.directory.children))),
        ...buildGroupTree(company.groups),
      ]),
    );
  }
  return children;
};

/** 加载设置模块菜单 */
export const loadStoreMenu = () => {
  return {
    key: '存储',
    label: '存储',
    itemType: 'group',
    children: [getUserMenu(), ...getTeamMenu()],
    icon: <EntityIcon notAvatar={true} entityId={orgCtrl.user.id} size={18} />,
  };
};
