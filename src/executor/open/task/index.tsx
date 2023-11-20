import { Card, Empty, Spin, Tabs, TabsProps, Timeline } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from '@/icons/im';
import cls from './index.module.less';
import { IWorkTask } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import WorkForm from '@/executor/tools/workForm';
import ProcessTree from '@/components/Common/FlowDesign/ProcessTree';
import { NodeModel, loadResource } from '@/components/Common/FlowDesign/processType';
import TaskDrawer from './drawer';
import FullScreenModal from '@/components/Common/fullScreen';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import TaskApproval from './approval';

export interface TaskDetailType {
  current: IWorkTask;
  finished: () => void;
}

const TaskContent: React.FC<TaskDetailType> = ({ current, finished }) => {
  const [selectNode, setSelectNode] = useState<NodeModel>();
  const [loaded] = useAsyncLoad(() => current.loadInstance());

  /** 加载时间条 */
  const loadTimeline = () => {
    if (current.instance) {
      return (
        <Timeline>
          <Timeline.Item color={'green'}>
            <Card>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '24px' }}>起始</div>
                <div style={{ paddingRight: '24px' }}>
                  {current.instance.createTime.substring(
                    0,
                    current.instance.createTime.length - 4,
                  )}
                </div>
                <div style={{ paddingRight: '24px' }}>
                  发起人：
                  <EntityIcon entityId={current.instance.createUser} showName />
                </div>
              </div>
              {current.instanceData && (
                <WorkForm
                  allowEdit={false}
                  belong={current.belong}
                  nodeId={current.instanceData.node.id}
                  data={current.instanceData}
                />
              )}
            </Card>
          </Timeline.Item>
          {current.instance.tasks
            ?.filter((a) => a.status >= 100)
            ?.sort((a, b) => (a.createTime < b.createTime ? -1 : 1))
            .map((item, index) => {
              return (
                <div key={`${item.id}_100_${index}`}>
                  {item.records?.map((record) => {
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
                          {/* <Collapse ghost>
                              {current.instanceData && (
                                <WorkForm
                                  allowEdit={false}
                                  belong={current.belong}
                                  nodeId={item.nodeId}
                                  data={current.instanceData}
                                />
                              )}
                            </Collapse> */}
                        </Card>
                      </Timeline.Item>
                    );
                  })}
                </div>
              );
            })}
          {current.instance.tasks
            ?.filter((a) => a.status < 100)
            ?.sort((a, b) => (a.createTime < b.createTime ? -1 : 1))
            .map((item, index) => {
              return (
                <div key={`${item.id}_1_${index}`}>
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
          <TaskApproval task={current} finished={finished} />
        </>
      ),
    },
    {
      key: '2',
      label: `流程跟踪`,
      children: (
        <ProcessTree
          isEdit={false}
          resource={loadResource(JSON.parse(current.instance?.data || '{}').node, '')}
          onSelectedNode={(node) => setSelectNode(node)}
        />
      ),
    },
  ];
  /** 加载内容 */
  const loadContent = () => {
    if (!loaded) {
      return (
        <Spin tip={'配置信息加载中...'}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </Spin>
      );
    }
    if (current.instance && current.instanceData?.node) {
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
                    finished.apply(this);
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
              instance={current.instance!}
            />
          )}
        </>
      );
    }
    return (
      <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
        <h3 style={{ padding: 20 }}>办事数据加载失败!</h3>
        <Empty />
      </div>
    );
  };

  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={current.taskdata.taskType}
        footer={[]}
        onCancel={finished}>
        {loadContent()}
      </FullScreenModal>
    </>
  );
};

export default TaskContent;
