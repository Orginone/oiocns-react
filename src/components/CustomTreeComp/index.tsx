import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import { Dropdown, Input, MenuProps, Tag, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
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
  handleMenuClick?: (_key: string, node: any) => void; //点击更多按钮事件
  title?: ReactElement | string;
  isDirectoryTree?: boolean; //是否文档树
  className?: any; // 树的css
  fieldNames?: {
    title: string;
    key: string | ((_record: any) => string);
    children: string;
  };
  [key: string]: any; // 其他属性方法
}
const { DirectoryTree } = Tree;
// const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
//   console.log('获取父级key', key!);
//   let parentKey: React.Key;
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i];
//     if (node[fieldNames.children]) {
//       if (node[fieldNames.children].some((item) => item.key === key)) {
//         parentKey = node.key;
//       } else if (getParentKey(key, node[fieldNames.children])) {
//         parentKey = getParentKey(key, node[fieldNames.children]);
//       }
//     }
//   }
//   console.log('获取父级', parentKey!);

//   return parentKey!;
// };
const StoreClassifyTree: React.FC<TreeType> = ({
  isDirectoryTree = false,
  title,
  treeData,
  menu,
  parentIcon,
  childIcon,
  searchable = false,
  draggable = false,
  handleMenuClick,
  handleTitleClick,
  onDoubleClickTitle,
  className,
  fieldNames = { title: 'title', key: 'key', children: 'children' },
  ...rest
}) => {
  const [mouseOverItem, setMouseOverItem] = useState<any>({});
  const [searchValue, setSearchValue] = useState<string>('');
  // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [visibleMenu, setVisibleMenu] = useState(false);
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

  /*******
   * @desc: 过滤功能 //TODO:
   * @param {React} e
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = resetTreeData.map((item: any) => {
      if (item[fieldNames.title].indexOf(value) > 0) {
        // return getParentKey(item.key, treeData);
      }
      return null;
    });
    // .filter(
    //   (item: any, i: any, self: string | any[]) => item && self.indexOf(item) === i,
    // );
    // 自动展示匹配项
    console.log('newExpandedKeys', newExpandedKeys);

    // setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    // setAutoExpandParent(true);
  };
  const resetTreeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data?.map((item) => {
        const strTitle = item[fieldNames.title] as string;
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
        if (item[fieldNames.children]) {
          return {
            ...item,
            searchTitle,
            [fieldNames.children]: loop(item[fieldNames.children]),
          };
        }

        return {
          ...item,
        };
      });

    return loop(treeData);
  }, [searchValue, treeData]);

  const renderTreeTitle = (node: any) => {
    return (
      <div
        className={cls.treeTitleBox}
        onMouseOver={() => {
          setMouseOverItem(node);
        }}
        onMouseLeave={() => {
          setMouseOverItem({});
          setVisibleMenu(false);
        }}>
        <div
          className={cls.treeTitleBoxLabel}
          onDoubleClick={() => {
            onDoubleClickTitle && onDoubleClickTitle(node);
          }}
          onClick={() => handleTitleClick && handleTitleClick(node)}>
          {isDirectoryTree == false &&
          node[fieldNames.children] &&
          node[fieldNames.children].length == 0
            ? childIcon
            : parentIcon}
          {node.searchTitle || node[fieldNames.title]}
          {node?.tag ? (
            <Tag style={{ marginLeft: '6px' }} color={node.tag?.color}>
              {node.tag?.txt}
            </Tag>
          ) : (
            ''
          )}
        </div>
        <div className={cls.treeTitleBoxBtns} onClick={(e: any) => e.stopPropagation()}>
          {mouseOverItem.key === node.key ? (
            <>
              {menu ? (
                <Dropdown
                  menu={{
                    items: renderMenu(node),
                    onClick: ({ key }) => {
                      handleMenuClick && handleMenuClick(key, node);
                    },
                  }}
                  placement="bottom"
                  open={visibleMenu}
                  onOpenChange={(open: boolean) => {
                    setVisibleMenu(open);
                  }}
                  trigger={['click', 'contextMenu']}>
                  <EllipsisOutlined className={cls.titleIcon} rotate={90} />
                </Dropdown>
              ) : (
                ''
              )}
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
          className={className}
          titleRender={menu ? renderTreeTitle : undefined}
          onRightClick={() => {
            setVisibleMenu(true);
          }}
          treeData={treeData}
          {...rest}
        />
      ) : (
        <Tree
          className={className}
          titleRender={menu ? renderTreeTitle : undefined}
          onRightClick={() => {
            setVisibleMenu(true);
          }}
          treeData={resetTreeData}
          {...rest}
        />
      )}
    </div>
  );
};

export default React.memo(StoreClassifyTree);
