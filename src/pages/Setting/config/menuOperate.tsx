import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import userCtrl from '@/ts/controller/setting';
import { ISpace, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { IsSuperAdmin } from '@/utils/authority';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';
import { XDict } from '@/ts/base/schema';

/** 加载分组菜单参数 */
interface groupMenuParams {
  item: ITarget;
  key: string;
  label: string;
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
    let prefix = item.target.code;
    let children: MenuItemType[] = [];
    let authority = await item.loadAuthorityTree();
    if (authority) {
      children.push({
        children: [buildAuthorityTree(prefix, authority)],
        key: prefix + '权限标准',
        label: '权限标准',
        itemType: '权限标准',
        item: userCtrl.space,
        icon: <im.ImNewspaper />,
      });
    }
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: parseGroupMenuType(item.typeName),
      menus: await loadTypeMenus(item),
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [
        ...children,
        await buildTargetSpeciesTree(item),
        ...(await buildTargetTree(item.subTeam)),
      ],
    });
  }
  return result;
};

const buildTargetSpeciesTree = async (target: ITarget) => {
  const species = await target.loadSpeciesTree();
  return {
    children: species.map((i) => buildSpeciesTree(target.id, i)),
    key: target.target.code + '-分类标准',
    label: '分类标准',
    itemType: '分类标准',
    item: undefined,
    icon: <im.ImNewspaper />,
  };
};

/** 编译分类树 */
export const buildSpeciesTree = (prefix: string, species: ISpeciesItem) => {
  const result: MenuItemType = {
    key: prefix + species.id,
    item: species,
    label: species.name,
    icon: <im.ImTree />,
    itemType: GroupMenuType.Species,
    menus: loadSpeciesMenus(species),
    children: species.children?.map((i) => buildSpeciesTree(prefix, i)) ?? [],
  };
  return result;
};

/** 编译权限树 */
export const buildAuthorityTree = (prefix: string, authoritys: IAuthority) => {
  const result: MenuItemType = {
    key: prefix + authoritys.id,
    item: authoritys,
    label: authoritys.name,
    icon: <im.ImTree />,
    itemType: GroupMenuType.Authority,
    menus: loadAuthorityMenus(authoritys),
    children: authoritys.children?.map((i) => buildAuthorityTree(prefix, i)) ?? [],
  };
  return result;
};

export const buildDictMenus = (dict: XDict) => {
  const result: MenuItemType = {
    key: dict.id,
    item: dict,
    label: dict.name,
    icon: <im.ImTree />,
    itemType: GroupMenuType.Dict,
    menus: [
      {
        key: '编辑字典',
        icon: <im.ImPencil />,
        label: '编辑字典',
        model: 'outside',
      },
      {
        key: '删除字典',
        icon: <im.ImCross />,
        label: '删除字典',
        model: 'outside',
      },
    ],
    children: [],
  };
  return result;
};

export const loadStandardSetting = async (target: ITarget) => {
  let prefix = target.target.code;
  const result: MenuItemType[] = [];
  const authors = await target?.loadAuthorityTree();
  const dicts = await target.dict.loadDict({ offset: 0, limit: 1000, filter: '' });
  if (authors) {
    result.push({
      children: [buildAuthorityTree(prefix, authors)],
      key: prefix + '权限标准',
      label: '权限标准',
      itemType: '权限标准',
      item: userCtrl.space,
      icon: <im.ImNewspaper />,
    });
  }
  if (dicts) {
    result.push({
      children: dicts?.result?.map((item) => buildDictMenus(item)) || [],
      key: prefix + '字典定义',
      label: '字典定义',
      itemType: '字典定义',
      item: userCtrl.space,
      icon: <im.ImNewspaper />,
      menus: [
        {
          key: '新增字典',
          icon: <im.ImPlus />,
          label: '新增字典',
          model: 'outside',
        },
      ],
    });
  }
  result.push({
    children: [],
    key: prefix + '属性定义',
    label: '属性定义',
    itemType: GroupMenuType.Property,
    item: userCtrl.space,
    icon: <im.ImNewspaper />,
    menus: [
      {
        key: '新增属性',
        icon: <im.ImPlus />,
        label: '新增属性',
        model: 'outside',
      },
    ],
  });
  return result;
};

