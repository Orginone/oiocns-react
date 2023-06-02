import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import orgCtrl from '@/ts/controller';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/es/form/FormItemLabel';

interface IProps {
  dictId: string;
  rules: Rule[];
  name: string;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
  props: any;
}
/**
 * 字典组件
 */
const ProFormDict = (props: IProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const filterOption = (input: any, option: any) =>
    ((option?.label ?? '') as string).includes(input);
  const filterSort = (optionA: any, optionB: any) =>
    ((optionA?.label ?? '') as string)
      .toLowerCase()
      .localeCompare(((optionB?.label ?? '') as string).toLowerCase());

  useEffect(() => {
    orgCtrl.work.loadItems(props.dictId).then((value) => {
      setOptions(
        value.map((item) => {
          return { label: item.name, value: item.value };
        }),
      );
    });
  }, []);
  return (
    <ProFormSelect
      width={200}
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...props.rules,
        ...{ options },
        ...{ filterOption },
        ...{ filterSort },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormDict;
