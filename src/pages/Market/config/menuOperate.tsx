import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IconFont } from '@/components/IconFont';
import {
  IBelong,
  IForm,
  ISpeciesItem,
  ITarget,
  IWork,
  SpeciesType,
  TargetType,
} from '@/ts/core';

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
          itemType: MenuType.Species,
          menus: [],
          children: buildSpeciesTree(item.children),
          onClick: async () => {
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
const buildTargetTree = (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.metadata.name,
      itemType: item.metadata.typeName,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
      children: buildSpeciesTree(item.species),
    });
  }
  return result;
};

/** 机构分组加载 */
const loadAgencyGroup = (
  space: IBelong,
  children: MenuItemType[],
  type: string,
  typeName: string,
) => {
  return {
    key: space.key + type,
    item: space,
    label: type,
    itemType: type,
    icon: <TeamIcon share={{ name: type, typeName: typeName }} size={18} fontSize={16} />,
    menus: [],
    children: children,
  };
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.metadata.name,
    itemType: GroupMenuType.User,
    icon: <TeamIcon share={orgCtrl.user.share} size={18} fontSize={16} />,
    menus: [],
    children: [
      {
        key: orgCtrl.user.key + GroupMenuType.User,
        item: orgCtrl.user,
        label: GroupMenuType.User,
        itemType: GroupMenuType.User,
        icon: <im.ImNewspaper />,
        menus: [],
        children: buildSpeciesTree(orgCtrl.user.species),
      },
      {
        key: orgCtrl.user.key + GroupMenuType.UserCohort,
        item: orgCtrl.user,
        label: GroupMenuType.UserCohort,
        itemType: GroupMenuType.UserCohort,
        icon: <im.ImNewspaper />,
        menus: [],
        children: buildTargetTree(orgCtrl.user.cohorts),
      },
    ],
  };
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push({
      key: company.key,
      item: company,
      label: company.metadata.name,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + GroupMenuType.Company,
          item: company,
          label: GroupMenuType.Company,
          itemType: GroupMenuType.Company,
          icon: <im.ImNewspaper />,
          menus: [],
          children: buildSpeciesTree(company.species),
        },
        loadAgencyGroup(
          company,
          buildTargetTree(company.departments),
          GroupMenuType.InnerAgency,
          TargetType.Department,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.groups),
          GroupMenuType.OutAgency,
          TargetType.Group,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.cohorts),
          GroupMenuType.CompanyCohort,
          TargetType.Cohort,
        ),
      ],
    });
  }
  return children;
};

/** 获取交易模块菜单 */
export const loadMarketMenu = () => {
  return {
    key: '交易',
    label: '交易',
    itemType: 'group',
    icon: <IconFont type={'icon-guangshangcheng'} />,
    children: [getUserMenu(), ...getTeamMenu()],
  };
};
