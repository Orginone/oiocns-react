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
    let itemWorks = orgCtrl.user
      .allWorks()
      .filter(
        (a) =>
          a.shareId == item.shareId &&
          a.spaceId == item.spaceId &&
          a.speciesId == item.id,
      );
    works.push(...itemWorks);
    result.push({
      key: item.fullId,
      label: item.name,
      item: [...itemWorks, subSpecies.item],
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
  let parentItem = [];
  const result: MenuItemType[] = [];
  for (const item of targets) {
    let works = orgCtrl.user
      .allWorks()
      .filter((a) => a.shareId == item.id && a.spaceId == item.space.id);
    parentItem.push(works);
    let species = await buildSpeciesTree(
      (await item.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
    );
    let children = [];
    if (item.typeName == TargetType.Group) {
      let subGroup = await buildTargetTree(await(item as IGroup).getSubGroups());
      children.push(...subGroup.children);
    }
    result.push({
      key: item.space.id + '-' + item.id,
      label: item.teamName,
      tag: [item.typeName + '群'],
      item: works,
      itemType: GroupMenuType.Work,
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [...children, ...species.children],
    });
  }
  return { item: parentItem, children: result };
};

export const loadWorkMenu = async () => {
  let companys = await orgCtrl.user.getJoinedCompanys(false);
  let companyItems = [];
  for (const company of companys) {
    let ret = await buildSpeciesTree(
      (await company.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
    );
    companyItems.push({
      key: company.id + '单位',
      label: company.teamName,
      item: orgCtrl.user.allWorks().filter((a) => a.spaceId == company.id),
      itemType: GroupMenuType.Work,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.id + OrganizationType.Group,
          label: OrganizationType.Group,
          itemType: GroupMenuType.Work,
          tag: [company.typeName, '集团'],
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: OrganizationType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          ...(await buildTargetTree(company.joinedGroup)),
        },
        {
          key: company.id + OrganizationType.Working,
          label: OrganizationType.Working,
          itemType: GroupMenuType.Work,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: OrganizationType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          ...(await buildTargetTree(await company.getCohorts())),
        },
        ...ret.children,
      ],
    });
  }
  let person = await buildSpeciesTree(
    (await orgCtrl.user.loadSpeciesTree()).filter((a) => a.target.code == 'matters'),
  );
  return [
    {
      key: '个人',
      label: orgCtrl.user.teamName,
      itemType: GroupMenuType.Work,
      belong: orgCtrl.user,
      item: orgCtrl.user.allWorks().filter((a) => a.spaceId == orgCtrl.user.id),
      children: [
        {
          key: '群组',
          label: '群组',
          itemType: GroupMenuType.Work,
          icon: <im.ImUsers />,
          ...(await buildTargetTree(await orgCtrl.user.getCohorts())),
        },
        ...person.children,
      ],
    },
    ...companyItems,
  ];
};
