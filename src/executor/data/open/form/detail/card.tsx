import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { kernel } from '@/ts/base';
import CardDescriptions from '@/components/CardDescriptions';
import { IForm } from '@/ts/core';

interface IProps {
  thingId: string;
  belongId: string;
  forms?: IForm[];
}
/**
 * 存储-物-卡片
 */
const ThingCard: React.FC<IProps> = (props) => {
  const [formValue, setFormValue] = useState<any>({});
  useEffect(() => {
    kernel.anystore
      .loadThing<any>(props.belongId, {
        options: {
          match: {
            _id: props.thingId,
          },
        },
        userData: [],
      })
      .then((res) => {
        setFormValue(res.data.data[0].Propertys);
      });
  }, []);

  return (
    <Card bordered={false} title="资产卡片">
      {props.forms.map((form) => {
        return (
          <div key={form.id} style={{ paddingBottom: '16px' }}>
            <CardDescriptions
              form={form.metadata}
              fieldsValue={formValue}
              attrs={form.attributes}
            />
          </div>
        );
      })}
    </Card>
  );
};
export default ThingCard;
