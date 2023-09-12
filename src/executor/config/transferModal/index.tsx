import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { XEntity } from '@/ts/base/schema';
import { IDirectory, IEntity } from '@/ts/core';
import React, { ReactNode } from 'react';
import { MenuItemType } from 'typings/globelType';

type GenLabel = (current: IEntity<XEntity>) => ReactNode;

export type MenuItem = Omit<MenuItemType, 'Children'> & {
  node: ReactNode;
  isLeaf?: boolean;
  selectable: boolean;
  children: MenuItem[];
};

/** 根据类型加载不同文件项 */
const loadFiles = (current: IDirectory, typeNames: string[], genLabel?: GenLabel) => {
  const items = [];
  for (const typeName of typeNames) {
    switch (typeName) {
      case '事项配置':
      case '实体配置':
        items.push(
          ...current.forms
            .filter((item) => item.typeName == typeName)
            .map((entity) => loadEntity(entity, genLabel)),
        );
        break;
      case '字典':
      case '分类':
        items.push(
          ...current.specieses
            .filter((item) => item.typeName == typeName)
            .map((entity) => loadEntity(entity, genLabel)),
        );
        break;
    }
  }
  return items;
};

/** 加载目录 */
export const loadDirs = (
  current: IDirectory,
  operate?: (item: MenuItem) => void,
  genLabel?: GenLabel,
): MenuItem => {
  return loadMenus(current, [], genLabel, operate);
};

/** 单一类型菜单 */
export const loadMenu = (current: IDirectory, typeName: string): MenuItem => {
  return loadMenus(current, [typeName]);
};

/** 多类型菜单 */
export const loadMenus = (
  current: IDirectory,
  typeNames: string[],
  genLabel?: GenLabel,
  operate?: (item: MenuItem) => void,
): MenuItem => {
  let item = {
    key: current.id,
    item: current,
    label: current.name,
    itemType: current.typeName,
    icon: <EntityIcon entityId={current.id} typeName={current.typeName} size={18} />,
    children: [
      ...current.children.map((item) => loadMenus(item, typeNames, genLabel, operate)),
      ...loadFiles(current, typeNames, genLabel),
    ],
    isLeaf: false,
    selectable: false,
    node: genLabel?.(current),
  };
  operate?.(item);
  return item;
};

/** 表单项 */
export const loadFormsMenu = (current: IDirectory, genLabel?: GenLabel) => {
  return loadMenus(current, ['事项配置', '实体配置'], genLabel);
};

/** 文件项菜单 */
export const loadEntity = (entity: IEntity<XEntity>, genLabel?: GenLabel): MenuItem => {
  return {
    key: entity.id,
    item: entity,
    label: entity.name,
    itemType: entity.typeName,
    icon: <EntityIcon entityId={entity.id} typeName={entity.typeName} size={18} />,
    children: [],
    isLeaf: true,
    selectable: true,
    node: genLabel?.(entity),
  };
};

/** 默认展开的树节点 */
export const expand = (nodes: MenuItem[], targetTypes: string[]): string[] => {
  let ans: string[] = [];
  for (const node of nodes) {
    if (node.children) {
      const children = expand(node.children, targetTypes);
      if (children.length > 0) {
        ans.push(node.key);
        ans.push(...children);
      }
    }
    if (node.itemType == '事项配置' || node.itemType == '实体配置') {
      console.log(targetTypes, targetTypes.indexOf(node.itemType), node);
    }
    if (targetTypes.indexOf(node.itemType) != -1) {
      ans.push(node.key);
    }
  }
  return ans;
};

/** 默认的生成图标 */
export const defaultGenLabel = (entity: IEntity<XEntity>, types: string[]): ReactNode => {
  return <></>;
  // return (
  //   <Space>
  //     {entity.name}
  //     {types.indexOf(entity.typeName) != -1 && (
  //       <EditOutlined
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           linkCmd.emitter('entity', 'update', { entity });
  //         }}
  //       />
  //     )}
  //     {entity.typeName == '目录' && (
  //       <NewEntity
  //         curDir={entity as IDirectory}
  //         types={[...types, '目录']}
  //         size="small"
  //       />
  //     )}
  //   </Space>
  // );
};
