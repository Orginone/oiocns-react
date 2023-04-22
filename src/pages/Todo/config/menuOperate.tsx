import React from 'react';
import * as im from 'react-icons/im';
import { IGroup, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType, OrganizationType } from '@/pages/Todo/config/menuType';

/** 编译分类树 */
const buildSpeciesTree = async (species: ISpeciesItem[]) => {
  let works = [];
  var result: MenuItemType[] = [];
  for (let item of species) {
    let subSpecies = await buildSpeciesTree(item.children);
    works.push(item);
    result.push({
      key: item.key,
      label: item.name,
      item: [item, subSpecies.item],
      icon: <im.ImNewspaper />,
      itemType: GroupMenuType.Species,
      children: subSpecies.children,
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
      (await item.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
    );
    let children = [];
    if (item.typeName == TargetType.Group) {
      let subGroup = await buildTargetTree(await (item as IGroup).getSubGroups());
      children.push(...subGroup);
    }
    result.push({
      key: item.key,
      label: item.teamName,
      tag: [item.typeName + '群'],
      item: [item],
      itemType: GroupMenuType.Organization,
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [...children, ...species.children],
    });
  }
  return result;
};

export const loadWorkMenu = async () => {
  let companys = await orgCtrl.user.getJoinedCompanys(false);
  let companyItems = [];
  for (const company of companys) {
    let ret = await buildSpeciesTree(
      (await company.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
    );
    companyItems.push({
      key: company.key,
      label: company.teamName,
      item: [company],
      itemType: GroupMenuType.Organization,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + OrganizationType.Group,
          label: OrganizationType.Group,
          itemType: GroupMenuType.Organization,
          tag: [company.typeName, '集团'],
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: OrganizationType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          item: company.joinedGroup,
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
  return [
    {
      key: '个人',
      label: orgCtrl.user.teamName,
      itemType: GroupMenuType.Organization,
      item: [orgCtrl.user],
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
  ];
};
