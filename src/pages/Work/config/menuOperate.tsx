import React from 'react';
import * as im from 'react-icons/im';
import { IGroup, ISpeciesItem, ITarget, ITeam, SpeciesType } from '@/ts/core';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from './menuType';
import { IconFont } from '@/components/IconFont';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';

const buildTargetSpeciesTree = (target: ITarget) =>
  target.species
    .filter((a) => SpeciesType.Application == a.metadata.typeName)
    .map((i) => buildSpeciesTree(i));

/** 加载右键菜单 */
const loadSpeciesMenus = () => {
  const items: OperateMenuType[] = [];
  items.push({
    key: '发起办事',
    icon: <im.ImPlus />,
    label: '发起办事',
    model: 'outside',
  });
  return items;
};

/** 编译事项 */
const buildWorkDefine = (workItem: IWorkItem) => {
  return workItem.defines.map((a) => {
    return {
      key: workItem.key + a.metadata.id,
      item: a,
      label: a.metadata.name,
      icon: <TeamIcon share={workItem.share} size={18} fontSize={16} />,
      itemType: GroupMenuType.Work,
      menus: loadSpeciesMenus(),
      children: [],
    };
  });
};

/** 编译分类树 */
const buildSpeciesTree = (species: ISpeciesItem) => {
  let children: MenuItemType[] = [];
  if (species.metadata.typeName == SpeciesType.WorkItem) {
    children = buildWorkDefine(species as IWorkItem);
  } else {
    children = species.children
      .filter((a) =>
        [SpeciesType.AppModule, SpeciesType.WorkItem].includes(
          a.metadata.typeName as SpeciesType,
        ),
      )
      .map((i) => buildSpeciesTree(i));
  }
  const result: MenuItemType = {
    key: species.key,
    item: species,
    label: species.metadata.name,
    icon: <TeamIcon share={species.share} size={18} fontSize={16} />,
    itemType: GroupMenuType.Species,
    menus: [],
    children: children,
    clickEvent: async () => {
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
      ...buildTargetSpeciesTree(orgCtrl.user),
      ...orgCtrl.user.cohorts.map((i) => createMenu(i, [], buildTargetSpeciesTree(i))),
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
          ...buildTargetSpeciesTree(company),
          ...buildGroupTree(company.groups),
          ...company.cohorts.map((i) => createMenu(i, [], buildTargetSpeciesTree(i))),
        ],
      ),
    );
  }
  return children;
};

/** 编译组织群树 */
const buildGroupTree = (groups: IGroup[]): MenuItemType[] => {
  return groups.map((item) =>
    createMenu(
      item,
      [],
      [...buildTargetSpeciesTree(item), ...buildGroupTree(item.children)],
    ),
  );
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
