import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
// import { IBelong } from '@/ts/core';
import orgCtrl from '@/ts/controller';
interface IProps {
  // rules: Rule[];
  // name: string;
  // belong: any;
  // label: React.ReactNode;
  // labelAlign: FormLabelAlign;
  // tooltip: LabelTooltipType;
  schema: any;
}

/**
 * 人员组件
 */
const ProFormPerson = (props: IProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const belong = orgCtrl.targets.find(
      (a) => a.id == props.schema?.metadata?.belongId,
    ) as any;

    const initOptions = async () => {
      setOptions(
        belong.members?.map((xtarget: any) => {
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
      name={props.schema.title}
      // label={props.schema.title}
      width={200}
      fieldProps={{
        ...{ options },
        ...{ filterOption },
        ...{ filterSort },
      }}
    />
  );
};

export default ProFormPerson;
