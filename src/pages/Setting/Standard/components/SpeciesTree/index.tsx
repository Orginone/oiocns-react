import type { TreeProps } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';

import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import thingCtrl from '@/ts/controller/thing';
import ReactDOM from 'react-dom';
import { ISpeciesItem } from '@/ts/core';

type CreateGroupPropsType = {
  tkey: string;
  current: ISpeciesItem | undefined;
  setCurrent: (item: ISpeciesItem) => void;
  handleMenuClick: (key: string, item: ISpeciesItem) => void;
};

const SpeciesTree: React.FC<CreateGroupPropsType> = ({
  tkey,
  current,
  setCurrent,
  handleMenuClick,
}) => {
  const [data, setData] = useState<any[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    if (thingCtrl.teamSpecies) {
      setData([buildSpeciesTree(thingCtrl.teamSpecies)]);
    }
  }, [tkey]);

  /** 加载右侧菜单 */
  const loadMenus = (item: ISpeciesItem) => {
    const items = [
      {
        key: '新增分类',
        icon: <im.ImPlus />,
        label: '新增分类',
        item: item,
      },
    ];
    if (item.target.belongId) {
      items.push(
        {
          key: '编辑分类',
          icon: <im.ImCog />,
          label: '编辑分类',
          item: item,
        },
        {
          key: '删除分类',
          icon: <im.ImBin />,
          label: '删除分类',
          item: item,
        },
      );
    }
    return items;
  };

  /** 加载组织树 */
  const buildSpeciesTree: any = (species: ISpeciesItem) => {
    return {
      key: species.id,
      title: species.name,
      icon: <im.ImTree />,
      item: species,
      menus: loadMenus(species),
      isLeaf: species.children.length === 0,
      children: species.children.map((item) => {
        return buildSpeciesTree(item);
      }),
    };
  };

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: ISpeciesItem = info.node.item;
    if (item) {
      setCurrent(item);
    }
  };

  return treeContainer ? (
    ReactDOM.createPortal(
      <div className={cls.topMes}>
        <StoreClassifyTree
          isDirectoryTree
          className={cls.docTree}
          title={'分类标准'}
          menu={'menus'}
          searchable
          showIcon
          selectedKeys={[current?.id]}
          treeData={data}
          onSelect={onSelect}
          handleMenuClick={(id, node) => handleMenuClick(id, node.item)}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default SpeciesTree;
