import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { Rule } from 'antd/es/form';
import React from 'react';
import ProFormAuth from './widgets/ProFormAuth';
import ProFormDept from './widgets/ProFormDept';
import ProFormDict from './widgets/ProFormDict';
import ProFormGroup from './widgets/ProFormGroup';
import ProFormPerson from './widgets/ProFormPerson';
import ProFormIdentity from './widgets/ProFormIdentity';
import { XAttribute } from '@/ts/base/schema';
import { IBelong } from '@/ts/core';
import { loadWidgetsOpts } from '../rule';

interface IProps {
  disabled?: boolean;
  item: XAttribute;
  belong: IBelong;
  noRule?: boolean;
}

/**
 * 表单项渲染
 */
const OioFormItem = ({ item, belong, disabled, noRule }: IProps) => {
  const rule = JSON.parse(item.rule || '{}');
  // 规则校验
  let rules: Rule[] = [];
  if (rule.rules && !noRule) {
    if (typeof rule.rules === 'string') {
      rules = [...rules, { message: '所填内容不符合要求', pattern: rule.rules }];
    } else if (rule.rules instanceof Array) {
      for (const r of rule.rules) {
        rules = [...rules, { message: '所填内容不符合要求', pattern: r }];
      }
    }
  }
  if (rule.required === true) {
    rules = [...rules, { required: true, message: `${rule.title}为必填项` }];
  }
  if (noRule) {
    rules = [];
  }
  if (!rule.widget) {
    rule.widget = loadWidgetsOpts(item.valueType)[0].value;
  }
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          disabled={disabled}
          name={item.id}
          required={rule.required}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          disabled={disabled}
          name={item.id}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          disabled={disabled}
          name={item.id}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload':
      return (
        <ProFormUploadButton
          disabled={disabled}
          name={item.id}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'date':
      return (
        <ProFormDatePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormDict
          label=""
          dictId={item.dictId}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
          props={rule}
        />
      );
    case 'department':
    case 'dept':
      return (
        <ProFormDept
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'person':
      return (
        <ProFormPerson
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={item.id}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
