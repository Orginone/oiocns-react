import orgCtrl from '@/ts/controller';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMarket, ISpeciesItem, IThingClass, SpeciesType } from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';

/** 编译组织分类树 */
const buildSpeciesTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.typeName) {
      case SpeciesType.Thing:
        {
          const thing = item as IThingClass;
          result.push({
            key: item.key,
            item: item,
            label: item.name,
            icon: (
              <TeamIcon
                notAvatar={true}
                typeName={item.typeName}
                entityId={item.id}
                size={18}
              />
            ),
            itemType: item.typeName,
            menus: [],
            tag: [item.typeName],
            children: [
              ...buildSpeciesTree(item.children),
              ...thing.forms.map((i) => {
                return {
                  key: i.key,
                  item: i,
                  label: i.name,
                  icon: (
                    <TeamIcon typeName={item.typeName} entityId={item.id} size={18} />
                  ),
                  itemType: i.typeName,
                  beforeLoad: async () => {
                    await i.loadAttributes();
                  },
                  children: [],
                };
              }),
            ],
            beforeLoad: async () => {
              await thing.loadForms();
            },
          });
        }
        break;
    }
  }
  return result;
};

/** 编译组织树 */
const buildMarketTree = (markets: IMarket[]) => {
  return markets.map((market) => {
    return {
      key: market.current.key,
      item: market,
      label: market.name,
      itemType: market.typeName,
      menus: [],
      tag: [market.current.space.name],
      icon: (
        <TeamIcon
          notAvatar={true}
          typeName={market.typeName}
          entityId={market.id}
          size={18}
        />
      ),
      children: buildSpeciesTree(market.children),
    };
  });
};

/** 获取交易模块菜单 */
export const loadMarketMenu = () => {
  const markets: IMarket[] = [];
  markets.push(...orgCtrl.user.cohorts.filter((i) => i.market).map((i) => i.market!));
  for (const company of orgCtrl.user.companys) {
    markets.push(...company.groups.filter((i) => i.market).map((i) => i.market!));
  }
  return {
    key: '流通',
    label: '流通',
    itemType: 'group',
    icon: <OrgIcons market />,
    children: buildMarketTree(markets),
  };
};
