import { MenuItemType } from 'typings/globelType';
import React from 'react';
import { IApplyItem, IApprovalItem, loadOrgApply, WorkType } from '@/ts/core';
import { MarketColumns, MerchandiseColumns, OrgColumns } from '../config/columns';
import CommonTodo from './Common/Todo';
import CommonApply from './Common/Apply';
import SellOrder from './Common/Order/Sell';
import Work from './Work';
import { ProColumns } from '@ant-design/pro-components';
import BuyOrder from './Common/Order/Buy';
import userCtrl from '@/ts/controller/setting';
import WorkTodo from './WorkTodo';

interface IProps {
  reflashMenu: () => void;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ selectMenu, reflashMenu }: IProps) => {
  switch (selectMenu.itemType) {
    case WorkType.FriendTodo:
    case WorkType.CompanyTodo:
    case WorkType.CohortTodo:
    case WorkType.GroupTodo:
      return (
        <CommonTodo
          todoGroup={selectMenu.item}
          columns={OrgColumns as ProColumns<IApprovalItem>[]}
          reflashMenu={reflashMenu}
          tabList={[
            { key: 'todo', tab: '待办' },
            { key: 'complete', tab: '已办' },
          ]}
        />
      );
    case WorkType.JoinStoreTodo:
      return (
        <CommonTodo
          todoGroup={selectMenu.item}
          tabList={[
            { key: 'todo', tab: '待办' },
            { key: 'complete', tab: '已办' },
          ]}
          columns={MarketColumns as ProColumns<IApprovalItem>[]}
          reflashMenu={reflashMenu}
        />
      );
    case WorkType.PublishTodo:
      return (
        <CommonTodo
          todoGroup={selectMenu.item}
          tabList={[
            { key: 'todo', tab: '待办' },
            { key: 'complete', tab: '已办' },
          ]}
          columns={MerchandiseColumns as ProColumns<IApprovalItem>[]}
          reflashMenu={reflashMenu}
        />
      );
    case WorkType.OrderTodo:
      return <SellOrder typeName={selectMenu.key} todoGroup={selectMenu.item} />;
    case WorkType.FriendApply:
    case WorkType.CohortApply:
    case WorkType.CompanyApply:
    case WorkType.GroupApply:
      return (
        <CommonApply
          menu={selectMenu}
          todoGroup={loadOrgApply(userCtrl.space, selectMenu.itemType as WorkType)}
          columns={OrgColumns as ProColumns<IApplyItem>[]}
          reflashMenu={reflashMenu}
        />
      );
    case WorkType.JoinStoreApply:
      return (
        <CommonApply
          menu={selectMenu}
          columns={MarketColumns as ProColumns<IApplyItem>[]}
          reflashMenu={reflashMenu}
        />
      );
    case WorkType.PublishApply:
      return (
        <CommonApply
          menu={selectMenu}
          columns={MerchandiseColumns as ProColumns<IApplyItem>[]}
          reflashMenu={reflashMenu}
        />
      );
    case WorkType.OrderApply:
      return <BuyOrder typeName={selectMenu.key} todoGroup={selectMenu.item} />;
    case WorkType.WorkItem:
      return <Work selectMenu={selectMenu} />;
    case WorkType.WorkTodo:
      return <WorkTodo selectMenu={selectMenu} reflashMenu={reflashMenu} />;
    default:
      return <></>;
  }
};

export default TypeSetting;
