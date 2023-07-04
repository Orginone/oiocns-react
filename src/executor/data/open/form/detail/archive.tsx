import React from 'react';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Card, Collapse, Timeline } from 'antd';
import WorkForm from '@/executor/tools/workForm';
import { InstanceDataModel } from '@/ts/base/model';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const { Panel } = Collapse;

interface IProps {
  instances: schema.XWorkInstance[];
}
/**
 * 存储-物-归档日志
 */
const ThingArchive: React.FC<IProps> = ({ instances }) => {
  const loadDeatil = (instance: schema.XWorkInstance) => {
    const belong =
      orgCtrl.user.companys.find((a) => a.id == instance.belongId) || orgCtrl.user;
    const instanceData: InstanceDataModel = JSON.parse(instance.data || '{}');
    return (
      <Timeline>
        <Timeline.Item key={'begin'} color={'green'}>
          <Card>
            <div style={{ display: 'flex' }}>
              <div style={{ paddingRight: '24px' }}>起始</div>
              <div style={{ paddingRight: '24px' }}>
                {instance.createTime.substring(0, instance.createTime.length - 4)}
              </div>
              <div style={{ paddingRight: '24px' }}>
                发起人：
                <EntityIcon entityId={instance.createUser} showName />
              </div>
            </div>
            {instanceData.node && (
              <WorkForm
                allowEdit={false}
                belong={belong}
                nodeId={instanceData.node?.id}
                data={instanceData}
              />
            )}
          </Card>
        </Timeline.Item>
        {instance.tasks?.map((item) => {
          return (
            <div key={item.id}>
              {item.records?.map((record) => {
                return (
                  <Timeline.Item key={record.id} color={'green'}>
                    <Card>
                      <div style={{ display: 'flex' }}>
                        <div style={{ paddingRight: '24px' }}>{item.node?.nodeType}</div>
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
                        {instanceData && (
                          <WorkForm
                            allowEdit={false}
                            belong={belong}
                            nodeId={item.nodeId}
                            data={instanceData}
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
  };

  return (
    <Card bordered={false}>
      <Timeline>
        {instances.map((a) => {
          return (
            <Timeline.Item key={a.id}>
              <Collapse>
                <Panel
                  key={a.id}
                  header={
                    <div style={{ display: 'flex' }}>
                      <div style={{ paddingRight: '24px' }}>{a.title}</div>
                      <div style={{ paddingRight: '24px' }}>
                        {a.updateTime.substring(0, a.updateTime.length - 4)}
                      </div>
                      <div style={{ paddingRight: '24px' }}>{a.title}</div>
                      <div style={{ paddingRight: '24px' }}>
                        归属用户：
                        <EntityIcon entityId={a.belongId} showName />
                      </div>
                      <div style={{ paddingRight: '24px' }}>
                        申请用户：
                        <EntityIcon entityId={a.applyId} showName />
                      </div>
                      {a.content && (
                        <div style={{ paddingRight: '24px' }}>{'内容：' + a.content}</div>
                      )}
                      {a.remark && (
                        <div style={{ paddingRight: '24px' }}>{'备注：' + a.remark}</div>
                      )}
                    </div>
                  }>
                  {loadDeatil(a)}
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
