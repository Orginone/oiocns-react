import React from 'react';
import { Avatar } from 'antd';
import * as im from 'react-icons/im';
import { ISpeciesItem, ITodoGroup } from '@/ts/core';
import userCtrl from '@/ts/controller/setting/';
import { GroupMenuType } from './menuType';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { FileSyncOutlined, ToTopOutlined } from '@ant-design/icons';
import { MenuItemType } from 'typings/globelType';

export const loadPlatformMenu = async () => {
  return [
    {
      key: '组织审批',
      label: '组织审批',
      itemType: '组织审批',
      icon: <im.ImTree />,
      ...(await loadOrgChildren(todoCtrl.OrgTodo)),
    },
    {
      key: '商店审批',
      label: '商店审批',
      itemType: '商店审批',
      icon: <im.ImCart />,
      ...(await loadMarket()),
    },
    {
      children: [
        {
          children: [],
          key: '销售订单',
          label: '销售订单',
          itemType: GroupMenuType.Order,
          item: todoCtrl.OrderTodo,
          count: await todoCtrl.OrderTodo?.getCount(),
          icon: <im.Im500Px />,
        },
        {
          children: [],
          key: '采购订单',
          label: '采购订单',
          itemType: GroupMenuType.Order,
          item: todoCtrl.OrderTodo,
          icon: <im.ImBarcode />,
        },
      ],
      key: '订单管理',
      label: '订单管理',
      itemType: GroupMenuType.Order,
      item: todoCtrl.OrderTodo,
      count: await todoCtrl.OrderTodo?.getCount(),
      icon: <im.ImBarcode />,
    },
  ];
};

/** 获取事菜单 */
export const loadThingMenus = async (isWork: boolean = false) => {
  const root = await userCtrl.space.loadSpeciesTree();
  const species = root?.children?.find((item) => item.name == '事') || null;
  return species
    ? await buildSpeciesTree(species, '事', isWork)
    : {
        children: [],
        key: '事',
        label: '事',
        itemType: '事',
        item: species,
        icon: <im.ImNewspaper />,
      };
};

const loadMarket = async () => {
  let sum = 0;
  let children = [
    {
      key: '上架审批',
      label: '上架审批',
      itemType: GroupMenuType.Publish,
      icon: <ToTopOutlined />,
      ...(await loadChildren(todoCtrl.PublishTodo, GroupMenuType.Publish)),
    },
    {
      key: '加入审批',
      label: '加入审批',
      itemType: GroupMenuType.JoinStore,
      icon: <im.ImBarcode />,
      ...(await loadChildren(todoCtrl.MarketTodo, GroupMenuType.JoinStore)),
    },
  ];
  children.forEach((a) => (sum += a.count));
  return {
    children: children,
    count: sum,
  };
};

const loadChildren = async (todoGroups: ITodoGroup[], typeName: string) => {
  let sum = 0;
  let children = [];
  for (const todoGroup of todoGroups) {
    let count = todoGroup.id ? await todoGroup.getCount() : 0;
    let key = todoGroup.id ? todoGroup.id : '-申请';
    children.push({
      key: typeName + key,
      label: todoGroup.name,
      itemType: typeName,
      icon: <FileSyncOutlined />,
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

const loadOrgChildren = async (todoGroups: ITodoGroup[]) => {
  let sum = 0;
  let children = [];
  for (const todoGroup of todoGroups) {
    const icon = todoGroup.icon ? (
      <Avatar size={18} src={todoGroup.icon} />
    ) : (
      <im.ImOffice />
    );
    const menuType =
      todoGroup.id == userCtrl.user.id
        ? GroupMenuType.Friend
        : GroupMenuType.Organization;
    let count = await todoGroup.getCount();
    children.push({
      key: todoGroup.id!,
      label: todoGroup.name,
      itemType: menuType,
      icon: icon,
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
  species: ISpeciesItem,
  itemType: string,
  isWork: boolean,
): Promise<MenuItemType> => {
  let children: MenuItemType[] = [];
  species.children.forEach(async (a) => {
    children.push(await buildSpeciesTree(a, itemType, isWork));
  });
  const result: MenuItemType = {
    key: species.id,
    item: species,
    label: species.name,
    icon: <im.ImNewspaper />,
    itemType: itemType,
    menus: [],
    children: children,
  };
  const res = await species.loadOperations(userCtrl.space.id, true, true, {
    offset: 0,
    limit: 1000,
    filter: '',
  });
  res.result?.forEach((a) => {
    result.children.push({
      key: a.id,
      item: a,
      label: a.name,
      icon: <im.ImNewspaper />,
      itemType: itemType,
      menuType: isWork ? 'checkbox' : undefined,
      menus: [],
      children: [],
    });
  });
  return result;
};
