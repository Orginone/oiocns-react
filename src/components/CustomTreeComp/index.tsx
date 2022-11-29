import {
  ApartmentOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Dropdown, Input, MenuProps, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { ReactElement, useMemo, useState } from 'react';
import cls from './index.module.less';

interface TreeType {
  treeData: any[];
  draggable?: boolean; //是否可拖拽
  searchable?: boolean; //是否展示搜索区域
  menu?: string[] | 'menus' | undefined; //更多按钮列表 需提供 string[]
  parentIcon?: ReactElement; // 父级 --具备子集的层级展示图标
  childIcon?: ReactElement; //子级 --无下级 展示 icon
  handleTitleClick?: (node: any) => void; //名称 单击
  onDoubleClickTitle?: (node: any) => void; // 名称 双击
  handleAddClick?: (node: any) => void; //展示 点击添加按钮事件
  handleMenuClick?: (_key: string, node: any) => void; //点击更多按钮事件
  title?: ReactElement | string;
  isDirectoryTree?: boolean; //是否文档树
  [key: string]: any; // 其他属性方法
}
const { DirectoryTree } = Tree;
const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  console.log('获取父级key', key!);
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  console.log('获取父级', parentKey!);

  return parentKey!;
};
const StoreClassifyTree: React.FC<TreeType> = ({
  isDirectoryTree = false,
  title,
  treeData,
  menu,
  parentIcon,
  childIcon,
  searchable = false,
  draggable = false,
  handleAddClick,
  handleMenuClick,
  handleTitleClick,
  onDoubleClickTitle,
  ...rest
}) => {
  const [mouseOverItem, setMouseOverItem] = useState<any>({});
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 树形控件 更多操作
  const renderMenu: (data: any) => MenuProps['items'] = (data) => {
    if (menu === 'menus') {
      return data?.menus?.map((item: string) => {
        if (typeof item === 'string') {
          return {
            key: item,
            label: item,
          };
        } else {
          return item;
        }
      });
    }
    return menu?.map((item) => {
      return {
        key: item,
        label: item,
      };
    });
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = resetTreeData.map((item: any) => {
      console.log('包含value', item.title.indexOf(value) > 0);
      if (item.title.indexOf(value) > 0) {
        return getParentKey(item.key, treeData);
      }
      return null;
    });
    // .filter(
    //   (item: any, i: any, self: string | any[]) => item && self.indexOf(item) === i,
    // );
    console.log('newExpandedKeys', newExpandedKeys);

    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const resetTreeData = useMemo(() => {
    console.log('sousuo', searchValue);

    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const searchTitle =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: 'red' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            ''
          );
        if (item.children) {
          return { ...item, searchTitle, children: loop(item.children) };
        }

        return {
          ...item,
        };
      });
    console.log('打印测试', loop(treeData));

    return loop(treeData);
  }, [searchValue, treeData]);
  const [gData, setGData] = useState([]);

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
        <div
          className={cls.treeTitleBoxLabel}
          onDoubleClick={() => {
            onDoubleClickTitle && onDoubleClickTitle(node);
          }}
          onClick={() => handleTitleClick && handleTitleClick(node)}>
          {isDirectoryTree == false && node.children.length == 0 ? childIcon : parentIcon}
          {node.searchTitle || node.title}
        </div>
        <div className={cls.treeTitleBoxBtns} onClick={(e: any) => e.stopPropagation()}>
          {mouseOverItem.key === node.key ? (
            <>
              {handleAddClick ? (
                <PlusOutlined
                  className={cls.titleIcon}
                  onClick={() => handleAddClick(node)}
                />
              ) : (
                ''
              )}
              <Dropdown
                menu={
                  menu
                    ? {
                        items: renderMenu(node),
                        onClick: ({ key }) => {
                          handleMenuClick && handleMenuClick(key, node);
                        },
                      }
                    : undefined
                }
                placement="bottom"
                trigger={['click']}>
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
      {title && typeof title === 'string' ? (
        <div className={cls.title}>{`${title || '全部分类'}`} </div>
      ) : (
        title
      )}
      {searchable && (
        <div className={cls.title}>
          <Input prefix={<SearchOutlined />} onChange={onChange} placeholder="搜索分类" />
        </div>
      )}
      {isDirectoryTree ? (
        <DirectoryTree
          className="draggable-tree"
          // switcherIcon={<LeftCircleOutlined />}
          titleRender={renderTreeTitle}
          defaultExpandedKeys={expandedKeys}
          // draggable={draggable}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          treeData={treeData}
          {...rest}
        />
      ) : (
        <Tree
          className="draggable-tree"
          // switcherIcon={<LeftCircleOutlined />}
          titleRender={renderTreeTitle}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          treeData={resetTreeData}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          {...rest}
        />
      )}
    </div>
  );
};

export default React.memo(StoreClassifyTree);
