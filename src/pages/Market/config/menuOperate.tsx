import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IBelong, TargetType } from '@/ts/core';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { IconFont } from '@/components/IconFont';
/** 获取商品菜单 */
const loadThingMenus = (target: ITarget) => {
  const children: MenuItemType[] = [];
  for (const item of target.species) {
    if (item.metadata.name === GroupMenuType.Things) {
      children.push(...buildSpeciesTree(item.children));
    }
  }
  return {
    key: target.key + GroupMenuType.Things,
    label: GroupMenuType.Things,
    itemType: GroupMenuType.Things,
    menus: [],
    item: target,
    icon: <im.ImCalculator />,
    children: children,
  };
};

/** 编译组织分类树 */
const buildSpeciesTree = (parent: ISpeciesItem[]): MenuItemType[] => {
  if (parent.length > 0) {
    return parent.map((species) => {
      return {
        key: species.key,
        item: species,
        label: species.metadata.name,
        icon: <im.ImNewspaper />,
        itemType: MenuType.Species,
        menus: [],
        children: buildSpeciesTree(species.children),
      };
    });
  }
  return [];
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
      children: [loadThingMenus(item), ...buildTargetTree(item.subTarget)],
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
      loadThingMenus(orgCtrl.user),
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
        loadThingMenus(company),
        loadAgencyGroup(
          company,
          buildTargetTree(company.subTarget),
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
