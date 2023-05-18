import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ICompany, ITarget } from '@/ts/core';
interface IProps {
  rootDisable?: boolean;
  company?: ICompany;
  orgId?: string;
  value?: string;
  onChange: any;
  readonly?: boolean;
}
const SelectOrg: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree;
    if (props.company) {
      tree = [props.company];
    } else {
      tree = [orgCtrl.user];
    }

    let targets = buildTargetTree(tree, false, 0);
    setTreeData(targets);
  };
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[], isChild: boolean, level: number) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        if (props.orgId && !isChild) {
          if (item.id == props.orgId) {
            result.push({
              label: item.metadata.name,
              value: item.id,
              disabled: props.rootDisable && level == 0,
              children: [
                ...[{ label: '其他', value: '0' }],
                ...buildTargetTree(item.subTarget, true, level + 1),
              ],
            });
          } else {
            let children = buildTargetTree(item.subTarget, false, level + 1);
            for (let child of children) {
              result.push(child);
            }
          }
        } else {
          result.push({
            label: item.metadata.name,
            value: item.id,
            disabled: props.rootDisable && level == 0,
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
      value={props.value}
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
