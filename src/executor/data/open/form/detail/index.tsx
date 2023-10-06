import { Card, Tabs } from 'antd';
import React from 'react';
import { ImUndo2 } from '@/icons/im';
import ThingArchive from './archive';
import { IForm } from '@/ts/core';
import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { schema } from '@/ts/base';

interface IProps {
  form: IForm;
  thingData: schema.XThing;
  onBack: () => void;
}

/**
 * 物-查看
 * @returns
 */
const ThingView: React.FC<IProps> = (props) => {
  const convertData = () => {
    let data: any = {};
    for (let [key, value] of Object.entries(props.thingData)) {
      const field = props.form.fields.find((a) => a.code == key);
      if (field) {
        data[field.id] = value;
      }
    }
    return data;
  };
  return (
    <Card>
      <Tabs
        items={[
          {
            key: '1',
            label: `归档痕迹`,
            children: (
              <ThingArchive instances={Object.values(props.thingData.archives)} />
            ),
          },
          {
            key: '2',
            label: `卡片信息`,
            children: (
              <OioForm
                key={props.form.id}
                form={props.form.metadata}
                fields={props.form.fields}
                fieldsValue={convertData()}
                belong={props.form.directory.target.space}
                disabled={true}
                submitter={{
                  resetButtonProps: {
                    style: { display: 'none' },
                  },
                  render: (_: any, _dom: any) => <></>,
                }}
              />
            ),
          },
        ]}
        tabBarExtraContent={
          <div
            style={{ display: 'flex', cursor: 'pointer' }}
            onClick={() => {
              props.onBack();
            }}>
            <a style={{ paddingTop: '2px' }}>
              <ImUndo2 />
            </a>
            <a style={{ paddingLeft: '6px' }}>返回</a>
          </div>
        }
      />
    </Card>
  );
};

export default ThingView;
