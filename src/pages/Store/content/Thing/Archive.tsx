import React, { useEffect, useState } from 'react';
import { Card, Collapse, Timeline } from 'antd';
import orgCtrl from '@/ts/controller';
import { kernel } from '@/ts/base';
import { ISpeciesItem } from '@/ts/core';
import OioForm from '@/pages/Setting/content/Standard/WorkForm/Form/Design/OioForm';

const { Panel } = Collapse;

interface IThingCardProps {
  species: ISpeciesItem;
  thingId: string;
}
/**
 * 仓库-物-归档日志
 */
const ThingArchive: React.FC<IThingCardProps> = ({ thingId, species }) => {
  const [archives, setArchives] = useState<any[]>([]);
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
      setArchives(data.sort((a, b) => a.sort_time - b.sort_time));
    };
    findThing();
  }, [thingId]);

  return (
    <Card bordered={false} title="归档痕迹">
      <Timeline>
        {archives.map((a) => {
          const record = a.record;
          return (
            <Timeline.Item key={record.id}>
              <Card>
                <div style={{ display: 'flex' }}>
                  <div style={{ paddingRight: '24px' }}>{a.node?.nodeType}</div>
                  <div style={{ paddingRight: '24px' }}>
                    {record.createTime.substring(0, record.createTime.length - 4)}
                  </div>
                  <div style={{ paddingRight: '24px' }}>
                    {orgCtrl.provider.user?.findShareById(a.node?.belongId!).name}
                  </div>
                  <div style={{ paddingRight: '24px' }}>
                    操作人：{orgCtrl.provider.user?.findShareById(record.createUser).name}
                  </div>
                  <div>{record.comment && <div>审批意见：{record.comment}</div>}</div>
                </div>
                <Collapse ghost>
                  {(a.node?.bindForms || []).map((form: any) => {
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
                          disabled={true}></OioForm>
                      </Panel>
                    );
                  })}
                </Collapse>
              </Card>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );
};
export default ThingArchive;
