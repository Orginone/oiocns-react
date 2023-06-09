import { ISpeciesItem, SpeciesType, IThingClass, IBelong } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';

const loadChildren = (team: IBelong) => {
  const things: ISpeciesItem[] = [];
  for (const s of team.species) {
    switch (s.typeName) {
      case SpeciesType.Thing:
        things.push(s);
        break;
    }
  }
  return buildThingTree(things);
};
/** 获取存储模块菜单 */
export const loadThingMenu = (space: IBelong) => {
  return {
    key: space.id,
    item: space,
    label: space.name,
    itemType: space.typeName,
    menus: [],
    icon: <TeamIcon entityId={space.id} typeName={space.typeName} size={18} />,
    children: loadChildren(space),
  } as MenuItemType;
};
/** 编译组织分类树 */
export const buildThingTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: any[] = [];
  for (const item of species) {
    switch (item.typeName) {
      case SpeciesType.Thing:
        {
          result.push({
            key: item.key,
            item: item,
            label: item.name,
            icon: <TeamIcon entityId={item.id} typeName={item.typeName} size={18} />,
            itemType: item.typeName,
            menus: [],
            children: [
              ...buildThingMenus(item as IThingClass),
              ...buildThingTree(item.children),
            ],
            beforeLoad: async () => {
              switch (item.typeName) {
                case SpeciesType.Thing:
                  await (item as IThingClass).loadForms();
                  break;
              }
            },
          });
        }
        break;
    }
  }
  return result;
};

/** 加载实体类菜单 */
export const buildThingMenus = (thing: IThingClass) => {
  const children: MenuItemType[] = [];
  if (thing.typeName === SpeciesType.Thing) {
    thing.forms.forEach((form) => {
      children.push({
        key: form.key,
        item: form,
        label: form.name,
        icon: <TeamIcon entityId={form.id} typeName={form.typeName} size={18} />,
        itemType: '表单',
        beforeLoad: async () => {
          await form.loadAttributes();
        },
        children: [],
      });
    });
  }
  return children;
};
