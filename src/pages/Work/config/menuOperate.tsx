import React from 'react';
import { IBelong } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from './menuType';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';

const createSpaceMenu = (team: IBelong) => {
  return {
    key: team.key,
    item: team,
    label: team.name,
    itemType: team.typeName,
    menus: [],
    icon: <TeamIcon notAvatar={true} entityId={team.id} size={18} />,
    children: [
      {
        key: team.key + GroupMenuType.Todo,
        item: team,
        label: GroupMenuType.Todo,
        itemType: GroupMenuType.Todo,
        icon: <OrgIcons size={22} work />,
        expIcon: <OrgIcons size={22} work selected />,
        menus: [],
        children: [],
      },
      {
        key: team.key + GroupMenuType.Done,
        item: team,
        label: GroupMenuType.Done,
        itemType: GroupMenuType.Done,
        icon: <OrgIcons size={22} workDone />,
        expIcon: <OrgIcons size={22} workDone selected />,
        menus: [],
        children: [],
      },
      {
        key: team.key + GroupMenuType.Apply,
        item: team,
        label: GroupMenuType.Apply,
        itemType: GroupMenuType.Apply,
        icon: <OrgIcons size={22} myWork />,
        expIcon: <OrgIcons size={22} myWork selected />,
        menus: [],
        children: [],
      },
    ],
  };
};

export const loadWorkMenu = (): MenuItemType => {
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <OrgIcons work />,
    children: [orgCtrl.user, ...orgCtrl.user.companys].map((a) => createSpaceMenu(a)),
  };
};
