import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { targetsToTreeData } from '@/pages/Setting';

type OptionType = {
  key: string;
  label: string;
  value: string;
  origin: any;
};

/**
 * 部门组件
 */
const ProFormDept = (props: any) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    const initTreeData = async () => {
      const res = await orgCtrl.getTeamTree();
      const data = targetsToTreeData(res).filter((d) => d.value == orgCtrl.user.id);
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
