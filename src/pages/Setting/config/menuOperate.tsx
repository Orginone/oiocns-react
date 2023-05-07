import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import { AiOutlineSetting } from 'react-icons/ai';
import {
  IAuthority,
  IBelong,
  IDepartment,
  IDict,
  IGroup,
  ISpeciesItem,
  ITarget,
  ITeam,
  OrgAuth,
  SpeciesType,
  TargetType,
} from '@/ts/core';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

/** 加载分组菜单参数 */
interface groupMenuParams {
  item: ITarget;
  key: string;
  label: string;
  typeName: string;
  children: MenuItemType[];
}
/** 创建团队菜单 */
const createMenu = (team: ITeam, menus: OperateMenuType[], children: MenuItemType[]) => {
  return {
    key: team.key,
    item: team,
    label: team.metadata.name,
    itemType: team.metadata.typeName,
    menus: menus,
    tag: [team.metadata.typeName],
    icon: <TeamIcon notAvatar={true} share={team.share} size={18} fontSize={16} />,
    children: children,
  };
};
/** 编译部门树 */
const buildDepartmentTree = (departments: IDepartment[]): MenuItemType[] => {
  return departments.map((item) =>
    createMenu(item, loadTypeMenus(item, item.childrenTypes, true), [
      ...item.species.map((i) => buildSpeciesTree(i)),
      ...buildDepartmentTree(item.children),
    ]),
  );
};
/** 编译单位群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(item, loadTypeMenus(item, [TargetType.Group], true), [
      ...item.species.map((i) => buildSpeciesTree(i)),
      ...buildGroupTree(item.children),
    ]),
  );
};

/** 编译类别树 */
const buildSpeciesTree = (species: ISpeciesItem) => {
  const result: MenuItemType = {
    key: species.key,
    item: species,
    label: species.metadata.name,
    tag: [species.metadata.typeName],
    icon: <TeamIcon share={species.share} size={18} fontSize={16} />,
    itemType: MenuType.Species,
    menus: loadSpeciesMenus(species),
    children: species.children.map((i) => buildSpeciesTree(i)),
    clickEvent: async () => {
      switch (species.metadata.typeName) {
        case SpeciesType.Commodity:
        case SpeciesType.WorkForm:
          await (species as IWorkForm).loadForms();
          await (species as IWorkForm).loadAttributes();
          break;
        case SpeciesType.Market:
        case SpeciesType.WorkItem:
          await (species as IWorkItem).loadWorkDefines();
          break;
        default:
          break;
      }
    },
  };
  return result;
};

/** 编译权限树 */
const buildAuthorityTree = (authority: IAuthority) => {
  const result: MenuItemType = {
    key: authority.key,
    item: authority,
    label: authority.metadata.name,
    icon: <im.ImTree />,
    itemType: MenuType.Authority,
    tag: [MenuType.Authority],
    menus: loadAuthorityMenus(authority),
    children: authority.children?.map((i) => buildAuthorityTree(i)) ?? [],
  };
  return result;
};

/** 加载字典菜单 */
const buildDictMenus = (dict: IDict) => {
  const result: MenuItemType = {
    key: dict.key,
    item: dict,
    label: dict.metadata.name,
    tag: ['字典'],
    icon: <TeamIcon share={dict.share} size={18} fontSize={16} />,
    itemType: MenuType.Dict,
    menus: [
      {
        key: '修改|字典',
        icon: <im.ImPencil />,
        label: '编辑字典',
        model: 'outside',
      },
      {
        key: '删除字典',
        icon: <im.ImCross />,
        label: '删除字典',
        model: 'outside',
        clickEvent: async () => {
          return await dict.delete();
        },
      },
    ],
    children: [],
    clickEvent: async () => {
      await dict.loadItems();
    },
  };
  return result;
};

const LoadStandardMenus = (target: ITarget) => {
  return [
    {
      key: '新增|类别',
      icon: <im.ImPlus />,
      label: '新增类别',
      model: 'outside',
    },
  ];
};

/** 加载标准菜单 */
const loadStandardSetting = (belong: IBelong) => {
  const result: MenuItemType[] = [];
  if (belong.superAuth) {
    result.push(buildAuthorityTree(belong.superAuth));
  }
  result.push({
    children: belong.dicts.map((item) => buildDictMenus(item)),
    key: belong.key + GroupMenuType.DictGroup,
    label: GroupMenuType.DictGroup,
    itemType: GroupMenuType.DictGroup,
    item: belong,
    icon: <im.ImNewspaper />,
    menus: [
      {
        key: '新增',
        icon: <im.ImPlus />,
        label: '新增字典',
        model: 'outside',
      },
    ],
  });
  result.push(...belong.species.map((i) => buildSpeciesTree(i)));
  return result;
};

