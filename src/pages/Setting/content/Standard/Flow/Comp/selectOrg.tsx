import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { ICompany, ITarget } from '@/ts/core';
import { DefaultOptionType } from 'rc-select/lib/Select';
interface IProps {
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
      tree = await userCtrl.getCompanyTeamTree(props.company);
    } else {
      tree = await userCtrl.getTeamTree();
    }

    let targets = buildTargetTree(tree, false);
    debugger;
    setTreeData(targets);
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
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[], isChild: boolean) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        if (props.orgId && !isChild) {
          if (item.id == props.orgId) {
            result.push({
              label: item.teamName,
              value: item.id,
              children: buildTargetTree(item.subTeam, true),
            });
          } else {
            let children = buildTargetTree(item.subTeam, false);
            for (let child of children) {
              result.push(child);
            }
          }
        } else {
          result.push({
            label: item.teamName,
            value: item.id,
            children: buildTargetTree(item.subTeam, isChild),
          });
        }
      }
    }
    return result;
  };
  useEffect(() => {
    loadTreeData();
  }, [userCtrl.space]);
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
