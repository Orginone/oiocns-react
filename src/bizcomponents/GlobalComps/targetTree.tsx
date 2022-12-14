/** 加载组织树 */

import { ITarget } from '@/ts/core';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { useEffect, useState } from 'react';
import TeamIcon from './teamIcon';
import CustomTreeComp from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';

/** 组织树 */
interface Iprops {
  title: string;
  className: string;
  targets: ITarget[];
  onSelect?: (item: ITarget) => void;
  loadMenus?: (item: ITarget) => ItemType[];
  handleMenuClick?: (key: string, item: ITarget | undefined) => void;
}

const TargetTree = (props: Iprops) => {
  const [selectKey, setSelectKey] = useState<string>();
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    if (props.targets.length > 0) {
      setData(buildTargetTree(props.targets));
      setSelectKey(props.targets[0].key);
    } else {
      setData([]);
    }
  }, [props.targets]);
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[]) => {
    const result: any[] = [];
    for (const item of targets) {
      result.push({
        key: item.key,
        item: item,
        isLeaf: item.subTeam.length === 0,
        title: item === userCtrl.user ? '我的好友' : item.name,
        menus: props.loadMenus ? props.loadMenus(item) : undefined,
        icon: <TeamIcon share={item.shareInfo} />,
        children: buildTargetTree(item.subTeam),
      });
    }
    return result;
  };

  return (
    <CustomTreeComp
      className={props.className}
      title={'外部机构'}
      isDirectoryTree
      menu={'menus'}
      searchable
      showIcon
      treeData={data}
      selectedKeys={[selectKey]}
      onSelect={async (_: any, info: any) => {
        const item: ITarget = info.node.item;
        await item.loadSubTeam();
        if (props.onSelect) {
          props.onSelect(item);
        }
        setData(buildTargetTree(props.targets));
        setSelectKey(item.key);
      }}
      handleMenuClick={(id, node) => {
        if (props.handleMenuClick) {
          props.handleMenuClick(id, node.item);
        }
      }}
    />
  );
};

export default TargetTree;
