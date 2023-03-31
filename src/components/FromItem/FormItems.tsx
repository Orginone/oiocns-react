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

/**
 * 表单项渲染
 */
const OioFormItem = (props: any) => {
  const { item } = props;
  const rule = JSON.parse(item.rule);
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
          name={item.attrId}
          label={rule.title}
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
          name={item.attrId}
          label={rule.title}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          name={item.attrId}
          label={rule.title}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload':
      return (
        <ProFormUploadButton
          name={item.attrId}
          label={rule.title}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'date':
      return (
        <ProFormDatePicker
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormDict
          name={item.attrId}
          label={rule.title}
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
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'person':
      return (
        <ProFormPerson
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          name={item.attrId}
          label={rule.title}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={item.attrId}
          label={rule.title}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
