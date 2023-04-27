import React, { useEffect, useState } from 'react';
import { pageAll } from '@/ts/base';
import { ProFormSelect } from '@ant-design/pro-components';
import { ISpace } from '@/ts/core';

interface IProps {
  space: ISpace;
  [key: string]: any;
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
    const initOptions = async () => {
      const res = await props.space.dict.loadDictItem(
        props.props.dictId,
        props.space.id,
        pageAll(),
      );
      const dictItems =
        res.result?.map((item) => {
          return { label: item.name, value: item.value };
        }) || [];
      setOptions(dictItems);
    };
    initOptions();
  }, []);
  return (
    <ProFormSelect
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...props.rule,
        ...{ options },
        ...{ filterOption },
        ...{ filterSort },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormDict;
