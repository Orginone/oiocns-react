/* eslint-disable no-unused-vars */
import { AiOutlineSearch } from 'react-icons/ai';
import { Input, message, Modal, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import { ISpeciesItem, ITarget } from '@/ts/core';
import CustomTree from '@/components/CustomTreeComp';
import { ImTree } from 'react-icons/im';
interface Iprops {
  open: boolean;
  close: Function;
  ok: Function;
  currentCompany: ITarget;
}

const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
  list.map((node) => {
    if (node.id === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
const SearchSpecies = (props: Iprops) => {
  const { currentCompany, open, close, ok } = props;

  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [selectItem, setSelectItem] = useState<any>(undefined);

  useEffect(() => {
    if (!currentCompany) {
      message.warn('请先选择单位!');
    } else {
      onLoadSpeciesData();
    }
  }, []);

  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    const item: ISpeciesItem = info.node.item;
    setLeftTreeSelectedKeys(selectedKeys);
    setSelectItem(item);
  };
  const handleTreeData = (node: any, belongId: string) => {
    node.disabled = !(node.belongId && node.belongId == belongId);
    if (node.children) {
      node.nodes = node.children.map((child: any) => {
        return handleTreeData(child, belongId);
      });
    }
    //判断是否有操作权限
    return { ...node._authority, node };
  };
  // 左侧树选中事件
  const handleCheckChange: TreeProps['onCheck'] = (checkedKeys, info: any) => {};

  const buildSpeciesTree = (species: ISpeciesItem) => {
    const result: any = {
      id: species.id,
      item: species,
      name: species.name,
      icon: <ImTree />,
      children: species.children?.map((i) => buildSpeciesTree(i)) ?? [],
    };
    return result;
  };

  const onLoadSpeciesData = async () => {
    const species = await thingCtrl.loadSpeciesTree();
    if (species) {
      setLeftTreeData([buildSpeciesTree(species)]);
    }
  };
  return (
    <div>
      <Modal
        title="查询分类"
        width={800}
        destroyOnClose={true}
        open={true}
        okText="确定"
        onOk={() => {
          ok(selectItem);
        }}
        onCancel={() => {
          close();
        }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <Input prefix={<AiOutlineSearch />} placeholder="请设置关键字" />
            <div>
              <CustomTree
                checkable={false}
                blockNode
                loadData={onLoadSpeciesData}
                fieldNames={{
                  title: 'name',
                  key: 'id',
                  children: 'children',
                }}
                autoExpandParent={true}
                selectedKeys={leftTreeSelectedKeys}
                onSelect={onSelect}
                onCheck={handleCheckChange}
                treeData={leftTreeData}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SearchSpecies;
