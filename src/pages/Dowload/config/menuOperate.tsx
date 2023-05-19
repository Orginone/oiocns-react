import orgCtrl from '@/ts/controller';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IForm, IMarket, ISpeciesItem, ITarget, IWork, SpeciesType } from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';

/** 编译组织分类树 */
const buildSpeciesTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.metadata.typeName) {
      case SpeciesType.Market:
      case SpeciesType.Commodity:
        result.push({
          key: item.key,
          item: item,
          label: item.metadata.name,
          icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
          itemType: item.metadata.typeName,
          menus: [],
          tag: [item.metadata.typeName],
          children: buildSpeciesTree(item.children),
          beforeLoad: async () => {
            switch (item.metadata.typeName) {
              case SpeciesType.Market:
                await (item as IWork).loadWorkDefines();
                break;
              case SpeciesType.Commodity:
                await (item as IForm).loadAttributes();
                await (item as IForm).loadForms();
                break;
            }
          },
        });
        break;
    }
  }
  return result;
};

/** 编译组织树 */
const buildTargetTree = (item: ITarget, market: IMarket) => {
  return {
    key: item.key,
    item: market,
    label: market.metadata.name,
    itemType: market.metadata.typeName,
    menus: [],
    tag: [item.space.metadata.name],
    icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
    children: buildSpeciesTree(market.children),
  };
};

/** 获取模块菜单 */
export const loadMarketMenu = () => {
  const dowload: MenuItemType[] = [];
  dowload.push(
    ...orgCtrl.user.cohorts
      .filter((i) => i.market)
      .map((i) => buildTargetTree(i, i.market!)),
  );
  for (const company of orgCtrl.user.companys) {
    dowload.push(
      ...company.groups.filter((i) => i.market).map((i) => buildTargetTree(i, i.market!)),
    );
  }
  return {
    key: '文件',
    label: '文件',
    itemType: 'group',
    icon: <OrgIcons myWork />,
    children: dowload,
  };
};
