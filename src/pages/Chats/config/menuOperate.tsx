import React from 'react';
import chatCtrl from '@/ts/controller/chat';
import { BookType, GroupMenuType } from './menuType';
import * as im from 'react-icons/im';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import userCtrl from '@/ts/controller/setting';
import { IChat, ITarget, TargetType } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import setting from '@/ts/controller/setting';
import { XTarget } from '@/ts/base/schema';

/** 编译组织树 */
export const buildTargetTree = async (
  targets: ITarget[],
  spaceId: string,
  spaceName: string,
) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    const chat = chatCtrl.findTargetChat(
      item.target,
      spaceId,
      spaceName,
      item.typeName + '群',
    );
    result.push({
      key: chat.fullId,
      item: chat,
      label: chat.target.name,
      tag: [chat.target.label],
      itemType: GroupMenuType.Chat,
      menus: loadChatMenus(chat, true),
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: await buildTargetTree(item.subTeam, spaceId, spaceName),
    });
  }
  return result;
};

export const buildAuthorityTree = (authority: IAuthority, id: string) => {
  const result: MenuItemType = {
    key: id + '_' + authority.id,
    label: authority.name,
    icon: <im.ImTree />,
    item: {
      source: authority,
      chat: chatCtrl.findTargetChat(
        {
          id: authority.id,
          name: authority.name,
          team: {
            remark: authority.remark,
          },
          typeName: TargetType.Cohort,
        } as XTarget,
        setting.space.id,
        setting.space.teamName,
        '权限群',
      ),
    },
    tag: [setting.space.teamName, '权限群'],
    menus: loadChatMenus(undefined),
    itemType: GroupMenuType.Books + '-' + BookType.Authority,
    children: authority.children?.map((i) => buildAuthorityTree(i, id)) ?? [],
  };
  return result;
};

export const loadBookMenu = async () => {
  const orginoneGpt = chatCtrl.getOrginoneGpt();
  const cohorts = await userCtrl.user.getCohorts(false);
  let companys = await userCtrl.user.getJoinedCompanys(false);
  let cohortChats: any[] = [];
  for (const item of cohorts) {
    if (item.target.belongId == setting.user.id) {
      cohortChats.push(
        chatCtrl.findTargetChat(
          item.target,
          setting.user.id,
          setting.user.teamName,
          item.typeName,
        ),
      );
    }
  }
  let companyItems = [];
  for (const company of companys) {
    const chat = chatCtrl.findTargetChat(
      company.target,
      company.id,
      company.teamName,
      '单位群',
    );
    companyItems.push({
      key: company.teamName,
      label: company.teamName,
      item: chat,
      belong: company,
      itemType: GroupMenuType.Books,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: chat.fullId,
          label: company.teamName,
          item: chat,
          tag: [company.typeName, '全员群'],
          children: [],
          itemType: GroupMenuType.Chat,
          menus: loadChatMenus(chat, true),
          icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
        },
        {
          key: company.id + BookType.Innner,
          label: BookType.Innner,
          item: company,
          itemType: BookType.Innner,
          belong: company,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Department, name: BookType.Innner }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(
            await company.loadSubTeam(),
            company.id,
            company.teamName,
          ),
        },
        {
          key: company.id + BookType.Station,
          label: BookType.Station,
          item: company,
          itemType: BookType.Station,
          belong: company,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Department, name: BookType.Innner }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(
            await company.getStations(),
            company.id,
            company.teamName,
          ),
        },
        {
          key: company.id + BookType.Working,
          label: BookType.Working,
          item: company,
          itemType: BookType.Working,
          belong: company,
          icon: (
            <TeamIcon
              share={{ typeName: TargetType.Working, name: BookType.Working }}
              size={18}
              fontSize={16}
            />
          ),
          children: await buildTargetTree(
            await company.getCohorts(),
            company.id,
            company.teamName,
          ),
        },
        {
          key: company.id + '单位权限群',
          label: '单位权限群',
          item: company,
          itemType: '单位权限群',
          icon: <im.ImUser />,
          belong: company,
          children: [
            buildAuthorityTree((await company.loadSpaceAuthorityTree())!, company.id),
          ],
        },
      ],
    });
  }
  return [
    {
      key: '我的通讯录',
      label: setting.user.teamName,
      itemType: setting.user.teamName,
      item: setting.user,
      belong: setting.user,
      children: [
        {
          key: orginoneGpt.fullId,
          label: orginoneGpt.target.name,
          itemType: GroupMenuType.Chat,
          icon: <TeamIcon share={orginoneGpt.shareInfo} size={18} fontSize={16} />,
          children: [],
          item: orginoneGpt,
          menus: loadChatMenus(orginoneGpt, true),
        },
        {
          key: BookType.Friend,
          label: BookType.Friend,
          itemType: GroupMenuType.Books + '-' + TargetType.Person,
          icon: <im.ImUser />,
          belong: setting.user,
          children: userCtrl.friends.map((i) => {
            const chat = chatCtrl.findTargetChat(
              i.target,
              setting.user.id,
              setting.user.teamName,
              '好友',
            );
            return {
              key: chat.fullId,
              label: chat.target.name,
              item: chat,
              itemType: GroupMenuType.Chat,
              icon: <TeamIcon share={chat.shareInfo} size={18} fontSize={16} />,
              children: [],
              menus: loadChatMenus(chat, true),
            };
          }),
          item: {
            source: setting.user,
            chat: chatCtrl.findTargetChat(
              setting.user.target,
              setting.user.id,
              setting.user.teamName,
              '好友',
            ),
          },
        },
        {
          key: BookType.Cohort,
          label: BookType.Cohort,
          itemType: GroupMenuType.Books,
          icon: <im.ImUsers />,
          belong: setting.user,
          children: cohortChats.map((chat: IChat) => {
            return {
              children: [],
              key: chat.fullId,
              label: chat.target.name,
              item: chat,
              menus: loadChatMenus(chat, true),
              itemType: GroupMenuType.Chat,
              icon: <TeamIcon share={chat.shareInfo} size={18} fontSize={16} />,
            };
          }),
        },
      ],
      icon: <TeamIcon share={setting.user.shareInfo} size={18} fontSize={16} />,
    },
    ...companyItems,
  ];
};

