import { TreeSelect } from 'antd';
import React, { useState } from 'react';
import { DefaultOptionType } from 'rc-select/lib/Select';
import { IAuthority, IBelong } from '@/ts/core';
import useAsyncLoad from '@/hooks/useAsyncLoad';
interface IProps {
  value?: string;
  space: IBelong;
  onChange: (newValue: string, label: string) => void;
}
const SelectAuth: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loaded] = useAsyncLoad(async () => {
    const getTreeData = (targets: IAuthority[]): DefaultOptionType[] => {
      return targets.map((item: IAuthority) => {
        return {
          label: item.name,
          value: item.id,
          children:
            item.children && item.children.length > 0 ? getTreeData(item.children) : [],
        };
      });
    };
    let tree = await props.space.loadSuperAuth(false);
    if (tree) {
      setTreeData([
        ...[{ label: '全员', value: '0', children: [] }],
        ...getTreeData([tree]),
      ]);
    }
  }, [props.space]);
  if (!loaded) return <></>;

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={props.value || '0'}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择角色"
      treeDefaultExpandAll
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSelect={(_, options) =>
        props.onChange?.apply(this, [options.value, options.label])
      }
      treeData={treeData}
    />
  );
};

export default SelectAuth;
