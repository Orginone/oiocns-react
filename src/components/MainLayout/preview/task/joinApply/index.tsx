import React from 'react';
import { IWorkTask, TaskStatus } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Divider, Space } from 'antd';
import { formatZhDate } from '@/utils/tools';
import TaskApproval from '../approval';
import { command } from '@/ts/base';

export interface TaskDetailType {
  task: IWorkTask;
}

const TaskContent: React.FC<TaskDetailType> = ({ task }) => {
  if (task.targets.length < 2) return <></>;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 32,
        fontSize: 16,
      }}>
      <Space wrap split={<Divider type="vertical" />} size={2}>
        <EntityIcon entity={task.targets[0]} showName size={30} />
        <span>申请加入</span>
        <EntityIcon entity={task.targets[1]} showName size={30} />
      </Space>
      <div>申请时间：{formatZhDate(task.taskdata.createTime)}</div>
      {task.taskdata.records && task.taskdata.records.length > 0 && (
        <>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <EntityIcon
              entityId={task.taskdata.records[0].createUser}
              showName
              size={30}
            />
            <span>审批意见：</span>
            {task.taskdata.status == TaskStatus.ApprovalStart && (
              <span style={{ color: 'blue' }}>已同意</span>
            )}
            {task.taskdata.status == TaskStatus.RefuseStart && (
              <span style={{ color: 'red' }}>已拒绝</span>
            )}
          </Space>
          <div>审批时间：{formatZhDate(task.taskdata.records[0].createTime)}</div>
        </>
      )}
      <TaskApproval
        task={task}
        finished={() => {
          command.emitter('preview', 'work');
        }}
      />
    </div>
  );
};

export default TaskContent;
