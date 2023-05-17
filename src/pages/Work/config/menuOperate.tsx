import React from 'react';
import {
  IAppModule,
  IBelong,
  IMarket,
  ISpeciesItem,
  IWorkItem,
  SpeciesType,
} from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from './menuType';
import { IWorkDefine } from '@/ts/core/thing/base/work';
import { IApplication } from '@/ts/core/thing/app/application';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';

const buildWorkItem = (defines: IWorkDefine[]) => {
  const items: MenuItemType[] = [];
  for (const item of defines) {
    items.push({
      key: item.key,
      item: item,
      label: item.metadata.name,
      itemType: GroupMenuType.WorkItem,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
      children: [],
    });
  }
  return items;
};

const buildSpeciesTree = (species: ISpeciesItem[]) => {
  const items: MenuItemType[] = [];
  for (const item of species) {
    const children: MenuItemType[] = [];
    const defines: IWorkDefine[] = [];
    switch (item.metadata.typeName) {
      case SpeciesType.Market:
        defines.push(...(item as IMarket).defines);
        children.push(...buildWorkItem(defines));
        break;
      case SpeciesType.AppModule:
      case SpeciesType.Application:
        defines.push(...(item as IAppModule).defines);
        break;
      case SpeciesType.WorkItem:
        defines.push(...(item as IWorkItem).defines);
        children.push(...buildWorkItem(defines));
        break;
    }
    if (defines.length < 1) {
      continue;
    }
    children.push(...buildSpeciesTree(item.children));
    items.push({
      key: item.key,
      item: defines,
      label: item.metadata.name,
      itemType: GroupMenuType.Species,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
      children: children,
      beforeLoad: async () => {
        switch (item.metadata.typeName) {
          case SpeciesType.AppModule:
          case SpeciesType.Application:
            await (item as IAppModule).loadWorkDefines();
            break;
        }
      },
    });
  }
  return items;
};

const loadChildren = (team: IBelong) => {
  const defines: IWorkDefine[] = [];
  const species: ISpeciesItem[] = [];
  for (const item of team.targets) {
    if (item.space === team.space) {
      species.push(...item.species);
      for (const species of item.species) {
        switch (species.metadata.typeName) {
          case SpeciesType.Market:
            defines.push(...(species as IMarket).defines);
            break;
          case SpeciesType.Application:
            defines.push(...(species as IApplication).defines);
            break;
        }
      }
    }
  }
  return [
    {
      key: team.key + '发起办事',
      item: defines,
      label: '发起办事',
      itemType: GroupMenuType.Species,
      icon: <OrgIcons size={22} workStart />,
      expIcon: <OrgIcons size={22} workStart selected />,
      menus: [],
      children: buildSpeciesTree(species),
      beforeLoad: async () => {
        for (const item of team.targets) {
          for (const species of item.species) {
            switch (species.metadata.typeName) {
              case SpeciesType.Market:
                await (species as IMarket).loadWorkDefines();
                break;
              case SpeciesType.Application:
                await (species as IApplication).loadWorkDefines();
                break;
            }
          }
        }
      },
    },
    {
      key: team.key + GroupMenuType.Todo,
      item: team,
      label: GroupMenuType.Todo,
      itemType: GroupMenuType.Todo,
      icon: <OrgIcons size={22} work />,
      expIcon: <OrgIcons size={22} work selected />,
      menus: [],
      children: [],
    },
    {
      key: team.key + GroupMenuType.Done,
      item: team,
      label: GroupMenuType.Done,
      itemType: GroupMenuType.Done,
      icon: <OrgIcons size={22} workDone />,
      expIcon: <OrgIcons size={22} workDone selected />,
      menus: [],
      children: [],
    },
    {
      key: team.key + GroupMenuType.Apply,
      item: team,
      label: GroupMenuType.Apply,
      itemType: GroupMenuType.Apply,
      icon: <OrgIcons size={22} myWork />,
      expIcon: <OrgIcons size={22} myWork selected />,
      menus: [],
      children: [],
    },
  ];
};

/** 创建团队菜单 */
const createMenu = (team: IBelong) => {
  return {
    key: team.key,
    item: team,
    label: team.metadata.name,
    itemType: team.metadata.typeName,
    menus: [],
    icon: <TeamIcon notAvatar={true} share={team.share} size={18} fontSize={16} />,
    children: loadChildren(team),
  };
};

export const loadWorkMenu = (): MenuItemType => {
  const children: MenuItemType[] = [createMenu(orgCtrl.user)];
  for (const company of orgCtrl.user.companys) {
    children.push(createMenu(company));
  }
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <OrgIcons work />,
    children: children,
  };
};