/** 加载右侧菜单 */
const loadSpeciesMenus = (species: ISpeciesItem) => {
  const items: OperateMenuType[] = [];
  if (species.speciesTypes.length > 0) {
    items.push({
      key: '新增|类别',
      icon: <im.ImPlus />,
      label: '新增类别',
    });
  }
  items.push(
    {
      key: '修改|类别',
      icon: <im.ImCog />,
      label: '编辑类别',
    },
    {
      key: '移除|类别',
      icon: <im.ImBin />,
      label: '删除类别',
      clickEvent: async () => {
        return await species.delete();
      },
    },
  );
  return items;
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(
    orgCtrl.user,
    [
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
    [
      {
        key: orgCtrl.user.key + GroupMenuType.StandardGroup,
        item: orgCtrl.user,
        label: GroupMenuType.StandardGroup,
        itemType: GroupMenuType.StandardGroup,
        menus: LoadStandardMenus(orgCtrl.user),
        icon: <im.ImNewspaper />,
        children: loadStandardSetting(orgCtrl.user),
      },
      loadGroupMenus(
        {
          key: orgCtrl.user.key + GroupMenuType.Cohort,
          label: GroupMenuType.Cohort,
          item: orgCtrl.user,
          typeName: TargetType.Cohort,
          children: orgCtrl.user.cohorts.map((i) =>
            createMenu(
              i,
              loadTypeMenus(i, [], true),
              i.species.map((i) => buildSpeciesTree(i)),
            ),
          ),
        },
        [TargetType.Cohort],
      ),
    ],
  );
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(
      createMenu(company, loadTypeMenus(company, [], false), [
        {
          key: company.key + GroupMenuType.StandardGroup,
          item: company,
          label: GroupMenuType.StandardGroup,
          itemType: GroupMenuType.StandardGroup,
          menus: LoadStandardMenus(company),
          icon: <im.ImNewspaper />,
          children: loadStandardSetting(company),
        },
        loadGroupMenus(
          {
            key: company.key + GroupMenuType.InnerAgency,
            label: GroupMenuType.InnerAgency,
            item: company,
            typeName: TargetType.Department,
            children: buildDepartmentTree(company.departments),
          },
          company.departmentTypes,
        ),
        loadGroupMenus(
          {
            key: company.key + GroupMenuType.OutAgency,
            label: GroupMenuType.OutAgency,
            item: company,
            typeName: TargetType.Group,
            children: buildGroupTree(company.groups),
          },
          [TargetType.Group],
        ),
        loadGroupMenus(
          {
            key: company.key + GroupMenuType.Station,
            label: GroupMenuType.Station,
            item: company,
            typeName: TargetType.Station,
            children: company.stations.map((i) =>
              createMenu(i, loadTypeMenus(i, [], true), []),
            ),
          },
          [TargetType.Station],
        ),
        loadGroupMenus(
          {
            key: company.key + GroupMenuType.Cohort,
            label: GroupMenuType.Cohort,
            item: company,
            typeName: TargetType.Cohort,
            children: company.cohorts.map((i) =>
              createMenu(
                i,
                loadTypeMenus(i, [], true),
                i.species.map((i) => buildSpeciesTree(i)),
              ),
            ),
          },
          [TargetType.Cohort],
        ),
      ]),
    );
  }
  return children;
};

/** 加载分组菜单 */
const loadGroupMenus = (param: groupMenuParams, teamTypes: string[]) => {
  let menus: OperateMenuType[] = [
    {
      key: '刷新',
      icon: <im.ImSpinner9 />,
      label: '刷新' + param.typeName,
      model: 'inside',
      clickEvent: async () => {
        await param.item.deepLoad(true);
        return false;
      },
    },
  ];
  if (param.item.hasAuthoritys([OrgAuth.RelationAuthId])) {
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
    children: param.children,
  };
};

/** 加载右侧菜单 */
const loadAuthorityMenus = (item: IAuthority) => {
  const items: OperateMenuType[] = [
    {
      key: '新增',
      icon: <im.ImPlus />,
      label: '新增权限',
    },
  ];
  if (item.hasAuthoritys([OrgAuth.RelationAuthId])) {
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
        clickEvent: async () => {
          return await item.delete();
        },
      },
    );
  }
  return items;
};

/** 加载类型更多操作 */
const loadTypeMenus = (item: ITeam, subTypes: string[], allowDelete: boolean) => {
  const menus: OperateMenuType[] = [];
  if (item.hasAuthoritys([OrgAuth.RelationAuthId])) {
    menus.push({
      key: '新增|类别',
      icon: <im.ImPlus />,
      label: '新增类别',
      model: 'outside',
    });
    menus.push({
      key: '新建|' + subTypes.join('|'),
      icon: <im.ImPlus />,
      label: '新建用户',
    });
    menus.push({
      key: '编辑',
      icon: <im.ImPencil />,
      label: '编辑信息',
    });
    if (allowDelete) {
      menus.push({
        key: '删除',
        icon: <im.ImBin />,
        label: '删除用户',
        clickEvent: async () => {
          return await item.delete();
        },
      });
    } else {
      if ('species' in item) {
        menus.push({
          key: '退出',
          icon: <im.ImBin />,
          label: '退出' + item.metadata.typeName,
          clickEvent: async () => {
            return await (item as ITarget).exit();
          },
        });
      }
    }
  }
  return menus;
};

/** 加载设置模块菜单 */
export const loadSettingMenu = () => {
  return {
    key: '设置',
    label: '设置',
    itemType: 'Tab',
    children: [getUserMenu(), ...getTeamMenu()],
    icon: <AiOutlineSetting />,
  };
};
