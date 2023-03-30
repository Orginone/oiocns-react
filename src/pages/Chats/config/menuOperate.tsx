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
    result.push({
      key: item.key,
      item: {
        source: item,
        chat: chatCtrl.findTargetChat(
          item.target,
          spaceId,
          spaceName,
          item.typeName + '群',
        ),
      },
      menus: loadChatMenus(undefined),
      label: item.teamName,
      tag: [spaceName, item.typeName],
      itemType: GroupMenuType.Books + '-' + item.typeName,
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: await buildTargetTree(item.subTeam, spaceId, spaceName),
    });
  }
  return result;
};

export const buildAuthorityTree = (authority: IAuthority) => {
  const result: MenuItemType = {
    key: authority.id,
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
    children: authority.children?.map((i) => buildAuthorityTree(i)) ?? [],
  };
  return result;
};

export const loadBookMenu = async () => {
  const cohorts = await userCtrl.user.getCohorts(false);
  let companys = await userCtrl.user.getJoinedCompanys(false);
  let authors = await userCtrl.space.loadSpaceAuthorityTree();
  let authorMenus = authors ? [buildAuthorityTree(authors)] : [];
  let cohortInfos: any[] = [];
  for (const item of cohorts) {
    let spaceId = setting.user.id;
    let spaceName = '我的';
    if (item.target.belongId != spaceId) {
      let share = setting.findTeamInfoById(item.target.belongId);
      if (share) {
        if (share.typeName != TargetType.Person) {
          spaceId = item.target.belongId;
          spaceName = share.name;
        }
      } else {
        const res = await item.queryBelong();
        if (res && res.typeName != TargetType.Person) {
          spaceId = item.target.belongId;
          spaceName = res.team?.name || res.name;
        }
      }
    }
    cohortInfos.push({
      cohort: item,
      spaceId: spaceId,
      spaceName: spaceName,
    });
  }
  let companyItems = [];
  for (const company of companys) {
    companyItems.push({
      key: company.id,
      label: company.name,
      item: {
        source: company,
        chat: chatCtrl.findTargetChat(
          company.target,
          company.id,
          company.teamName,
          '单位群',
        ),
      },
      tag: [company.typeName],
      menus: loadChatMenus(undefined),
      itemType: GroupMenuType.Books + '-' + company.typeName,
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.id + BookType.Innner,
          label: BookType.Innner,
          item: company,
          itemType: BookType.Innner,
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
      ],
    });
  }
  return [
    {
      key: BookType.Friend,
      label: BookType.Friend,
      itemType: GroupMenuType.Books + '-' + TargetType.Person,
      icon: <im.ImUser />,
      children: [],
      item: {
        source: setting.user,
        chat: chatCtrl.findTargetChat(
          setting.user.target,
          setting.user.id,
          '我的',
          '好友',
        ),
      },
    },
    {
      key: BookType.Cohort,
      label: BookType.Cohort,
      itemType: GroupMenuType.Books,
      icon: <im.ImUsers />,
      children: cohortInfos.map((a) => {
        return {
          children: [],
          key: a.cohort.id,
          label: a.cohort.name,
          item: {
            source: a.cohort,
            chat: chatCtrl.findTargetChat(
              a.cohort.target,
              a.spaceId,
              a.spaceName,
              a.cohort.target.typeName,
            ),
          },
          menus: loadChatMenus(undefined),
          itemType: GroupMenuType.Books + '-' + a.cohort.typeName,
          icon: <TeamIcon share={a.cohort.shareInfo} size={18} fontSize={16} />,
        };
      }),
    },
    ...authorMenus,
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
        model: 'inside',
      });
    } else {
      items.push({
        key: '置顶会话',
        label: '置顶会话',
        icon: <im.ImUpload3 />,
        model: 'inside',
      });
    }
    if ((chat?.messages?.length ?? 0) > 0) {
      items.push({
        key: '清空消息',
        label: '清空消息',
        icon: <im.ImBin />,
        model: 'inside',
      });
    }
    items.push({
      key: '删除会话',
      label: '删除会话',
      icon: <im.ImBin2 />,
      model: 'inside',
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
      groups.spaces.push({
        label: item.spaceName,
        key: item.spaceId + '-' + item.spaceName,
      });
    }
  });
  return groups.spaces.map((item) => {
    const chats = chatCtrl.chats.filter((i) => i.spaceName === item.label);
    let noReadCount = 0;
    for (const i of chats) {
      noReadCount += i.noReadCount;
    }
    var children: MenuItemType[] = chats.map((a) => {
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
    });
    const sortNumber = (c: IChat) => {
      let sum = 0;
      if (c.isToping) {
        sum += 10;
      }
      if (c.lastMessage) {
        sum += 2;
      }
      return sum;
    };
    return {
      key: item.key,
      label: item.label,
      item: null,
      itemType: '空间',
      count: noReadCount,
      tag: ['空间'],
      icon: <im.ImUsers />,
      menus: [],
      children: children.sort((a, b) => {
        const num = sortNumber(b.item) - sortNumber(a.item);
        if (num === 0) {
          const atime = new Date(a.item.lastMessage?.createTime || a.item.target.msgTime);
          const btime = new Date(b.item.lastMessage?.createTime || b.item.target.msgTime);
          return btime > atime ? 1 : -1;
        }
        return num;
      }),
    };
  });
};
