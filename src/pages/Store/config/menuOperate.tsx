import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import { loadFileMenus } from '@/executor/fileOperate';
import { MenuItemType } from 'typings/globelType';
import { IDepartment, IGroup, ITarget, IDirectory, IApplication, IWork } from '@/ts/core';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

/** 创建团队菜单 */
const createMenu = (target: ITarget, children: MenuItemType[]) => {
  children.unshift(...buildApplicationTree(target.directory.standard.applications));
  return {
    key: target.directory.key,
    item: target.directory,
    label: target.name,
    itemType: target.directory.typeName,
    menus: loadFileMenus(target.directory),
    tag: [target.typeName],
    icon: <EntityIcon entity={target.directory.metadata} size={18} />,
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
  return directorys
    .filter((i) => !i.groupTags.includes('已删除'))
    .map((directory) => {
      return {
        key: directory.key,
        item: directory,
        label: directory.name,
        tag: [directory.typeName],
        itemType: directory.typeName,
        menus: loadFileMenus(directory),
        children: [
          ...buildDirectoryTree(directory.children),
          ...buildApplicationTree(directory.standard.applications),
        ],
        icon: <EntityIcon entity={directory.metadata} size={18} />,
      };
    });
};

const buildWorks = (works: IWork[]): MenuItemType[] => {
  return works
    .filter((i) => i.isInherited)
    .map((work) => {
      return {
        key: work.key,
        item: work,
        label: work.name,
        tag: [work.typeName],
        itemType: work.typeName,
        menus: loadFileMenus(work),
        children: [],
        icon: <EntityIcon entity={work.metadata} size={18} />,
      };
    });
};

/** 编译目录树 */
const buildApplicationTree = (applications: IApplication[]): MenuItemType[] => {
  return applications
    .filter((i) => !i.groupTags.includes('已删除'))
    .map((application) => {
      return {
        key: application.key,
        item: application,
        label: application.name,
        tag: [application.typeName],
        itemType: application.typeName,
        menus: loadFileMenus(application),
        children: [
          ...buildApplicationTree(application.children),
          ...buildWorks(application.works),
        ],
        icon: <EntityIcon entity={application.metadata} size={18} />,
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
        ...buildDepartmentTree(company.departments),
        ...buildGroupTree(company.groups),
        ...company.cohorts.map((i) =>
          createMenu(i, buildDirectoryTree(i.directory.children)),
        ),
      ]),
    );
  }
  return children;
};

/** 加载设置模块菜单 */
export const loadBrowserMenu = () => {
  return {
    key: '存储',
    label: '存储',
    itemType: 'Tab',
    item: 'disk',
    children: [getUserMenu(), ...getTeamMenu()],
    icon: <OrgIcons store selected />,
  };
};
