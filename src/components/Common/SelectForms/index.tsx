import { TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '@/components/Common/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { IBelong, ITarget } from '@/ts/core';
import { XForm } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core/thing/directory';

interface IProps {
  belong: IBelong;
  typeName: string;
  selected: XForm[];
  setSelected: (forms: XForm[]) => void;
}

const SelectForms: React.FC<IProps> = ({ belong, typeName, selected, setSelected }) => {
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    (selected || []).map((i) => i.id),
  );

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    setCenterTreeData(
      directory.forms.map((item) => {
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
    const form: XForm = { ...(info.node as any).item, typeName };
    if (info.checked) {
      selected.push(form);
    } else {
      selected = selected.filter((i) => i.id != form.id);
    }
    setSelected([...selected]);
  };

  const buildTargetWorkThingTree = (targets: ITarget[]): any[] => {
    const result: any[] = [];
    for (const target of targets.filter((a) => a.belongId == belong.id)) {
      result.push({
        key: target.directory.id,
        title: target.directory.name,
        value: target.directory.id,
        item: target.directory,
        children: [
          ...buildTargetWorkThingTree(target.subTarget),
          ...buildWorkThingTree(target.directory.children),
        ],
      });
    }
    return result;
  };

  const buildWorkThingTree = (directory: IDirectory[]): any[] => {
    const result: any[] = [];
    for (const item of directory) {
      if (item.id) {
        result.push({
          key: item.id,
          title: item.name,
          value: item.id,
          item: item,
          children: [...buildWorkThingTree(item.children)],
        });
      }
    }
    return result;
  };

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    setSelected(selected.filter((i) => i.id != id));
  };

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div style={{ width: '33%' }} className={cls.left}>
          <div className={cls.leftContent}>
            <CustomTree
              isDirectoryTree
              searchable
              onSelect={onSelect}
              treeData={buildTargetWorkThingTree(belong.shareTarget)}
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
          <ShareShowComp departData={selected} deleteFuc={handelDel}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default SelectForms;
