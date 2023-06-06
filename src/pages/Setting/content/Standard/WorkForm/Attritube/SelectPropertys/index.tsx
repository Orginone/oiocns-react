import { AiOutlineSearch } from 'react-icons/ai';
import { Input, TreeProps } from 'antd';
import React, { useState, Key } from 'react';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { IPropClass } from '@/ts/core';
import { XProperty } from '@/ts/base/schema';

interface IProps {
  species: IPropClass[];
  selected: XProperty[];
  onAdded: (prop: XProperty) => void;
  onDeleted: (id: string) => void;
  setSelected: (props: XProperty[]) => void;
}

const SelectForms: React.FC<IProps> = (props) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>(
    (props.selected || []).map((i) => i.id),
  );

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const species: IPropClass = info.node.item;
    let propertys = await species.loadPropertys();
    setCenterTreeData(
      propertys.map((item) => {
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
    const property: XProperty = (info.node as any).item;
    if (info.checked) {
      props.selected.push(property);
      props.onAdded(property);
    } else {
      props.selected = props.selected.filter((i) => i.id != property.id);
      props.onDeleted(property.id);
    }
    props.setSelected([...props.selected]);
  };

  const buildPropClassTree = (species: IPropClass[]): any[] => {
    const result: any[] = [];
    for (const item of species) {
      result.push({
        key: item.id,
        title: item.name,
        value: item.id,
        item: item,
        children: buildPropClassTree(item.children.map((i) => i as IPropClass)),
      });
    }
    return result;
  };

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    props.setSelected(props.selected.filter((i) => i.id != id));
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
              onSelect={onSelect}
              treeData={buildPropClassTree(props.species)}
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
