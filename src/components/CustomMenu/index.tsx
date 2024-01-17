import { RiMore2Fill } from 'react-icons/ri';
import { Dropdown, Menu, MenuProps, Typography, Input, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import { cleanMenus } from '@/utils/tools';

interface CustomMenuType {
  collapsed: boolean;
  selectMenu: MenuItemType;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}
const CustomMenu = (props: CustomMenuType) => {
  if (props.item === undefined) return <></>;
  /** 转换数据,解析成原生菜单数据 */
  const loadMenus: any = (items: MenuItemType[], expKeys: string[]) => {
    const result = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          title: item.label,
          label: renderLabel(item),
          children: loadMenus(item.children, expKeys),
          icon: item.expIcon && expKeys.includes(item.key) ? item.expIcon : item.icon,
        });
      }
    }
    return result;
  };
  const loopFilterTree = (data: MenuItemType[]) => {
    const result: any[] = [];
    for (const item of data) {
      const newItem = { ...item };
      let exsit = false;
      const title: string = newItem.label;
      if (title) {
        exsit = title.includes(filter);
      }
      const children: any[] = item.children;
      if (children && Array.isArray(children)) {
        const result = loopFilterTree(children);
        exsit = exsit || result.length > 0;
        newItem.children = result;
      }
      if (item.item.groupTags?.includes('已删除')) {
        exsit = false;
      }
      if (exsit) {
        result.push(newItem);
      }
    }
    return result;
  };
  /** 还原打开的keys */
  const loadOpenKeys = (items: MenuItemType[], key: string) => {
    const result: string[] = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.key === key) {
          result.push(key);
        } else {
          const nodes = loadOpenKeys(item.children, key);
          if (nodes.length > 0) {
            result.push(...nodes);
            result.unshift(item.key);
          }
        }
      }
    }
    return result;
  };
  /** 渲染标题,支持更多操作 */
  const renderLabel = (item: MenuItemType) => {
    return (
      <span
        onClick={() => {
          if (item.key != props.selectMenu.key) {
            props.onSelect?.apply(this, [item]);
          }
        }}
        className="customlabel"
        onMouseLeave={() => {
          setVisibleMenu(false);
        }}>
        <Typography.Text className="label" ellipsis={{ tooltip: item.label }}>
          {item.label}
        </Typography.Text>
        {item.count && item.count > 0 ? (
          <span className="badge">
            <Badge key={item.key} count={item.count} size="small" />
          </span>
        ) : (
          <></>
        )}
        {Array.isArray(item.menus) && item.menus.length > 0 && (
          <span onClick={(e: any) => e.stopPropagation()} className="moreButton">
            {props.selectMenu.key === item.key && (
              <Dropdown
                menu={{
                  items: cleanMenus(item.menus),
                  onClick: ({ key }) => {
                    setVisibleMenu(false);
                    props.onMenuClick?.apply(this, [item, key]);
                  },
                }}
                placement="bottom"
                open={visibleMenu}
                onOpenChange={(open: boolean) => {
                  setVisibleMenu(open);
                }}
                trigger={['click', 'contextMenu']}>
                {!props.collapsed ? (
                  <RiMore2Fill style={{ fontSize: 22, marginTop: 10 }} />
                ) : (
                  <></>
                )}
              </Dropdown>
            )}
          </span>
        )}
      </span>
    );
  };
  const [filter, setFilter] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([props.selectMenu.key]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<boolean>();
  const [data, setData] = useState<MenuProps['items']>(
    loadMenus(props.item.children, []),
  );
  useEffect(() => {
    reloadData(loadOpenKeys(props.item.children, props.selectMenu.key));
  }, [props]);

  useEffect(() => {
    reloadData(openKeys);
  }, [visibleMenu, filter]);

  const reloadData = (keys: string[]) => {
    setData(loadMenus(loopFilterTree(props.item.children), keys));
    setOpenKeys(keys);
    setSelectedKeys([props.selectMenu.key]);
  };
  return (
    <>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        {props.collapsed ? (
          <ImSearch />
        ) : (
          <Input
            style={{ height: 36, fontSize: 15 }}
            placeholder="搜索"
            prefix={<ImSearch />}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        )}
      </span>

      <Menu
        className="customMenu"
        mode="inline"
        inlineIndent={10}
        items={data}
        triggerSubMenuAction="click"
        onContextMenu={(e) => {
          e.preventDefault();
          setVisibleMenu(true);
        }}
        expandIcon={() => <></>}
        openKeys={openKeys}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        selectedKeys={selectedKeys}></Menu>
    </>
  );
};

export default CustomMenu;
