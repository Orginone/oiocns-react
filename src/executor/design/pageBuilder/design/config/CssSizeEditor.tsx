import { computed, useSignal, useSignalEffect } from '@preact/signals-react';
import { InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';
import { IExistTypeEditor } from './IExistTypeEditor';

export const CSSUnits = [
  'px',
  'pt',
  'cm',
  'in',
  'em',
  'rem',
  'vh',
  'vw',
  'vmin',
  'vmax',
  '%',
] as const;
export type CSSUnit = (typeof CSSUnits)[number];

const CssSizeEditor: IExistTypeEditor<string> = ({ value, onChange }) => {
  const type = useSignal<'value' | 'auto' | 'none'>('value');
  const number = useSignal<number | null>(null);
  const unit = useSignal<CSSUnit | null>(null);
  const realValue = computed(() => {
    if (type.value == 'none') {
      return '';
    } else if (type.value == 'auto') {
      return 'auto';
    } else {
      return number.value || number.value === 0 ? `${number.value}${unit.value}` : '';
    }
  });
  useSignalEffect(() => {
    onChange(realValue.value);
  });

  useEffect(() => {
    if (!value) {
      type.value = 'none';
      number.value = null;
      unit.value = null;
    } else if (value == 'auto') {
      type.value = 'auto';
      number.value = null;
      unit.value = null;
    } else {
      const match = /^(\d+)([a-zA-Z%]+)$/.exec(value);
      if (match) {
        type.value = 'value';
        number.value = parseFloat(match[1]);
        unit.value = match[2] as CSSUnit;
      } else {
        type.value = 'none';
        number.value = null;
        unit.value = null;
      }
    }
  }, [value]);

  const prefix = (
    <Select
      value={type.value}
      onChange={(v) => {
        if (v == 'value' && !unit.value) {
          unit.value = 'px';
        }
        type.value = v;
      }}>
      <Select.Option value="value">数值</Select.Option>
      <Select.Option value="auto">自动</Select.Option>
      <Select.Option value="none">无</Select.Option>
    </Select>
  );
  const postfix = (
    <Select
      value={unit.value}
      onChange={(v) => (unit.value = v)}
      disabled={type.value != 'value'}>
      {CSSUnits.map((v) => (
        <Select.Option key={v} value={v}>
          {v}
        </Select.Option>
      ))}
    </Select>
  );
  return (
    <InputNumber
      value={number.value}
      onChange={(v) => (number.value = v)}
      addonBefore={prefix}
      addonAfter={postfix}
    />
  );
};

export default CssSizeEditor;
