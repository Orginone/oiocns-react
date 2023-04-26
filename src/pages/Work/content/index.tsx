import { MenuItemType } from 'typings/globelType';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '../config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { workNotify } from '@/ts/core/target/work/work';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import ITodo from '@/ts/core/target/work/todo';
import CardOrTableComp from '@/components/CardOrTableComp';
import { CommonStatus, ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Space } from 'antd';
import { WorkColumns } from '../config/columns';
import Detail from './work/detail';

interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ filter, selectMenu }: IProps) => {
  const [pageKey, setPageKey] = useState('List');
  const [workKey, forceUpdate] = useCtrlUpdate(workNotify);
  const [selectTodo, setSelectTodo] = useState<ITodo>();
  const [selectedRows, setSelectRows] = useState<ITodo[]>([]);

  useEffect(() => {
    setPageKey('List');
    forceUpdate();
  }, [selectMenu, filter]);

  const rowsOperation = (
    <Space>
      <Button
        type="link"
        onClick={async () => {
          orgCtrl.user.work.approvals(selectedRows, CommonStatus.ApproveStartStatus);
        }}>
        同意
      </Button>
      <Button
        type="link"
        onClick={async () => {
          orgCtrl.user.work.approvals(selectedRows, CommonStatus.RejectStartStatus);
        }}
        style={{ color: 'red' }}>
        拒绝
      </Button>
    </Space>
  );

  const content = () => {
    switch (pageKey) {
      case 'List':
        return (
          <PageCard key={workKey} bordered={false} tabBarExtraContent={rowsOperation}>
            <div className={cls['page-content-table']}>
              <CardOrTableComp<ITodo>
                dataSource={[]}
                rowKey={(record: ITodo) => record.id}
                columns={WorkColumns}
                operation={(item: ITodo) => {
                  return [
                    {
                      key: 'detail',
                      label: '详情',
                      onClick: async () => {
                        setSelectTodo(item);
                        setPageKey('Detail');
                      },
                    },
                    {
                      key: 'approve',
                      label: '同意',
                      onClick: async () => {
                        orgCtrl.user.work.approval(item, CommonStatus.ApproveStartStatus);
                      },
                    },
                    {
                      key: 'refuse',
                      label: '拒绝',
                      onClick: async () => {
                        orgCtrl.user.work.approval(item, CommonStatus.RejectStartStatus);
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
                request={async (page) => {
                  let todos = (await orgCtrl.user.work.loadTodo(true)).filter(
                    (a) =>
                      a.name.includes(filter) ||
                      a.type.includes(filter) ||
                      a.remark.includes(filter),
                  );
                  switch (selectMenu.itemType) {
                    case GroupMenuType.Organization:
                      {
                        let targets = selectMenu.item as ITarget[];
                        if (targets.length == 1 && targets[0].space.id == targets[0].id) {
                          todos = todos.filter((a) => a.spaceId == targets[0].space.id);
                        } else {
                          todos = todos.filter(
                            (a) =>
                              a.spaceId == targets[0].space.id &&
                              targets.findIndex((s) => s.id == a.shareId) > 0,
                          );
                        }
                      }
                      break;
                    case GroupMenuType.Species:
                      const species = selectMenu.item as ISpeciesItem[];
                      todos = todos.filter(
                        (a) =>
                          a.spaceId == species[0].team.space.id &&
                          species.findIndex((s) => s.id == a.speciesId) > 0,
                      );
                      break;
                    default:
                      break;
                  }
                  return {
                    total: todos.length,
                    offset: page.offset,
                    limit: page.limit,
                    result: todos.slice(page.offset, page.offset + page.limit),
                  };
                }}
              />
            </div>
          </PageCard>
        );
      case 'Detail':
        if (!selectTodo) return <></>;
        return (
          <Detail
            todo={selectTodo}
            onBack={(success: boolean) => {
              if (success) {
                setPageKey('List');
                forceUpdate();
              }
            }}
          />
        );
      default:
        return <></>;
    }
  };

  return content();
};

export default TypeSetting;
