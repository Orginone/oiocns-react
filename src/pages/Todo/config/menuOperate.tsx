import React from 'react';
import { Avatar } from 'antd';
import * as im from 'react-icons/im';
import { ISpeciesItem, ITodoGroup, WorkType } from '@/ts/core';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import thingCtrl from '@/ts/controller/thing';
import { ToTopOutlined } from '@ant-design/icons';
import { MenuItemType } from 'typings/globelType';

export const loadPlatformTodoMenu = async () => {
  let friendTodo = await loadChildren(todoCtrl.FriendTodo);
  let cohortTodo = await loadChildren(todoCtrl.CohortTodo);
  let companyTodo = await loadChildren(todoCtrl.CompanyTodo);
  let groupTodo = await loadChildren(todoCtrl.GroupTodo);

  let PublishTodo = await loadChildren(todoCtrl.PublishTodo);
  let MarketTodo = await loadChildren(todoCtrl.MarketTodo);
  return [
    {
      key: WorkType.OrgTodo,
      label: '组织',
      itemType: WorkType.OrgTodo,
      icon: <im.ImTree />,
      children: [
        ...friendTodo.children,
        {
          key: '群组待办',
          label: '群组',
          itemType: WorkType.OrgTodo,
          icon: <im.ImTree />,
          ...cohortTodo,
        },
        {
          key: '单位待办',
          label: '单位',
          itemType: WorkType.OrgTodo,
          icon: <im.ImTree />,
          ...companyTodo,
        },
        {
          key: '集团待办',
          label: '集团',
          itemType: WorkType.OrgTodo,
          icon: <im.ImTree />,
          ...groupTodo,
        },
      ],
      count: friendTodo.count + companyTodo.count + cohortTodo.count + groupTodo.count,
    },
    {
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
    },
    {
      children: [],
      key: WorkType.OrderTodo,
      label: '订单',
      itemType: WorkType.OrderTodo,
      item: todoCtrl.OrderTodo,
      count: await todoCtrl.OrderTodo?.getCount(),
      icon: <im.ImBarcode />,
    },
  ];
};

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

/** 获取事菜单 */
export const loadThingMenus = async (prefix: string, isWork: boolean = false) => {
  const root = await thingCtrl.loadSpeciesTree();
  for (const item of root!.children) {
    if (item.target.code === 'matters') {
      return await buildSpeciesTree(item.children, prefix + '事', isWork);
    }
  }
  return [];
};

const loadChildren = async (todoGroups: ITodoGroup[]) => {
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
      key: todoGroup.name + todoGroup.type,
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

/** 编译分类树 */
const buildSpeciesTree = async (
  species: ISpeciesItem[],
  itemType: string,
  isWork: boolean,
): Promise<MenuItemType[]> => {
  var result: MenuItemType[] = [];
  for (let item of species) {
    result.push({
      key: itemType + item.id,
      item: item,
      label: item.name,
      icon: <im.ImNewspaper />,
      itemType: itemType,
      menuType: isWork ? 'checkbox' : undefined,
      children: await buildSpeciesTree(item.children, itemType, isWork),
    });
  }
  return result;
};
