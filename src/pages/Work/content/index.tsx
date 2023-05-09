import { MenuItemType } from 'typings/globelType';
import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '../config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IBelong, ISpeciesItem, IWork, SpeciesType } from '@/ts/core';
import { Button, Space, message } from 'antd';
import { ApplyColumns, DefineColumns, DoneColumns, WorkColumns } from '../config/columns';
import Detail from './work/detail';
import { workNotify } from '@/ts/core/user';
import { ITodo, WorkTodo } from '@/ts/core/work/todo';
import { XWorkRecord, XWorkTask } from '@/ts/base/schema';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';
import WorkStartDo from '@/pages/Work/content/work/start';

interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ filter, selectMenu }: IProps) => {
  const [pageKey, setPageKey] = useState('List');
  const [workKey, forceUpdate] = useCtrlUpdate(workNotify);
  const [selectTodo, setSelectTodo] = useState<ITodo>();
  const [selectedRows, setSelectRows] = useState<ITodo[]>([]);
  const [selectDefine, setSelectDefine] = useState<IWorkDefine>();
  const [openStart, setOpenStart] = useState<boolean>(false);

  let workDefines: IWorkDefine[] = [];

  /** 加载所有办事分类 */
  const loadWorkDefines = (species: ISpeciesItem[]) => {
    for (let work of species.filter((a) => a.metadata.typeName == SpeciesType.WorkItem)) {
      workDefines.push(...(work as IWork).defines);
    }
    for (let sp of species) {
      if (sp.children.length > 0) {
        loadWorkDefines(sp.children);
      }
    }
  };

  /** 待办多行操作 */
  const todoRowsOperation = (
    <Space>
      <Button
        type="link"
        onClick={async () => {
          selectedRows.forEach(async (a) => await a.approval(100));
        }}>
        同意
      </Button>
      <Button
        type="link"
        onClick={async () => {
          selectedRows.forEach(async (a) => await a.approval(200));
        }}
        style={{ color: 'red' }}>
        拒绝
      </Button>
    </Space>
  );

  /** 待办单行操作 */
  const todoRowOperation = (item: ITodo) => {
    return [
      {
        key: 'detail',
        label: '详情',
        onClick: async () => {
          setSelectTodo(item);
          setSelectDefine(
            workDefines.find(
              (a) =>
                a.metadata.id == item.metadata.defineId &&
                a.metadata.shareId == item.metadata.shareId,
            ),
          );
          setPageKey('Detail');
        },
      },
      {
        key: 'approve',
        label: '同意',
        onClick: async () => {
          await item.approval(100);
        },
      },
      {
        key: 'refuse',
        label: '拒绝',
        onClick: async () => {
          await item.approval(200);
        },
      },
    ];
  };

  /** 已发起单行操作 */
  const applyRowOperation = (item: XWorkTask) => {
    let operItems: { key: string; label: React.ReactNode; onClick: Function }[] = [];
    if (item.taskType == '事项') {
      operItems = [
        {
          key: 'detail',
          label: '详情',
          onClick: async () => {
            setPageKey('Detail');
          },
        },
      ];
    }
    if (item.status < 100) {
      operItems.push({
        key: 'cancel',
        label: '取消',
        onClick: async () => {
          if (item.defineId != '') {
            let success = await (selectMenu.item as IWorkDefine).deleteInstance(item.id);
            if (success) {
              message.info('操作成功');
              forceUpdate();
            }
          } else {
            //TODO 组织取消申请
          }
        },
      });
    }
    return operItems;
  };

  let todos = orgCtrl.user.todos.filter(
    (a) =>
      a.metadata.title.includes(filter) ||
      a.metadata.taskType.includes(filter) ||
      a.metadata.remark.includes(filter),
  );

  const loadContent = () => {
    if (openStart && selectDefine) {
      return (
        <WorkStartDo
          current={selectDefine}
          goBack={() => {
            setOpenStart(false);
          }}
        />
      );
    } else {
      switch (selectMenu.itemType) {
        case GroupMenuType.Start: {
          let belong = selectMenu.item as IBelong;
          loadWorkDefines(belong.workSpecies);
          return (
            <CardOrTableComp<IWorkDefine>
              key={'start'}
              dataSource={workDefines}
              columns={DefineColumns}
              rowKey={(record: IWorkDefine) => record.metadata.id}
              operation={(item: IWorkDefine) => [
                {
                  key: 'start',
                  label: '发起',
                  onClick: async () => {
                    setSelectDefine(item);
                    setOpenStart(true);
                  },
                },
              ]}
            />
          );
        }
        case GroupMenuType.Todo: {
          let belong = selectMenu.item as IBelong;
          todos = todos.filter((a) => a.metadata.shareId == belong.metadata.id);
          return (
            <CardOrTableComp<ITodo>
              key={'todo'}
              dataSource={todos}
              columns={WorkColumns}
              operation={todoRowOperation}
              tabBarExtraContent={todoRowsOperation}
              rowKey={(record: ITodo) => record.metadata.id}
              rowSelection={{
                type: 'checkbox',
                onChange: (_: React.Key[], selectedRows: ITodo[]) => {
                  setSelectRows(selectedRows);
                },
              }}
            />
          );
        }
        case GroupMenuType.Done: {
          let belong = selectMenu.item as IBelong;
          return (
            <CardOrTableComp<XWorkRecord>
              key={'done'}
              columns={DoneColumns}
              dataSource={[]}
              operation={(item) => {
                if (item.task && item.task.taskType == '事项') {
                  return [
                    {
                      key: 'detail',
                      label: '详情',
                      onClick: async () => {
                        setSelectTodo(new WorkTodo(item.task!));
                        setPageKey('Detail');
                      },
                    },
                  ];
                }
                return [];
              }}
              rowKey={(record: XWorkRecord) => record.id}
              request={async (page) => {
                return await orgCtrl.user.loadDones({ id: belong.metadata.id, page });
              }}
            />
          );
        }
        case GroupMenuType.Apply: {
          let belong = selectMenu.item as IBelong;
          return (
            <CardOrTableComp<XWorkTask>
              key={'apply'}
              dataSource={[]}
              rowKey={(record: XWorkTask) => record.id}
              columns={ApplyColumns}
              request={async (page) => {
                return await orgCtrl.user.loadApply({ id: belong.metadata.id, page });
              }}
              rowSelection={{
                type: 'checkbox',
                onChange: (_: React.Key[], selectedRows: ITodo[]) => {
                  setSelectRows(selectedRows);
                },
              }}
            />
          );
        }
        default:
          if (selectMenu.item) {
            let belong = selectMenu.item as IBelong;
            todos = todos.filter((a) => a.metadata.shareId == belong.metadata.id);
          }
          return (
            <CardOrTableComp<ITodo>
              key={'todo'}
              dataSource={todos}
              columns={WorkColumns}
              operation={todoRowOperation}
              tabBarExtraContent={todoRowsOperation}
              rowKey={(record: ITodo) => record.metadata.id}
              rowSelection={{
                type: 'checkbox',
                onChange: (_: React.Key[], selectedRows: ITodo[]) => {
                  setSelectRows(selectedRows);
                },
              }}
            />
          );
      }
    }
  };

  switch (pageKey) {
    case 'List':
      return (
        <PageCard bordered={false}>
          <div key={workKey} className={cls['page-content-table']}>
            {loadContent()}
          </div>
        </PageCard>
      );
    case 'Detail':
      if (!selectDefine || !selectTodo) return <></>;
      return (
        <Detail
          todo={selectTodo}
          define={selectDefine}
          onBack={(success: boolean) => {
            if (success) {
              setSelectTodo(undefined);
              forceUpdate();
              setPageKey('List');
            }
          }}
        />
      );
    default:
      return <></>;
  }
};

export default TypeSetting;
