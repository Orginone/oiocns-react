import React, { useEffect, useState } from 'react';
import { Card, Collapse, Tabs, Timeline } from 'antd';
import orgCtrl from '@/ts/controller';
import { kernel, schema } from '@/ts/base';
import OioForm from '@/bizcomponents/FormDesign/OioFormNext';
import { XWorkInstance, XWorkTask } from '@/ts/base/schema';
import BashThing from '@/pages/Work/content/Work/ThingTables/BaseThing';
import { IBelong } from '@/ts/core';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';

const { Panel } = Collapse;

interface IThingCardProps {
  belongId: string;
  thingId: string;
}
/**
 * 存储-物-归档日志
 */
const ThingArchive: React.FC<IThingCardProps> = ({ thingId, belongId }) => {
  const [instances, setInstances] = useState<XWorkInstance[]>([]);
  useEffect(() => {
    const findThing = async () => {
      const res = await kernel.anystore.loadThingArchives(belongId, {
        options: {
          match: {
            _id: {
              _eq_: thingId,
            },
          },
        },
        userData: [],
      });
      const resData = res.data as { data: any };
      const ts = (resData?.data || [])[0];
      let data = [];
      for (const key in ts) {
        if (Object.prototype.hasOwnProperty.call(ts, key)) {
          const element = ts[key];
          if (key.startsWith('T')) {
            const time = key.substring(1, key.length);
            if (time.length === 14) {
              element.sort_time = time;
              data.push(element);
            }
          }
        }
      }
      let workInstances: XWorkInstance[] = [];
      for (let instance of data as XWorkInstance[]) {
        instance =
          (await orgCtrl.work.loadTaskDetail({
            instanceId: instance.id,
            belongId: instance.belongId,
          } as XWorkTask)) || instance;
        workInstances.push(instance);
      }
      // 加载办事实例
      setInstances(workInstances.sort((a, b) => (a.createTime < b.createTime ? 1 : 0)));
    };
    findThing();
  }, [thingId]);

  /** 加载主表 */
  const loadForms = (forms: any) => {
    const content: React.ReactNode[] = [];
    let items: any[] = [];
    Object.keys(forms?.formData || {}).forEach((id) => {
      if (forms.formData[id].isHeader) {
        content.push(
          ...loadFormItem(
            [JSON.parse(forms.formData[id].resourceData)],
            true,
            forms.headerData,
          ),
        );
      } else {
        let json = JSON.parse(forms?.formData[id].resourceData);
        items.push({
          label: json.form.name,
          key: json.form.id,
          children: (
            <BashThing
              readonly
              propertys={json.propertys}
              dataSource={json.data}
              form={json.form}
            />
          ),
        });
      }
    });
    return [content, <Tabs key={1} tabPosition="top" items={items} />];
  };

  /** 加载表单 */
  const loadFormItem = (forms: schema.XForm[], disabled: boolean, data?: any) => {
    let content = [];
    let belong = orgCtrl.user.targets.find((a) => a.id == belongId);
    if (belong) {
      for (let item of forms) {
        content.push(
          <OioForm
            key={item.id}
            form={item}
            formRef={undefined}
            belong={belong as IBelong}
            fieldsValue={data}
            disabled={disabled}
          />,
        );
      }
    }
    return content;
  };

  const loadInstanceContent = (instance: XWorkInstance) => {
    const data = JSON.parse(instance.data);
    return (
      <Timeline>
        <Timeline.Item key={'begin'} color={'green'}>
          <Card>
            <div style={{ display: 'flex' }}>
              <div style={{ paddingRight: '24px' }}>起始</div>
              <div style={{ paddingRight: '24px' }}>
                {instance!.createTime.substring(0, instance.createTime.length - 4)}
              </div>
              <div style={{ paddingRight: '24px' }}>
                发起人：
                <EntityIcon entityId={instance.createUser} showName />
              </div>
            </div>
            {loadForms(data.forms)}
          </Card>
        </Timeline.Item>
        {instance.tasks?.map((task, _index) => {
          return (
            <div key={task.id}>
              {task.records?.map((record) => {
                return (
                  <Timeline.Item key={record.id} color={'green'}>
                    <Card>
                      <div style={{ display: 'flex' }}>
                        <div style={{ paddingRight: '24px' }}>{task.node?.nodeType}</div>
                        <div style={{ paddingRight: '24px' }}>
                          {task.createTime.substring(0, task.createTime.length - 4)}
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
                        {task.node?.bindFroms &&
                          loadFormItem(
                            task.node.bindFroms,
                            task.status == 100,
                            record.data,
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
    <Card bordered={false} title="归档痕迹">
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
                        {a.createTime.substring(0, a.createTime.length - 4)}
                      </div>
                      <div style={{ paddingRight: '24px' }}>
                        归属用户：
                        <EntityIcon entityId={a.belongId} showName />
                      </div>
                      <div style={{ paddingRight: '24px' }}>
                        操作人：
                        <EntityIcon entityId={a.createUser} showName />
                      </div>
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
