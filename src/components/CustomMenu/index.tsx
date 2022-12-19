import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu, MenuProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import css from './index.module.less';

interface CustomMenuType {
  selectKey?: string;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}
const CustomMenu = (props: CustomMenuType) => {
  const [openKeys, setOpenKeys] = useState<string[]>();
  const [visibleMenu, setVisibleMenu] = useState<boolean>();
  const [overItem, setOverItem] = useState<MenuItemType>();
  const [data, setData] = useState<MenuProps['items']>([]);
  useEffect(() => {
    if (props.selectKey) {
      setOpenKeys(loadOpenKeys(props.item.children, props.selectKey));
    }
    setData(loadMenus(props.item.children));
  }, [props]);

  useEffect(() => {
    setData(loadMenus(props.item.children));
  }, [overItem, visibleMenu]);

  const loadMenus: any = (items: MenuItemType[]) => {
    const result = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          icon: item.icon,
          label: renderLabel(item),
          children: loadMenus(item.children),
        });
      }
    }
    return result;
  };

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
  const renderLabel = (item: MenuItemType) => {
    return (
      <div
        onClick={() => {
          if (item.key != props.selectKey) {
            props.onSelect?.apply(this, [item]);
          }
        }}
        style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
        onMouseOver={() => {
          setOverItem(item);
        }}
        onMouseLeave={() => {
          setOverItem(undefined);
          setVisibleMenu(false);
        }}>
        <Typography.Text ellipsis>{item.label}</Typography.Text>
        <div onClick={(e: any) => e.stopPropagation()}>
          {item.menus && overItem?.key === item.key && (
            <Dropdown
              menu={{
                items: item.menus,
                onClick: ({ key }) => {
                  props.onMenuClick?.apply(this, [item, key]);
                  setVisibleMenu(false);
                },
              }}
              placement="bottom"
              open={visibleMenu}
              onOpenChange={(open: boolean) => {
                setVisibleMenu(open);
              }}
              trigger={['click', 'contextMenu']}>
              <EllipsisOutlined style={{ fontSize: 18 }} rotate={90} />
            </Dropdown>
          )}
        </div>
      </div>
    );
  };
  return (
    <Menu
      className={css.customMenu}
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
      onOpenChange={(keys) => setOpenKeys(keys)}
      selectedKeys={[props.selectKey ?? '']}></Menu>
  );
};

export default CustomMenu;