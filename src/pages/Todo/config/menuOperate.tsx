import React from 'react';
import { Avatar } from 'antd';
import * as im from 'react-icons/im';
import { ITodoGroup } from '@/ts/core';
import userCtrl from '@/ts/controller/setting/';
import { GroupMenuType } from './menuType';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { AppstoreAddOutlined, FileSyncOutlined, ToTopOutlined } from '@ant-design/icons';

export const loadPlatformMenu = () => {
  return [
    {
      key: '组织审批',
      label: '组织审批',
      itemType: '组织审批',
      item: userCtrl.space,
      icon: <im.ImTree />,
      children: loadOrgChildren(todoCtrl.OrgTodo),
    },
    {
      children: [
        {
          key: '上架审批',
          label: '上架审批',
          itemType: GroupMenuType.Publish,
          item: userCtrl.space,
          icon: <ToTopOutlined />,
          children: loadMarketChildren(todoCtrl.PublishTodo, GroupMenuType.Publish),
        },
        {
          key: '加入审批',
          label: '加入审批',
          itemType: GroupMenuType.JoinStore,
          item: userCtrl.space,
          icon: <im.ImBarcode />,
          children: loadMarketChildren(todoCtrl.MarketTodo, GroupMenuType.JoinStore),
        },
      ],
      key: '商店审批',
      label: '商店审批',
      itemType: '商店审批',
      item: userCtrl.space,
      icon: <im.ImCart />,
    },
    {
      children: [
        {
          children: [],
          key: '销售订单',
          label: '销售订单',
          itemType: GroupMenuType.Order,
          item: todoCtrl.OrderTodo,
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
      icon: <im.ImBarcode />,
    },
  ];
};

export const loadApplicationMenu = () => {
  let children = [];
  for (var todo of todoCtrl.AppTodo) {
    children.push({
      key: todo.id!,
      label: todo.name,
      itemType: GroupMenuType.Application,
      icon: <im.ImSteam />,
      item: todo,
      children: [],
    });
  }
  return {
    key: GroupMenuType.Application,
    label: GroupMenuType.Application,
    itemType: GroupMenuType.Application,
    icon: <AppstoreAddOutlined />,
    item: userCtrl.space,
    children: children,
  };
};

const loadMarketChildren = (todoGroups: ITodoGroup[], typeName: string) => {
  return todoGroups.map((a) => {
    {
      let key = a.id ? a.id : '-申请';
      return {
        key: typeName + key,
        label: a.name,
        itemType: typeName,
        icon: <FileSyncOutlined />,
        item: a,
        children: [],
      };
    }
  });
};

const loadOrgChildren = (todoGroups: ITodoGroup[]) => {
  return todoGroups.map((a) => {
    {
      const icon = a.icon ? <Avatar size={18} src={a.icon} /> : <im.ImOffice />;
      return {
        key: a.id,
        label: a.name,
        itemType:
          a.id == userCtrl.user.id ? GroupMenuType.Friend : GroupMenuType.Organization,
        icon: icon,
        item: a,
        children: [],
      };
    }
  });
};
