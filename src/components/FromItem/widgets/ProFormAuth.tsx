import orgCtrl from '@/ts/controller';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';

/**
 * 权限组件
 */
const ProFormAuth = (props: any) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree = await orgCtrl.user.loadSpaceAuthorityTree(false);
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
