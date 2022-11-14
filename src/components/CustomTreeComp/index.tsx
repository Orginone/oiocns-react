/* eslint-disable no-unused-vars */
import {
  EllipsisOutlined,
  LeftCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Dropdown, Input, Menu, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useState } from 'react';
import cls from './index.module.less';
import { renderNum } from '@/utils/tools';

interface TreeType {
  treeData?: any[];
  draggable?: boolean; //是否可拖拽
  searchable?: boolean; //是否展示搜索区域
  menu?: string[]; //更多按钮列表 需提供 string[]
  handleAddClick?: (_item: any) => void; //点击更多按钮事件
  handleMenuClick?: ({ data, key }: { data: any; key: string }) => void; //点击更多按钮事件
}

const x = 2;
const y = 2;
const z = 1;
const defaultData: DataNode[] = [];

const nameArr = '擦传递火炬方法合并VS阿我认为有任务和感受到风清热'.split('');
const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: nameArr[renderNum(1, 15)] + nameArr[renderNum(1, 15)], key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const StoreClassifyTree: React.FC<TreeType> = ({
  treeData,
  menu,
  searchable = false,
  draggable = false,
  handleAddClick,
  handleMenuClick,
}) => {
  const [mouseOverItem, setMouseOverItem] = useState<any>({});
  // 树形控件 更多操作
  const renderMenu = (data: any) => {
    if (!menu) {
      return <></>;
    }
    return (
      <Menu
        onClick={({ key }) => handleMenuClick && handleMenuClick({ data, key })}
        items={menu.map((item) => {
          return {
            key: item,
            label: item,
          };
        })}
      />
    );
  };
  //TODO: 树形数据需要切换
  // console.log('树形数据需要切换', treeData);

  const [gData, setGData] = useState(defaultData);
  const [expandedKeys] = useState(['0-0', '0-0-0']);

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log('拖拽', info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log('拖拽2', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      // eslint-disable-next-line no-unused-vars
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };
  const renderTreeTitle = (node: any) => {
    return (
      <div
        className={cls.treeTitleBox}
        onMouseOver={() => {
          setMouseOverItem(node);
        }}
        onMouseLeave={() => {
          setMouseOverItem({});
        }}>
        <div>{node.title}</div>
        <div className={cls.treeTitleBoxBtns} onClick={(e: any) => e.stopPropagation()}>
          {mouseOverItem.key === node.key ? (
            <>
              <PlusOutlined
                className={cls.titleIcon}
                onClick={() => handleAddClick && handleAddClick(node)}
              />
              <Dropdown overlay={renderMenu(node)} placement="bottom" trigger={['click']}>
                <EllipsisOutlined className={cls.titleIcon} rotate={90} />
              </Dropdown>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  };
  return (
    <div className={cls.customTreeWrap}>
      <div className={cls.title}>全部分类</div>
      {searchable && (
        <div className={cls.title}>
          <Input prefix={<SearchOutlined />} placeholder="搜索分类" />
        </div>
      )}
      <Tree
        className="draggable-tree"
        switcherIcon={<LeftCircleOutlined />}
        titleRender={renderTreeTitle}
        defaultExpandedKeys={expandedKeys}
        draggable={draggable}
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={treeData}
      />
    </div>
  );
};

export default React.memo(StoreClassifyTree);
