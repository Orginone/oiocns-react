import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { TargetType } from '@/ts/core';
import { ISpace, ISpeciesItem, ITarget } from '@/ts/core';
import { IconFont } from '@/components/IconFont';
/** 获取商品菜单 */
const loadThingMenus = async (target: ITarget) => {
  const children: MenuItemType[] = [];
  await target.loadSpeciesTree();
  for (const item of target.species) {
    if (item.name === GroupMenuType.Things) {
      children.push(...buildSpeciesTree(item.children));
    }
  }
  return {
    key: target.id + GroupMenuType.Things,
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
        label: species.name,
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
const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: item.typeName,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [await loadThingMenus(item), ...(await buildTargetTree(item.subTeam))],
    });
  }
  return result;
};

/** 机构分组加载 */
const loadAgencyGroup = (
  space: ISpace,
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
const getUserMenu = async () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.teamName,
    itemType: GroupMenuType.User,
    icon: <TeamIcon share={orgCtrl.user.shareInfo} size={18} fontSize={16} />,
    menus: [],
    children: [
      await loadThingMenus(orgCtrl.user),
      {
        key: orgCtrl.user.key + GroupMenuType.Cohorts,
        item: orgCtrl.user,
        label: GroupMenuType.Cohorts,
        itemType: GroupMenuType.Cohorts,
        icon: <im.ImNewspaper />,
        menus: [],
        children: await buildTargetTree(orgCtrl.user.cohorts),
      },
    ],
  };
};

/** 获取组织菜单 */
const getTeamMenu = async () => {
  const children: MenuItemType[] = [];
  for (const company of await orgCtrl.user.getJoinedCompanys()) {
    children.push({
      key: company.key,
      item: company,
      label: company.teamName,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        await loadThingMenus(company),
        loadAgencyGroup(
          company,
          await buildTargetTree(company.subTeam),
          GroupMenuType.InnerAgency,
          TargetType.Department,
        ),
        loadAgencyGroup(
          company,
          await buildTargetTree(company.joinedGroup),
          GroupMenuType.OutAgency,
          TargetType.Group,
        ),
        loadAgencyGroup(
          company,
          await buildTargetTree(company.stations),
          GroupMenuType.Station,
          TargetType.Station,
        ),
        loadAgencyGroup(
          company,
          await buildTargetTree(company.cohorts),
          GroupMenuType.Cohorts,
          TargetType.Cohort,
        ),
      ],
    });
  }
  return children;
};

/** 获取交易模块菜单 */
export const loadMarketMenu = async () => {
  return {
    key: '交易',
    label: '交易',
    itemType: 'group',
    icon: <IconFont type={'icon-guangshangcheng'} />,
    children: [await getUserMenu(), ...(await getTeamMenu())],
  };
};
