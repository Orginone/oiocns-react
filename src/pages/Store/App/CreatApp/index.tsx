import React, { useState } from 'react';
// import cls from './index.module.less';

import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProFormSelect } from '@ant-design/pro-components';
import { Button, Alert, DatePicker, Space } from 'antd';

import { columns, DataItem, valueEnum } from './config';
import dayjs from 'dayjs';
interface indexType {
  props: []; //props
}
const Index: React.FC<indexType> = ({ props }) => {
  console.log('打印index', props);

  const [layoutType, setLayoutType] = useState<ProFormLayoutType>('Form');
  return (
    <>
      {/* <Space
        style={{
          width: '100%',
        }}
        direction="vertical">
        <ProFormSelect
          label="布局方式"
          options={[
            'Form',
            'ModalForm',
            'DrawerForm',
            'LightFilter',
            'QueryFilter',
            'StepsForm',
            'StepForm',
            'Embed',
          ]}
          fieldProps={{
            value: layoutType,
            onChange: (e) => setLayoutType(e),
          }}
        />
      </Space> */}
      <BetaSchemaForm<DataItem>
        trigger={<a>点击我</a>}
        layoutType={layoutType}
        steps={[
          {
            title: 'ProComponent',
          },
        ]}
        rowProps={{
          gutter: [16, 16],
        }}
        colProps={{
          span: 12,
        }}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values) => {
          console.log(values);
        }}
        columns={(layoutType === 'StepsForm' ? [columns] : columns) as any}
      />
    </>
  );
};

export default Index;
