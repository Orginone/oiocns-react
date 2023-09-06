import ShareShowComp from '@/components/Common/ShareShowComp';
import CustomTree from '@/components/CustomTree';
import { XEntity } from '@/ts/base/schema';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import { Input, TreeProps } from 'antd';
import React, { Key, useState } from 'react';
import { AiOutlineSearch } from '@/icons/ai';
import cls from './index.module.css';

interface IExtends<X extends XEntity> {
  current: IBelong;
  multiple?: boolean;
  onChange: (files: IEntity<X>[]) => void;
  onOk?: () => void;
  loadItems: (current: IDirectory) => Promise<IEntity<XEntity>[]>;
}

export const Selector = ({
  multiple = true,
  current,
  onChange,
  loadItems,
}: IExtends<XEntity>) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);
  const [selected, setSelected] = useState<IEntity<XEntity>[]>([]);

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    let configs = await loadItems(directory);
    setCenterTreeData(
      configs.map((item) => {
        return {
          key: item.id,
          title: item.name,
          value: item.id,
          item: item,
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
    const request: IEntity<XEntity> = (info.node as any).item;
    if (info.checked) {
      selected.push(request);
      setSelected(selected);
      onChange(selected);
    } else {
      let ans = [...selected.filter((i) => i.id != request.id)];
      setSelected(ans);
      onChange(ans);
    }
  };

  const buildWorkThingTree = (directory: IDirectory[]): any[] => {
    const result: any[] = [];
    for (const item of directory) {
      result.push({
        key: item.id,
        title: item.name,
        value: item.id,
        item: item,
        children: buildWorkThingTree(item.children),
      });
    }
    return result;
  };

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    let ans = selected.filter((i) => i.id != id);
    setSelected(ans);
    onChange(ans);
  };

  return (
    <>
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
                onSelect={onSelect}
                treeData={buildWorkThingTree([current.directory])}
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
                multiple={multiple}
                checkable
                checkedKeys={centerCheckedKeys}
                autoExpandParent={true}
                onCheck={onCheck}
                treeData={centerTreeData.filter((i: any) => i.title.includes(filter))}
              />
            </div>
          </div>
          {multiple && (
            <div style={{ width: '33%' }} className={cls.right}>
              <ShareShowComp departData={selected} deleteFuc={handelDel}></ShareShowComp>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Selector;
