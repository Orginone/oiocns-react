import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { ITarget } from '@/ts/core';
import { DefaultOptionType } from 'rc-select/lib/Select';
interface IProps {
  orgId?: string;
  onChange: any;
  readonly?: boolean;
}
const SelectOrg: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree = await userCtrl.getTeamTree();
    setTreeData(getTreeData(tree));
  };
  const getTreeData = (targets: ITarget[]): DefaultOptionType[] => {
    return targets.map((item: ITarget) => {
      return {
        label: item.teamName,
        value: item.id,
        children:
          item.subTeam && item.subTeam.length > 0 ? getTreeData(item.subTeam) : [],
      };
    });
  };
  useEffect(() => {
    loadTreeData();
  }, [userCtrl.space]);
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={props.orgId}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择操作组织"
      treeDefaultExpandAll
      onChange={props.onChange}
      treeData={treeData}
      disabled={props.readonly}
    />
  );
};

export default SelectOrg;
