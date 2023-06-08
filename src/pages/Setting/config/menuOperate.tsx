import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import {
  IAuthority,
  IDepartment,
  IDict,
  IDictClass,
  IForm,
  IGroup,
  IPropClass,
  ISpeciesItem,
  ITarget,
  ITeam,
  IThingClass,
  IFlowClass,
  SpeciesType,
  TargetType,
  companyTypes,
  IBelong,
  IWorkDefine,
  IWorkClass,
} from '@/ts/core';
import { XProperty } from '@/ts/base/schema';
import { orgAuth } from '@/ts/core/public/consts';
import { generateXlsx, getConfigs } from '@/utils/excel';

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
  if (team.id === team.metadata.belongId) {
    const superAuth = (team as IBelong).superAuth;
    if (superAuth) {
      children.unshift(buildAuthorityTree(superAuth, '权限标准'));
    }
  }
  return {
    key: team.key,
    item: team,
    label: team.name,
    itemType: team.typeName,
    menus: menus,
    tag: [team.typeName],
    icon: (
      <TeamIcon notAvatar={true} entityId={team.id} typeName={team.typeName} size={18} />
    ),
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
/** 编译组织集群树 */
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
  switch (species.typeName) {
    case SpeciesType.Thing:
      children.push(...buildFormMenu((species as IThingClass).forms));
      break;
    case SpeciesType.Work:
      children.push(...buildFormMenu((species as IWorkClass).forms));
      break;
    case SpeciesType.Store:
      children.push(...buildProperty(species as IPropClass));
      break;
    case SpeciesType.Dict:
      children.push(...buildDict(species as IDictClass));
      break;
    case SpeciesType.Flow:
      children.push(...buildDefineMenu(species as IFlowClass));
      break;
  }
  return {
    key: species.key,
    item: species,
    label: species.name,
    tag: [species.typeName],
    icon: <TeamIcon entityId={species.id} typeName={species.typeName} size={18} />,
    itemType: MenuType.Species,
    menus: loadSpeciesMenus(species),
    children: [...children, ...species.children.map((i) => buildSpeciesTree(i))],
    beforeLoad: async () => {
      switch (species.typeName) {
        case SpeciesType.Market:
        case SpeciesType.Flow:
          await (species as IFlowClass).loadWorkDefines();
          break;
        case SpeciesType.Dict:
          await (species as IDictClass).loadDicts();
          break;
        case SpeciesType.Store:
          await (species as IPropClass).loadPropertys();
          break;
        case SpeciesType.Work:
          await (species as IWorkClass).loadForms();
          break;
        case SpeciesType.Thing:
          await (species as IThingClass).loadForms();
          break;
      }
    },
  };
};

/** 编译属性菜单 */
const buildProperty = (propClass: IPropClass) => {
  return propClass.propertys.map((i) => {
    return {
      key: i.id,
      item: {
        property: i,
        species: propClass,
      },
      label: i.name,
      itemType: MenuType.Property,
      icon: <im.ImJoomla fontSize={22} />,
      menus: loadPropertyMenus(propClass, false, i),
      children: [],
    };
  });
};

/** 编译字典菜单 */
const buildDict = (dictClass: IDictClass) => {
  return dictClass.dicts.map((dict) => {
    return {
      key: dict.id,
      item: dict,
      label: dict.name,
      itemType: MenuType.Dict,
      tag: ['字典'],
      icon: (
        <TeamIcon
          notAvatar={true}
          entityId={dict.id}
          typeName={dict.typeName}
          size={18}
        />
      ),
      menus: loadDictMenus(dict),
      children: [],
      beforeLoad: async () => {
        await dict.loadItems();
      },
    };
  });
};

/** 编译表单项菜单 */
const buildDefineMenu = (form: IFlowClass) => {
  return form.defines.map((i) => {
    return {
      key: i.key,
      item: i,
      label: i.name,
      icon: <TeamIcon notAvatar={true} entityId={i.id} typeName={i.typeName} size={18} />,
      itemType: MenuType.Work,
      menus: loadDefineMenus(i),
      children: [],
      beforeLoad: async () => {
        await i.loadWorkNode();
      },
    } as MenuItemType;
  });
};

