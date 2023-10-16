import { Card, Spin, Tabs, Timeline } from 'antd';
import React, { useState } from 'react';
import { IWorkTask } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import WorkForm from '@/executor/tools/workForm';
import ProcessTree from '@/components/Common/FlowDesign/ProcessTree';
import { NodeModel, loadResource } from '@/components/Common/FlowDesign/processType';
import TaskDrawer from './drawer';
import TaskApproval from './approval';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { command } from '@/ts/base';

export interface TaskDetailType {
  task: IWorkTask;
}

const TaskContent: React.FC<TaskDetailType> = ({ task }) => {
  const [selectNode, setSelectNode] = useState<NodeModel>();
  const [loaded] = useAsyncLoad(() => task.loadInstance(), [task]);
  /** 加载时间条 */
  const loadTimeline = React.useCallback(() => {
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

                          {task.instanceData && (
                            <WorkForm
                              allowEdit={false}
                              belong={task.belong}
                              nodeId={item.nodeId}
                              data={task.instanceData}
                            />
                          )}
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
  }, [task]);

  /** 办事详情 */
  const loadDetails = () => {
    if (loaded && task.instance && task.instanceData) {
      return (
        <>
          {loadTimeline()}
          <TaskApproval
            task={task}
            finished={() => {
              command.emitter('preview', 'work');
            }}
          />
        </>
      );
    }
    return <></>;
  };

  return (
    <Spin tip={'信息加载中...'} spinning={!loaded}>
      <Tabs
        items={[
          {
            key: '1',
            label: `办事详情`,
            children: loadDetails(),
          },
          {
            key: '2',
            label: `流程图`,
            children: (
              <ProcessTree
                isEdit={false}
                resource={loadResource(task.instanceData?.node, '')}
                onSelectedNode={(node) => setSelectNode(node)}
              />
            ),
          },
        ]}
      />
      {task.instance && selectNode && (
        <TaskDrawer
          current={selectNode}
          isOpen={selectNode != undefined}
          onClose={() => setSelectNode(undefined)}
          instance={task.instance}
        />
      )}
    </Spin>
  );
};

export default TaskContent;
