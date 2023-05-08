import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { kernel } from '@/ts/base';
import CardDescriptions from '@/components/CardDescriptions';
import { IWorkForm } from '@/ts/core';

interface IThingCardProps {
  thingId: string;
  species: IWorkForm;
}
/**
 * 存储-物-卡片
 */
const ThingCard: React.FC<IThingCardProps> = ({ thingId, species }) => {
  const [formValue, setFormValue] = useState<any>({});
  useEffect(() => {
    kernel.anystore
      .loadThing<any>(species.current.space.metadata.id, {
        options: {
          match: {
            _id: {
              _eq_: thingId,
            },
          },
        },
        userData: [],
      })
      .then((res) => {
        setFormValue(res.data.data[0].Propertys);
      });
  }, [thingId]);

  return (
    <Card bordered={false} title="资产卡片">
      {species.forms.map((form) => {
        return (
          <div key={form.id} style={{ paddingBottom: '16px' }}>
            <CardDescriptions
              form={form}
              fieldsValue={formValue}
              attrs={species.attributes}
            />
          </div>
        );
      })}
    </Card>
  );
};
export default ThingCard;
