import CardOrTableComp from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XFlowRecord, XFlowTaskHistory } from '@/ts/base/schema';
import { SpeciesItem } from '@/ts/core/thing/species';
import { Card, Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { WorkReocrdColumns, WorkTodoColumns } from '../../config/columns';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

// 卡片渲染
interface IProps {
  pageKey: number;
  tabKey: string;
  selectMenu: MenuItemType;
  setPageKey: (pageKey: number) => void;
  setFlowTask: (flowTask: XFlowTaskHistory) => void;
  setTabKey: (tabKey: string) => void;
}
/**
 * 事--待办
 * @returns
 */
const TaskList: React.FC<IProps> = ({
  pageKey,
  tabKey,
  selectMenu,
  setPageKey,
  setTabKey,
  setFlowTask,
}) => {
  const [key, forceUpdate] = useObjectUpdate(selectMenu);
  const species: SpeciesItem = selectMenu.item;
  const [todoTasks, setTodoTasks] = useState<XFlowTaskHistory[]>([]);
  const [csTasks, setCsTasks] = useState<XFlowTaskHistory[]>([]);

  // 查询待办任务
  const loadTasks = async () => {
    const tasks = (await todoCtrl.loadWorkTodo()) || [];
    setTodoTasks(tasks.filter((t) => t.node?.nodeType == '审批'));
    setCsTasks(tasks.filter((t) => t.node?.nodeType == '抄送'));
    forceUpdate();
  };

  useEffect(() => {
    loadTasks();
  }, [species?.id]);

  useEffect(() => {
    loadTasks();
  }, [pageKey]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `待办`,
      children: (
        <CardOrTableComp<XFlowTaskHistory>
          key={key}
          rowKey={(record) => record?.id}
          columns={WorkTodoColumns}
          dataSource={todoTasks}
          operation={(item) => {
            return [
              {
                key: 'approve',
                label: '去审批',
                onClick: async () => {
                  setFlowTask(item);
                  setPageKey(1);
                },
              },
            ];
          }}
        />
      ),
    },
    {
      key: '2',
      label: `抄送`,
      children: (
        <CardOrTableComp<XFlowTaskHistory>
          key={key}
          rowKey={(record) => record?.id}
          columns={WorkTodoColumns}
          dataSource={csTasks}
          operation={(item) => {
            return [
              {
                key: 'view',
                label: '查看',
                onClick: async () => {
                  setFlowTask(item);
                  setPageKey(2);
                },
              },
            ];
          }}
        />
      ),
    },
    {
      key: '3',
      label: `已办`,
      children: (
        <CardOrTableComp<XFlowRecord>
          key={key}
          rowKey={(record) => record?.id}
          columns={WorkReocrdColumns}
          dataSource={[]}
          request={async (params) => {
            return (
              (
                await kernel.queryRecord({
                  id: '0',
                  spaceId: userCtrl.space.id,
                  page: {
                    offset: params.offset,
                    limit: params.limit,
                    filter: params.filter,
                  },
                })
              )?.data || []
            );
          }}
          operation={(item) => {
            return [
              {
                key: 'view',
                label: '查看',
                onClick: async () => {
                  setFlowTask(item.historyTask);
                  setPageKey(3);
                },
              },
            ];
          }}
        />
      ),
    },
    {
      key: '4',
      label: `已完结`,
      children: <></>,
    },
  ];

  return (
    <Card>
      <Tabs items={items} activeKey={tabKey} onTabClick={(e) => setTabKey(e)}></Tabs>
    </Card>
  );
};

export default TaskList;
