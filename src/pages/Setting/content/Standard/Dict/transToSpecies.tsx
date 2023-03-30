/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, message, Modal, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting';
import { INullSpeciesItem, ISpeciesItem } from '@/ts/core';
import CustomTree from '@/components/CustomTreeComp';
import { ImTree } from 'react-icons/im';
import { IDict } from '@/ts/core/thing/idict';
import thingCtrl from '@/ts/controller/thing';
interface Iprops {
  open: boolean;
  setOpen: Function;
  currentSpeciesItem: ISpeciesItem;
  dict: IDict;
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
const TransToSpecies = (props: Iprops) => {
  const { open, setOpen, dict } = props;
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [selectItem, setSelectItem] = useState<any>(undefined);

  useEffect(() => {
    onLoadSpeciesData();
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
      // menus: loadSpeciesMenus(species),
      children: species.children?.map((i) => buildSpeciesTree(i)) ?? [],
    };
    return result;
  };

  // const buildDictTree = (dicts: IDict[]) => {
  //   const result: any[] = dicts.map((item: IDict) => {
  //     return {
  //       id: item.id,
  //       item: item,
  //       name: item.name,
  //       isLeaf: true,
  //       icon: <ImTree />,
  //     };
  //   });
  //   return result;
  // };

  const createSpeciesItemFromDict = async (root: ISpeciesItem) => {
    let dictItemsResult = await dict.loadItems();
    let dictItems = dictItemsResult;
    dictItems?.forEach((item) => {
      root
        .create({
          name: item.name,
          code: item.name + item.value,
          public: true,
          belongId: userCtrl.space.id,
          authId: root.target.authId,
          remark: '从字典生成',
        })
        .then((spceies: INullSpeciesItem) => {
          if (spceies) {
            message.success('转化成功');
          } else {
            message.error('转化失败');
          }
        });
    });
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
        title="字典转分类"
        width={800}
        destroyOnClose={true}
        open={open}
        okText="确定"
        onOk={() => {
          if (!selectItem) {
            message.warn('请先选择要置于哪个分类下');
          } else {
            Modal.confirm({
              title: '提示',
              content: '确认将此字典转为该分类下的子分类吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                createSpeciesItemFromDict(selectItem);
                setOpen(false);
              },
            });
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}>
        <div className={cls.layout} style={{ display: 'flex' }}>
          <div style={{ width: '100%' }} className={cls.left}>
            <Input
              className={cls.leftInput}
              prefix={<SearchOutlined />}
              placeholder="请设置关键字"
            />
            <div className={cls.leftContent}>
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

export default TransToSpecies;
