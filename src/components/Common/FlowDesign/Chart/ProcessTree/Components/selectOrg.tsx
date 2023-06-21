import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { ITarget } from '@/ts/core';
interface IProps {
  rootDisable?: boolean;
  orgId?: string;
  onChange: any;
  value?: string;
  target: ITarget;
}
const SelectOrg: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  if (!props.value || props.value.length < 2) return <div>其他组织</div>;

  useEffect(() => {
    setTreeData(buildTargetTree([props.target], false, 0));
  }, [props]);

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
              disabled: props.rootDisable && level == 0,
              children: buildTargetTree(item.subTarget, true, level + 1),
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
            disabled: props.rootDisable && level == 0,
            children: buildTargetTree(item.subTarget, isChild, level + 1),
          });
        }
      }
    }
    return result;
  };
  return (
    <TreeSelect
      showSearch
      value={props.value}
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
