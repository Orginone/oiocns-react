import { MenuItemType } from 'typings/globelType';
import { IEntity, IFormView } from '@/ts/core';
import React from 'react';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
/** 创建团队菜单 */
const buildSpeciesItemTree = (
  items: IEntity<schema.XSpeciesItem>[],
  parentId: string | undefined,
): MenuItemType[] => {
  const result: any[] = [];
  for (const item of items) {
    if (item.metadata.parentId === parentId) {
      result.push({
        key: item.id,
        item: item,
        label: item.name,
        itemType: item.typeName,
        menus: [],
        icon: <EntityIcon notAvatar={true} entityId={item.id} size={18} />,
        children: buildSpeciesItemTree(items, item.id),
      });
    }
  }
  return result;
};

/** 加载表单分类菜单 */
export const loadSpeciesItemMenu = (form: IFormView): MenuItemType => {
  return {
    key: form.key,
    label: form.name,
    itemType: 'Tab',
    children: buildSpeciesItemTree(form.items, undefined),
    icon: <EntityIcon notAvatar={true} entityId={form.id} size={18} />,
  };
};
