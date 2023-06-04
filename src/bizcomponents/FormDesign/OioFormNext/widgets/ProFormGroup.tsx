import React, { useEffect, useState } from 'react';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { IBelong } from '@/ts/core';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';

interface IProps {
  rules: Rule[];
  name: string;
  belong?: IBelong;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
}

type OptionType = {
  key: string;
  label: string;
  value: string;
  origin: any;
};

/**
 * 组织集群组件
 */
const ProFormGroup = (props: IProps) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    if (props.belong) {
      const initTreeData = async () => {
        setTreeData(
          props.belong!.parentTarget.map((i) => {
            return {
              key: i.key,
              label: i.name,
              value: i.id,
              origin: 0,
            };
          }),
        );
      };
      initTreeData();
    }
  }, []);

  return (
    <ProFormTreeSelect
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...props.rules,
        ...{ treeData },
      }}
      width={200}
      rules={props.rules}
    />
  );
};

export default ProFormGroup;
