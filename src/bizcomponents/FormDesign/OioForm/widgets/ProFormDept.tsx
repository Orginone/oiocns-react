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

/**
 * 部门组件
 */
const ProFormDept = (props: IProps) => {
  const [treeData, setTreeData] = useState<
    {
      key: string;
      label: string;
      value: string;
      origin: any;
    }[]
  >([]);

  // useEffect(() => {
  //   const initTreeData = async () => {
  //     const res = await orgCtrl.getTeamTree(props.belong);
  //     const data = targetsToTreeData(res);
  //     setTreeData(data);
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
      width={150}
      rules={props.rules}
    />
  );
};

export default ProFormDept;
