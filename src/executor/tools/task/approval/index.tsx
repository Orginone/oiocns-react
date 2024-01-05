import { changeRecords } from '@/components/Common/ExecutorShowComp';
import { command, model } from '@/ts/base';
import { IWorkTask, TaskStatus } from '@/ts/core';
import { IExecutor } from '@/ts/core/work/executor';
import { getNodeByNodeId } from '@/utils/tools';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Input, Modal, Space, message } from 'antd';
import React, { useState } from 'react';

export interface TaskDetailType {
  task: IWorkTask;
  finished: () => void;
  fromData?: Map<string, model.FormEditData>;
}

export interface ConfirmProps {
  task: IWorkTask;
  executor: IExecutor;
}

const TaskApproval: React.FC<TaskDetailType> = ({ task, finished, fromData }) => {
  if (task.isHistory) {
    return <></>;
  }
  const [comment, setComment] = useState<string>('');
  const [confirm, setConfirm] = useState(<></>);

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

  const approving = async () => {
    if (validation()) {
      await approvalTask(TaskStatus.ApprovalStart);
      //TODO 执行审批后的执行方法
    } else {
      message.warn('请完善表单内容再提交!');
    }
  };

  const Confirm: React.FC<ConfirmProps> = (props) => {
    const [open, setOpen] = useState(true);
    return (
      <Modal
        open={open}
        title={'字段变更确认'}
        width={1200}
        onOk={async () => {
          try {
            await props.executor.execute(fromData ?? new Map());
            await approving();
            setOpen(false);
          } catch (error) {
            message.error((error as Error).message);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}>
        <Space style={{ width: '100%' }} direction="vertical">
          <span>确认后，您的数据将自动产生变更操作，变更字段如下</span>
          {props.executor.metadata.changes.map((item, index) => {
            return (
              <Card key={index} title={item.name}>
                <ProTable
                  key={'id'}
                  search={false}
                  options={false}
                  tableAlertRender={false}
                  dataSource={item.fieldChanges}
                  columns={changeRecords}
                />
              </Card>
            );
          })}
        </Space>
      </Modal>
    );
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
            const node = getNodeByNodeId(task.taskdata.nodeId, task.instanceData?.node);
            const executors = node ? task.loadExecutors(node) : [];
            const executor = executors.find(
              (item) => item.metadata.funcName == '字段变更',
            );
            if (executor) {
              setConfirm(<Confirm task={task} executor={executor} />);
              return;
            }
            approving();
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
      {confirm}
    </div>
  );
};

export default TaskApproval;
