import { MenuItemType } from 'typings/globelType';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { GroupMenuType } from '../config/menuType';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ISpeciesItem, ITarget } from '@/ts/core';
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
  const [species, setSpecies] = useState<ISpeciesItem[]>([]);
  const [dataSource, setDataSource] = useState<ITodo[]>([]);

  useEffect(() => {
    let todos = orgCtrl.user.todos.filter(
      (a) =>
        a.name.includes(filter) ||
        a.typeName.includes(filter) ||
        a.remark.includes(filter),
    );
    switch (selectMenu.itemType) {
      case GroupMenuType.Species:
        {
          const species = selectMenu.item as ISpeciesItem;
          const speciesList = loadSpecies([species]);
          setSpecies(speciesList);
          todos = todos.filter(
            (a) =>
              a.typeName == '事项' &&
              a.belongId == species.current.metadata.id &&
              speciesList.find((s) => s.metadata.id == a.speciesId),
          );
        }
        break;
      default:
        {
          let target = selectMenu.item as ITarget;
          if (target) {
            setSpecies(loadSpecies(target.species));
            if (target.space.metadata.id == target.metadata.id) {
              todos = todos.filter((a) => a.belongId == target.metadata.id);
            } else {
              todos = todos.filter(
                (a) =>
                  a.belongId == target.space.metadata.id &&
                  a.shareId == target.metadata.id,
              );
            }
          }
        }
        break;
    }
    setDataSource(todos);
    setPageKey('List');
    forceUpdate();
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

  const loadSpecies = (species: ISpeciesItem[]) => {
    let spList: ISpeciesItem[] = [...species];
    for (let sp of species) {
      if (sp.children.length > 0) {
        spList.push(...loadSpecies(sp.children));
      }
    }
    return spList;
  };

  const content = () => {
    switch (pageKey) {
      case 'List':
        return (
          <PageCard key={workKey} bordered={false} tabBarExtraContent={rowsOperation}>
            <div className={cls['page-content-table']}>
              <CardOrTableComp<ITodo>
                dataSource={dataSource}
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
        if (!selectTodo) return <></>;
        return (
          <Detail
            todo={selectTodo}
            species={species.find((a) => a.metadata.id == selectTodo.id)}
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
