import React from 'react';
import { IApplication, IBelong } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from './menuType';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';
import { IWork } from '@/ts/core';

const buildWorkItem = (defines: IWork[]) => {
  const items: MenuItemType[] = [];
  for (const item of defines) {
    items.push({
      key: item.key,
      item: item,
      label: item.name,
      itemType: GroupMenuType.WorkItem,
      menus: [],
      icon: (
        <TeamIcon
          notAvatar={true}
          entityId={item.id}
          typeName={item.typeName}
          size={18}
        />
      ),
      children: [],
    });
  }
  return items;
};

const buildAppTree = (apps: IApplication[]) => {
  const items: MenuItemType[] = [];
  for (const app of apps) {
    items.push({
      key: app.key,
      item: app.works,
      label: app.name,
      itemType: GroupMenuType.Species,
      menus: [],
      icon: (
        <TeamIcon notAvatar={true} entityId={app.id} typeName={app.typeName} size={18} />
      ),
      children: [...buildAppTree(app.children), ...buildWorkItem(app.works)],
    });
  }
  return items;
};

const loadChildren = (team: IBelong) => {
  const defines: IWork[] = [];
  const apps: IApplication[] = [];
  for (const t of team.targets) {
    for (const s of t.directory.applications) {
      const app = s as IApplication;
      apps.push(app);
      defines.push(...app.works);
    }
  }
  return [
    {
      key: team.key + '发起办事',
      item: defines,
      label: '发起办事',
      itemType: GroupMenuType.Species,
      icon: <OrgIcons size={22} workStart />,
      expIcon: <OrgIcons size={22} workStart selected />,
      menus: [],
      children: buildAppTree(apps.filter((app) => app.works.length > 0)),
      beforeLoad: async () => {
        for (const app of apps) {
          await app.loadWorks();
        }
      },
    },
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
  ];
};

/** 创建团队菜单 */
const createMenu = (team: IBelong) => {
  return {
    key: team.key,
    item: team,
    label: team.name,
    itemType: team.typeName,
    menus: [],
    icon: <TeamIcon notAvatar={true} entityId={team.id} size={18} />,
    children: loadChildren(team),
  };
};

export const loadWorkMenu = (): MenuItemType => {
  const children: MenuItemType[] = [createMenu(orgCtrl.user)];
  for (const company of orgCtrl.user.companys) {
    children.push(createMenu(company));
  }
  return {
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    icon: <OrgIcons work />,
    children: children,
  };
};
