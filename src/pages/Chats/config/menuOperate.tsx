import React from 'react';
import chatCtrl from '@/ts/controller/chat';
import { BookType, GroupMenuType } from './menuType';
import * as im from 'react-icons/im';
import ChatItem from '../components/chatItem';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import userCtrl from '@/ts/controller/setting';
import { IChat, ITarget, TargetType } from '@/ts/core';
import { MenuItemType } from 'typings/globelType';

interface groupMenuParams {
  item: ITarget;
  key: string;
  typeName: string;
  subTeam: ITarget[];
}

/** 编译组织树 */
export const buildTargetTree = async (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: item.typeName,
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: await buildTargetTree(item.subTeam),
    });
  }
  return result;
};

export const loadBookMenu = async () => {
  let cohorts = await userCtrl.user.getCohorts(false);
  let companys = await userCtrl.user.getJoinedCompanys(false);
  let companyItems = [];
  for (const company of companys) {
    companyItems.push({
      key: company.id,
      label: company.name,
      item: company,
      itemType: GroupMenuType.Books,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        await loadGroupMenus({
          key: '内设机构',
          item: company,
          typeName: TargetType.Department,
          subTeam: await company.loadSubTeam(),
        }),
        await loadGroupMenus({
          key: '外设机构',
          item: company,
          typeName: TargetType.Group,
          subTeam: await company.getJoinedGroups(),
        }),
        await loadGroupMenus({
          key: '岗位',
          item: company,
          typeName: TargetType.Station,
          subTeam: await company.getStations(),
        }),
        await loadGroupMenus({
          key: '单位群组',
          item: company,
          typeName: TargetType.Cohort,
          subTeam: await company.getCohorts(),
        }),
      ],
    });
  }
  return {
    key: '通讯录',
    label: '通讯录',
    itemType: '通讯录',
    icon: <im.ImTree />,
    children: [
      {
        key: BookType.Common,
        label: BookType.Common,
        itemType: GroupMenuType.Books,
        icon: <im.ImHeart />,
        children: [],
      },
      {
        key: BookType.NewFriend,
        label: BookType.NewFriend,
        itemType: GroupMenuType.Books,
        icon: <im.ImUserPlus />,
        children: [],
      },
      {
        key: BookType.Friend,
        label: BookType.Friend,
        itemType: GroupMenuType.Books,
        icon: <im.ImUser />,
        children: [],
      },
      {
        key: BookType.UserCohort,
        label: BookType.UserCohort,
        itemType: GroupMenuType.Books,
        icon: <im.ImUsers />,
        children: cohorts.map((a) => {
          return {
            children: [],
            key: a.id,
            label: a.name,
            item: a,
            itemType: GroupMenuType.Books,
            icon: <TeamIcon share={a.shareInfo} size={18} fontSize={16} />,
          };
        }),
      },
      ...companyItems,
    ],
  };
};

/** 加载分组菜单 */
export const loadGroupMenus = async (param: groupMenuParams) => {
  return {
    key: param.item.id + param.key,
    label: param.key,
    itemType: GroupMenuType.Books,
    icon: (
      <TeamIcon
        share={{
          name: param.key,
          typeName: param.typeName,
        }}
        size={18}
        fontSize={16}
        notAvatar={true}
      />
    ),
    item: param.item,
    children: await buildTargetTree(param.subTeam),
  };
};

/** 加载右侧菜单 */
export const loadChatMenus = (_: IChat) => {
  const items = [
    {
      key: '进入会话',
      icon: <im.ImPlus />,
      label: '进入会话',
    },
  ];
  return items;
};

export const loadChatMenu = () => {
  let children = chatCtrl.chats.map((a) => {
    return {
      key: a.chatId,
      label: a.target.name,
      display: <ChatItem current={a} />,
      itemType: GroupMenuType.Chat,
      item: a,
      children: [],
      icon: <TeamIcon share={a.shareInfo} size={16} fontSize={16} />,
    };
  });
  return {
    key: '会话',
    label: '会话',
    itemType: '会话',
    icon: <im.ImTree />,
    children: children,
  };
};
