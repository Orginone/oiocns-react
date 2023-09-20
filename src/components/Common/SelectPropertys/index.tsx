import { TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '../ShareShowComp';
import cls from './index.module.less';
import CustomTree from '../../CustomTree';
import { XProperty } from '@/ts/base/schema';
import { IDirectory, ITarget } from '@/ts/core';

interface IProps {
  target: ITarget;
  selected: XProperty[];
  onAdded: (prop: XProperty) => void;
  onDeleted: (id: string) => void;
}

const SelectPropertys: React.FC<IProps> = (props) => {
  const [centerTreeData, setCenterTreeData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    props.selected.map((i) => i.id),
  );

  const onSelectDirectory: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    setCenterTreeData(
      directory.propertys.map((item) => {
        return {
          key: item.id,
          title: item.name,
          value: item.id,
          item: item.metadata,
          children: [],
        };
      }),
    );
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    if (Array.isArray(checkedKeys)) {
      setCenterCheckedKeys(checkedKeys);
    }
    const property: XProperty = (info.node as any).item;
    if (info.checked) {
      props.selected.push(property);
      props.onAdded(property);
    } else {
      let selectedIndex = props.selected.findIndex((i) => i.id == property.id);
      if (selectedIndex > -1) {
        props.selected.splice(selectedIndex, 1);
      }
      props.onDeleted(property.id);
    }
  };

  const buildDirectoryTree = (directorys: IDirectory[]): any[] => {
    const result: any[] = [];
    for (const item of directorys) {
      result.push({
        key: item.id,
        title: item.name,
        value: item.id,
        item: item,
        children: buildDirectoryTree(item.children),
      });
    }
    return result;
  };

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    let selectedIndex = props.selected.findIndex((i) => i.id == id);
    if (selectedIndex > -1) {
      props.selected.splice(selectedIndex, 1);
    }
    props.onDeleted(id);
  };

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div style={{ width: '33%' }} className={cls.left}>
          <div className={cls.leftContent}>
            <CustomTree
              searchable
              showIcon
              checkable={false}
              isDirectoryTree
              autoExpandParent={true}
              onSelect={onSelectDirectory}
              treeData={buildDirectoryTree([props.target.directory])}
            />
          </div>
        </div>
        <div className={cls.center}>
          <div className={cls.centerContent}>
            <CustomTree
              checkable
              searchable
              checkedKeys={centerCheckedKeys}
              autoExpandParent={true}
              onCheck={onCheck}
              treeData={centerTreeData}
            />
          </div>
        </div>

        <div style={{ width: '33%' }} className={cls.right}>
          <ShareShowComp
            departData={props.selected}
            deleteFuc={handelDel}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default SelectPropertys;
