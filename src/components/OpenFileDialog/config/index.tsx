import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import { loadFileMenus } from '@/executor/fileOperate';
import { MenuItemType } from 'typings/globelType';
import { IDepartment, IGroup, ITarget, IDirectory, IApplication, IWork } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';

/** 创建团队菜单 */
const createMenu = (target: ITarget, children: MenuItemType[]) => {
  children.unshift(
    ...buildDirectoryTree([target.memberDirectory]),
    ...buildApplicationTree(target.directory.applications),
  );
  return {
    key: target.directory.key,
    item: target.directory,
    label: target.name,
    itemType: target.directory.typeName,
    menus: loadFileMenus(target.directory, 2),
    tag: [target.typeName],
    icon: <EntityIcon notAvatar={true} entityId={target.id} size={18} />,
    children: children,
  };
};
/** 编译部门树 */
const buildDepartmentTree = (departments: IDepartment[]): MenuItemType[] => {
  return departments.map((item) =>
    createMenu(item, [
      ...buildDirectoryTree(item.directory.children),
      ...buildDepartmentTree(item.children),
    ]),
  );
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
      menus: loadFileMenus(directory),
      children: [
        ...buildDirectoryTree(directory.children),
        ...buildApplicationTree(directory.applications),
      ],
    };
  });
};

const buildWorks = (works: IWork[]): MenuItemType[] => {
  return works
    .filter((i) => i.isContainer)
    .map((work) => {
      return {
        key: work.key,
        item: work,
        label: work.name,
        tag: [work.typeName],
        icon: <EntityIcon entityId={work.id} typeName={work.typeName} size={18} />,
        itemType: work.typeName,
        menus: loadFileMenus(work),
        children: buildForms(work),
      };
    });
};

const buildForms = (work: IWork): MenuItemType[] => {
  return work.content().map((form) => {
    return {
      key: form.key,
      item: form,
      label: form.name,
      tag: [form.typeName],
      icon: <EntityIcon entityId={form.id} typeName={form.typeName} size={18} />,
      itemType: form.typeName,
      menus: loadFileMenus(form),
      children: [],
    };
  });
};

/** 编译目录树 */
const buildApplicationTree = (applications: IApplication[]): MenuItemType[] => {
  return applications.map((application) => {
    return {
      key: application.key,
      item: application,
      label: application.name,
      tag: [application.typeName],
      icon: (
        <EntityIcon entityId={application.id} typeName={application.typeName} size={18} />
      ),
      itemType: application.typeName,
      menus: loadFileMenus(application),
      children: [
        ...buildApplicationTree(application.children),
        ...buildWorks(application.works),
      ],
    };
  });
};

/** 获取个人菜单 */
const getUserMenu = (allowInherited: boolean) => {
  return createMenu(orgCtrl.user, [
    ...buildDirectoryTree(orgCtrl.user.directory.children),
    ...orgCtrl.user.cohorts
      .filter((i) => !i.isInherited || allowInherited)
      .map((i) => createMenu(i, buildDirectoryTree(i.directory.children))),
  ]);
};

/** 获取组织菜单 */
const getTeamMenu = (allowInherited: boolean) => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(
      createMenu(company, [
        ...buildDirectoryTree(company.directory.children),
        ...buildDepartmentTree(company.departments),
        ...buildGroupTree(company.groups.filter((i) => !i.isInherited || allowInherited)),
        ...company.cohorts.map((i) =>
          createMenu(i, buildDirectoryTree(i.directory.children)),
        ),
      ]),
    );
  }
  return children;
};

/** 加载设置模块菜单 */
export const loadSettingMenu = (rootKey: string, allowInherited: boolean) => {
  const rootMenu = {
    key: '根目录',
    label: '根目录',
    itemType: 'Tab',
    item: 'disk',
    children: [getUserMenu(allowInherited), ...getTeamMenu(allowInherited)],
    icon: <EntityIcon notAvatar={true} entityId={orgCtrl.user.id} size={18} />,
  };
  const findMenu = findMenuItemByKey(rootMenu, rootKey);
  if (findMenu) {
    findMenu.parentMenu = undefined;
    return findMenu;
  }
  return rootMenu;
};
