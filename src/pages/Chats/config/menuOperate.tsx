import React from 'react';
import { GroupMenuType, MenuType } from './menuType';
import * as im from 'react-icons/im';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { MenuItemType } from 'typings/globelType';
import { IconFont } from '@/components/IconFont';
import { IAuthority, IDepartment, IMsgChat, TargetType } from '@/ts/core';

/** 创建会话菜单 */
const createChatMenu = (chat: IMsgChat, children: MenuItemType[]) => {
  return {
    key: chat.chatdata.fullId,
    item: chat,
    label: chat.chatdata.chatName,
    tag: chat.chatdata.labels,
    itemType: MenuType.Chat,
    menus: loadChatMoreMenus(false, true),
    icon: <TeamIcon notAvatar={true} share={chat.share} size={18} fontSize={16} />,
    children: children,
  };
};

/** 编译部门树 */
const buildDepartmentTree = (departments: IDepartment[]): MenuItemType[] => {
  return departments.map((item) =>
    createChatMenu(item, buildDepartmentTree(item.children)),
  );
};

const buildAuthorityTree = (authority: IAuthority): MenuItemType => {
  return createChatMenu(
    authority,
    authority.children.map((item) => buildAuthorityTree(item)),
  );
};

const loadBookMenu = () => {
  const companyItems = [];
  for (const company of orgCtrl.user.companys) {
    const innnerChats = [];
    for (const item of company.departments) {
      innnerChats.push(...item.chats);
    }
    companyItems.push({
      key: company.key + '同事',
      label: company.metadata.name,
      item: company.chats,
      itemType: MenuType.Books,
      icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
      children: [
        createChatMenu(
          company,
          company.memberChats.map((item) => createChatMenu(item, [])),
        ),
        {
          key: company.key + GroupMenuType.InnerAgency,
          label: GroupMenuType.InnerAgency,
          item: innnerChats,
          itemType: MenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Department, name: GroupMenuType.InnerAgency }}
              size={18}
              fontSize={16}
            />
          ),
          children: buildDepartmentTree(company.departments),
        },
        {
          key: company.key + GroupMenuType.Station,
          label: GroupMenuType.Station,
          item: company.stations.map((i) => i.chats[0]),
          itemType: MenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Station, name: GroupMenuType.Station }}
              size={18}
              fontSize={16}
            />
          ),
          children: company.stations.map((item) => createChatMenu(item, [])),
        },
        {
          key: company.key + GroupMenuType.Cohort,
          label: GroupMenuType.Cohort,
          item: company.cohorts.map((i) => i.chats[0]),
          itemType: MenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Cohort, name: GroupMenuType.Cohort }}
              size={18}
              fontSize={16}
            />
          ),
          children: company.cohorts.map((item) => createChatMenu(item, [])),
        },
      ],
    });
    if (company.superAuth) {
      companyItems.push(buildAuthorityTree(company.superAuth));
    }
  }
  return [
    {
      key: '通讯录',
      label: orgCtrl.user.chatdata.chatName,
      itemType: orgCtrl.user.chatdata.chatName,
      item: orgCtrl.user.chats.filter((i) => i.belongId === orgCtrl.user.metadata.id),
      children: [
        createChatMenu(orgCtrl.user, []),
        {
          key: GroupMenuType.Friends,
          label: GroupMenuType.Friends,
          itemType: MenuType.Books,
          icon: <im.ImUser />,
          item: orgCtrl.user.memberChats,
          children: orgCtrl.user.memberChats.map((chat) => createChatMenu(chat, [])),
        },
        {
          key: GroupMenuType.Cohort,
          label: GroupMenuType.Cohort,
          itemType: MenuType.Books,
          icon: <im.ImUsers />,
          item: orgCtrl.user.cohorts.map((i) => i.chats[0]),
          children: orgCtrl.user.cohorts.map((chat) => createChatMenu(chat, [])),
        },
        buildAuthorityTree(orgCtrl.user.superAuth!),
      ],
      icon: <TeamIcon share={orgCtrl.user.share} size={18} fontSize={16} />,
    },
    ...companyItems,
  ];
};

/** 加载右侧菜单 */
const loadChatMoreMenus = (allowDelete: boolean, isChat: boolean = false) => {
  const items = [];
  if (isChat) {
    items.push({
      key: '会话详情',
      label: '会话详情',
      icon: <im.ImProfile />,
      model: 'outside',
    });
    if (allowDelete) {
      items.push({
        key: '清空消息',
        label: '清空消息',
        icon: <im.ImBin />,
        model: 'outside',
      });
    }
    items.push({
      key: '标记为未读',
      label: '标记为未读',
      icon: <im.ImBell />,
      model: 'outside',
    });
  }
  return items;
};

/** 加载会话菜单 */
export const loadChatMenu = () => {
  const chatMenus = {
    key: '沟通',
    label: '沟通',
    itemType: 'Tab',
    children: [],
    icon: <IconFont type={'icon-message'} />,
  } as MenuItemType;
  chatMenus.children = loadBookMenu();
  return chatMenus;
};
