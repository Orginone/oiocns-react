import { MenuItemType } from 'typings/globelType';
import { GroupMenuType } from '../config/menuType';
import React from 'react';
import { ITodoGroup } from '@/ts/core';
import { MarketColumns, MerchandiseColumns, OrgColumns } from '../config/columns';
import CommonTodo from './Common';
import OrderTodo from './Order';
import AppTodo from './App';
import Work from './Work';
import { XOperation } from '@/ts/base/schema';

interface IProps {
  reflashMenu: () => void;
  selectMenu: MenuItemType;
  operations: XOperation[];
}

const TypeSetting = ({ selectMenu, reflashMenu, operations }: IProps) => {
  if (operations.length <= 0) {
    let todoGroup = selectMenu.item as ITodoGroup;
    if (todoGroup) {
      switch (selectMenu.itemType) {
        case GroupMenuType.Friend:
        case GroupMenuType.Organization:
          return (
            <CommonTodo
              todoGroup={todoGroup}
              columns={OrgColumns}
              reflashMenu={reflashMenu}
              tabList={[
                { key: 'todo', tab: '我的待办' },
                { key: 'complete', tab: '我的已办' },
                { key: 'apply', tab: '我的申请' },
              ]}
            />
          );
        case GroupMenuType.JoinStore:
          // eslint-disable-next-line no-case-declarations
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
            <CommonTodo
              todoGroup={todoGroup}
              tabList={tabList}
              columns={MarketColumns}
              reflashMenu={reflashMenu}
            />
          );
        case GroupMenuType.Publish:
          // eslint-disable-next-line no-case-declarations
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
              reflashMenu={reflashMenu}
            />
          );
        case GroupMenuType.Order:
          return (
            <OrderTodo
              typeName={selectMenu.key}
              todoGroup={todoGroup}
              reflashMenu={reflashMenu}
            />
          );
        case GroupMenuType.Application:
          return (
            <AppTodo
              typeName={selectMenu.key}
              todoGroup={todoGroup}
              reflashMenu={reflashMenu}
            />
          );
        default:
          return <></>;
      }
    }
  } else {
    return <Work key={'work'} operations={operations}></Work>;
  }
  return <></>;
};

export default TypeSetting;
