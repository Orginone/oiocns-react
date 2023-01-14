import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { Input, Select } from 'antd';
import Generator, { FRGeneratorProps, defaultSettings } from 'fr-generator';
import React from 'react';

interface FormDesignProps extends FRGeneratorProps {
  current: ISpeciesItem;
}

export type WidgetProps = {
  value: any;
  onChange: (value: any) => void;
};

// 分类特性小部件
const AttrWidget: React.FC<WidgetProps> = ({ value, onChange }) => (
  <Input defaultValue={value} onChange={onChange} />
);

// 分类字典小部件
const DictWidget: React.FC<WidgetProps> = ({ value, onChange }) => (
  <Select
    defaultValue={value}
    onChange={onChange}
    style={{ width: '100%' }}
    options={[
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
      {
        value: 'Yiminghe',
        label: 'yiminghe',
      },
    ]}
  />
);

// 自定义扩展组件
const widgets: any[] = [
  {
    text: '分类特性',
    name: 'attr',
    schema: { title: '分类特性', type: 'string', widget: 'attrWidget' },
    setting: {
      bind: { title: '字段名', type: 'string', widget: 'select' },
    },
  },
  {
    text: '分类字典',
    name: 'dict',
    schema: { title: '分类字典', type: 'string', widget: 'dictWidget' },
    setting: {
      dict: { title: '字典名称', type: 'string', widget: 'select' },
    },
  },
  // {
  //   text: '子表数量统计',
  //   name: 'stat',
  //   schema: { title: '子表数量统计', type: 'number' },
  // },
  // {
  //   text: '字段求和',
  //   name: 'sum',
  //   schema: { title: '字段求和', type: 'number' },
  //   setting: {
  //     sumField: { title: '子表求和字段名', type: 'string' },
  //   },
  // },
];

// 左侧组件配置
const settings = [
  { show: true, title: '平台组件(自定义扩展)', useCommon: true, widgets },
  ...defaultSettings,
];

// 公共设置
const commonSetting = {
  $id: {
    title: 'ID',
    description: '字段名称/英文',
    type: 'string',
    widget: 'idInput',
    require: true,
    hidden: true,
    readOnly: true,
    rules: [
      {
        pattern: '^#/.+$',
        message: 'ID 必填',
      },
    ],
  },
  title: {
    title: '标题',
    type: 'string',
    widget: 'htmlInput',
  },
  displayType: {
    title: '标题展示模式',
    type: 'string',
    enum: ['row', 'column'],
    enumNames: ['同行', '单独一行'],
    widget: 'radio',
  },
  description: {
    title: '说明',
    type: 'string',
  },
  required: {
    title: '必填',
    type: 'boolean',
  },
  bind: {
    title: '字段名',
    type: 'string',
    require: true,
  },
};

/*
  表单设计
*/
const FormDesign = (props: FormDesignProps) => {
  return (
    <Generator
      defaultValue={props.defaultValue}
      settings={settings}
      commonSettings={commonSetting}
      widgets={{ dictWidget: DictWidget, attrWidget: AttrWidget }}
      onSchemaChange={props.onSchemaChange}
    />
  );
};

export default FormDesign;
