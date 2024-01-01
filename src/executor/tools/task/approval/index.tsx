import { command, model } from '@/ts/base';
import { IWorkTask, TaskStatus } from '@/ts/core';
import message from '@/utils/message';
import { Input, Button } from 'antd';
import React, { useState } from 'react';

export interface TaskDetailType {
  task: IWorkTask;
  finished: () => void;
  fromData?: Map<string, model.FormEditData>;
}

const TaskApproval: React.FC<TaskDetailType> = ({ task, finished, fromData }) => {
  if (task.isHistory) {
    return <></>;
  }
  const [comment, setComment] = useState<string>('');

  // 审批
  const approvalTask = async (status: number) => {
    task.approvalTask(status, comment, fromData);
    command.emitter('preview', 'work');
    setComment('');
    finished();
  };

  const validation = (): boolean => {
    if (task.instanceData && fromData) {
      const valueIsNull = (value: any) => {
        return (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.length < 1)
        );
      };
      for (const formId of fromData.keys()) {
        const data: any = fromData.get(formId)?.after.at(-1) ?? {};
        for (const item of task.instanceData.fields[formId]) {
          const isRequired = task.instanceData.data[formId]
            .at(-1)
            ?.rules?.find(
              (i) => i.destId === item.id && i.typeName === 'isRequired',
            )?.value;
          if (
            (isRequired == undefined || isRequired == true) &&
            item.options?.isRequired &&
            valueIsNull(data[item.id])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  if (task.taskdata.status >= TaskStatus.ApprovalStart) {
    return <></>;
  }
  return (
    <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <Input.TextArea
        style={{ height: 100, width: 'calc(100% - 80px)' }}
        placeholder="请填写备注信息"
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button
          type="primary"
          onClick={() => {
            if (validation()) {
              approvalTask(TaskStatus.ApprovalStart);
              //TODO 执行审批后的执行方法
            } else {
              message.warn('请完善表单内容再提交!');
            }
          }}>
          通过
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => approvalTask(TaskStatus.RefuseStart)}>
          驳回
        </Button>
      </div>
    </div>
  );
};

export default TaskApproval;
