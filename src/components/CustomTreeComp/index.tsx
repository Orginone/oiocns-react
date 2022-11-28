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
  treeData?: any[];
  draggable?: boolean; //是否可拖拽
  searchable?: boolean; //是否展示搜索区域
  menu?: string[] | 'menus' | undefined; //更多按钮列表 需提供 string[]
  parentIcon?: ReactElement; // 父级 --具备子集的层级展示图标
  childIcon?: ReactElement; //子级 --无下级 展示 icon
  handleTitleClick?: (node: any) => void; //名称 单击
  onDoubleClickTitle?: (node: any) => void; // 名称 双击
  handleAddClick?: (node: any) => void; //点击添加按钮事件
  handleMenuClick?: (_key: string, node: any) => void; //点击更多按钮事件
  title?: ReactElement | string;
  isDirectoryTree?: boolean; //是否文档树
  [key: string]: any; // 其他属性方法
}
const { DirectoryTree } = Tree;
const StoreClassifyTree: React.FC<TreeType> = ({
  isDirectoryTree = false,
  title,
  treeData,
  menu,
  parentIcon,
  childIcon = <ApartmentOutlined />,
  searchable = false,
  draggable = false,
  handleAddClick,
  handleMenuClick,
  handleTitleClick,
  ...rest
}) => {
  const [mouseOverItem, setMouseOverItem] = useState<any>({});
  // 树形控件 更多操作
  const renderMenu: (data: any) => MenuProps['items'] = (data) => {
    if (menu === 'menus') {
      return data?.menus?.map((item: string) => {
        return {
          key: item,
          label: item,
        };
      });
    }
    return menu?.map((item) => {
      return {
        key: item,
        label: item,
      };
    });
  };
  //TODO: 树形数据需要切换
  // console.log('树形数据需要切换', treeData);
  const resetTreeData: any = useMemo(() => {
    console.log('3333', treeData);

    return treeData;
    // ?.map((v: any) => {
    //   return (v.icon = <ApartmentOutlined />);
    // });
  }, [treeData]);

  const [gData, setGData] = useState([]);
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
          // setMouseOverItem({});
        }}>
        <div
          onDoubleClick={() => {
            onDoubleClickTitle && onDoubleClickTitle(node);
          }}
          onClick={() => handleTitleClick && handleTitleClick(node)}>
          {node.children.length == 0 ? childIcon : parentIcon}
          {node.title}
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
      {typeof title === 'string' || !title ? (
        <div className={cls.title}>{`${title || '全部分类'}`} </div>
      ) : (
        title
      )}
      {searchable && (
        <div className={cls.title}>
          <Input prefix={<SearchOutlined />} placeholder="搜索分类" />
        </div>
      )}
      {isDirectoryTree ? (
        <DirectoryTree
          className="draggable-tree"
          // switcherIcon={<LeftCircleOutlined />}
          titleRender={renderTreeTitle}
          defaultExpandedKeys={expandedKeys}
          draggable={draggable}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          treeData={resetTreeData}
          {...rest}
        />
      ) : (
        <Tree
          className="draggable-tree"
          // switcherIcon={<LeftCircleOutlined />}
          titleRender={renderTreeTitle}
          defaultExpandedKeys={expandedKeys}
          draggable={draggable}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          treeData={resetTreeData}
          {...rest}
        />
      )}
    </div>
  );
};

export default React.memo(StoreClassifyTree);
