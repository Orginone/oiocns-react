import React from 'react';
import * as im from 'react-icons/im';
import userCtrl from '@/ts/controller/setting/';
import { GroupMenuType } from './menuType';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import {
  AppstoreAddOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FileSyncOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import { ITodoGroup } from '@/ts/core';

export const loadPlatformMenu = () => {
  return [
    {
      key: '组织审批',
      label: '组织审批',
      itemType: '组织审批',
      item: userCtrl.space,
      icon: <im.ImTree />,
      children: loadOrgChildren(todoCtrl.OrgTodo, '组织审批'),
    },
    {
      children: [
        {
          key: '上架审批',
          label: '上架审批',
          itemType: GroupMenuType.Publish,
          item: userCtrl.space,
          icon: <ToTopOutlined />,
          children:
            todoCtrl.PublishTodo.length > 0
              ? loadMarketChildren(todoCtrl.PublishTodo, GroupMenuType.Publish)
              : [],
        },
        {
          key: '加入审批',
          label: '加入审批',
          itemType: GroupMenuType.JoinStore,
          item: userCtrl.space,
          icon: <im.ImBarcode />,
          children:
            todoCtrl.MarketTodo.length > 0
              ? loadMarketChildren(todoCtrl.MarketTodo, GroupMenuType.JoinStore)
              : [],
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
          key: '销售订单-待办',
          label: '销售订单',
          itemType: GroupMenuType.Order,
          item: userCtrl.space,
          icon: <im.Im500Px />,
        },
        {
          children: [],
          key: '采购订单-申请',
          label: '采购订单',
          itemType: GroupMenuType.Order,
          item: userCtrl.space,
          icon: <im.ImBarcode />,
        },
      ],
      key: '订单管理',
      label: '订单管理',
      itemType: GroupMenuType.Order,
      item: userCtrl.space,
      icon: <im.ImBarcode />,
    },
  ];
};

export const loadApplicationMenu = () => {
  let children = [];
  for (var todo of todoCtrl.AppTodo) {
    children.push({
      key: todo.id!,
      label: todo.displayName,
      itemType: GroupMenuType.Application,
      icon: <im.ImSteam />,
      item: todo,
      children: loadTodoItem(todo.id!, todo, GroupMenuType.Application),
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
        label: a.displayName,
        itemType: typeName,
        icon: <FileSyncOutlined />,
        item: a,
        children: a.id
          ? [
              {
                key: typeName + a.id + '-待办',
                label: '待办',
                itemType: typeName,
                icon: <FileSyncOutlined />,
                item: a,
                children: [],
              },
              {
                key: typeName + a.id + '-已办',
                label: '已办',
                itemType: typeName,
                icon: <FileDoneOutlined />,
                item: a,
                children: [],
              },
            ]
          : [],
      };
    }
  });
};

const loadOrgChildren = (todoGroups: ITodoGroup[], typeName: string) => {
  return todoGroups.map((a) => {
    {
      const icon = a.icon ? <Avatar size={18} src={a.icon} /> : <im.ImOffice />;
      const groupType =
        a.id === userCtrl.user.id ? GroupMenuType.Friend : GroupMenuType.Organization;
      let count = 0;
      a.getCount().then((a) => {
        count = a;
      });
      return {
        key: typeName + a.id,
        label: a.displayName,
        itemType: groupType,
        icon: icon,
        item: a,
        children: [
          {
            key: typeName + a.id + '-申请',
            label: '我的申请',
            itemType: groupType,
            icon: <FileAddOutlined />,
            item: a,
            children: [],
          },
          {
            key: typeName + a.id + '-待办',
            label: '待办',
            itemType: groupType,
            icon: <FileSyncOutlined />,
            item: a,
            count: count,
            children: [],
          },
          {
            key: typeName + a.id + '-已办',
            label: '已办',
            itemType: groupType,
            icon: <FileDoneOutlined />,
            item: a,
            children: [],
          },
        ],
      };
    }
  });
};

const loadTodoItem = (key: string, todoGroup: ITodoGroup, typeName?: string) => {
  typeName = typeName || key;
  let count = 0;
  todoGroup.getCount().then((a) => {
    count = a;
  });
  let children: any = [];
  children.push({
    key: key + '-待办',
    label: '待办',
    itemType: typeName,
    icon: <FileSyncOutlined />,
    count: count,
    item: todoGroup,
    children: [],
  });
  if (typeName == GroupMenuType.Application) {
    children.push({
      key: key + '-抄送',
      label: '抄送',
      itemType: typeName,
      icon: <FileSyncOutlined />,
      item: todoGroup,
      children: [],
    });
  }
  children.push({
    key: key + '-已办',
    label: '已办',
    itemType: typeName,
    icon: <FileDoneOutlined />,
    item: todoGroup,
    children: [],
  });
  children.push({
    key: key + '-申请',
    label: '我的申请',
    itemType: typeName,
    icon: <FileAddOutlined />,
    item: todoGroup,
    children: [],
  });
  return children;
};
