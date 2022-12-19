import React from 'react';
import * as im from 'react-icons/im';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from './menuType';

/** 加载分组菜单参数 */
interface groupMenuParams {
  item: ITarget;
  key: string;
  typeName: string;
  subTeam: ITarget[];
}

/** 转换类型 */
const parseGroupMenuType = (typeName: TargetType) => {
  switch (typeName) {
    case TargetType.Cohort:
      return GroupMenuType.Cohort;
    case TargetType.Station:
      return GroupMenuType.Station;
    default:
      return GroupMenuType.Agency;
  }
};

/** 编译组织树 */
export const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: parseGroupMenuType(item.typeName),
      menus: await loadTypeMenus(item),
      icon: <TeamIcon share={item.shareInfo} size={18} fontSize={16} />,
      children: await buildTargetTree(item.subTeam),
    });
  }
  return result;
};

/** 编译组织树 */
export const buildSpeciesTree = (species: ISpeciesItem) => {
  const result: MenuItemType = {
    key: species.id,
    item: species,
    label: species.name,
    icon: <im.ImTree />,
    itemType: GroupMenuType.Species,
    menus: loadSpeciesMenus(species),
    children: species.children?.map((i) => buildSpeciesTree(i)) ?? [],
  };
  return result;
};

/** 获取空间菜单 */
export const getSpaceMenu = async () => {
  let label = '个人信息';
  let itemType = GroupMenuType.User;
  if (userCtrl.isCompanySpace) {
    label = '单位信息';
    itemType = GroupMenuType.Company;
  }
  return {
    key: userCtrl.space.key,
    item: userCtrl.space,
    label: label,
    itemType: itemType,
    menus: await loadTypeMenus(userCtrl.space),
    icon: <TeamIcon share={userCtrl.space.shareInfo} size={18} fontSize={16} />,
    children: [],
  };
};

/** 加载分组菜单 */
export const loadGroupMenus = async (param: groupMenuParams) => {
  return {
    key: param.key,
    label: param.key,
    itemType: param.key,
    icon: (
      <TeamIcon
        share={{
          name: param.key,
          typeName: param.typeName,
        }}
        size={18}
        fontSize={16}
      />
    ),
    menus: [
      {
        key: '新建|' + param.typeName,
        icon: <im.ImPlus />,
        label: '新建' + param.typeName,
      },
      {
        key: '刷新',
        icon: <im.ImSpinner9 />,
        label: '刷新子组织',
      },
    ],
    item: param.item,
    children: await buildTargetTree(param.subTeam),
  };
};

/** 加载右侧菜单 */
export const loadSpeciesMenus = (item: ISpeciesItem) => {
  const items = [
    {
      key: '新增',
      icon: <im.ImPlus />,
      label: '新增分类',
    },
  ];
  if (item.target.belongId) {
    items.push(
      {
        key: '修改',
        icon: <im.ImCog />,
        label: '编辑分类',
      },
      {
        key: '移除',
        icon: <im.ImBin />,
        label: '删除分类',
      },
    );
  }
  return items;
};

/** 加载类型更多操作 */
export const loadTypeMenus = async (item: ITarget) => {
  const menus: any[] = [];
  if (item.subTeamTypes.length > 0) {
    menus.push({
      key: '新建|' + item.subTeamTypes.join('|'),
      icon: <im.ImPlus />,
      label: '新建子组织',
    });
  }
  menus.push(
    {
      key: '编辑',
      icon: <im.ImPencil />,
      label: '编辑信息',
    },
    {
      key: '刷新',
      icon: <im.ImSpinner9 />,
      label: '刷新子组织',
    },
  );
  if (item.speciesTree) {
    menus.push({
      key: '制定标准',
      label: '制定标准',
      icon: <im.ImNewspaper />,
      subMenu: buildSpeciesTree(item.speciesTree),
    });
  }
  if (item != userCtrl.user && item != userCtrl.company) {
    menus.push({
      key: '删除',
      icon: <im.ImBin />,
      label: '删除' + item.typeName,
    });
  }
  return menus;
};
