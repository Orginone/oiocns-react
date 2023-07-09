import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { IBelong, IWorkTask } from '@/ts/core';
import { model } from '@/ts/base';
import { WorkTaskColumns } from '@/config/column';
import { GroupMenuType } from '../config/menuType';
import TaskDetail from './detail';
import GenerateEntityTable from '@/executor/tools/generate/entityTable';
import CustomStore from 'devextreme/data/custom_store';

interface IProps {
  filter: string;
  taskType: string;
  space: IBelong;
}

const TaskContent = (props: IProps) => {
  const [task, setTask] = useState<IWorkTask>();

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

  if (task) {
    return <TaskDetail task={task} onBack={() => setTask(undefined)} />;
  }
  return (
    <GenerateEntityTable
      fields={WorkTaskColumns}
      dataSource={
        new CustomStore({
          key: 'id',
          async load(loadOptions) {
            const res = await getTaskList({
              offset: loadOptions.skip || 0,
              limit: loadOptions.take || 20,
              filter: loadOptions.searchValue || '',
            });
            return {
              data: res.result,
              totalCount: res.total,
            };
          },
        })
      }
      columnChooser={{ enabled: true }}
      onRowDblClick={async (e) => {
        const data: IWorkTask = e.data;
        await data.loadInstance(true);
        if (data.instance && data.instanceData?.node) {
          setTask(data);
        }
      }}
    />
  );
};
export default TaskContent;
