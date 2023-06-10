import { AiOutlineSearch } from 'react-icons/ai';
import { Input, TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { IThingClass } from '@/ts/core';
import { XForm } from '@/ts/base/schema';

interface IProps {
  species: IThingClass[];
  selected: XForm[];
  setSelected: (forms: XForm[]) => void;
}

const SelectForms: React.FC<IProps> = ({ species, selected, setSelected }) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    (selected || []).map((i) => i.id),
  );

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const species: IThingClass = info.node.item;
    let forms = await species.loadForms();
    setCenterTreeData(
      forms.map((item) => {
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
    const form: XForm = (info.node as any).item;
    if (info.checked) {
      selected.push(form);
    } else {
      selected = selected.filter((i) => i.id != form.id);
    }
    setSelected([...selected]);
  };

  const buildWorkThingTree = (species: IThingClass[]): any[] => {
    const result: any[] = [];
    for (const item of species) {
      result.push({
        key: item.id,
        title: item.name,
        value: item.id,
        item: item,
        children: buildWorkThingTree(item.children.map((i) => i as IThingClass)),
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
              treeData={buildWorkThingTree(species.map((i) => i as IThingClass))}
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
          <ShareShowComp departData={selected} deleteFuc={handelDel}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default SelectForms;