export const loadSpaceSetting = () => {
  return {
    key: GroupMenuType.ResouceSetting,
    label: GroupMenuType.ResouceSetting,
    itemType: GroupMenuType.ResouceSetting,
    icon: <im.ImSteam />,
    item: userCtrl.space,
    children: [
      {
        children: [],
        key: '权限设置',
        label: '权限设置',
        itemType: '权限设置',
        item: userCtrl.space,
        icon: <im.Im500Px />,
      },
      {
        children: [],
        key: '主页设置',
        label: '主页设置',
        itemType: '主页设置',
        item: userCtrl.space,
        icon: <im.ImBarcode />,
      },
      {
        children: [],
        key: '帮助中心',
        label: '帮助中心',
        itemType: '帮助中心',
        item: userCtrl.space,
        icon: <im.ImShield />,
      },
    ],
  };
};

export const loadUserSetting = () => {
  return {
    key: '个人设置',
    label: '个人设置',
    itemType: '个人设置',
    icon: <im.ImUserCheck />,
    item: userCtrl.user,
    children: [
      {
        children: [],
        key: '主题设置',
        label: '主题设置',
        itemType: '主题设置',
        item: userCtrl.user,
        icon: <im.ImLifebuoy />,
      },
      {
        children: [],
        key: '语言设置',
        label: '语言设置',
        itemType: '语言设置',
        item: userCtrl.user,
        icon: <im.ImBooks />,
      },
      {
        children: [],
        key: '卡包设置',
        label: '卡包设置',
        itemType: '卡包设置',
        item: userCtrl.user,
        icon: <im.ImCreditCard />,
      },
      {
        children: [],
        key: '地址管理',
        label: '地址管理',
        itemType: '地址管理',
        item: userCtrl.user,
        icon: <im.ImLocation2 />,
      },
    ],
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
/** 获取空间菜单 */
export const getSpaceMenu = async (user: ISpace, children: any[]) => {
  let label = '我的';
  let itemType = GroupMenuType.User;
  if (user.typeName != TargetType.Person) {
    label = user.teamName;
    itemType = GroupMenuType.Company;
  }
  children.unshift(await buildTargetSpeciesTree(user));
  return {
    key: user.key,
    item: user,
    label: label,
    itemType: itemType,
    menus: await loadTypeMenus(user),
    icon: <TeamIcon share={user.shareInfo} size={18} fontSize={16} />,
    children: [...(await loadStandardSetting(user)), ...children],
  };
};

/** 加载分组菜单 */
export const loadGroupMenus = async (param: groupMenuParams, teamTypes: string[]) => {
  let menus = [
    {
      key: '重载|' + param.typeName,
      icon: <im.ImSpinner9 />,
      label: '刷新' + param.typeName,
      model: 'inside',
    },
  ];
  if (await IsSuperAdmin(param.item)) {
    menus.unshift({
      key: '新建|' + teamTypes.join('|'),
      icon: <im.ImPlus />,
      label: '新建' + param.typeName,
      model: 'outside',
    });
  }
  return {
    key: param.key,
    label: param.label,
    itemType: param.key,
    icon: (
      <TeamIcon
        share={{
          name: param.key,
          typeName: param.typeName,
        }}
        size={18}
        fontSize={16}
        notAvatar={true}
      />
    ),
    menus: menus,
    item: param.item,
    children: await buildTargetTree(param.subTeam),
  };
};

/** 加载右侧菜单 */
export const loadAuthorityMenus = (item: IAuthority) => {
  const items = [
    {
      key: '新增',
      icon: <im.ImPlus />,
      label: '新增权限',
    },
  ];
  if (item.belongId) {
    items.push(
      {
        key: '修改',
        icon: <im.ImCog />,
        label: '编辑权限',
      },
      {
        key: '移除',
        icon: <im.ImBin />,
        label: '删除权限',
      },
    );
  }
  return items;
};

/** 加载类型更多操作 */
export const loadTypeMenus = async (item: ITarget) => {
  const menus: OperateMenuType[] = [];
  let isAdmin = await IsSuperAdmin(item);
  if (item.subTeamTypes.length > 0) {
    if (isAdmin) {
      menus.push({
        key: '新建|' + item.subTeamTypes.join('|'),
        icon: <im.ImPlus />,
        label: '新建子组织',
      });
    }
  }
  if (isAdmin) {
    menus.push({
      key: '编辑',
      icon: <im.ImPencil />,
      label: '编辑信息',
    });
    if (item != userCtrl.user && item != userCtrl.company) {
      menus.push({
        key: '删除',
        icon: <im.ImBin />,
        label: '删除' + item.typeName,
      });
    }
  } else if (await IsSuperAdmin(userCtrl.space)) {
    if (item != userCtrl.user && item != userCtrl.company) {
      menus.push({
        key: '退出',
        icon: <im.ImBin />,
        label: '退出' + item.typeName,
      });
    }
  }
  return menus;
};
