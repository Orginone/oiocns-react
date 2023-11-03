import { InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [type, setType] = useState<'value' | 'auto' | 'none'>('value');
  const [number, setNumber] = useState<number | null>(null);
  const [unit, setUnit] = useState<CSSUnit | null>(null);
  const realValue = (type: string, number: number | null, unit: CSSUnit | null) => {
    if (type == 'none') {
      return '';
    } else if (type == 'auto') {
      return 'auto';
    } else {
      return number || number === 0 ? `${number}${unit}` : '';
    }
  };

  useEffect(() => {
    if (!value) {
      setType('none');
      setNumber(null);
      setUnit(null);
    } else if (value == 'auto') {
      setType('auto');
      setNumber(null);
      setUnit(null);
    } else {
      const match = /^(\d+)([a-zA-Z%]+)$/.exec(value);
      if (match) {
        setType('value');
        setNumber(parseFloat(match[1]));
        setUnit(match[2] as CSSUnit);
      } else {
        setType('none');
        setNumber(null);
        setUnit(null);
      }
    }
  }, [value]);

  const prefix = (
    <Select
      value={type}
      onChange={(v) => {
        let old: CSSUnit | null = unit;
        if (v == 'value' && !old) {
          old = 'px';
          setUnit(old);
        }
        setType(v);
        onChange(realValue(v, number, old));
      }}>
      <Select.Option value="value">数值</Select.Option>
      <Select.Option value="auto">自动</Select.Option>
      <Select.Option value="none">无</Select.Option>
    </Select>
  );
  const postfix = (
    <Select
      value={unit}
      onChange={(v) => {
        setUnit(v);
        onChange(realValue(type, number, v));
      }}
      disabled={type != 'value'}>
      {CSSUnits.map((v) => (
        <Select.Option key={v} value={v}>
          {v}
        </Select.Option>
      ))}
    </Select>
  );
  return (
    <InputNumber
      value={number}
      onChange={(v) => {
        setNumber(v);
        onChange(realValue(type, v, unit));
      }}
      addonBefore={prefix}
      addonAfter={postfix}
    />
  );
};

export default CssSizeEditor;
