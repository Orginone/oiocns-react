import React from 'react';
import {
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import ProFormDict from './../render/widgets/ProFormDict';
import ProFormPerson from './../render/widgets/ProFormPerson';
import ProFormDept from './../render/widgets/ProFormDept';
import ProFormGroup from './../render/widgets/ProFormGroup';

/**
 * 表单项渲染
 */
const OioFormItem = (props: any) => {
  const { item } = props;
  const rule = JSON.parse(item.rule);
  // console.log('rule.rules', rule);
  if (rule.rules && typeof rule.rules === 'string') {
    rule.rules = JSON.parse(rule.rules);
  }
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          name={item.code}
          label={rule.title}
          required={rule.required}
          fieldProps={rule}
          rules={rule.rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          name={item.code}
          label={rule.title}
          fieldProps={rule}
          rules={rule.rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          name={item.code}
          label={rule.title}
          fieldProps={rule}
          rules={rule.rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload':
      return (
        <ProFormUploadButton
          name={item.code}
          label={rule.title}
          fieldProps={rule}
          rules={rule.rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'date':
      return (
        <ProFormDatePicker
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormDict
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
          props={rule}
        />
      );
    case 'dept':
      return (
        <ProFormDept
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'person':
      return (
        <ProFormPerson
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          name={item.code}
          label={rule.title}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={item.code}
          label={rule.title}
          fieldProps={rule}
          rules={rule.rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
