import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ITarget } from '@/ts/core';
interface IProps {
  orgId?: string;
  onChange: any;
}
const SelectOrg: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);

  const loadTreeData = async () => {
    let tree = [orgCtrl.user, ...orgCtrl.user.companys].find((a) => a.id == props.orgId);
    if (tree) {
      setTreeData(buildTargetTree([tree], false, 0));
    }
  };
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[], isChild: boolean, level: number) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        if (props.orgId && !isChild) {
          if (item.id == props.orgId) {
            result.push({
              label: item.name,
              value: item.id,
              disabled: false,
              children: [...buildTargetTree(item.subTarget, true, level + 1)],
            });
          } else {
            let children = buildTargetTree(item.subTarget, false, level + 1);
            for (let child of children) {
              result.push(child);
            }
          }
        } else {
          result.push({
            label: item.name,
            value: item.id,
            children: buildTargetTree(item.subTarget, isChild, level + 1),
          });
        }
      }
    }
    return result;
  };
  useEffect(() => {
    loadTreeData();
  }, [orgCtrl.user, props]);
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择操作组织"
      treeDefaultExpandAll
      onChange={props.onChange}
      treeData={treeData}
    />
  );
};

export default SelectOrg;
