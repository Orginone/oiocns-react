import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { IBelong, TaskStatus } from '@/ts/core';
import { XWorkTask } from '@/ts/base/schema';
import { model, schema } from '@/ts/base';
import { WorkColumns } from '../../config/columns';
import { GroupMenuType } from '../../config/menuType';
import TaskDetail, { TaskDetailType } from './detail';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import CardOrTableComp from '@/components/CardOrTableComp';

interface IProps {
  filter: string;
  taskType: string;
  space: IBelong | undefined;
}

const TaskContent = (props: IProps) => {
  const [key] = useCtrlUpdate(orgCtrl.work.notity);
  const [task, setTask] = useState<TaskDetailType>();
  const [selectedRows, setSelectRows] = useState<schema.XWorkTask[]>([]);

  /** 查询任务项 */
  const getTaskList = async (page: model.PageModel) => {
    let taskList: model.PageResult<XWorkTask> = {
      offset: page.offset,
      limit: page.limit,
      total: 0,
      result: [],
    };
    switch (props.taskType) {
      case GroupMenuType.Done:
        {
          const res = await orgCtrl.work.loadDones({
            page: { ...page, filter: props.filter },
            id: props.space?.id || '0',
          });
          taskList.total = res.total;
          for (const item of res.result || []) {
            if (item.task) {
              item.task.records = [item];
              taskList.result!.push(item.task);
            }
          }
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
            todos = todos.filter(
              (a) => a.belongId == props.space!.id || a.shareId == props.space!.id,
            );
          }
          if (props.filter != '') {
            todos = todos.filter(
              (a) => a.title.includes(props.filter) || a.remark.includes(props.filter),
            );
          }
          taskList.total = todos.length;
          taskList.result = todos.slice(page.offset, page.limit);
        }
        break;
    }
    return taskList;
  };

  /** 加载操作功能 */
  const getOperation = (items: XWorkTask[]) => {
    const operates: any[] = [];
    if (items.length === 1 && items[0].taskType != '加用户') {
      operates.push({
        key: 'detail',
        label: '详情',
        onClick: async () => {
          const define = await orgCtrl.work.findFlowDefine(items[0].defineId);
          const instance = await orgCtrl.work.loadTaskDetail(items[0]);
          if (define && instance) {
            setTask({
              define,
              instance,
              task: items[0],
            });
          }
        },
      });
    }
    switch (props.taskType) {
      case GroupMenuType.Done:
        break;
      case GroupMenuType.Apply:
        if (items.filter((i) => i.status < TaskStatus.ApplyStart).length > 0) {
          operates.push({
            key: 'confirm',
            label: '取消',
            onClick: async () => {
              await orgCtrl.work.approvalTask(items, -1);
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
              await orgCtrl.work.approvalTask(items, TaskStatus.ApprovalStart);
            },
          },
          {
            key: 'refuse',
            label: '拒绝',
            onClick: async () => {
              await orgCtrl.work.approvalTask(items, TaskStatus.RefuseStart);
            },
          },
        );
        break;
    }
    return operates;
  };

  if (task) {
    return (
      <TaskDetail
        task={task.task}
        define={task.define}
        instance={task.instance}
        onBack={() => {
          setTask(undefined);
        }}
      />
    );
  }
  return (
    <CardOrTableComp<schema.XWorkTask>
      key={key}
      columns={WorkColumns}
      operation={(item) => getOperation([item])}
      tabBarExtraContent={selectedRows.length > 0 ? getOperation(selectedRows) : []}
      request={getTaskList}
      rowSelection={{
        type: 'checkbox',
        onChange: (_: React.Key[], selectedRows: schema.XWorkTask[]) => {
          setSelectRows(selectedRows);
        },
      }}
      dataSource={[]}
      rowKey="id"
    />
  );
};
export default TaskContent;
