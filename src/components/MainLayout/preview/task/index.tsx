import { Card, Collapse, Empty, Spin, Tabs, TabsProps, Timeline } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
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
          <TaskApproval
            task={task}
            finished={() => {
              command.emitter('preview', 'work');
            }}
          />
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
  if (!loaded) {
    return (
      <Spin tip={'信息加载中...'} spinning={!loaded}>
        <div style={{ width: '100%', height: '100%' }}></div>
      </Spin>
    );
  }
  if (task.instance && task.instanceData?.node) {
    return (
      <>
        <Card>
          <Tabs items={items} />
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
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ padding: 20 }}>办事数据加载失败!</h3>
      <Empty />
    </div>
  );
};

export default TaskContent;
