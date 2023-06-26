import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { IBelong, IWorkTask, TaskStatus } from '@/ts/core';
import { model } from '@/ts/base';
import { WorkColumns } from '../config/columns';
import { GroupMenuType } from '../config/menuType';
import TaskDetail from './detail';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import CardOrTableComp from '@/components/CardOrTableComp';

interface IProps {
  filter: string;
  taskType: string;
  space: IBelong;
}

const TaskContent = (props: IProps) => {
  const [key] = useCtrlUpdate(orgCtrl.work.notity);
  const [task, setTask] = useState<IWorkTask>();
  const [selectedRows, setSelectRows] = useState<IWorkTask[]>([]);

  /** 查询任务项 */
  const getTaskList = async (page: model.PageModel) => {
    let taskList: model.PageResult<IWorkTask> = {
      offset: page.offset,
      limit: page.limit,
      total: 0,
      result: [],
    };
    switch (props.taskType) {
      case GroupMenuType.Done:
        {
          taskList = await orgCtrl.work.loadDones({
            page: { ...page, filter: props.filter },
            id: props.space?.id || '0',
          });
        }
        break;
      case GroupMenuType.Apply:
        taskList = await orgCtrl.work.loadApply({
          page: { ...page, filter: props.filter },
          id: props.space?.id || '0',
        });
        break;
      default:
        {
          let todos = orgCtrl.work.todos;
          if (props.space) {
            todos = todos.filter((t) => t.belong.id === props.space.id);
          }
          if (props.filter != '') {
            todos = todos.filter((t) => t.isMatch(props.filter));
          }
          taskList.total = todos.length;
          taskList.result = todos.slice(page.offset, page.limit);
        }
        break;
    }
    return taskList;
  };

  /** 加载操作功能 */
  const getOperation = (items: IWorkTask[]) => {
    const operates: any[] = [];
    if (items.length === 1 && items[0].metadata.taskType != '加用户') {
      operates.push({
        key: 'detail',
        label: '详情',
        onClick: async () => {
          await items[0].loadInstance(true);
          if (items[0].instance) {
            setTask(items[0]);
          }
        },
      });
    }
    switch (props.taskType) {
      case GroupMenuType.Done:
        break;
      case GroupMenuType.Apply:
        if (items.filter((i) => i.metadata.status < TaskStatus.ApplyStart).length > 0) {
          operates.push({
            key: 'confirm',
            label: '取消',
            onClick: async () => {
              items.forEach(async (item) => {
                await item.approvalTask(-1, '取消申请');
              });
            },
          });
        }
        break;
      default:
        operates.push(
          {
            key: 'confirm',
            label: '通过',
            onClick: async () => {
              items.forEach(async (item) => {
                await item.approvalTask(TaskStatus.ApprovalStart, '同意');
              });
            },
          },
          {
            key: 'refuse',
            label: '拒绝',
            onClick: async () => {
              items.forEach(async (item) => {
                await item.approvalTask(TaskStatus.ApprovalStart, '驳回');
              });
            },
          },
        );
        break;
    }
    return operates;
  };

  if (task) {
    return (
      <TaskDetail task={task} belong={props.space} onBack={() => setTask(undefined)} />
    );
  }
  return (
    <CardOrTableComp<IWorkTask>
      key={key}
      columns={WorkColumns}
      operation={(item) => getOperation([item])}
      tabBarExtraContent={selectedRows.length > 0 ? getOperation(selectedRows) : []}
      request={getTaskList}
      rowSelection={{
        type: 'checkbox',
        onChange: (_: React.Key[], selectedRows: IWorkTask[]) => {
          setSelectRows(selectedRows);
        },
      }}
      dataSource={[]}
      rowKey="id"
    />
  );
};
export default TaskContent;
