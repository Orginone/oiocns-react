import React from 'react';
import * as im from 'react-icons/im';
import { IGroup, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType, OrganizationType } from './menuType';
import { IconFont } from '@/components/IconFont';

const buildGroupMenu = () => {
  return [
    {
      key: '发起办事',
      icon: <im.ImPlus />,
      label: '发起办事',
      model: 'outside',
    },
  ];
};

/** 编译分类树 */
const buildSpeciesTree = async (species: ISpeciesItem[]) => {
  let works = [];
  var result: MenuItemType[] = [];
  for (let item of species) {
    let subSpecies = await buildSpeciesTree(item.children);
    works.push(item);
    result.push({
      key: item.key,
      label: item.metadata.name,
      item: [item, subSpecies.item],
      icon: <im.ImNewspaper />,
      itemType: GroupMenuType.Species,
      children: subSpecies.children,
      menus: buildGroupMenu(),
    });
  }
  return {
    item: works,
    children: result,
  };
};

/** 编译组织树 */
export const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    let species = await buildSpeciesTree(
      (await item.loadSpecies()).filter((a) => a.target.code == 'matters'),
    );
    let children = [];
    if (item.metadata.typeName == TargetType.Group) {
      let subGroup = await buildTargetTree((item as IGroup).subTarget);
      children.push(...subGroup);
    }
    result.push({
      key: item.key,
      label: item.metadata.name,
      tag: [item.metadata.typeName + '群'],
      item: [item],
      menus: buildGroupMenu(),
      itemType: GroupMenuType.Organization,
      icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
      children: [...children, ...species.children],
    });
  }
  return result;
};

export const loadWorkMenu = async (): Promise<MenuItemType> => {
  let companys = orgCtrl.user.companys;
  let companyItems: MenuItemType[] = [];
  for (const company of companys) {
    let ret = await buildSpeciesTree(
      company.species.filter((a) => a.target.code == 'matters'),
    );
    companyItems.push({
      key: company.key,
      label: company.metadata.name,
      item: [company],
      menus: buildGroupMenu(),
      itemType: GroupMenuType.Organization,
      icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + OrganizationType.Group,
          label: OrganizationType.Group,
          itemType: GroupMenuType.Organization,
          tag: [company.metadata.name, '集团'],
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: OrganizationType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          item: company.parentTarget,
          children: await buildTargetTree(company.joinedGroup),
        },
        {
          key: company.key + OrganizationType.Working,
          label: OrganizationType.Working,
          itemType: GroupMenuType.Organization,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: OrganizationType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          item: company.cohorts,
          children: await buildTargetTree(await company.getCohorts()),
        },
        ...ret.children,
      ],
    });
  }
  let personSpecies = await buildSpeciesTree(
    (await orgCtrl.user.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
  );
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <IconFont type={'icon-todo'} />,
    children: [
      {
        key: '个人',
        label: orgCtrl.user.teamName,
        itemType: GroupMenuType.Organization,
        item: [orgCtrl.user],
        menus: buildGroupMenu(),
        icon: <TeamIcon share={orgCtrl.user.chat.shareInfo} size={18} fontSize={16} />,
        children: [
          {
            key: '群组',
            label: '群组',
            itemType: GroupMenuType.Organization,
            icon: <im.ImUsers />,
            item: orgCtrl.user.cohorts,
            children: await buildTargetTree(await orgCtrl.user.getCohorts()),
          },
          ...personSpecies.children,
        ],
      },
      ...companyItems,
    ],
  };
};
