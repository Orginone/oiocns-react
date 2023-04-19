import React from 'react';
import { Avatar } from 'antd';
import * as im from 'react-icons/im';
import { ISpace, ISpeciesItem, ITodoGroup, TargetType, WorkType } from '@/ts/core';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { ToTopOutlined } from '@ant-design/icons';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';

export const getCommonSpeciesMenus = () => {
  return {
    key: '我的常用',
    label: '我的常用',
    itemType: '我的常用',
    icon: <im.ImHeart />,
    children: todoCtrl.caches || [],
  };
};

export const loadPlatformApplyMenu = async () => {
  return [
    {
      key: WorkType.OrgApply,
      label: '组织',
      itemType: WorkType.OrgApply,
      icon: <im.ImTree />,
      children: [
        {
          key: WorkType.FriendApply,
          label: '加好友',
          itemType: WorkType.FriendApply,
          icon: <im.ImTree />,
          children: [],
        },
        {
          key: WorkType.CohortApply,
          label: '加群组',
          itemType: WorkType.CohortApply,
          icon: <im.ImTree />,
          children: [],
        },
        {
          key: WorkType.CompanyApply,
          label: '加单位',
          itemType: WorkType.CompanyApply,
          icon: <im.ImTree />,
          children: [],
        },
        {
          key: WorkType.GroupApply,
          label: '加集团',
          itemType: WorkType.GroupApply,
          icon: <im.ImTree />,
          children: [],
        },
      ],
    },
    {
      key: WorkType.StoreApply,
      label: '商店',
      itemType: WorkType.StoreApply,
      icon: <im.ImCart />,
      children: [
        {
          key: WorkType.PublishApply,
          label: '上架',
          itemType: WorkType.PublishApply,
          icon: <ToTopOutlined />,
          item: todoCtrl.PublishApply,
          children: [],
        },
        {
          key: WorkType.JoinStoreApply,
          label: '加入',
          itemType: WorkType.JoinStoreApply,
          icon: <im.ImBarcode />,
          item: todoCtrl.MarketApply,
          children: [],
        },
      ],
    },
    {
      key: WorkType.OrderApply,
      label: '订单',
      item: todoCtrl.OrderTodo,
      itemType: WorkType.OrderApply,
      icon: <im.ImBarcode />,
      children: [],
    },
  ];
};

const loadChildren = async (targetId: string, todoGroups: ITodoGroup[]) => {
  let sum = 0;
  let children = [];
  for (const todoGroup of todoGroups) {
    const icon = todoGroup.icon ? (
      <Avatar size={18} src={todoGroup.icon} />
    ) : (
      <im.ImOffice />
    );
    let count = todoGroup.id ? await todoGroup.getCount() : 0;
    children.push({
      icon: icon,
      key: todoGroup.name + todoGroup.type + targetId,
      label: todoGroup.name,
      itemType: todoGroup.type,
      item: todoGroup,
      count: count,
      children: [],
    });
    sum += count;
  }
  return {
    children: children,
    count: sum,
  };
};

export const getUserMenu = async (user: ISpace) => {
  let children: MenuItemType[] = [];
  children.push(
    ...(await getOrgMenu(user)),
    await getStoreMenu(user),
    await getOrderMenu(user),
  );
  const root = await user.loadSpeciesTree();
  for (const item of root) {
    if (item.target.code === 'matters') {
      children.push(...(await buildSpeciesTree(user.id, [item], 'work')));
    }
  }
  return {
    key: user.target.id,
    item: user.target,
    label: user.teamName,
    itemType: user.target.typeName,
    menus: [],
    icon: <TeamIcon share={user.shareInfo} size={18} fontSize={16} />,
    children: children,
  };
};

const getStoreMenu = async (user: ISpace) => {
  let PublishTodo = await loadChildren(user.id, todoCtrl.PublishTodo);
  let MarketTodo = await loadChildren(user.id, todoCtrl.MarketTodo);
  return {
    key: WorkType.StoreTodo,
    label: '商店',
    itemType: WorkType.StoreTodo,
    icon: <im.ImCart />,
    children: [
      {
        key: WorkType.PublishTodo,
        label: '上架',
        itemType: WorkType.PublishTodo,
        icon: <ToTopOutlined />,
        ...PublishTodo,
      },
      {
        key: WorkType.JoinStoreTodo,
        label: '加入',
        itemType: WorkType.JoinStoreTodo,
        icon: <im.ImBarcode />,
        ...MarketTodo,
      },
    ],
    count: PublishTodo.count + MarketTodo.count,
  };
};

const getOrderMenu = async (user: ISpace) => {
  return {
    children: [],
    key: WorkType.OrderTodo + user.id,
    label: '订单',
    itemType: WorkType.OrderTodo,
    item: todoCtrl.OrderTodo,
    count: await todoCtrl.OrderTodo?.getCount(),
    icon: <im.ImBarcode />,
  };
};

const getOrgMenu = async (user: ISpace) => {
  let menus: MenuItemType[] = [];
  if (user.typeName == TargetType.Person) {
    let friendTodo = await loadChildren(user.id, todoCtrl.FriendTodo);
    menus.push(...friendTodo.children, {
      key: '单位待办',
      label: '单位',
      itemType: WorkType.OrgTodo,
      icon: <im.ImTree />,
      children: [],
    });
  } else {
    menus.push({
      key: '集团待办' + user.id,
      label: '集团',
      itemType: WorkType.OrgTodo,
      icon: <im.ImTree />,
      ...(await loadChildren(user.id, todoCtrl.GroupTodo)),
    });
  }
  menus.push({
    key: '群组待办' + user.id,
    label: '群组',
    itemType: WorkType.OrgTodo,
    icon: <im.ImTree />,
    ...(await loadChildren(user.id, todoCtrl.CohortTodo)),
  });
  return menus;
};

/** 编译分类树 */
const buildSpeciesTree = async (
  prefix: string,
  species: ISpeciesItem[],
  itemType: string,
): Promise<MenuItemType[]> => {
  var result: MenuItemType[] = [];
  for (let item of species) {
    result.push({
      key: prefix + item.id,
      item: item,
      label: item.name,
      icon: <im.ImNewspaper />,
      itemType: itemType,
      children: await buildSpeciesTree(prefix, item.children, itemType),
    });
  }
  return result;
};
