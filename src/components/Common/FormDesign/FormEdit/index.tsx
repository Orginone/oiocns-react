import { Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, {
  defaultCommonSettings,
  defaultGlobalSettings,
  defaultSettings,
} from 'fr-generator';
const { Provider, Sidebar, Canvas,Settings } = Generator;
// import Settings from './components/Settings';
import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  schemaType
} from '@/ts/base/schema';
type IProps = {
  current: IForm;
  finished: () => void;
  editFormOpen: boolean;
  defaultSchema:schemaType
  itemClick: (e: any) => void;

};

type FormLayout = {
  layout: 'horizontal' | 'vertical';
  col: 8 | 12 | 24;
};



/**
 * 表单设计器
 * @param props
 */
const FormEditModal: React.FC<IProps> = ({ current, finished, defaultSchema,editFormOpen = false, itemClick }) => {
  console.log("@@", current);
 


  const [formLayout, setFormLayout] = useState<FormLayout>(
    current.metadata.rule
      ? JSON.parse(current.metadata.rule)
      : {
        type: 'object',
        properties: {},
        labelWidth: 120,
        layout: 'horizontal',
        col: 12,
      },
  );


  // const NewWidget = ({ value = 0, onChange }) => (
  //   <button onClick={() => onChange(value + 1)}>{value}</button>
  // );
  const onSchemaChange = (e: schemaType) => {
  
      current.update({
        ...current.metadata,
        rule: JSON.stringify({
          schema: e,
        }),
      });
    //window.localStorage.setItem('schema', JSON.stringify(e));
  }
  const onCanvasSelect = (e: any) => {
    console.log("onCanvasSelect", e)
    if (JSON.stringify(e) !== '{}')
      itemClick(e);
  }
  
 
  // 布局改变
  const layoutChange = (value: any) => {
    const newFormLayout = { ...formLayout, ...value };
    setFormLayout(newFormLayout);
    current.metadata.rule = current.metadata.rule || '{}';
    current.update({
      ...current.metadata,
      rule: JSON.stringify({
        ...JSON.parse(current.metadata.rule),
        ...newFormLayout,
      }),
    })
  };
  //页面重载获取默认schema或者配置后的schema

  console.log("defaultSettings",defaultSettings)
 //const  settings = defaultSettings[2].
  return (
    <FullScreenModal
      open={editFormOpen}
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={'表单设计'}
      footer={[]}
      onCancel={finished}>
        <Generator 
         defaultValue={defaultSchema}
         onSchemaChange={onSchemaChange}
         settings={[defaultSettings[2]]}
         hideId
         onCanvasSelect={onCanvasSelect}
         widgets={{ money: ProFormMoney }}
       />
      {/* <Provider
        defaultValue={defaultSchema}
        onSchemaChange={onSchemaChange}
        settings={[defaultSettings[2]]}
        hideId
      >
        <div className="fr-generator-container">
          <div>
            <div style={{ padding: '16px 0 0 8px' }}>
              <p >整体布局</p>
              <Select
                defaultValue={formLayout.col}
                style={{ width: '120px' }}
                options={[
                  { value: 24, label: '一行一列' },
                  { value: 12, label: '一行两列' },
                  { value: 8, label: '一行三列' },
                ]}
                onChange={(value) => {
                  layoutChange({ col: value });
                }}
              />
              <Select
                defaultValue={formLayout.layout}
                style={{ width: '80px' }}
                options={[
                  { value: 'horizontal', label: '水平' },
                  { value: 'vertical', label: '垂直' },
                ]}
                onChange={(value) => {
                  layoutChange({ layout: value });
                }}
              />
            </div>

            <div style={{ height: "200px" }}>
              <Sidebar fixedName />
            </div>
          </div>
          <Canvas onCanvasSelect={onCanvasSelect}/>
        </div>
      </Provider> */}
    </FullScreenModal>
  );
};

export default FormEditModal;
