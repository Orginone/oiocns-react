import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { ISpace, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { IsSuperAdmin } from '@/utils/authority';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import { XDict } from '@/ts/base/schema';
import { SettingOutlined } from '@ant-design/icons';

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
      return MenuType.Cohort;
    case TargetType.Station:
      return MenuType.Station;
    default:
      return MenuType.Agency;
  }
};

/** 编译组织树 */
const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: parseGroupMenuType(item.typeName),
      menus: await loadTypeMenus(item, true),
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [buildTargetSpeciesTree(item), ...(await buildTargetTree(item.subTeam))],
    });
  }
  return result;
};

const buildTargetSpeciesTree = (target: ITarget) => {
  return {
    children: target.species.map((i) => buildSpeciesTree(target.key, i)),
    key: target.key + '-' + GroupMenuType.SpeciesGroup,
    label: GroupMenuType.SpeciesGroup,
    itemType: GroupMenuType.SpeciesGroup,
    item: target,
    icon: <im.ImNewspaper />,
  };
};

/** 编译分类树 */
const buildSpeciesTree = (prefix: string, species: ISpeciesItem) => {
  const result: MenuItemType = {
    key: prefix + species.id,
    item: species,
    label: species.name,
    icon: <im.ImTree />,
    itemType: MenuType.Species,
    menus: loadSpeciesMenus(species),
    children: species.children?.map((i) => buildSpeciesTree(prefix, i)) ?? [],
  };
  return result;
};

/** 编译权限树 */
const buildAuthorityTree = (prefix: string, authoritys: IAuthority) => {
  const result: MenuItemType = {
    key: prefix + authoritys.id,
    item: authoritys,
    label: authoritys.name,
    icon: <im.ImTree />,
    itemType: MenuType.Authority,
    menus: loadAuthorityMenus(authoritys),
    children: authoritys.children?.map((i) => buildAuthorityTree(prefix, i)) ?? [],
  };
  return result;
};

