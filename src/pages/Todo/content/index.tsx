import { MenuItemType } from 'typings/globelType';
import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '@/pages/Todo/config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { workNotify } from '@/ts/core/target/work/work';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import ITodo from '@/ts/core/target/work/todo';
import CardOrTableComp from '@/components/CardOrTableComp';
import { PageRequest } from '@/ts/base/model';
import { CommonStatus, ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Space } from 'antd';
import { WorkColumns } from '../config/columns';
import { dataType } from '@/pages/Setting/content/Standard/Flow/Design/Chart/FlowDrawer/processType';

interface IProps {
  selectMenu: MenuItemType;
}

const TypeSetting = ({ selectMenu }: IProps) => {
  const [workKey] = useCtrlUpdate(workNotify);
  const [selectedRows, setSelectRows] = useState<ITodo[]>([]);

  const operation = (
    <Space>
      <Button
        type="link"
        onClick={async () => {
          orgCtrl.user.work.approvals(
            selectedRows,
            CommonStatus.ApproveStartStatus,
            '',
            '',
          );
        }}>
        同意
      </Button>
      <Button
        type="link"
        onClick={async () => {
          orgCtrl.user.work.approvals(
            selectedRows,
            CommonStatus.RejectStartStatus,
            '',
            '',
          );
        }}
        style={{ color: 'red' }}>
        拒绝
      </Button>
    </Space>
  );

  return (
    <PageCard key={workKey} bordered={false} tabBarExtraContent={operation}>
      <div className={cls['page-content-table']}>
        <CardOrTableComp<ITodo>
          dataSource={[]}
          rowKey={(record: ITodo) => record.id}
          columns={WorkColumns}
          request={async (page: PageRequest) => {
            let res = await orgCtrl.user.work.loadTodo();
            switch (selectMenu.itemType) {
              case GroupMenuType.Organization: {
                if (selectMenu.item != undefined) {
                  let targets = selectMenu.item as ITarget[];
                  if (targets.length == 1 && targets[0].space.id == targets[0].id) {
                    res = res.filter((a) => a.spaceId == targets[0].space.id);
                  } else {
                    res = res.filter(
                      (a) =>
                        a.spaceId == targets[0].space.id &&
                        targets.findIndex((s) => s.id == a.shareId) > 0,
                    );
                  }
                }
                if ((selectMenu.item as ITarget[]).length > 0) {
                }
              }
              case GroupMenuType.Species:
                let species = selectMenu.item as ISpeciesItem[];
                res = res.filter(
                  (a) =>
                    a.spaceId == species[0].team.space.id &&
                    species.findIndex((s) => s.id == a.speciesId) > 0,
                );
            }
            return {
              total: res.length,
              result: res.splice(page.offset, page.limit),
              offset: page.offset,
              limit: page.limit,
            };
          }}
          operation={(item: ITodo) => {
            return [
              {
                key: 'approve',
                label: '同意',
                onClick: async () => {
                  orgCtrl.user.work.approval(
                    item,
                    CommonStatus.ApproveStartStatus,
                    '',
                    '',
                  );
                },
              },
              {
                key: 'refuse',
                label: '拒绝',
                onClick: async () => {
                  orgCtrl.user.work.approval(
                    item,
                    CommonStatus.RejectStartStatus,
                    '',
                    '',
                  );
                },
              },
            ];
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (_: React.Key[], selectedRows: ITodo[]) => {
              setSelectRows(selectedRows);
            },
          }}
        />
      </div>
    </PageCard>
  );
};

export default TypeSetting;
