import { IAuthority, IBelong } from '@/ts/core';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { Rule } from 'antd/lib/form';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';

interface IProps {
  rules: Rule[];
  name: string;
  belong: IBelong;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
}

/**
 * 权限组件
 */
const ProFormAuth = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree = await props.belong.loadSuperAuth(false);
    if (tree) {
      setTreeData([
        ...[{ label: '全员', value: '0', key: '0', children: [] }],
        ...getTreeData([tree]),
      ]);
    }
  };
  const getTreeData = (targets: IAuthority[]): DefaultOptionType[] => {
    return targets.map((item: IAuthority) => {
      return {
        key: item.id,
        label: item.name,
        value: item.id,
        children:
          item.children && item.children.length > 0 ? getTreeData(item.children) : [],
      };
    });
  };

  useEffect(() => {
    loadTreeData();
  }, []);

  return (
    <ProFormTreeSelect
      name={props.name}
      label={props.label || '角色'}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      allowClear
      width={150}
      fieldProps={{
        ...props.rules,
        ...{ treeData },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormAuth;
