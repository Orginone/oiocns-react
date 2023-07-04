import React from 'react';
import { Card, Collapse, Timeline } from 'antd';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IWorkTask } from '@/ts/core/work/task';
import WorkForm from '@/executor/tools/workForm';

const { Panel } = Collapse;

interface IProps {
  works: IWorkTask[];
}
/**
 * 存储-物-归档日志
 */
const ThingArchive: React.FC<IProps> = ({ works }) => {
  const loadInstanceContent = (work: IWorkTask) => {
    if (work.instance) {
      return (
        <Timeline>
          <Timeline.Item key={'begin'} color={'green'}>
            <Card>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '24px' }}>起始</div>
                <div style={{ paddingRight: '24px' }}>
                  {work.instance.createTime.substring(
                    0,
                    work.instance.createTime.length - 4,
                  )}
                </div>
                <div style={{ paddingRight: '24px' }}>
                  发起人：
                  <EntityIcon entityId={work.instance.createUser} showName />
                </div>
              </div>
              {work.instanceData && (
                <WorkForm
                  allowEdit={false}
                  belong={work.belong}
                  nodeId={work.instanceData.node?.id}
                  data={work.instanceData}
                />
              )}
            </Card>
          </Timeline.Item>
          {work.instance.tasks?.map((item) => {
            return (
              <div key={item.id}>
                {item.records?.map((record) => {
                  return (
                    <Timeline.Item key={record.id} color={'green'}>
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
                          {work.instanceData && (
                            <WorkForm
                              allowEdit={false}
                              belong={work.belong}
                              nodeId={item.nodeId}
                              data={work.instanceData}
                            />
                          )}
                        </Collapse>
                      </Card>
                    </Timeline.Item>
                  );
                })}
              </div>
            );
          })}
        </Timeline>
      );
    }
    return <></>;
  };

  return (
    <Card bordered={false}>
      <Timeline>
        {works.map((a) => {
          return (
            <Timeline.Item key={a.metadata.id}>
              <Collapse>
                <Panel
                  key={a.metadata.id}
                  header={
                    <div style={{ display: 'flex' }}>
                      <div style={{ paddingRight: '24px' }}>{a.metadata.title}</div>
                      <div style={{ paddingRight: '24px' }}>
                        {a.metadata.updateTime.substring(
                          0,
                          a.metadata.updateTime.length - 4,
                        )}
                      </div>
                      <div style={{ paddingRight: '24px' }}>{a.metadata.title}</div>
                      <div style={{ paddingRight: '24px' }}>
                        归属用户：
                        <EntityIcon entityId={a.metadata.belongId} showName />
                      </div>
                      <div style={{ paddingRight: '24px' }}>
                        申请用户：
                        <EntityIcon entityId={a.metadata.applyId} showName />
                      </div>
                      {a.metadata.content && (
                        <div style={{ paddingRight: '24px' }}>
                          {'内容：' + a.metadata.content}
                        </div>
                      )}
                      {a.metadata.remark && (
                        <div style={{ paddingRight: '24px' }}>
                          {'备注：' + a.metadata.remark}
                        </div>
                      )}
                    </div>
                  }>
                  {loadInstanceContent(a)}
                </Panel>
              </Collapse>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );
};
export default ThingArchive;
