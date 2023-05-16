import { AiOutlineSearch } from 'react-icons/ai';
import { Input, TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { IWork, IWorkThing, SpeciesType } from '@/ts/core';
import { XForm } from '@/ts/base/schema';

interface IProps {
  current: IWork;
  selected: XForm[];
  setSelected: (forms: XForm[]) => void;
}

const SelectOperation: React.FC<IProps> = ({ current, selected, setSelected }) => {
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    (selected || []).map((i) => i.id),
  );

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const species: IWorkThing = info.node.item;
    let forms = await species.loadForms();
    setCenterTreeData(
      forms.map((item) => {
        return {
          key: item.metadata.id,
          title: item.metadata.name,
          value: item.metadata.id,
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
    const form: XForm = (info.node as any).item;
    if (info.checked) {
      selected.push(form);
    } else {
      selected = selected.filter((i) => i.id != form.id);
    }
    setSelected([...selected]);
  };

  const buildWorkThingTree = (species: IWorkThing[]): any[] => {
    const result: any[] = [];
    for (const item of species) {
      result.push({
        key: item.metadata.id,
        title: item.metadata.name,
        value: item.metadata.id,
        item: item,
        children: buildWorkThingTree(item.children.map((i) => i as IWorkThing)),
      });
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
              treeData={buildWorkThingTree(
                current.app.children
                  .filter((i) => i.metadata.typeName === SpeciesType.WorkThing)
                  .map((i) => i as IWorkThing),
              )}
            />
          </div>
        </div>
        <div className={cls.center}>
          <Input
            className={cls.centerInput}
            prefix={<AiOutlineSearch />}
            placeholder="搜索"
          />
          <div className={cls.centerContent}>
            <CustomTree
              checkable
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

export default SelectOperation;
