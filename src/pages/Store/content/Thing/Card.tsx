import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import { XOperation } from '@/ts/base/schema';
import CardDescriptions from '@/components/CardDescriptions';

interface IThingCardProps {
  thingId: string;
}
/**
 * 仓库-物-卡片
 */
const ThingCard: React.FC<IThingCardProps> = ({ thingId }) => {
  const [operations, setOperations] = useState<XOperation[]>([]);
  const [formValue, setFormValue] = useState<any>({});
  useEffect(() => {
    const findThing = async () => {
      const res = await kernel.anystore.loadThing<any>(userCtrl.space.id, {
        options: {
          match: {
            _id: {
              _eq_: thingId,
            },
          },
        },
        userData: [],
      });
      let thing: any;
      const data = res.data?.data;
      if (data && data.length > 0) {
        thing = data[0];
      }
      if (thing) {
        const speciesIds: string[] = [];
        let formValue: any = {};
        for (const key in thing) {
          if (Object.prototype.hasOwnProperty.call(thing, key)) {
            const element = thing[key];
            if (key.startsWith('S')) {
              const id = key.substring(1, key.length);
              if (id.length >= 16 && id.length <= 20) {
                formValue = { ...formValue, ...element };
                speciesIds.push(id);
              }
            }
          }
        }
        setFormValue(formValue);
        const attrIds: string[] = [];
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key)) {
            attrIds.push(key.substring(1, key.length));
          }
        }
        // 2、查询表单
        const operationsRes = await kernel.queryOperationBySpeciesIds({
          ids: speciesIds,
          spaceId: userCtrl.space.id,
        });
        let operations = operationsRes.data.result || [];
        operations = operations.filter((operation) => {
          let exist = false;
          for (const item of operation.items || []) {
            if (attrIds.includes(item.attrId)) {
              exist = true;
              break;
            }
          }
          return exist;
        });
        setOperations(operations);
      }
    };
    findThing();
  }, [thingId]);

  return (
    <Card bordered={false} title="资产卡片">
      {operations.map((operation) => {
        return (
          <div key={operation.id} style={{ paddingBottom: '16px' }}>
            <CardDescriptions operation={operation} fieldsValue={formValue} />
          </div>
        );
      })}
    </Card>
  );
};
export default ThingCard;
