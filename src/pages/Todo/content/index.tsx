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
  switch (selectMenu.itemType) {
    case GroupMenuType.Friend:
    case GroupMenuType.Organization:
      let orgkeys = selectMenu.key.split('-');
      return orgkeys.length > 1 ? (
        <CommonTodo
          title={selectMenu.itemType + '-' + orgkeys[1]}
          typeName={orgkeys[1]}
          todoGroup={selectMenu.item as ITodoGroup}
          columns={OrgColumns}
        />
      ) : (
        <></>
      );
    case GroupMenuType.JoinStore:
      let marketKey = selectMenu.key.split('-');
      return marketKey.length > 1 ? (
        <CommonTodo
          title={`商店加入审核-` + marketKey[1]}
          typeName={marketKey[1]}
          todoGroup={selectMenu.item as ITodoGroup}
          columns={MarketColumns}
        />
      ) : (
        <></>
      );
    case GroupMenuType.Publish:
      let merchandiseKey = selectMenu.key.split('-');
      return merchandiseKey.length > 1 ? (
        <CommonTodo
          title={`应用上架审批-` + merchandiseKey[1]}
          typeName={merchandiseKey[1]}
          todoGroup={selectMenu.item as ITodoGroup}
          columns={MerchandiseColumns}
        />
      ) : (
        <></>
      );
    case GroupMenuType.Order:
      return (
        <OrderTodo typeName={selectMenu.key} todoGroup={selectMenu.item as ITodoGroup} />
      );
    case GroupMenuType.Application:
      let appKey = selectMenu.key.split('-');
      return appKey.length > 1 ? (
        <AppTodo typeName={appKey[1]} todoGroup={selectMenu.item as ITodoGroup} />
      ) : (
        <></>
      );
    default:
      return <></>;
  }
};

export default TypeSetting;
