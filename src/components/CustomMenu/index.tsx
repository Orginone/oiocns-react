import { EllipsisOutlined } from '@ant-design/icons';
import {
  Dropdown,
  Menu,
  MenuProps,
  Typography,
  Input,
  Layout,
  Row,
  Col,
  Badge,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ImSearch, ImUndo2 } from 'react-icons/im';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import style from './index.module.less';

interface CustomMenuType {
  selectMenu: MenuItemType;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
}
const CustomMenu = (props: CustomMenuType) => {
  const [filter, setFilter] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([props.selectMenu.key]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<boolean>();
  const [data, setData] = useState<MenuProps['items']>([]);
  const [operateMenu, setOperateMenu] = useState<OperateMenuType>();
  useEffect(() => {
    if (!selectedKeys.includes(props.selectMenu.key) || !operateMenu) {
      setOperateMenu(undefined);
      const expKeys = loadOpenKeys(props.item.children, props.selectMenu.key);
      if (props.selectMenu.label != '') {
        setData(loadMenus(loopFilterTree([props.selectMenu]), expKeys));
      } else {
        setData(loadMenus(loopFilterTree(props.item.children), expKeys));
      }
      setOpenKeys(expKeys);
      setSelectedKeys([props.selectMenu.key]);
    }
    if (operateMenu && props.selectMenu.menus) {
      const menu = props.selectMenu.menus.find((i) => i.key == operateMenu?.key);
      if (menu && menu.subMenu) {
        setOperateMenu(menu);
        setData(loadMenus(loopFilterTree([menu.subMenu])));
      }
    }
  }, [props]);

  useEffect(() => {
    if (operateMenu) {
      setData(loadMenus(loopFilterTree([operateMenu.subMenu!]), openKeys));
    } else {
      setData(loadMenus(loopFilterTree(props.item.children), openKeys));
    }
  }, [visibleMenu, filter]);

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
      if (exsit) {
        result.push(newItem);
      }
    }
    return result;
  };

  /** 转换数据,解析成原生菜单数据 */
  const loadMenus: any = (items: MenuItemType[], expKeys: string[]) => {
    const result = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          key: item.key,
          icon: (
            <span style={{ fontSize: 16, paddingTop: 2 }}>
              {item.expIcon && expKeys.includes(item.key) ? item.expIcon : item.icon}
            </span>
          ),
          title: item.label,
          label: renderLabel(item),
          children: loadMenus(item.children, expKeys),
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
      <span
        onClick={() => {
          if (item.key != props.selectMenu.key) {
            props.onSelect?.apply(this, [item]);
          }
          if (operateMenu) {
            setSelectedKeys([props.selectMenu.key, item.key]);
          }
        }}
        className={style.customlabel}
        onMouseLeave={() => {
          setVisibleMenu(false);
        }}>
        <Typography.Text className={style.label} ellipsis={{ tooltip: item.label }}>
          {item.label}
        </Typography.Text>
        {item.count && item.count > 0 ? (
          <span className={style.badge}>
            <Badge key={item.key} count={item.count} size="small" />
          </span>
        ) : (
          <></>
        )}
        {Array.isArray(item.menus) && item.menus.length > 0 && (
          <span onClick={(e: any) => e.stopPropagation()} className={style.moreButton}>
            {props.selectMenu.key === item.key && (
              <Dropdown
                menu={{
                  items: item.menus.map((i) => {
                    return {
                      key: i.key,
                      icon: i.icon,
                      label: i.label,
                    };
                  }),
                  onClick: ({ key }) => {
                    const menu = item.menus?.find((i) => i.key == key);
                    if (menu && menu.subMenu) {
                      setOperateMenu(menu);
                      setSelectedKeys([props.selectMenu.key, menu.subMenu.key]);
                      props.onSelect?.apply(this, [menu.subMenu]);
                    } else {
                      props.onMenuClick?.apply(this, [item, key]);
                    }
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
          </span>
        )}
      </span>
    );
  };

  return (
    <>
      {operateMenu && (
        <Layout className={style.operateMenu}>
          <Row justify="space-between">
            <Col>
              <div style={{ display: 'flex' }}>
                <div style={{ paddingRight: '6px' }}>{operateMenu.icon}</div>
                <div>{operateMenu.label}</div>
              </div>
            </Col>
            <Col>
              <ImUndo2
                style={{ cursor: 'pointer' }}
                title={'返回'}
                onClick={() => {
                  setOperateMenu(undefined);
                  props.onSelect?.apply(this, [props.selectMenu]);
                }}
              />
            </Col>
          </Row>
        </Layout>
      )}
      <span style={{ display: 'flex' }}>
        <Input
          style={{ height: 36, fontSize: 15 }}
          placeholder="搜索"
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </span>

      <Menu
        className={style.customMenu}
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
