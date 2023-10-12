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
} from '@ant-design/pro-form';
import { Rule } from 'antd/es/form';
import React from 'react';
import ProFormFile from './widgets/ProFormFile';
import ProFormAuth from './widgets/ProFormAuth';
import ProFormDept from './widgets/ProFormDept';
import ProFormGroup from './widgets/ProFormGroup';
import ProFormPerson from './widgets/ProFormPerson';
import ProFormIdentity from './widgets/ProFormIdentity';
import { IBelong } from '@/ts/core';
import { loadWidgetsOpts } from '../rule';
import { model } from '@/ts/base';
import EntityIcon from '../../GlobalComps/entityIcon';

interface IProps {
  disabled?: boolean;
  field: model.FieldModel;
  belong: IBelong;
  noRule?: boolean;
  value?: any;
  onFieldChange?: (key: string, value: any) => void;
}
/**
 * 表单项渲染
 */
const OioFormItem = ({
  field,
  belong,
  disabled,
  noRule,
  onFieldChange,
  value,
}: IProps) => {
  const rule = JSON.parse(field.rule || '{}');
  // 规则校验
  let rules: Rule[] = [];
  // 基本规则
  if (rule.rules) {
    if (typeof rule.rules === 'string') {
      rules = [...rules, { message: '所填内容不符合要求', pattern: rule.rules }];
    } else if (rule.rules instanceof Array) {
      for (const r of rule.rules) {
        rules = [...rules, { message: '所填内容不符合要求', pattern: r }];
      }
    }
  }
  // 对不展示规则需求，隐藏必填项
  if (noRule) {
    rule.required = false;
    rules = rules?.map((r) => {
      return { ...r, required: false };
    });
  } else {
    // 对展示规则需求，修改提示词
    if (rule.required === true && !noRule) {
      rules = [...rules, { required: true, message: `${field.name}为必填项` }];
    }
  }
  if (!rule.widget) {
    rule.widget = loadWidgetsOpts(field.valueType)[0].value;
  }
  const buildTreeNode = (id: string | undefined, items: model.FiledLookup[]): any[] => {
    return items
      .filter((i) => i.parentId == id)
      .map((i) => {
        return {
          label: i.text,
          value: i.value,
          children: buildTreeNode(i.id, items),
        };
      });
  };
  if (disabled) {
    switch (rule.widget) {
      case 'dept':
      case 'department':
      case 'person':
      case 'myself':
      case 'group':
      case 'auth':
      case 'identity':
        if (value) {
          return <EntityIcon entityId={value} showName size={20} />;
        }
        return <></>;
    }
  }
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload': {
      return (
        <ProFormFile
          disabled={disabled}
          name={field.id}
          values={value}
          onFieldChange={onFieldChange}
        />
      );
    }
    case 'date':
      return (
        <ProFormDatePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormSelect
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          tooltip={field.remark}
          fieldProps={{
            ...rules,
            options: (field.lookups || []).map((i) => {
              return { label: i.text, value: i.value };
            }),
          }}
          rules={rules}
        />
      );
    case 'species':
      return (
        <ProFormTreeSelect
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          tooltip={field.remark}
          fieldProps={{
            treeData: buildTreeNode(undefined, field.lookups || []),
          }}
          rules={rules}
        />
      );
    case 'department':
    case 'dept':
      return (
        <ProFormDept
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'person':
    case 'myself':
      return (
        <ProFormPerson
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          myself={rule.widget === 'myself'}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={field.id}
          fieldProps={rule}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
