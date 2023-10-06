import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, Tabs, TabsProps, Timeline } from 'antd';
import React, { useRef, useState } from 'react';
import { ImUndo2 } from '@/icons/im';
import cls from './index.module.less';
import { IWorkTask, TaskStatus } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import WorkForm from '@/executor/tools/workForm';
import ProcessTree from '@/components/Common/FlowDesign/ProcessTree';
import { NodeModel, loadResource } from '@/components/Common/FlowDesign/processType';
import TaskDrawer from './drawer';

export interface TaskDetailType {
  task: IWorkTask;
  onBack?: () => void;
}

const Detail: React.FC<TaskDetailType> = ({ task, onBack }) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [selectNode, setSelectNode] = useState<NodeModel>();
  const [comment, setComment] = useState<string>('');

  /** 加载时间条 */
  const loadTimeline = () => {
    if (task.instance) {
      return (
        <Timeline>
          <Timeline.Item color={'green'}>
            <Card>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '24px' }}>起始</div>
                <div style={{ paddingRight: '24px' }}>
                  {task.instance.createTime.substring(
                    0,
                    task.instance.createTime.length - 4,
                  )}
                </div>
                <div style={{ paddingRight: '24px' }}>
                  发起人：
                  <EntityIcon entityId={task.instance.createUser} showName />
                </div>
              </div>
              {task.instanceData && (
                <WorkForm
                  allowEdit={false}
                  belong={task.belong}
                  nodeId={task.instanceData.node.id}
                  data={task.instanceData}
                />
              )}
            </Card>
          </Timeline.Item>
          {task.instance.tasks?.map((item, index) => {
            return (
              <div key={`${item.id}_${index}`}>
                {item.status >= 100 ? (
                  item.records?.map((record) => {
                    return (
                      <Timeline.Item key={`${record.id}_${index}`} color={'green'}>
                        <Card>
                          <div style={{ display: 'flex' }}>
                            <div style={{ paddingRight: '24px' }}>
                              {item.node?.nodeType}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              {item.createTime.substring(0, item.createTime.length - 4)}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              审批人：
                              <EntityIcon entityId={record.createUser} showName />
                            </div>
                            <div>审批结果：{record.status < 200 ? '通过' : '拒绝'}</div>
                            <div>
                              {record.comment && <div>审批意见：{record.comment}</div>}
                            </div>
                          </div>
                          <Collapse ghost>
                            {task.instanceData && (
                              <WorkForm
                                allowEdit={false}
                                belong={task.belong}
                                nodeId={item.nodeId}
                                data={task.instanceData}
                              />
                            )}
                          </Collapse>
                        </Card>
                      </Timeline.Item>
                    );
                  })
                ) : (
                  <Timeline.Item color={'red'}>
                    <Card>
                      <div style={{ display: 'flex' }}>
                        <div style={{ paddingRight: '24px' }}>{item.node?.nodeType}</div>
                        <div style={{ paddingRight: '24px' }}>
                          {item.createTime.substring(0, item.createTime.length - 4)}
                        </div>
                        <div style={{ color: 'red' }}>待审批</div>
                      </div>
                      {/* {task.node?.bindFroms &&
                        loadFormItem(task.node.bindFroms, task.status == 100)} */}
                    </Card>
                  </Timeline.Item>
                )}
              </div>
            );
          })}
        </Timeline>
      );
    }
    return <></>;
  };

  // 审批
  const approvalTask = async (status: number) => {
    await formRef.current?.validateFields();
    task.approvalTask(status, comment);
    onBack?.apply(this);
  };

  /** tab标签页 */
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `办事详情`,
      children: (
        <>
          <div className={cls['content']}>
            {/** 时间轴 */}
            {loadTimeline()}
          </div>

          {task.metadata.status < TaskStatus.ApprovalStart && (
            <div
              style={{ padding: 10, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
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
                  onClick={() => approvalTask(TaskStatus.ApprovalStart)}>
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
          )}
        </>
      ),
    },
    {
      key: '2',
      label: `流程图`,
      children: (
        <ProcessTree
          isEdit={false}
          resource={loadResource(JSON.parse(task.instance?.data || '{}').node, '')}
          onSelectedNode={(node) => setSelectNode(node)}
        />
      ),
    },
  ];

  return (
    <>
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={items}
          tabBarExtraContent={
            <div
              style={{ display: 'flex', cursor: 'pointer' }}
              onClick={() => {
                onBack?.apply(this);
              }}>
              <a style={{ paddingTop: '2px' }}>
                <ImUndo2 />
              </a>
              <a style={{ paddingLeft: '6px' }}>返回</a>
            </div>
          }
        />
      </Card>
      {selectNode && (
        <TaskDrawer
          current={selectNode}
          isOpen={selectNode != undefined}
          onClose={() => setSelectNode(undefined)}
          instance={task.instance!}
        />
      )}
    </>
  );
};

export default Detail;
