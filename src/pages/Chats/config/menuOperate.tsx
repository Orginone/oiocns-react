import React from 'react';
import { MenuType } from './menuType';
import * as im from 'react-icons/im';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { MenuItemType } from 'typings/globelType';
import { IMsgChat } from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';
import { orgAuth } from '@/ts/core/public/consts';

/** 创建会话菜单 */
const createChatMenu = (chat: IMsgChat, children: MenuItemType[]) => {
  return {
    key: chat.chatdata.fullId,
    item: chat,
    label: chat.chatdata.chatName,
    tag: chat.chatdata.labels,
    itemType: MenuType.Chat,
    menus: loadChatMoreMenus(false, true),
    icon: (
      <TeamIcon notAvatar={true} typeName={chat.typeName} entityId={chat.id} size={18} />
    ),
    children: children,
  };
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
      label: company.name,
      item: company.chats.filter((i) => i.isMyChat),
      itemType: MenuType.Books,
      icon: <TeamIcon typeName={company.typeName} entityId={company.id} size={18} />,
      company,
      menus: company.hasAuthoritys([orgAuth.SuperAuthId])
        ? [
            {
              key: '查看会话',
              label: `查看${company.metadata.typeName}所有消息`,
              icon: <im.ImFilter />,
              model: 'outside',
            },
          ]
        : [],
      children: [
        createChatMenu(
          company,
          company.memberChats.map((item) => createChatMenu(item, [])),
        ),
        ...company.cohortChats
          .filter((i) => i.isMyChat)
          .map((item) => createChatMenu(item, [])),
      ],
    });
  }
  return [
    {
      key: orgCtrl.user.key,
      label: orgCtrl.user.chatdata.chatName,
      itemType: orgCtrl.user.chatdata.chatName,
      item: orgCtrl.user.chats.filter((i) => i.isMyChat),
      children: [
        createChatMenu(
          orgCtrl.user,
          orgCtrl.user.memberChats.map((chat) => createChatMenu(chat, [])),
        ),
        ...orgCtrl.user.cohortChats
          .filter((i) => i.isMyChat)
          .map((item) => createChatMenu(item, [])),
      ],
      icon: (
        <TeamIcon typeName={orgCtrl.user.typeName} entityId={orgCtrl.user.id} size={18} />
      ),
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
    icon: <OrgIcons chat />,
  } as MenuItemType;
  chatMenus.children = loadBookMenu();
  return chatMenus;
};
