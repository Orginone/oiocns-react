import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu, MenuProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import css from './index.module.less';

interface CustomMenuType {
  selectMenu: MenuItemType;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}
const CustomMenu = (props: CustomMenuType) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([props.selectMenu.key]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<boolean>();
  const [overItem, setOverItem] = useState<MenuItemType>();
  const [data, setData] = useState<MenuProps['items']>([]);
  const [subMenuKey, setSubMenuKey] = useState<string>();
  const [subMenu, setSubMenu] = useState<MenuItemType>();
  useEffect(() => {
    if (!selectedKeys.includes(props.selectMenu.key) || !subMenu) {
      setSubMenu(undefined);
      setSubMenuKey(undefined);
      setSelectedKeys([props.selectMenu.key]);
      setData(loadMenus(props.item.children));
      setOpenKeys(loadOpenKeys(props.item.children, props.selectMenu.key));
    }
    if (subMenu && props.selectMenu.menus) {
      const menu = props.selectMenu.menus.find((i) => i.key == subMenuKey);
      if (menu && menu.subMenu) {
        setSubMenu(menu.subMenu);
        setData(loadMenus([menu.subMenu]));
      }
    }
  }, [props]);

  useEffect(() => {
    if (subMenu) {
      setData(loadMenus([subMenu]));
    } else {
      setData(loadMenus(props.item.children));
    }
  }, [overItem, visibleMenu]);

  /** 转换数据,解析成原生菜单数据 */
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
      <div
        onClick={() => {
          if (item.key != props.selectMenu.key) {
            props.onSelect?.apply(this, [item]);
          }
          if (subMenu) {
            setSelectedKeys([props.selectMenu.key, item.key]);
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
                items: item.menus?.map((i) => {
                  return {
                    key: i.key,
                    icon: i.icon,
                    label: i.label,
                  };
                }),
                onClick: ({ key }) => {
                  const menu = item.menus?.find((i) => i.key == key);
                  if (menu) {
                    if (menu.subMenu) {
                      setSubMenuKey(key);
                      setSubMenu(menu.subMenu);
                      setSelectedKeys([props.selectMenu.key, menu.subMenu.key]);
                      props.onSelect?.apply(this, [menu.subMenu]);
                    } else {
                      props.onMenuClick?.apply(this, [item, key]);
                    }
                    setVisibleMenu(false);
                  }
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
      selectedKeys={selectedKeys}></Menu>
  );
};

export default CustomMenu;
