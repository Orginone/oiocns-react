import React from 'react';
import { IWorkTask, TaskStatus } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Divider, Space } from 'antd';
import { formatZhDate } from '@/utils/tools';

export interface TaskDetailType {
  current: IWorkTask;
}

const TaskContent: React.FC<TaskDetailType> = ({ current }) => {
  if (current.targets.length < 2) return <></>;
  return (
    <div style={{ lineHeight: '60px', padding: 16 }}>
      <Space wrap split={<Divider type="vertical" />} size={2}>
        <EntityIcon entity={current.targets[0]} showName size={30} />
        <span>申请加入</span>
        <EntityIcon entity={current.targets[1]} showName size={30} />
      </Space>
      <div>申请时间：{formatZhDate(current.taskdata.createTime)}</div>
      {current.taskdata.records && current.taskdata.records.length > 0 && (
        <>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <EntityIcon
              entityId={current.taskdata.records[0].createUser}
              showName
              size={30}
            />
            <span>审批意见：</span>
            {current.taskdata.status == TaskStatus.ApprovalStart && (
              <span style={{ color: 'blue' }}>已同意</span>
            )}
            {current.taskdata.status == TaskStatus.RefuseStart && (
              <span style={{ color: 'red' }}>已拒绝</span>
            )}
          </Space>
          <div>审批时间:{formatZhDate(current.taskdata.records[0].createTime)}</div>
        </>
      )}
    </div>
  );
};

export default TaskContent;
