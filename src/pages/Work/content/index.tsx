import { MenuItemType } from 'typings/globelType';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '../config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem, ITarget, IWorkItem, SpeciesType } from '@/ts/core';
import { Button, Space, message } from 'antd';
import { ApplyColumns, DoneColumns, WorkColumns } from '../config/columns';
import Detail from './work/detail';
import { workNotify } from '@/ts/core/user';
import { ITodo, WorkTodo } from '@/ts/core/work/todo';
import { XWorkInstance, XWorkRecord } from '@/ts/base/schema';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';

interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ filter, selectMenu }: IProps) => {
  const [pageKey, setPageKey] = useState('List');
  const [workKey, forceUpdate] = useCtrlUpdate(workNotify);
  const [selectTodo, setSelectTodo] = useState<ITodo>();
  const [activeTab, setActiveTab] = useState<string>('todo');
  const [selectedRows, setSelectRows] = useState<ITodo[]>([]);
  const [selectDefine, setSelectDefine] = useState<IWorkDefine>();

  let workSpecies: IWorkItem[] = [];

  /** 加载所有办事分类 */
  const loadWorkSpecies = (species: ISpeciesItem[]) => {
    let spList: IWorkItem[] = species.filter(
      (a) => a.metadata.typeName == SpeciesType.WorkItem,
    ) as IWorkItem[];
    for (let sp of species) {
      if (sp.children.length > 0) {
        spList.push(...loadWorkSpecies(sp.children));
      }
    }
    return spList;
  };

  /** 查找当前选中待办的办事分类 */
  const findWorkByTodo = async () => {
    if (selectTodo) {
      workSpecies = workSpecies.filter(
        (a) => a.current.metadata.id == selectTodo?.metadata.shareId,
      );
      for (let work of workSpecies) {
        let define = (await work.loadWorkDefines()).find(
          (a) => a.metadata.id == selectTodo?.metadata.defineId,
        );
        if (define) {
          setSelectDefine(define);
        }
      }
    }
  };

  useEffect(() => {
    findWorkByTodo();
  }, [selectTodo]);

  let todos = orgCtrl.user.todos.filter(
    (a) =>
      a.metadata.title.includes(filter) ||
      a.metadata.taskType.includes(filter) ||
      a.metadata.remark.includes(filter),
  );
  switch (selectMenu.itemType) {
    case GroupMenuType.Work:
      let curDefine = selectMenu.item as IWorkDefine;
      workSpecies = [selectMenu.parentMenu!.item as IWorkItem];
      todos = todos.filter(
        (a) =>
          a.metadata.defineId == curDefine.metadata.id &&
          a.metadata.shareId == curDefine.workItem.current.metadata.id,
      );
      break;
    case GroupMenuType.Species:
      {
        const species = selectMenu.item as ISpeciesItem;
        const speciesList = loadWorkSpecies([species]);
        workSpecies = speciesList;
        todos = todos.filter(
          (a) =>
            a.metadata.taskType == '事项' &&
            a.metadata.shareId == species.current.metadata.id &&
            speciesList.find((s) => s.metadata.id == a.metadata.defineId),
        );
      }
      break;
    default:
      {
        let target = selectMenu.item as ITarget;
        if (target) {
          if (target.space.metadata.id == target.metadata.id) {
            todos = todos.filter((a) => a.metadata.shareId == target.metadata.id);
          } else {
            todos = todos.filter((a) => a.metadata.shareId == target.metadata.id);
          }
          workSpecies = loadWorkSpecies(target.workSpecies);
        } else {
          workSpecies = loadWorkSpecies(orgCtrl.user.workSpecies);
        }
      }
      break;
  }

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
  const applyRowOperation = (item: XWorkInstance) => {
    let operItems: { key: string; label: React.ReactNode; onClick: Function }[] = [];
    if (selectMenu.itemType == GroupMenuType.Work) {
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

  // 标题tabs页
  const titleItems = () => {
    let items = [
      {
        tab: `待办`,
        key: 'todo',
      },
      {
        tab: `已办`,
        key: 'done',
      },
    ];
    items.push({
      tab: `已发起`,
      key: 'apply',
    });
    return items;
  };

  const loadContent = () => {
    switch (activeTab) {
      case 'todo':
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
      case 'done':
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
              return await orgCtrl.user.loadDones('0', '0', page);
            }}
          />
        );
      case 'apply':
        return (
          <CardOrTableComp<XWorkInstance>
            key={'apply'}
            dataSource={[]}
            rowKey={(record: XWorkInstance) => record.id}
            columns={ApplyColumns}
            request={async (page) => {
              let defineId = '0';
              let shareId = '0';
              switch (selectMenu.itemType) {
                case GroupMenuType.Species:
                  shareId = (selectMenu.item as ISpeciesItem).current.metadata.id;
                case GroupMenuType.Work:
                  return await (selectMenu.item as IWorkDefine).loadInstance(page);
                default:
                  shareId = (selectMenu.item as ITarget).metadata.id;
              }
              return await orgCtrl.user.loadApply(defineId, shareId, page);
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
  };

  switch (pageKey) {
    case 'List':
      return (
        <PageCard
          bordered={false}
          activeTabKey={activeTab}
          onTabChange={(key) => {
            setActiveTab(key);
          }}
          tabList={titleItems()}>
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
