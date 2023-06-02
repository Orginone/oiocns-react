import { MenuType } from '@/pages/Setting/config/menuType';
import { ISpeciesItem, SpeciesType, IThingClass, IBelong } from '@/ts/core';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { GroupMenuType } from '@/pages/Store/config/menuType';
import { Company } from '@/ts/core/target/team/company';

const loadChildren = async (team: IBelong) => {
  const things: ISpeciesItem[] = [];
  for (const s of team.species) {
    switch (s.typeName) {
      case SpeciesType.Thing:
        things.push(s);
        break;
    }
  }
  return [...(await buildThingTree(things))];
};
/** 获取存储模块菜单 */
export const loadStoreMenu = async (company: Company) => {
  let menu = {
    key: company.id,
    item: company,
    label: company.name,
    itemType: GroupMenuType.Company,
    menus: [],
    icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
    children: await loadChildren(company),
  };

  return menu as MenuItemType;
};
/** 编译组织分类树 */
export const buildThingTree = async (
  species: ISpeciesItem[],
): Promise<MenuItemType[]> => {
  const result: any[] = [];
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
            forms: await (item as IThingClass).loadForms(),
            tag: [item.typeName],
            children: [
              ...buildThingMenus(item as IThingClass),
              ...(await buildThingTree(item.children)),
            ],
            beforeLoad: async () => {
              switch (item.typeName) {
                case SpeciesType.Thing:
                  {
                    (await (item as IThingClass).loadForms()) as any;
                  }

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
