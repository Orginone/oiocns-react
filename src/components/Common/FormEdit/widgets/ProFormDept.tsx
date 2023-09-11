import React, { useState } from 'react';
import { ProFormTreeSelect } from '@ant-design/pro-components';

interface IProps {
  schema: any;
}

interface treeModel {
  key: string;
  label: string;
  value: string;
  children: treeModel[];
}
/**
 * 部门组件
 */
const ProFormDept = (props: IProps) => {
  const [treeData] = useState<treeModel[]>(props.schema?.metadata?.deptTree ?? []);

  return (
    <ProFormTreeSelect
      fieldProps={{
        ...{ treeData },
      }}
    />
  );
};

export default ProFormDept;
