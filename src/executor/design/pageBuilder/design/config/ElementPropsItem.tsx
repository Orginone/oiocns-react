import { DatePicker, Input, InputNumber, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import editors from '.';
import { ExistTypeMeta, TypeMeta } from '../../core/ElementMeta';

interface Props {
  target: any;
  prop: string;
  meta: TypeMeta;
  onValueChange?: (v: any) => any;
  labelWidth?: string;
}

export default function ElementPropsItem(props: Props) {
  const [value, setValue] = useState<any>(props.target[props.prop] ?? props.meta.default);
  // 相当于watch props.target[props.prop]
  useEffect(() => {
    setValue(() => props.target[props.prop]);
  });

  const onValueChange = (v: any) => {
    props.target[props.prop] = v;
    setValue(v);
    props.onValueChange?.(v);
  };

  function renderExistType<T>(meta: ExistTypeMeta<T>) {
    const Editor = editors[meta.typeName];
    if (!Editor) {
      console.warn(`未知属性类型 ${meta.typeName}`);
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} />;
    }
    return (
      <Editor
        {...(meta.editorConfig || {})}
        prop={props.prop}
        value={value}
        onChange={onValueChange}
      />
    );
  }

  function renderComponent(meta: TypeMeta) {
    switch (meta.type) {
      case 'string':
        return (
          <Input
            readOnly={meta.readonly}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
        );
      case 'number':
        return (
          <InputNumber
            style={{ width: '100%' }}
            readOnly={meta.readonly}
            value={value}
            onChange={(e) => onValueChange(e)}
          />
        );
      case 'boolean':
        return (
          <Switch style={{ width: '100%' }} checked={value} onChange={onValueChange} />
        );
      case 'date':
        return (
          <DatePicker
            style={{ width: '100%' }}
            value={value}
            onChange={(_, date) => onValueChange(date)}
          />
        );
      case 'enum':
        return (
          <Select
            style={{ width: '100%' }}
            value={value}
            onChange={onValueChange}
            allowClear
            options={meta.options}
          />
        );
      case 'type':
        return renderExistType(meta);
      case 'object':
      case 'array':
      default:
        return <></>;
    }
  }

  return (
    <div className="page-element-props-item">
      <div
        className={'item-label ' + (props.meta.required ? 'is-required' : '')}
        title={props.meta.label || props.prop}
        style={{ width: props.labelWidth || '120px' }}>
        {props.meta.label || props.prop}
      </div>
      {renderComponent(props.meta)}
    </div>
  );
}
