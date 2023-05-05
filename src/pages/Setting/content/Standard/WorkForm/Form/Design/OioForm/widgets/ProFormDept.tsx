import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { ISpace } from '@/ts/core';

interface IProps {
  space: ISpace;
  [key: string]: any;
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

  useEffect(() => {
    const initTreeData = async () => {
      const res = await orgCtrl.getTeamTree(props.space);
      const data = targetsToTreeData(res);
      setTreeData(data);
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

export default ProFormDept;
