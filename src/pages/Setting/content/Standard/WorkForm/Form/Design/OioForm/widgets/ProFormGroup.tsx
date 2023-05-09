import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { IBelong } from '@/ts/core';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';

interface IProps {
  rules: Rule[];
  name: string;
  belong: IBelong;
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
 * 组织群组件
 */
const ProFormGroup = (props: IProps) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  // useEffect(() => {
  //   const initTreeData = async () => {
  //     const res = await orgCtrl.getTeamTree(props.space);
  //     setTreeData(targetsToTreeData(res));
  //   };
  //   initTreeData();
  // }, []);

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
      rules={props.rules}
    />
  );
};

export default ProFormGroup;
