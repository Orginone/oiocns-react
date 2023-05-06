import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { DefaultOptionType } from 'rc-select/lib/Select';
import { IAuthority, IBelong } from '@/ts/core';
interface IProps {
  value?: string;
  onChange: any;
  space: IBelong;
}
const SelectAuth: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree = await props.space.loadSuperAuth(false);
    if (tree) {
      setTreeData([
        ...[{ label: '全员', value: '0', children: [] }],
        ...getTreeData([tree]),
      ]);
    }
  };
  const getTreeData = (targets: IAuthority[]): DefaultOptionType[] => {
    return targets.map((item: IAuthority) => {
      return {
        label: item.metadata.name,
        value: item.metadata.id,
        children:
          item.children && item.children.length > 0 ? getTreeData(item.children) : [],
      };
    });
  };

  useEffect(() => {
    loadTreeData();
  }, [props.space]);

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择角色"
      treeDefaultExpandAll
      onClick={(e) => {
        e.stopPropagation();
      }}
      onChange={props.onChange}
      treeData={treeData}
    />
  );
};

export default SelectAuth;
