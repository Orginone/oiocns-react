import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
// import { ITarget } from '@/ts/core';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { DefaultOptionType } from 'rc-select/lib/Select';
interface IProps {
  // orgId?: string;
  value?: string;
  onChange: any;
  readonly?: boolean;
}
const SelectAuth: React.FC<IProps> = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const loadTreeData = async () => {
    let tree = await userCtrl.space.loadAuthorityTree(false);
    if (tree) {
      setTreeData([...[{ label: '全部', value: 0 }], ...getTreeData([tree])]);
    }
  };
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
  /** 加载角色树 */
  // const buildTargetTree = (targets: IAuthority[], isChild: boolean) => {
  //   const result: any[] = [];
  //   if (targets) {
  //     for (const item of targets) {
  //       if (props.orgId && !isChild) {
  //         if (item.id == props.orgId) {
  //           result.push({
  //             label: item.teamName,
  //             value: item.id,
  //             children: buildTargetTree(item.subTeam, true),
  //           });
  //         } else {
  //           let children = buildTargetTree(item.subTeam, false);
  //           for (let child of children) {
  //             result.push(child);
  //           }
  //         }
  //       } else {
  //         result.push({
  //           label: item.teamName,
  //           value: item.id,
  //           children: buildTargetTree(item.subTeam, isChild),
  //         });
  //       }
  //     }
  //   }
  //   return result;
  // };
  useEffect(() => {
    loadTreeData();
  }, [userCtrl.space]);
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%', paddingTop: '10%' }}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择角色"
      treeDefaultExpandAll
      onChange={props.onChange}
      treeData={treeData}
      disabled={props.readonly}
    />
  );
};

export default SelectAuth;
