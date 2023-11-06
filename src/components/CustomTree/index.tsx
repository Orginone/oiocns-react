import { AiOutlineEllipsis, AiOutlineSearch } from '@/icons/ai';
import { Badge, Dropdown, Input, MenuProps, Tag, Tree, TreeProps } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import cls from './index.module.less';

interface TreeType extends TreeProps {
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
    key: string;
    children: string;
  };
}

const { DirectoryTree } = Tree;
const CustomTree: React.FC<TreeType> = ({
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
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleData, setVisibleData] = useState<any[]>(treeData);
  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      setVisibleData(loopFilterTree(treeData, searchValue));
    } else {
      setVisibleData(treeData);
    }
  }, [treeData, searchValue]);

  const loopFilterTree = (data: any[], filter: string) => {
    const result: any[] = [];
    for (const item of data) {
      const newItem = { ...item };
      let exsit = false;
      const title: string = newItem[fieldNames['title']];
      if (title) {
        exsit = title.includes(filter);
      }
      const children: any[] = item[fieldNames['children']];
      if (children && Array.isArray(children)) {
        const result = loopFilterTree(children, filter);
        exsit = exsit || result.length > 0;
        newItem[fieldNames['children']] = result;
      }
      if (exsit) {
        result.push(newItem);
      }
    }
    return result;
  };

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
   * @desc: 过滤功能
   * @param {React} e
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
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
          setVisibleMenu(false);
        }}>
        <div
          className={cls.treeTitleBoxLabel}
          style={{ width: '100%' }}
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
          {node.items ? (
            <Badge
              size={'small'}
              style={{ marginLeft: '4px' }}
              color={'geekblue'}
              count={node.items.length || ''}
            />
          ) : (
            ''
          )}

          {node?.tag ? (
            <Tag
              style={{ marginLeft: '6px' }}
              className={cls.titleTag}
              color={node.tag?.color}>
              {node.tag?.txt}
            </Tag>
          ) : (
            ''
          )}
        </div>
        <div className={cls.treeTitleBoxBtns} onClick={(e: any) => e.stopPropagation()}>
          {mouseOverItem.key === node.key ? (
            <>
              {menu && (node[menu as string] || Array.isArray(menu)) ? (
                <Dropdown
                  menu={{
                    items: renderMenu(node),
                    onClick: ({ key }) => {
                      setVisibleMenu(false);
                      handleMenuClick && handleMenuClick(key, node);
                    },
                  }}
                  placement="bottom"
                  open={visibleMenu}
                  onOpenChange={(open: boolean) => {
                    setVisibleMenu(open);
                  }}
                  trigger={['click', 'contextMenu']}>
                  <AiOutlineEllipsis className={cls.titleIcon} rotate={90} />
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
          <Input
            prefix={<AiOutlineSearch />}
            onChange={onChange}
            placeholder="搜索内容"
          />
        </div>
      )}
      {isDirectoryTree ? (
        <DirectoryTree
          className={className}
          titleRender={menu ? renderTreeTitle : undefined}
          onRightClick={() => {
            setVisibleMenu(true);
          }}
          draggable
          fieldNames={fieldNames}
          treeData={visibleData}
          {...rest}
        />
      ) : (
        <Tree
          className={className}
          titleRender={menu ? renderTreeTitle : undefined}
          fieldNames={fieldNames}
          onRightClick={() => {
            setVisibleMenu(true);
          }}
          draggable
          treeData={visibleData}
          {...rest}
        />
      )}
    </div>
  );
};

export default React.memo(CustomTree);
