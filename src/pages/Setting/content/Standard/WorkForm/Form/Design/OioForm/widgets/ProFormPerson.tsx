import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { IBelong } from '@/ts/core';

interface IProps {
  space: IBelong;
  [key: string]: any;
}

/**
 * 人员组件
 */
const ProFormPerson = (props: IProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const initOptions = async () => {
      setOptions(
        props.space.members?.map((xtarget) => {
          return { label: xtarget.name, value: xtarget.id };
        }) || [],
      );
    };
    initOptions();
  }, []);

  const filterOption = (input: any, option: any) =>
    ((option?.label ?? '') as string).includes(input);
  const filterSort = (optionA: any, optionB: any) =>
    ((optionA?.label ?? '') as string)
      .toLowerCase()
      .localeCompare(((optionB?.label ?? '') as string).toLowerCase());

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

export default ProFormPerson;
