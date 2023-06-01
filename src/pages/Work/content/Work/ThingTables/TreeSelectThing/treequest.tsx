import { MenuType } from '@/pages/Setting/config/menuType';
import { ISpeciesItem, SpeciesType, IThingClass } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
/** 编译组织分类树 */
export const buildThingTree = async (
  species: ISpeciesItem[],
): Promise<MenuItemType[]> => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.typeName) {
      case SpeciesType.Thing:
        {
          result.push({
            key: item.key,
            item: item,
            label: item.name,
            icon: (
              <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />
            ),
            itemType: MenuType.Species,
            menus: [],
            tag: [item.typeName],
            children: [
              // ...(await (item as IThingClass).loadForms()),
              ...buildThingMenus(item as IThingClass),
              ...(await buildThingTree(item.children)),
            ],
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
        icon: <TeamIcon share={form.share} size={18} fontSize={16} />,
        itemType: MenuType.Form,
        beforeLoad: async () => {
          await form.loadAttributes();
        },
        children: [],
      });
    });
  }
  return children;
};
