import React from 'react';
import { Avatar } from 'antd';
import * as im from 'react-icons/im';
import { ITodoGroup } from '@/ts/core';
import userCtrl from '@/ts/controller/setting/';
import { GroupMenuType } from './menuType';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { AppstoreAddOutlined, FileSyncOutlined, ToTopOutlined } from '@ant-design/icons';

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

export const loadApplicationMenu = async () => {
  let sum = 0;
  let children = [];
  for (var todo of todoCtrl.AppTodo) {
    let count = await todo.getCount();
    children.push({
      key: todo.id!,
      label: todo.name,
      itemType: GroupMenuType.Application,
      icon: <im.ImSteam />,
      item: todo,
      count: count,
      children: [],
    });
    sum += count;
  }
  return {
    key: GroupMenuType.Application,
    label: GroupMenuType.Application,
    itemType: GroupMenuType.Application,
    icon: <AppstoreAddOutlined />,
    children: children,
    count: sum,
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
