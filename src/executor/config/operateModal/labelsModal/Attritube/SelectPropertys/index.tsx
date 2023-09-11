import { AiOutlineSearch } from 'react-icons/ai';
import { Input, TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '@/components/Common/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { XProperty } from '@/ts/base/schema';
import { IDirectory, ITarget } from '@/ts/core';

interface IProps {
  target: ITarget;
  selected: XProperty[];
  onAdded: (prop: XProperty) => void;
  onDeleted: (id: string) => void;
}

const SelectForms: React.FC<IProps> = (props) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    props.selected.map((i) => i.id),
  );

  const onSelectDirectory: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    let propertys = await directory.loadPropertys();
    setCenterTreeData(
      propertys.map((item) => {
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
  const delFromSelected = (id: string) => {
    const idxInSelected = props.selected.findIndex((item) => item.id === id);
    props.selected.splice(idxInSelected, 1);
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
      delFromSelected(property.id);
      props.onDeleted(property.id);
    }
  };
  const buildDirectoryTree = (directors: IDirectory[]): any[] => {
    const result: any[] = [];
    for (const item of directors) {
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
    delFromSelected(id);
    props.onDeleted(id);
  };

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div style={{ width: '33%' }} className={cls.left}>
          <Input
            className={cls.leftInput}
            prefix={<AiOutlineSearch />}
            placeholder="请设置关键字"
          />
          <div className={cls.leftContent}>
            <CustomTree
              checkable={false}
              autoExpandParent={true}
              onSelect={onSelectDirectory}
              treeData={buildDirectoryTree([props.target.directory])}
            />
          </div>
        </div>
        <div className={cls.center}>
          <Input
            className={cls.centerInput}
            prefix={<AiOutlineSearch />}
            placeholder="搜索"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
          <div className={cls.centerContent}>
            <CustomTree
              checkable
              checkedKeys={centerCheckedKeys}
              autoExpandParent={true}
              onCheck={onCheck}
              treeData={centerTreeData.filter((i: any) => i.title.includes(filter))}
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

export default SelectForms;
