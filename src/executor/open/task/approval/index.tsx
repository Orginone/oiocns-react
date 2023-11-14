import { command } from '@/ts/base';
import { IWorkTask, TaskStatus } from '@/ts/core';
import { approvelWork } from '@/utils/anxinwu/axwWork';
import { Input, Button } from 'antd';
import React, { useState } from 'react';

export interface TaskDetailType {
  task: IWorkTask;
  finished: () => void;
}

const TaskApproval: React.FC<TaskDetailType> = ({ task, finished }) => {
  const [comment, setComment] = useState<string>('');

  // 审批
  const approvalTask = async (status: number) => {
    task.approvalTask(status, comment);
    command.emitter('preview', 'work');
    setComment('');
    finished();
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
          onClick={async () => {
            if (task.instanceData && task.instance) {
              const success = await approvelWork(task);
              if (success) {
                await approvalTask(TaskStatus.ApprovalStart);
              }
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
