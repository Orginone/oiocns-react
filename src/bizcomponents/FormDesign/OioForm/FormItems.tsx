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
import { IBelong } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';

interface IProps {
  disabled?: boolean;
  belong: IBelong;
  item: XAttribute;
}

/**
 * 表单项渲染
 */
const OioFormItem = ({ item, belong, disabled }: IProps) => {
  const rule = JSON.parse(item.rule || '{}');
  // 规则校验
  let rules: Rule[] = [];
  if (rule.rules) {
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
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          disabled={disabled}
          name={item.name}
          label={item.name}
          required={rule.required}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          disabled={disabled}
          name={item.name}
          label={item.name}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          disabled={disabled}
          name={item.name}
          label={item.name}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload':
      return (
        <ProFormUploadButton
          disabled={disabled}
          name={item.name}
          label={item.name}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'date':
      return (
        <ProFormDatePicker
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          disabled={disabled}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormDict
          dictId={rule.dictId}
          belong={belong}
          name={item.name}
          label={item.name}
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
          belong={belong}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'person':
      return (
        <ProFormPerson
          belong={belong}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          belong={belong}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          belong={belong}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          belong={belong}
          name={item.name}
          label={item.name}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={item.name}
          label={item.name}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
