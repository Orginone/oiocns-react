import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { XEntity } from '@/ts/base/schema';
import { IDirectory, IEntity } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';

export type MenuItem = Omit<MenuItemType, 'Children'> & {
  isLeaf?: boolean;
  selectable: boolean;
  children: MenuItem[];
};

/** 根据类型加载不同文件项 */
const loadFiles = (current: IDirectory, typeNames: string[]) => {
  const items = [];
  for (const typeName of typeNames) {
    switch (typeName) {
      case '事项配置':
      case '实体配置':
        items.push(
          ...current.forms.filter((item) => item.typeName == typeName).map(loadEntity),
        );
      default:
        items.push(
          ...current.configs.filter((item) => item.typeName == typeName).map(loadEntity),
        );
    }
  }
  return items;
};

/** 加载目录 */
export const loadDirs = (current: IDirectory): MenuItemType => {
  return loadMenus(current, []);
};

/** 单一类型菜单 */
export const loadMenu = (current: IDirectory, typeName: string): MenuItem => {
  return loadMenus(current, [typeName]);
};

/** 多类型菜单 */
export const loadMenus = (current: IDirectory, typeNames: string[]): MenuItem => {
  return {
    key: current.id,
    item: current,
    label: current.name,
    itemType: current.typeName,
    icon: <EntityIcon entityId={current.id} typeName={current.typeName} size={18} />,
    children: [
      ...current.children.map((item) => loadMenus(item, typeNames)),
      ...loadFiles(current, typeNames),
    ],
    isLeaf: false,
    selectable: false,
  };
};

/** 表单项 */
export const loadFormsMenu = (current: IDirectory) => {
  return loadMenus(current, ['事项配置', '实体配置']);
};

/** 环境 */
export const loadEnvironmentsMenu = (current: IDirectory) => {
  return loadMenus(current, ['环境']);
};

/** 脚本 */
export const loadScriptsMenu = (current: IDirectory) => {
  return loadMenus(current, ['脚本']);
};

/** 请求 */
export const loadRequestsMenu = (current: IDirectory) => {
  return loadMenus(current, ['请求']);
};

/** 文件项菜单 */
export const loadEntity = (entity: IEntity<XEntity>): MenuItem => {
  return {
    key: entity.id,
    item: entity,
    label: entity.name,
    itemType: entity.typeName,
    icon: <EntityIcon entityId={entity.id} typeName={entity.typeName} size={18} />,
    children: [],
    isLeaf: true,
    selectable: true,
  };
};

/** 默认展开的树节点 */
export const expand = (nodes: MenuItem[], targetType: string): string[] => {
  let ans: string[] = [];
  for (const node of nodes) {
    if (node.children) {
      const children = expand(node.children, targetType);
      if (children.length > 0) {
        ans.push(node.key);
        ans.push(...children);
      }
    }
    if (node.itemType == targetType) {
      ans.push(node.key);
    }
  }
  return ans;
};