import React, { useEffect, useState } from 'react';
import { Card, Collapse, Timeline } from 'antd';
import orgCtrl from '@/ts/controller';
import { kernel } from '@/ts/base';
import OioForm from '@/components/Form';

const { Panel } = Collapse;

interface IThingCardProps {
  thingId: string;
}
/**
 * 仓库-物-归档日志
 */
const ThingArchive: React.FC<IThingCardProps> = ({ thingId }) => {
  const [archives, setArchives] = useState<any[]>([]);
  useEffect(() => {
    const findThing = async () => {
      // TODO 注意，这里不对
      const res = await kernel.anystore.loadThingArchives(orgCtrl.user.id, {
        options: {
          match: {
            _id: {
              _eq_: thingId,
            },
          },
        },
        userData: [],
      });
      const resData = res.data as any;
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
                    {orgCtrl.provider.findNameById(a.node?.belongId!)}
                  </div>
                  <div style={{ paddingRight: '24px' }}>
                    操作人：{orgCtrl.provider.findNameById(record.createUser)}
                  </div>
                  <div>{record.comment && <div>审批意见：{record.comment}</div>}</div>
                </div>
                <Collapse ghost>
                  {(a.node?.bindOperations || []).map((operation: any) => {
                    let formValue = {};
                    if (record?.data) {
                      formValue = JSON.parse(record?.data);
                    }
                    return (
                      <Panel header={operation.name} key={operation.id}>
                        <OioForm
                          key={operation.id}
                          operation={operation}
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
