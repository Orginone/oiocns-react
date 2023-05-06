import React from 'react';
import * as im from 'react-icons/im';
import { IGroup, ISpeciesItem, ITarget, ITeam, SpeciesType, TargetType } from '@/ts/core';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from './menuType';
import { IconFont } from '@/components/IconFont';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';

/** 加载分组菜单参数 */
interface groupMenuParams {
  item: ITarget;
  key: string;
  label: string;
  typeName: string;
  children: MenuItemType[];
}

const buildTargetSpeciesTree = (target: ITarget) => {
  return {
    children: target.species
      .filter((a) => SpeciesType.Application == a.metadata.typeName)
      .map((i) => buildSpeciesTree(i)),
    key: target.key + '-' + GroupMenuType.SpeciesGroup,
    label: GroupMenuType.SpeciesGroup,
    itemType: GroupMenuType.SpeciesGroup,
    item: target,
    icon: <im.ImNewspaper />,
    menus: [],
  };
};

/** 编译分类树 */
const buildSpeciesTree = (species: ISpeciesItem) => {
  const result: MenuItemType = {
    key: species.key,
    item: species,
    label: species.metadata.name,
    icon: <TeamIcon share={species.share} size={18} fontSize={16} />,
    itemType: GroupMenuType.Species,
    menus: loadSpeciesMenus(species),
    children: species.children.map((i) => buildSpeciesTree(i)),
    onClick: async () => {
      switch (species.metadata.typeName) {
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
/** 加载右侧菜单 */
const loadSpeciesMenus = (species: ISpeciesItem) => {
  const items: OperateMenuType[] = [];
  if (species.metadata.typeName === SpeciesType.WorkItem) {
    items.push({
      key: '发起办事',
      icon: <im.ImPlus />,
      label: '发起办事',
      model: 'outside',
    });
  }
  return items;
};

/** 创建团队菜单 */
const createMenu = (team: ITeam, menus: OperateMenuType[], children: MenuItemType[]) => {
  return {
    key: team.key,
    item: team,
    label: team.metadata.name,
    itemType: team.metadata.typeName,
    menus: menus,
    icon: <TeamIcon notAvatar={true} share={team.share} size={18} fontSize={16} />,
    children: children,
  };
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return createMenu(
    orgCtrl.user,
    [],
    [
      buildTargetSpeciesTree(orgCtrl.user),
      loadGroupMenus({
        key: orgCtrl.user.key + GroupMenuType.Cohort,
        label: GroupMenuType.Cohort,
        item: orgCtrl.user,
        typeName: TargetType.Cohort,
        children: orgCtrl.user.cohorts.map((i) =>
          createMenu(i, [], [buildTargetSpeciesTree(i)]),
        ),
      }),
    ],
  );
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push(
      createMenu(
        company,
        [],
        [
          {
            key: company.key + GroupMenuType.SpeciesGroup,
            item: company,
            label: GroupMenuType.SpeciesGroup,
            itemType: GroupMenuType.SpeciesGroup,
            menus: [],
            icon: <im.ImNewspaper />,
            children: [buildTargetSpeciesTree(company)],
          },
          loadGroupMenus({
            key: company.key + GroupMenuType.OutAgency,
            label: GroupMenuType.OutAgency,
            item: company,
            typeName: TargetType.Group,
            children: buildGroupTree(company.groups),
          }),
          loadGroupMenus({
            key: company.key + GroupMenuType.Cohort,
            label: GroupMenuType.Cohort,
            item: company,
            typeName: TargetType.Cohort,
            children: company.cohorts.map((i) =>
              createMenu(i, [], [buildTargetSpeciesTree(i)]),
            ),
          }),
        ],
      ),
    );
  }
  return children;
};

/** 编译单位群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(
      item,
      [],
      [buildTargetSpeciesTree(item), ...buildGroupTree(item.children)],
    ),
  );
};
/** 加载分组菜单 */
const loadGroupMenus = (param: groupMenuParams) => {
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
    menus: [],
    item: param.item,
    children: param.children,
  };
};

export const loadWorkMenu = (): MenuItemType => {
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <IconFont type={'icon-todo'} />,
    children: [getUserMenu(), ...getTeamMenu()],
  };
};
