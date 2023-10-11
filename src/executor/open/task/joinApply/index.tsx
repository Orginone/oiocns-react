import React from 'react';
import { IWorkTask, TaskStatus } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Button, Divider, Space } from 'antd';
import { formatZhDate } from '@/utils/tools';

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
    <>
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
      </FullScreenModal>
    </>
  );
};

export default TaskContent;
