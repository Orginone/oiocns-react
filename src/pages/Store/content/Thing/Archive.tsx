import React, { useEffect, useState } from 'react';
import { Card, Collapse, Timeline } from 'antd';
import orgCtrl from '@/ts/controller';
import { kernel } from '@/ts/base';
import { ISpeciesItem } from '@/ts/core';
import OioForm from '@/bizcomponents/FormDesign/Design/OioForm';
import { XWorkInstance } from '@/ts/base/schema';

const { Panel } = Collapse;

interface IThingCardProps {
  species: ISpeciesItem;
  thingId: string;
}
/**
 * 存储-物-归档日志
 */
const ThingArchive: React.FC<IThingCardProps> = ({ thingId, species }) => {
  const [instances, setInstances] = useState<XWorkInstance[]>([]);
  useEffect(() => {
    const findThing = async () => {
      const res = await kernel.anystore.loadThingArchives(
        species.current.space.metadata.id,
        {
          options: {
            match: {
              _id: {
                _eq_: thingId,
              },
            },
          },
          userData: [],
        },
      );
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
      setInstances(data.sort((a, b) => a.sort_time - b.sort_time) as XWorkInstance[]);
    };
    findThing();
  }, [thingId]);

  const loadTaskContent = (instance: XWorkInstance) => {
    if (instance.tasks == undefined) return <></>;
    let tasks = instance.tasks!.sort(
      (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    );
    return tasks.map((a) => {
      const records = a.records?.sort(
        (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      );
      if (records) {
        return records?.map((record) => (
          <Timeline.Item key={record.id}>
            <Card>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '24px' }}>{a.node?.nodeType}</div>
                <div style={{ paddingRight: '24px' }}>
                  {record.createTime.substring(0, record.createTime.length - 4)}
                </div>
                <div style={{ paddingRight: '24px' }}>{a.node?.destName}</div>
                <div style={{ paddingRight: '24px' }}>
                  操作人：{orgCtrl.provider.user?.findShareById(record.createUser).name}
                </div>
                <div>
                  <div>审批意见：{record.comment || ''}</div>
                </div>
              </div>
              <Collapse ghost>
                {(
                  instance.define?.nodes?.find((q) => q.id == a.node?.id)?.bindFroms || []
                ).map((form: any) => {
                  let formValue = {};
                  if (record?.data) {
                    formValue = JSON.parse(record?.data);
                  }
                  return (
                    <Panel header={form.name} key={form.id}>
                      <OioForm
                        belong={species.current.space}
                        key={form.id}
                        form={form}
                        formRef={undefined}
                        fieldsValue={formValue}
                        disabled={true}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            </Card>
          </Timeline.Item>
        ));
      }
    });
  };

  return (
    <Card bordered={false} title="归档痕迹">
      <Timeline>
        {instances.map((a) => {
          return (
            <Timeline.Item key={a.id}>
              <Card>
                <div style={{ display: 'flex' }}>
                  <div style={{ paddingRight: '24px' }}>{a.title}</div>
                  <div style={{ paddingRight: '24px' }}>
                    {a.createTime.substring(0, a.createTime.length - 4)}
                  </div>
                  <div style={{ paddingRight: '24px' }}>
                    归属用户：{orgCtrl.provider.user?.findShareById(a.belongId!).name}
                  </div>
                  <div style={{ paddingRight: '24px' }}>
                    操作人：{orgCtrl.provider.user?.findShareById(a.createUser).name}
                  </div>
                </div>{' '}
                <Collapse ghost>{loadTaskContent(a)}</Collapse>
              </Card>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );
};
export default ThingArchive;
