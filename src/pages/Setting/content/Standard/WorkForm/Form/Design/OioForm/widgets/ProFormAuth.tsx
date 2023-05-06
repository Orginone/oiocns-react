import { IAuthority, IBelong } from '@/ts/core';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';

interface IProps {
  belong: IBelong;
  [key: string]: any;
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
        key: item.metadata.id,
        label: item.metadata.name,
        value: item.metadata.id,
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
      colProps={props.colProps}
      allowClear
      fieldProps={{
        ...props.rule,
        ...{ treeData },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormAuth;
