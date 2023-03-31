import { OperationItem } from '@/ts/base/model';
import { ProField } from '@ant-design/pro-components';
import React from 'react';
import DictField from './fields/DictField';

export interface IOioFieldProp {
  item: OperationItem;
  value: any;
}

/**
 * 卡片项渲染
 */
const OioField: React.FC<IOioFieldProp> = ({ item, value }) => {
  const rule = JSON.parse(item.rule);
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
    case 'digit':
    case 'number':
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'select':
      // Todo 加载下拉数据
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'treeSelect':
      // Todo 加载树下拉数据
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'file':
    case 'upload':
      // Todo 加载树下拉数据
      return <ProField text={value} valueType="image" mode={'read'} />;
    case 'image':
      return <ProField text={value} valueType="image" mode={'read'} />;
    case 'date':
      return <ProField text={value} valueType="date" mode={'read'} />;
    case 'datetime':
      return <ProField text={value} valueType="date" mode={'read'} />;
    case 'dateRange':
      return <ProField text={value} valueType="dateRange" mode={'read'} />;
    case 'dateTimeRange':
      return <ProField text={value} valueType="dateTimeRange" mode={'read'} />;
    case 'checkbox':
      // Todo
      return <ProField text={value} valueType="checkbox" mode={'read'} />;
    case 'radio':
      // Todo
      return <ProField text={value} valueType="radio" mode={'read'} />;
    case 'money':
      // Todo
      return <ProField text={value} valueType="money" mode={'read'} />;
    case 'dict':
      return <DictField dictId={rule.dictId} value={value} />;
    // return <ProField text={value} valueType="text" mode={'read'} />;
    case 'department':
      // Todo
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'person':
      // Todo
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'group':
      // Todo
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'auth':
      // Todo
      return <ProField text={value} valueType="text" mode={'read'} />;
    case 'identity':
      // Todo
      return <ProField text={value} valueType="text" mode={'read'} />;
    default:
      return <ProField text={value} valueType="text" mode={'read'} />;
  }
};

export default OioField;
