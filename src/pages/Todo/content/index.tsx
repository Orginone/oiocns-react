import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import React from 'react';
import { ITodoGroup } from '@/ts/core';
import { MarketColumns, MerchandiseColumns, OrgColumns } from '../config/columns';
import CommonTodo from './Common';
import OrderTodo from './Order';
import AppTodo from './App';

interface IProps {
  selectMenu: MenuItemType;
}

const TypeSetting = ({ selectMenu }: IProps) => {
  let todoGroup = selectMenu.item as ITodoGroup;
  if (todoGroup) {
    switch (selectMenu.itemType) {
      case GroupMenuType.Friend:
      case GroupMenuType.Organization:
        return (
          <CommonTodo
            todoGroup={todoGroup}
            columns={OrgColumns}
            tabList={[
              { key: 'todo', tab: '我的待办' },
              { key: 'complete', tab: '我的已办' },
              { key: 'apply', tab: '我的申请' },
            ]}
          />
        );
      case GroupMenuType.JoinStore:
        let tabList = [];
        if (todoGroup.id) {
          tabList = [
            { key: 'todo', tab: '我的待办' },
            { key: 'complete', tab: '我的已办' },
          ];
        } else {
          tabList = [{ key: 'apply', tab: '我的申请' }];
        }
        return (
          <CommonTodo todoGroup={todoGroup} tabList={tabList} columns={MarketColumns} />
        );
      case GroupMenuType.Publish:
        let publishTabList = [];
        if (todoGroup.id) {
          publishTabList = [
            { key: 'todo', tab: '我的待办' },
            { key: 'complete', tab: '我的已办' },
          ];
        } else {
          publishTabList = [{ key: 'apply', tab: '我的申请' }];
        }
        return (
          <CommonTodo
            todoGroup={todoGroup}
            tabList={publishTabList}
            columns={MerchandiseColumns}
          />
        );
      case GroupMenuType.Order:
        return <OrderTodo typeName={selectMenu.key} todoGroup={todoGroup} />;
      case GroupMenuType.Application:
        return <AppTodo typeName={selectMenu.key} todoGroup={todoGroup} />;
      default:
        return <></>;
    }
  }
  return <></>;
};

export default TypeSetting;
