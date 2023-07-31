// import { Col, Row, Select } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
// import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, {
  // defaultCommonSettings,
  // defaultGlobalSettings,
  defaultSettings,
} from 'fr-generator';
// const { Provider, Sidebar, Canvas, Settings } = Generator;
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
import { defaultCommonSettings } from './setting.js';
type IProps = {
  current: IForm;
  finished: () => void;
  editFormOpen: boolean;
  defaultSchema: schemaType
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
const FormEditModal: React.FC<IProps> = ({ current, finished, defaultSchema, editFormOpen = false, itemClick }) => {



  // 创建ref
  const myComponentRef = useRef(null);

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
    const ruleInfo = JSON.parse(current.metadata.rule || '{}');
    current.update({
      ...current.metadata,
      rule: JSON.stringify({
        ...ruleInfo,
        schema: e,
      }),
    });
  }
  const onCanvasSelect = (e: any) => {
    // if (JSON.stringify(e) !== '{}')
    //   itemClick(e);
    console.log(e)
  }



  //页面重载获取默认schema或者配置后的schema
  const settings = defaultSettings[0]
  settings.widgets = [
    {
    "text": "HTML",
    "name": "html",
    "schema": {
      "title": "HTML",
      "type": "string",
      "widget": "html"
    },
    "setting": {
      "props": {
        "type": "object",
        "properties": {
          "value": {
            "title": "展示内容",
            "type": "string"
          }
        }
      }
    }
  },
  {
    "text": "数字输入框",
    "name": "number",
    "schema": {
        "title": "数字输入框",
        "type": "number"
    },
    "setting": {
        "default": {
            "title": "默认值",
            "type": "number"
        },
      "format": {
        "title": "类型",
        "type": "string",
        "enum": [
          "number",
          "gold"
        ],
        "enumNames": [
          "数字",
          "金额",
        ]
      }
    }
}
  // {
  //   "text": "11",
  //   "name": "number",
  //   "setting": {
  //     "format": {
  //       "title": "类型",
  //       "type": "string",
  //       "enum": [
  //         "dateTime",
  //         "date"
  //       ],
  //       "enumNames": [
  //         "多行文本",
  //         "文本",
  //         "链接"
  //       ]
  //     }
  //   }
  // }
  ]

  // const fieldRenderFun = (schema:any, widgetProps:any, children:any, originNode:any)=>{

  //   const {margin} = schema;

  //   const marginResult = margin && typeof(Number(margin)) === 'number'? margin + "px":0
  //   console.log(marginResult,"marginResult")
  //   return <div style={{width:'100%',display:'flex',lineHeight:"30px",margin:marginResult}}>
  //     {originNode}
  //   </div>
  // }
  // const fieldWrapperRenderFun= (schema:any, isSelected:any, children:any, originNode:any)=>{
  //   const {margin} = schema;

  //   const marginResult = margin && typeof(Number(margin)) === 'number'? margin + "px":0
  //   console.log(marginResult,"marginResult")
  //   return <div style={{width:'100%',display:'flex',lineHeight:"30px",margin:marginResult}}>
  //     {originNode}
  //   </div>
  // }
  useEffect(() => {
    console.log(myComponentRef.current, "@@")
    // const Generator:any = myComponentRef.current;
    // const PreSchema = Generator.getValue();
  }, [])
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
        settings={[defaultSettings[2], settings]}
        hideId
        onCanvasSelect={onCanvasSelect}
        widgets={{ money: ProFormMoney }}
        commonSettings={{ ...defaultCommonSettings }}
        // fieldRender = {fieldRenderFun}
        // fieldWrapperRender = {fieldWrapperRenderFun}
        ref={myComponentRef}
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
