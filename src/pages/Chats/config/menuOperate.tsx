import React from 'react';
import { BookType, GroupMenuType } from './menuType';
import * as im from 'react-icons/im';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';
import { MenuItemType } from 'typings/globelType';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { ISpace, ITarget, TargetType } from '@/ts/core';
import { IChat } from '@/ts/core/target/chat/ichat';
import { IconFont } from '@/components/IconFont';

/** 编译组织树 */
const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.chat.fullId,
      item: item.chat,
      label: item.teamName,
      tag: item.chat.target.labels,
      itemType: GroupMenuType.Chat,
      menus: loadChatMoreMenus(false, true),
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: await buildTargetTree(item.subTeam),
    });
  }
  return result;
};

const buildAuthorityTree = (authority: IAuthority, user: ISpace) => {
  const result: MenuItemType = {
    key: authority.chat.fullId,
    label: authority.name,
    icon: <im.ImTree />,
    item: authority.chat,
    tag: authority.chat.target.labels,
    menus: loadChatMoreMenus(false, true),
    itemType: GroupMenuType.Chat,
    children: authority.children?.map((i) => buildAuthorityTree(i, user)) ?? [],
  };
  return result;
};

const loadBookMenu = async () => {
  let companys = await orgCtrl.user.getJoinedCompanys(false);
  let companyItems = [];
  for (const company of companys) {
    const innnerChats: IChat[] = [];
    for (const item of company.departments) {
      innnerChats.push(...item.allChats());
    }
    companyItems.push({
      key: company.id + '同事',
      label: company.teamName,
      item: company.allChats(),
      itemType: GroupMenuType.Books,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.chat.fullId,
          label: company.teamName,
          item: company.chat,
          itemType: GroupMenuType.Chat,
          tag: [company.typeName, '全员群'],
          menus: loadChatMoreMenus(false, true),
          children: company.memberChats.map((chat) => {
            return {
              key: chat.fullId,
              label: chat.target.name,
              item: chat,
              itemType: GroupMenuType.Chat,
              icon: <TeamIcon share={chat.shareInfo} size={18} fontSize={16} />,
              children: [],
              tag: chat.target.labels,
              menus: loadChatMoreMenus(true, true),
            };
          }),
          icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
        },
        {
          key: company.id + BookType.Innner,
          label: BookType.Innner,
          item: innnerChats,
          itemType: GroupMenuType.Books,
          belong: company,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Department, name: BookType.Innner }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(await company.loadSubTeam()),
        },
        {
          key: company.id + BookType.Station,
          label: BookType.Station,
          item: company.stations.map((i) => i.chat),
          itemType: GroupMenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Station, name: BookType.Innner }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(await company.getStations()),
        },
        {
          key: company.id + BookType.Working,
          label: BookType.Working,
          item: company.workings.map((i) => i.chat),
          itemType: GroupMenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: BookType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(await company.getCohorts()),
        },
        {
          key: company.id + '单位权限群',
          label: '单位权限群',
          item: company.authorityTree?.allChats() ?? [],
          itemType: GroupMenuType.Books,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Cohort, name: BookType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          children: company.authorityTree
            ? [buildAuthorityTree(company.authorityTree, company)]
            : [],
        },
      ],
    });
  }
  return [
    {
      key: '通讯录',
      label: orgCtrl.user.teamName,
      itemType: orgCtrl.user.teamName,
      item: orgCtrl.user.allChats().filter((i) => i.spaceId === orgCtrl.user.id),
      children: [
        {
          key: orgCtrl.user.chat.fullId,
          label: orgCtrl.user.chat.target.name,
          itemType: GroupMenuType.Chat,
          icon: <TeamIcon share={orgCtrl.user.chat.shareInfo} size={18} fontSize={16} />,
          children: [],
          tag: orgCtrl.user.chat.target.labels,
          item: orgCtrl.user.chat,
          menus: loadChatMoreMenus(true, true),
        },
        {
          key: BookType.Friend,
          label: BookType.Friend,
          itemType: GroupMenuType.Books,
          icon: <im.ImUser />,
          item: orgCtrl.user.memberChats,
          children: orgCtrl.user.memberChats.map((chat) => {
            return {
              key: chat.fullId,
              label: chat.target.name,
              item: chat,
              itemType: GroupMenuType.Chat,
              icon: <TeamIcon share={chat.shareInfo} size={18} fontSize={16} />,
              children: [],
              tag: chat.target.labels,
              menus: loadChatMoreMenus(true, true),
            };
          }),
        },
        {
          key: BookType.Cohort,
          label: BookType.Cohort,
          itemType: GroupMenuType.Books,
          icon: <im.ImUsers />,
          item: orgCtrl.user.cohorts.map((i) => i.chat),
          children: orgCtrl.user.cohorts.map((cohort) => {
            return {
              children: [],
              key: cohort.chat.fullId,
              label: cohort.chat.target.name,
              item: cohort.chat,
              menus: loadChatMoreMenus(true, true),
              itemType: GroupMenuType.Chat,
              tag: cohort.chat.target.labels,
              icon: <TeamIcon share={cohort.chat.shareInfo} size={18} fontSize={16} />,
            };
          }),
        },
      ],
      icon: <TeamIcon share={orgCtrl.user.shareInfo} size={18} fontSize={16} />,
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
      key: '删除会话',
      label: '删除会话',
      icon: <im.ImBin2 />,
      model: 'inside',
    });
    items.push({
      key: '标记为未读',
      label: '标记为未读',
      icon: <im.ImBell />,
      model: 'outside',
    });
  } else {
    items.push({
      key: '打开会话',
      icon: <im.ImBubbles />,
      label: '打开会话',
      model: 'outside',
    });
  }
  return items;
};

/** 加载会话菜单 */
export const loadChatMenu = async () => {
  const chatMenus = {
    key: '沟通',
    label: '沟通',
    itemType: 'Tab',
    children: [],
    icon: <IconFont type={'icon-message'} />,
  } as MenuItemType;
  chatMenus.children = await loadBookMenu();
  return chatMenus;
};