/** 编译表单项菜单 */
const buildFormMenu = (forms: IForm[]) => {
  return forms.map((i) => {
    return {
      key: i.key,
      item: i,
      label: i.name,
      icon: <TeamIcon notAvatar={true} entityId={i.id} typeName={i.typeName} size={18} />,
      itemType: MenuType.Form,
      menus: loadFormMenus(i),
      children: [],
      beforeLoad: async () => {
        await i.loadAttributes();
      },
    } as MenuItemType;
  });
};

/** 编译权限树 */
const buildAuthorityTree = (authority: IAuthority, name?: string) => {
  const result: MenuItemType = {
    key: authority.key,
    item: authority,
    label: name || authority.name,
    icon: (
      <TeamIcon
        notAvatar={true}
        entityId={authority.id}
        typeName={authority.typeName}
        size={18}
      />
    ),
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
  switch (species.typeName) {
    case SpeciesType.Dict:
      items.push(...loadDictMenus());
      break;
    case SpeciesType.Work:
    case SpeciesType.Thing:
      items.push(...loadFormMenus());
      break;
  }
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
  if (species.speciesTypes.length > 0) {
    items.push(
      {
        key: '导入类别',
        icon: <im.ImPlus />,
        label: '导入类别',
      },
      {
        key: '导入模板下载',
        icon: <im.ImDownload />,
        label: '导入模板下载',
        beforeLoad: async () => {
          generateXlsx(await getConfigs(species), '类别导入模板');
          return false;
        },
      },
    );
  }
  return items;
};

/** 加载右侧菜单 */
const loadDefineMenus = (define?: IWorkDefine) => {
  const items: OperateMenuType[] = [];
  if (define) {
    items.push(
      {
        key: '编辑事项',
        icon: <im.ImCog />,
        label: '编辑事项',
      },
      {
        key: '删除事项',
        icon: <im.ImBin />,
        label: '删除事项',
        beforeLoad: async () => {
          return await define.deleteDefine();
        },
      },
    );
  } else {
    items.push({
      key: '新增事项',
      icon: <im.ImPlus />,
      label: '新增事项',
    });
  }
  return items;
};

/** 加载右侧菜单 */
const loadFormMenus = (form?: IForm) => {
  const items: OperateMenuType[] = [];
  if (form) {
    items.push(
      {
        key: '编辑表单',
        icon: <im.ImCog />,
        label: '编辑表单',
      },
      {
        key: '删除表单',
        icon: <im.ImBin />,
        label: '删除表单',
        beforeLoad: async () => {
          return await form.delete();
        },
      },
    );
  } else {
    items.push({
      key: '新增表单',
      icon: <im.ImPlus />,
      label: '新增表单',
    });
  }
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
        key: '编辑字典',
        icon: <im.ImCog />,
        label: '编辑字典',
      },
      {
        key: '删除字典',
        icon: <im.ImBin />,
        label: '删除字典',
        beforeLoad: async () => {
          return await dict.delete();
        },
      },
    );
  } else {
    items.push({
      key: '新增字典',
      icon: <im.ImPlus />,
      label: '新增字典',
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
      {
        key: orgCtrl.user.key + GroupMenuType.StandardGroup,
        item: orgCtrl.user,
        label: GroupMenuType.StandardGroup,
        itemType: GroupMenuType.StandardGroup,
        menus: LoadStandardMenus(orgCtrl.user),
        icon: <im.ImDatabase fontSize={22} />,
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
        {
          key: company.key + GroupMenuType.StandardGroup,
          item: company,
          label: GroupMenuType.StandardGroup,
          itemType: GroupMenuType.StandardGroup,
          menus: LoadStandardMenus(company),
          icon: <im.ImDatabase fontSize={22} />,
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
  if (param.item.hasRelationAuth()) {
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
    icon: <TeamIcon entityId="0" typeName={param.typeName} size={18} notAvatar={true} />,
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
  if (item.hasAuthoritys([orgAuth.RelationAuthId])) {
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
  if (item.hasRelationAuth()) {
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
  }
  if (allowDelete && item.hasRelationAuth()) {
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
        label: '退出' + item.typeName,
        beforeLoad: async () => {
          return await (item as ITarget).exit();
        },
      });
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
      <TeamIcon
        notAvatar={true}
        entityId={orgCtrl.user.id}
        typeName={orgCtrl.user.typeName}
        size={18}
      />
    ),
  };
};
