import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { IBelong } from '@/ts/core';

interface IProps {
  belong: IBelong;
  dictId: string;
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
      const dicts = await props.belong.loadDicts();
      const dict = dicts.find((a) => a.metadata.id == props.dictId);
      const dictItems = await dict?.loadItems();
      setOptions(
        dictItems?.map((item) => {
          return { label: item.name, value: item.value };
        }) || [],
      );
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
