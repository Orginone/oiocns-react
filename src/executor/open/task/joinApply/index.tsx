import React from 'react';
import { IWorkTask, TaskStatus } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import { Button } from 'antd';
import JoinApply from '@/executor/tools/task/joinApply';

export interface TaskDetailType {
  current: IWorkTask;
  finished: () => void;
}

const TaskContent: React.FC<TaskDetailType> = ({ current, finished }) => {
  if (current.targets.length < 2) return <></>;
  const loadOperates = () => {
    if (current.taskdata.status < TaskStatus.ApprovalStart) {
      return [
        <Button
          key={'拒绝'}
          type="default"
          onClick={async () => {
            await current.approvalTask(TaskStatus.RefuseStart, '拒绝');
            finished();
          }}>
          拒绝
        </Button>,
        <Button
          key={'同意'}
          type="primary"
          onClick={async () => {
            await current.approvalTask(TaskStatus.ApprovalStart, '同意');
            finished();
          }}>
          同意
        </Button>,
      ];
    }
    return [];
  };
  return (
    <FullScreenModal
      open
      hideMaxed
      centered
      width={500}
      bodyHeight={300}
      destroyOnClose
      title={`申请加入${current.targets[1].name}`}
      footer={loadOperates()}
      onCancel={finished}>
      <JoinApply key={current.key} current={current as any} />
    </FullScreenModal>
  );
};

export default TaskContent;
