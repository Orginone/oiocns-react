import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ProFormSelect } from '@ant-design/pro-components';

/**
 * 人员组件
 */
const ProFormPerson = (props: any) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const initOptions = async () => {
      const res = await orgCtrl.user.loadMembers({
        offset: 0,
        limit: 1000000,
        filter: '',
      });
      const persons =
        res.result?.map((xtarget) => {
          return { label: xtarget.name, value: xtarget.id };
        }) || [];
      setOptions(persons);
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
