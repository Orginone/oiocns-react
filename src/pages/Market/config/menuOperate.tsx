import orgCtrl from '@/ts/controller';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IMarket, ISpeciesItem, IWorkThing, SpeciesType } from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';

/** 编译组织分类树 */
const buildSpeciesTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.metadata.typeName) {
      case SpeciesType.WorkThing:
        {
          const thing = item as IWorkThing;
          result.push({
            key: item.key,
            item: item,
            label: item.metadata.name,
            icon: (
              <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />
            ),
            itemType: item.metadata.typeName,
            menus: [],
            tag: [item.metadata.typeName],
            children: [
              ...buildSpeciesTree(item.children),
              ...thing.forms.map((i) => {
                return {
                  key: i.key,
                  item: i,
                  label: i.metadata.name,
                  icon: <TeamIcon share={item.share} size={18} fontSize={16} />,
                  itemType: '表单',
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
      label: market.metadata.name,
      itemType: market.metadata.typeName,
      menus: [],
      tag: [market.current.space.metadata.name],
      icon: <TeamIcon notAvatar={true} share={market.share} size={18} fontSize={16} />,
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
