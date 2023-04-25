import React, { useEffect, useState } from 'react';
import { kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { ProFormSelect } from '@ant-design/pro-components';

/**
 * 字典组件
 */
const ProFormDict = (props: any) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const filterOption = (input: any, option: any) =>
    ((option?.label ?? '') as string).includes(input);
  const filterSort = (optionA: any, optionB: any) =>
    ((optionA?.label ?? '') as string)
      .toLowerCase()
      .localeCompare(((optionB?.label ?? '') as string).toLowerCase());

  useEffect(() => {
    const initOptions = async () => {
      const res = await kernel.queryDictItems({
        id: props.props.dictId,
        spaceId: orgCtrl.user.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const dictItems =
        res.data.result?.map((item) => {
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
