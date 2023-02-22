import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { ITarget } from '@/ts/core';
import { visitTree } from '@/utils';
import { ProFormTreeSelect } from '@ant-design/pro-components';

type OptionType = {
  key: string;
  label: string;
  value: string;
  origin: any;
};

/**
 * 集团组件
 */
const ProFormGroup = (props: any) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    const initTreeData = async () => {
      const groups = await userCtrl.company.getJoinedGroups();
      setTreeData(
        groups.map((item) => {
          return {
            key: item.id,
            label: item.name,
            value: item.id,
            origin: item,
          };
        }),
      );
    };
    initTreeData();
  }, []);

  const onLoadData = (dataNode: OptionType) => {
    return (dataNode.origin as ITarget).loadSubTeam().then((res) => {
      const children = res.map((item) => {
        return {
          label: item.name,
          value: item.id,
          origin: item,
          key: item.id,
        };
      });
      visitTree(treeData, (node) => {
        if (node.value === dataNode.value) {
          if (children.length === 0) {
            node.isLeaf = true;
          } else {
            node.children = children;
          }
        }
      });
      setTreeData(treeData);
    });
  };
  return (
    <ProFormTreeSelect
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...props.rule,
        ...{ treeData },
        ...{ loadData: onLoadData },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormGroup;
