import { MenuItemType } from 'typings/globelType';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '../config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem, ITarget, IWorkItem, SpeciesType } from '@/ts/core';
import { Button, Space } from 'antd';
import { WorkColumns } from '../config/columns';
import Detail from './work/detail';
import { workNotify } from '@/ts/core/work/todo';
import { ITodo } from '@/ts/core/work/todo';

/** 通用状态 */
export enum CommonStatus {
  ApplyStartStatus = 1,
  ApproveStartStatus = 100,
  RejectStartStatus = 200,
}
interface IProps {
  filter: string;
  selectMenu: MenuItemType;
}

const TypeSetting = ({ filter, selectMenu }: IProps) => {
  const [pageKey, setPageKey] = useState('List');
  const [workKey, forceUpdate] = useCtrlUpdate(workNotify);
  const [selectTodo, setSelectTodo] = useState<ITodo>();
  const [selectedRows, setSelectRows] = useState<ITodo[]>([]);
  const [workSpecies, setWorkSpecies] = useState<IWorkItem[]>([]);
  const [selectWorkSpecies, setSelectWorkSpecies] = useState<IWorkItem>();
  const [dataSource, setDataSource] = useState<ITodo[]>([]);

  useEffect(() => {
    setTimeout(async () => {
      for (let work of workSpecies) {
        let defines = await work.loadWorkDefines();
        if (defines.find((a) => a.id == selectTodo?.metadata.defineId)) {
          setSelectWorkSpecies(work);
        }
      }
    }, 10);
  }, [selectTodo]);

  useEffect(() => {
    let todos = orgCtrl.user.todos.filter(
      (a) =>
        a.metadata.title.includes(filter) ||
        a.metadata.taskType.includes(filter) ||
        a.metadata.remark.includes(filter),
    );
    switch (selectMenu.itemType) {
      case GroupMenuType.Work:
        break;
      case GroupMenuType.Species:
        {
          const species = selectMenu.item as ISpeciesItem;
          const speciesList = loadWorkSpecies([species]);
          setWorkSpecies(speciesList);
          todos = todos.filter(
            (a) =>
              a.metadata.taskType == '事项' &&
              a.metadata.shareId == species.current.metadata.id &&
              speciesList.find((s) => s.metadata.id == a.metadata.id),
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
            setWorkSpecies(loadWorkSpecies(target.workSpecies));
          } else {
            setWorkSpecies(loadWorkSpecies(orgCtrl.user.workSpecies));
          }
        }
        break;
    }
    setDataSource(todos);
    // forceUpdate()
    setPageKey('List');
  }, [selectMenu, filter]);

  const rowsOperation = (
    <Space>
      <Button
        type="link"
        onClick={async () => {
          selectedRows.forEach(
            async (a) => await a.approval(CommonStatus.ApproveStartStatus, '', ''),
          );
        }}>
        同意
      </Button>
      <Button
        type="link"
        onClick={async () => {
          selectedRows.forEach(
            async (a) => await a.approval(CommonStatus.RejectStartStatus, '', ''),
          );
        }}
        style={{ color: 'red' }}>
        拒绝
      </Button>
    </Space>
  );

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
  switch (pageKey) {
    case 'List':
      return (
        <PageCard bordered={false} tabBarExtraContent={rowsOperation}>
          <div key={workKey} className={cls['page-content-table']}>
            <CardOrTableComp<ITodo>
              dataSource={dataSource}
              rowKey={(record: ITodo) => record.metadata.id}
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
                      await item.approval(CommonStatus.ApproveStartStatus, '', '');
                    },
                  },
                  {
                    key: 'refuse',
                    label: '拒绝',
                    onClick: async () => {
                      await item.approval(CommonStatus.RejectStartStatus, '', '');
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
    case 'Detail':
      if (!selectTodo || !selectWorkSpecies) return <></>;
      return (
        <Detail
          todo={selectTodo}
          species={selectWorkSpecies}
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

export default TypeSetting;