/** 加载字典菜单 */
const buildDictMenus = (dict: XDict, belong: ISpace) => {
  const result: MenuItemType = {
    key: dict.id,
    item: {
      dict,
      belong,
    },
    label: dict.name,
    icon: <im.ImTree />,
    itemType: MenuType.Dict,
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

/** 加载标准菜单 */
const loadStandardSetting = async (space: ISpace) => {
  const result: MenuItemType[] = [];
  result.push({
    children: space.authorityTree
      ? [buildAuthorityTree(space.key, space.authorityTree)]
      : [],
    key: space.key + GroupMenuType.AuthortyGroup,
    label: GroupMenuType.AuthortyGroup,
    itemType: GroupMenuType.AuthortyGroup,
    item: space,
    icon: <im.ImNewspaper />,
  });
  result.push({
    children: space.dict.dicts.map((item) => buildDictMenus(item, space)) || [],
    key: space.key + GroupMenuType.DictGroup,
    label: GroupMenuType.DictGroup,
    itemType: GroupMenuType.DictGroup,
    item: space,
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
  result.push({
    children: [],
    key: space.key + MenuType.Property,
    label: MenuType.Property,
    itemType: MenuType.Property,
    item: space,
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
  result.push(await buildTargetSpeciesTree(space));
  return result;
};

/** 加载右侧菜单 */
const loadSpeciesMenus = (item: ISpeciesItem) => {
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

/** 获取个人菜单 */
const getUserMenu = async () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.teamName,
    itemType: MenuType.User,
    icon: <TeamIcon share={orgCtrl.user.shareInfo} size={18} fontSize={16} />,
    menus: [
      {
        key: '创建单位',
        icon: <im.ImOffice />,
        label: '创建单位',
        model: 'outside',
      },
      {
        key: '加入单位',
        icon: <im.ImTree />,
        label: '加入单位',
        model: 'outside',
      },
      {
        key: '编辑',
        icon: <im.ImPencil />,
        label: '编辑信息',
        model: 'outside',
      },
    ],
    children: [
      {
        key: orgCtrl.user.key + '门户设置',
        item: orgCtrl.user,
        label: '门户设置',
        itemType: '门户设置',
        belongId: orgCtrl.user.id,
        shareId: orgCtrl.user.id,
        menus: [],
        icon: <im.ImNewspaper />,
        children: [
          {
            key: '页面列表',
            label: '页面列表',
            itemType: '门户页面',
            icon: <SettingOutlined />,
            children: [],
          },
          {
            key: '系统组件',
            label: '组件列表',
            itemType: '门户组件',
            icon: <SettingOutlined />,
            children: [],
          },
        ],
      },
      {
        key: orgCtrl.user.key + GroupMenuType.StandardGroup,
        item: orgCtrl.user,
        label: GroupMenuType.StandardGroup,
        itemType: GroupMenuType.StandardGroup,
        menus: [],
        icon: <im.ImNewspaper />,
        children: await loadStandardSetting(orgCtrl.user),
      },
      await loadGroupMenus(
        {
          key: orgCtrl.user.id + GroupMenuType.UserCohort,
          label: GroupMenuType.UserCohort,
          item: orgCtrl.user,
          typeName: TargetType.Cohort,
          subTeam: orgCtrl.user.cohorts,
        },
        [TargetType.Cohort],
      ),
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
      itemType: MenuType.Company,
      menus: await loadTypeMenus(company, false),
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + '单位门户',
          item: company,
          label: '门户设置',
          itemType: '门户设置',
          menus: [],
          icon: <im.ImNewspaper />,
          children: [
            {
              key: company.key + '页面列表',
              label: '页面列表',
              itemType: '门户页面',
              icon: <SettingOutlined />,
              children: [],
            },
            {
              key: company.key + '系统组件',
              label: '组件列表',
              itemType: '门户组件',
              icon: <SettingOutlined />,
              children: [],
            },
          ],
        },
        {
          key: company.key + GroupMenuType.StandardGroup,
          item: company,
          label: GroupMenuType.StandardGroup,
          itemType: GroupMenuType.StandardGroup,
          menus: [],
          icon: <im.ImNewspaper />,
          children: await loadStandardSetting(company),
        },
        await loadGroupMenus(
          {
            key: company.key + GroupMenuType.InnerAgency,
            label: GroupMenuType.InnerAgency,
            item: company,
            typeName: TargetType.Department,
            subTeam: company.subTeam,
          },
          company.subTeamTypes,
        ),
        await loadGroupMenus(
          {
            key: company.key + GroupMenuType.OutAgency,
            label: GroupMenuType.OutAgency,
            item: company,
            typeName: TargetType.Group,
            subTeam: company.joinedGroup,
          },
          [TargetType.Group],
        ),
        await loadGroupMenus(
          {
            key: company.key + GroupMenuType.StationSetting,
            label: GroupMenuType.StationSetting,
            item: company,
            typeName: TargetType.Station,
            subTeam: company.stations,
          },
          [TargetType.Station],
        ),
        await loadGroupMenus(
          {
            key: company.key + GroupMenuType.CompanyCohort,
            label: GroupMenuType.CompanyCohort,
            item: company,
            typeName: TargetType.Cohort,
            subTeam: company.cohorts,
          },
          [TargetType.Cohort],
        ),
      ],
    });
  }
  return children;
};

/** 加载分组菜单 */
const loadGroupMenus = async (param: groupMenuParams, teamTypes: string[]) => {
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
const loadAuthorityMenus = (item: IAuthority) => {
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
const loadTypeMenus = async (item: ITarget, allowDelete: boolean) => {
  const menus: OperateMenuType[] = [];
  if (item.typeName != TargetType.Group) {
    menus.push({
      key: '打开会话',
      icon: <im.ImBubbles />,
      label: '打开会话',
      model: 'outside',
    });
  }
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
    if (allowDelete) {
      menus.push({
        key: '删除',
        icon: <im.ImBin />,
        label: '删除' + item.typeName,
      });
    }
  } else if (await IsSuperAdmin(item)) {
    if (!allowDelete) {
      menus.push({
        key: '退出',
        icon: <im.ImBin />,
        label: '退出' + item.typeName,
      });
    }
  }
  return menus;
};

/** 加载设置模块菜单 */
export const loadSettingMenu = async () => {
  return {
    key: '设置',
    label: '设置',
    itemType: 'Tab',
    children: [await getUserMenu(), ...(await getTeamMenu())],
    icon: <SettingOutlined />,
  };
};
