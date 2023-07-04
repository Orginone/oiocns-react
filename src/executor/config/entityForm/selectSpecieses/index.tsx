import { AiOutlineSearch } from 'react-icons/ai';
import { Input, TreeProps } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { XProperty } from '@/ts/base/schema';
import { IDirectory, ITarget } from '@/ts/core';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface IProps {
  target: ITarget;
  selected: any;
  selectType: String;
  onAdded: (prop: XProperty) => void;
  onDeleted: () => void;
}

const SelectForms: React.FC<IProps> = (props) => {
  const [filter, setFilter] = useState<string>('');
  const [centerTreeData, setCenterTreeData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<any[]>(props.selected || []);

  const onSelectDirectory: TreeProps['onSelect'] = async (_, info: any) => {
    const directory: IDirectory = info.node.item;
    let propertys = await directory.loadSpecieses();
    setCenterTreeData(
      propertys
        .filter((item) => item.metadata.typeName === props.selectType)
        .map((item) => {
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
      props.onAdded(property);
    } else {
      props.selected = props.selected.filter((i: any) => i.id != property.id);
      props.onDeleted();
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
    props.onDeleted();
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

        {props.selected.id && (
          <div style={{ width: '33%' }} className={cls.checkRight}>
            <div className={cls.checkLayout}>
              <div className={cls.checkTitle}>已选1条数据</div>
              <div className={cls.checkContent}>
                <div key={props.selected?.metadata.id} className={cls.checkRow}>
                  <div>{props.selected?.metadata.name}</div>
                  <AiOutlineCloseCircle
                    className={cls.checkCloseIcon}
                    onClick={() => {
                      handelDel(props.selected?.metadata.id);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectForms;
