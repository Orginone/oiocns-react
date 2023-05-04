import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { ISpace } from '@/ts/core';

interface IProps {
  space: ISpace;
  [key: string]: any;
}

type OptionType = {
  key: string;
  label: string;
  value: string;
  origin: any;
};

/**
 * 集团组件
 */
const ProFormGroup = (props: IProps) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    const initTreeData = async () => {
      const res = await orgCtrl.getTeamTree(props.space);
      setTreeData(targetsToTreeData(res));
    };
    initTreeData();
  }, []);

  return (
    <ProFormTreeSelect
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...props.rule,
        ...{ treeData },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormGroup;