/** 加载右侧菜单 */
export const loadChatMenus = (chat: IChat | undefined, isChat: boolean = false) => {
  const items = [];
  if (isChat) {
    items.push({
      key: '会话详情',
      label: '会话详情',
      icon: <im.ImProfile />,
      model: 'outside',
    });
    if (chat?.isToping) {
      items.push({
        key: '取消置顶',
        label: '取消置顶',
        icon: <im.ImDownload3 />,
        model: 'outside',
      });
    } else {
      items.push({
        key: '置顶会话',
        label: '置顶会话',
        icon: <im.ImUpload3 />,
        model: 'outside',
      });
    }
    if (chat && chat.spaceName === '我的') {
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

export const loadChatMenu = () => {
  let groups: {
    names: string[];
    spaces: any[];
  } = { names: [], spaces: [] };
  chatCtrl.chats.forEach((item) => {
    if (groups.names.indexOf(item.spaceName) < 0) {
      groups.names.push(item.spaceName);
      let sortId = parseInt(item.spaceId.substring(6));
      if (item.spaceName === '我的') {
        sortId = Number.MAX_VALUE;
      }
      groups.spaces.push({
        sortId: sortId,
        label: item.spaceName,
        key: item.spaceId + '-' + item.spaceName,
      });
    }
  });
  groups.spaces = groups.spaces.sort((a, b) => {
    return b.sortId - a.sortId;
  });
  return groups.spaces.map((item) => {
    const chats = chatCtrl.chats.filter((i) => i.spaceName === item.label);
    let noReadCount = 0;
    for (const i of chats) {
      noReadCount += i.noReadCount;
    }
    var children: MenuItemType[] = chats
      .map((a) => {
        return {
          key: a.fullId,
          label: a.target.name + (a.isToping ? '(置顶)' : ''),
          menus: loadChatMenus(a, true),
          itemType: GroupMenuType.Chat,
          item: a,
          children: [],
          count: a.noReadCount,
          tag: [a.spaceName, a.target.label],
          icon: <TeamIcon share={a.shareInfo} size={22} fontSize={22} />,
        };
      })
      .sort((a, b) => {
        const num = (b.item.isToping ? 10 : 0) - (a.item.isToping ? 10 : 0);
        if (num === 0) {
          return b.item.lastMsgTime > a.item.lastMsgTime ? 1 : -1;
        }
        return num;
      });
    return {
      key: item.key,
      label: item.label,
      item: null,
      itemType: '空间',
      count: noReadCount,
      tag: ['空间'],
      icon: <im.ImUsers />,
      menus: [],
      children: children,
    };
  });
};
