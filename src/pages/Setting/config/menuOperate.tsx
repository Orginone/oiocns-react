import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import {
  IAuthority,
  ICommodity,
  IDepartment,
  IDict,
  IDictClass,
  IGroup,
  IPropClass,
  ISpeciesItem,
  ITarget,
  ITeam,
  IWorkForm,
  IWorkItem,
  OrgAuth,
  SpeciesType,
  TargetType,
  companyTypes,
} from '@/ts/core';
import { XProperty } from '@/ts/base/schema';

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
/** 编译组织群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(item, loadTypeMenus(item, [TargetType.Group], true), [
      ...item.species.map((i) => buildSpeciesTree(i)),
      ...buildGroupTree(item.children),
    ]),
  );
};

/** 编译类别树 */
const buildSpeciesTree = (species: ISpeciesItem): MenuItemType => {
  const children: MenuItemType[] = [];
  switch (species.metadata.typeName) {
    case SpeciesType.WorkForm:
      children.push(buildFormMenu(species as IWorkForm));
      break;
    case SpeciesType.Store:
      children.push(buildProperty(species as IPropClass));
      break;
    case SpeciesType.Dict:
      children.push(buildDict(species as IDictClass));
      break;
  }
  return {
    key: species.key,
    item: species,
    label: species.metadata.name,
    tag: [species.metadata.typeName],
    icon: <TeamIcon share={species.share} size={18} fontSize={16} />,
    itemType: MenuType.Species,
    menus: loadSpeciesMenus(species),
    children: [...children, ...species.children.map((i) => buildSpeciesTree(i))],
    beforeLoad: async () => {
      switch (species.metadata.typeName) {
        case SpeciesType.Commodity:
          await (species as ICommodity).loadForm();
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
};

/** 编译属性菜单 */
const buildProperty = (propClass: IPropClass): MenuItemType => {
  return {
    key: propClass.key + MenuType.PropPackage,
    item: propClass,
    label: MenuType.PropPackage,
    icon: <TeamIcon share={propClass.share} size={18} fontSize={16} />,
    itemType: MenuType.PropPackage,
    menus: loadPropertyMenus(propClass, true),
    children: propClass.propertys.map((i) => {
      return {
        key: i.id,
        item: {
          property: i,
          species: propClass,
        },
        label: i.name,
        itemType: MenuType.Property,
        icon: (
          <TeamIcon share={{ name: i.name, typeName: '未知' }} size={18} fontSize={16} />
        ),
        menus: loadPropertyMenus(propClass, false, i),
        children: [],
      };
    }),
  };
};

/** 编译字典菜单 */
const buildDict = (dictClass: IDictClass): MenuItemType => {
  return {
    key: dictClass.key + MenuType.DictPackage,
    item: dictClass,
    label: MenuType.DictPackage,
    icon: <TeamIcon share={dictClass.share} size={18} fontSize={16} />,
    itemType: MenuType.DictPackage,
    menus: loadDictMenus(),
    children: dictClass.dicts.map((dict) => {
      return {
        key: dict.metadata.id,
        item: dict,
        label: dict.metadata.name,
        itemType: MenuType.Dict,
        tag: ['字典'],
        icon: <TeamIcon share={dict.share} size={18} fontSize={16} />,
        menus: loadDictMenus(dict),
        children: [],
        beforeLoad: async () => {
          await dict.loadItems();
        },
      };
    }),
    beforeLoad: async () => {
      await dictClass.loadDicts();
    },
  };
};
/** 编译表单项菜单 */
const buildFormMenu = (form: IWorkForm): MenuItemType => {
  return {
    key: form.key,
    item: form,
    label: form.metadata.name,
    tag: [form.metadata.typeName],
    icon: <TeamIcon share={form.share} size={18} fontSize={16} />,
    itemType: MenuType.Species,
    menus: [
      {
        key: '新增表单',
        icon: <im.ImPencil />,
        label: '新增表单',
        model: 'outside',
      },
      ...loadSpeciesMenus(form),
    ],
    children: form.forms.map((i) => {
      return {
        key: i.key,
        item: i,
        label: i.metadata.name,
        icon: <TeamIcon share={form.share} size={18} fontSize={16} />,
        itemType: MenuType.Form,
        menus: [
          {
            key: '编辑表单',
            icon: <im.ImPencil />,
            label: '编辑表单',
            model: 'outside',
          },
          {
            key: '删除表单',
            icon: <im.ImPencil />,
            label: '删除表单',
            beforeLoad: async () => {
              await i.delete();
            },
          },
        ],
        children: [],
        beforeLoad: async () => {
          await i.loadPropertys();
          await i.loadAttributes();
        },
      } as MenuItemType;
    }),
    beforeLoad: async () => {
      await form.loadForms();
    },
  };
};

/** 编译权限树 */
const buildAuthorityTree = (authority: IAuthority, name?: string) => {
  const result: MenuItemType = {
    key: authority.key,
    item: authority,
    label: name || authority.metadata.name,
    icon: <im.ImTree />,
    itemType: MenuType.Authority,
    tag: [MenuType.Authority],
    menus: loadAuthorityMenus(authority),
    children: authority.children.map((i) => buildAuthorityTree(i)) ?? [],
  };
  return result;
};

const LoadStandardMenus = (target: ITarget) => {
  return [
    {
      key: '新增类别',
      icon: <im.ImPlus />,
      label: '新增类别',
      model: 'outside',
    },
  ];
};

/** 加载右侧菜单 */
const loadSpeciesMenus = (species: ISpeciesItem) => {
  const items: OperateMenuType[] = [];
  if (species.speciesTypes.length > 0) {
    items.push({
      key: '新增类别',
      icon: <im.ImPlus />,
      label: '新增类别',
    });
  }
  items.push(
    {
      key: '编辑类别',
      icon: <im.ImCog />,
      label: '编辑类别',
    },
    {
      key: '删除类别',
      icon: <im.ImBin />,
      label: '删除类别',
      beforeLoad: async () => {
        return await species.delete();
      },
    },
  );
  return items;
};

/** 加载右侧菜单 */
const loadPropertyMenus = (
  species: IPropClass,
  group: boolean = true,
  property?: XProperty,
) => {
  const items: OperateMenuType[] = [];
  if (group) {
    items.push({
      key: '新增属性',
      icon: <im.ImPlus />,
      label: '新增属性',
    });
  } else {
    items.push(
      {
        key: '编辑属性',
        icon: <im.ImCog />,
        label: '编辑属性',
      },
      {
        key: '删除属性',
        icon: <im.ImBin />,
        label: '删除属性',
        beforeLoad: async () => {
          return await species.deleteProperty(property!);
        },
      },
    );
  }
  return items;
};
/** 加载右侧菜单 */
const loadDictMenus = (dict?: IDict) => {
  const items: OperateMenuType[] = [];
  if (dict) {
    items.push(
      {
        key: '编辑属性',
        icon: <im.ImCog />,
        label: '编辑属性',
      },
      {
        key: '删除属性',
        icon: <im.ImBin />,
        label: '删除属性',
        beforeLoad: async () => {
          return await dict.delete();
        },
      },
    );
  } else {
    items.push({
      key: '新增属性',
      icon: <im.ImPlus />,
      label: '新增属性',
    });
  }
  return items;
};
/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(
    orgCtrl.user,
    [
      {
        key: '创建用户|' + companyTypes.join('|'),
        icon: <im.ImOffice />,
        label: '创建单位',
        model: 'outside',
      },
      {
        key: '加入|单位',
        icon: <im.ImTree />,
        label: '加入单位',
        model: 'outside',
      },
      {
        key: '编辑用户',
        icon: <im.ImPencil />,
        label: '编辑信息',
        model: 'outside',
      },
    ],
    [
      buildAuthorityTree(orgCtrl.user.superAuth!, '权限标准'),
      {
        key: orgCtrl.user.key + GroupMenuType.StandardGroup,
        item: orgCtrl.user,
        label: GroupMenuType.StandardGroup,
        itemType: GroupMenuType.StandardGroup,
        menus: LoadStandardMenus(orgCtrl.user),
        icon: <im.ImNewspaper />,
        children: orgCtrl.user.species.map((i) => buildSpeciesTree(i)),
      },
      loadGroupMenus(
        {
          key: orgCtrl.user.key + GroupMenuType.Cohort,
          label: '个人群组',
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
        buildAuthorityTree(company.superAuth!, '权限标准'),
        {
          key: company.key + GroupMenuType.StandardGroup,
          item: company,
          label: GroupMenuType.StandardGroup,
          itemType: GroupMenuType.StandardGroup,
          menus: LoadStandardMenus(company),
          icon: <im.ImNewspaper />,
          children: company.species.map((i) => buildSpeciesTree(i)),
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
      beforeLoad: async () => {
        await param.item.deepLoad(true);
        return false;
      },
    },
  ];
  if (teamTypes.includes(TargetType.Cohort)) {
    menus.push({
      key: '加入|' + TargetType.Cohort,
      icon: <im.ImTree />,
      label: '加入群组',
      model: 'outside',
    });
  }
  if (param.item.hasAuthoritys([OrgAuth.RelationAuthId])) {
    menus.push({
      key: '新建用户|' + teamTypes.join('|'),
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
      key: '新增权限',
      icon: <im.ImPlus />,
      label: '新增权限',
    },
  ];
  if (item.hasAuthoritys([OrgAuth.RelationAuthId])) {
    items.push(
      {
        key: '编辑权限',
        icon: <im.ImCog />,
        label: '编辑权限',
      },
      {
        key: '删除权限',
        icon: <im.ImBin />,
        label: '删除权限',
        beforeLoad: async () => {
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
      key: '新增类别',
      icon: <im.ImPlus />,
      label: '新增类别',
      model: 'outside',
    });
    menus.push({
      key: '新建用户|' + subTypes.join('|'),
      icon: <im.ImPlus />,
      label: '新建用户',
    });
    menus.push({
      key: '编辑用户',
      icon: <im.ImPencil />,
      label: '编辑信息',
    });
    if (allowDelete) {
      menus.push({
        key: '删除',
        icon: <im.ImBin />,
        label: '删除用户',
        beforeLoad: async () => {
          return await item.delete();
        },
      });
    } else {
      if ('species' in item) {
        menus.push({
          key: '退出',
          icon: <im.ImBin />,
          label: '退出' + item.metadata.typeName,
          beforeLoad: async () => {
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
    icon: (
      <TeamIcon notAvatar={true} share={orgCtrl.user.share} size={18} fontSize={16} />
    ),
  };
};
