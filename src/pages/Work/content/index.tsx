import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { IBelong, IWorkTask, TaskStatus } from '@/ts/core';
import { model } from '@/ts/base';
import { WorkTaskColumns } from '@/config/column';
import { GroupMenuType } from '../config/menuType';
import TaskDetail from './detail';
import GenerateEntityTable from '@/executor/tools/generate/entityTable';
import CustomStore from 'devextreme/data/custom_store';
import { ImCopy, ImShuffle, ImTicket } from '@/icons/im';
import { Modal, message } from 'antd';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import WorkStartDo from '@/executor/open/work';

interface IProps {
  taskType: string;
  space: IBelong;
}

const TaskContent = (props: IProps) => {
  const [task, setTask] = useState<IWorkTask>();
  const [key] = useCtrlUpdate(orgCtrl.work.notity);

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
            page: page,
            id: props.space?.id || '0',
          });
        }
        break;
      case GroupMenuType.Apply:
        taskList = await orgCtrl.work.loadApply({
          page: page,
          id: props.space?.id || '0',
        });
        break;
      default:
        {
          let todos = orgCtrl.work.todos;
          if (props.space) {
            todos = todos.filter((t) => t.belong.id === props.space.id);
          }
          if (page.filter != '') {
            todos = todos.filter((t) => t.isMatch(page.filter));
          }
          taskList.total = todos.length;
          taskList.result = todos.slice(page.offset, page.limit);
        }
        break;
    }
    return taskList;
  };

  /** 进入详情 */
  const setTaskDetail = async (data: IWorkTask) => {
    if (data.metadata.instanceId) {
      await data.loadInstance(true);
      if (data.instance && data.instanceData?.node) {
        setTask(data);
      }
    } else {
      const readOnly = data.metadata.status >= TaskStatus.ApprovalStart;
      Modal.confirm({
        closable: true,
        maskClosable: true,
        title: data.metadata.title,
        okText: readOnly ? '好的' : '同意',
        cancelText: '拒绝',
        cancelButtonProps: {
          style: {
            display: readOnly ? 'none' : undefined,
          },
        },
        content: data.content,
        onCancel: async (...args) => {
          if (args.length == 0) {
            await data.approvalTask(TaskStatus.RefuseStart, '拒绝');
          }
        },
        onOk: async () => {
          if (!readOnly) {
            await data.approvalTask(TaskStatus.ApprovalStart, '同意');
          }
        },
      });
    }
  };

  if (task) {
    if (task.metadata.approveType == '子流程' && task.metadata.identityId) {
      return <WorkStartDo current={task} finished={() => setTask(undefined)} />;
    }
    return <TaskDetail task={task} onBack={() => setTask(undefined)} />;
  }

  return (
    <GenerateEntityTable
      key={key}
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
              data: res.result || [],
              totalCount: res.total || 0,
            };
          },
        })
      }
      columnChooser={{ enabled: true }}
      onRowDblClick={async (e) => await setTaskDetail(e.data)}
      sorting={{ mode: 'none' }}
      remoteOperations={{
        paging: true,
        filtering: false,
        groupPaging: true,
      }}
      dataMenus={{
        items: [
          {
            key: 'remark',
            label: '详情',
            icon: <ImShuffle fontSize={22} color={'#9498df'} />,
          },
          {
            key: 'createNFT',
            label: '存证',
            icon: <ImTicket fontSize={22} color={'#9498df'} />,
            onClick: () => {
              message.success('存证成功!');
            },
          },
          {
            key: 'print',
            label: '打印',
            icon: <ImCopy fontSize={22} color={'#9498df'} />,
          },
        ],
        async onMenuClick(key, data) {
          switch (key) {
            case 'remark':
              await setTaskDetail(data);
              break;
          }
        },
      }}
    />
  );
};
export default TaskContent;
