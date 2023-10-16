import { MenuItemType } from 'typings/globelType';
import { IForm } from '@/ts/core';
import React from 'react';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { XEntity } from '@/ts/base/schema';
/** 创建选择字段菜单 */
const buildSpeciesFiledsTree = (fields: model.FieldModel[]): MenuItemType[] => {
  const result: any[] = [];
  for (const filed of fields) {
    result.push({
      key: filed.id,
      item: filed,
      label: filed.name,
      itemType: '分类',
      menus: [],
      icon: (
        <EntityIcon
          notAvatar={true}
          entity={
            {
              id: filed.id,
              name: filed.name,
              typeName: '分类',
            } as XEntity
          }
          size={18}
        />
      ),
      children: buildSpeciesItemsTree(filed.id, filed.lookups || []),
    });
  }
  return result;
};

/** 创建字典项字段菜单 */
const buildSpeciesItemsTree = (
  fieldId: string,
  lookups: model.FiledLookup[],
  parentId?: string,
): MenuItemType[] => {
  const result: any[] = [];
  for (const item of lookups) {
    if (item.parentId === parentId) {
      result.push({
        key: `${fieldId}-${item.id}`,
        item: item,
        label: item.text,
        itemType: '分类项',
        menus: [],
        icon: (
          <EntityIcon
            notAvatar={true}
            entity={
              {
                id: item.id,
                name: item.text,
                typeName: '分类',
              } as XEntity
            }
            size={18}
          />
        ),
        children: buildSpeciesItemsTree(fieldId, lookups, item.id),
      });
    }
  }
  return result;
};

/** 加载表单分类菜单 */
export const loadSpeciesItemMenu = (form: IForm): MenuItemType => {
  const SpeciesFields = form.fields.filter((i) => i.options?.species);
  return {
    key: form.key,
    label: form.name,
    itemType: 'Tab',
    children: buildSpeciesFiledsTree(SpeciesFields),
    icon: <EntityIcon notAvatar={true} entityId={form.id} size={18} />,
  };
};
