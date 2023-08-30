import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { XEntity } from '@/ts/base/schema';
import { IDirectory, IEntity } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';

export type MenuItem = MenuItemType & { isLeaf?: boolean; selectable: boolean };

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
