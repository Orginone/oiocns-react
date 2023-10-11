import { MenuItemType } from 'typings/globelType';
import React from 'react';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IDepartment, IGroup, ITarget, IForm, ICompany, TargetType } from '@/ts/core';

/** 创建菜单 */
const createMenu = (target: ITarget, children: MenuItemType[]) => {
  return {
    key: target.directory.key,
    item: target.directory,
    label: target.name,
    itemType: target.directory.typeName,
    tag: [target.typeName],
    icon: <EntityIcon notAvatar={true} entityId={target.id} size={18} />,
    children: children,
  };
};

/** 编译部门树 */
const buildDepartmentTree = (departments: IDepartment[]): MenuItemType[] => {
  return departments.map((item) =>
    createMenu(item, [
      ...buildMembersTree(item.members),
      ...buildDepartmentTree(item.children),
    ]),
  );
};
/** 编译组织集群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(item, [
      ...buildMembersTree(item.members),
      ...buildGroupTree(item.children),
    ]),
  );
};

/** 编译成员树 */
const buildMembersTree = (members: any[]): MenuItemType[] => {
  return members.map((member) => {
    return {
      key: member.code,
      item: member,
      label: member.name,
      tag: [member.typeName],
      icon: <EntityIcon entityId={member.id} typeName={member.typeName} size={18} />,
      itemType: member.typeName,
      children: [],
    };
  });
};

/** 获取组织菜单 */
const getTeamMenu = (company: ICompany) => {
  const children: MenuItemType[] = [];
  children.push(
    createMenu(company, [
      ...buildDepartmentTree(company.departments),
      ...buildGroupTree(company.groups),
      ...buildMembersTree(company.members),
    ]),
  );
  return children;
};

/** 加载组织分类菜单 */
export const loadSpeciesItemMenu = (form: IForm): MenuItemType => {
  const items = [];
  if (form.directory.target.space.typeName !== TargetType.Person) {
    items.push(...getTeamMenu(form.directory.target.space as ICompany));
  }
  return {
    key: form.key,
    label: form.name,
    itemType: 'Tab',
    children: items,
    icon: <EntityIcon notAvatar={true} entityId={form.id} size={18} />,
  };
};
