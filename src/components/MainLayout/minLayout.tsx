import { Button, Dropdown, Layout, Typography } from 'antd';
import React from 'react';
import CustomMenu from '@/components/CustomMenu';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { ImUndo2 } from 'react-icons/im';
import { RiMore2Fill } from 'react-icons/ri';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MinLayoutType = {
  children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType;
  selectMenu: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const MinLayout: React.FC<MinLayoutType> = (props) => {
  const parentMenu = props.selectMenu.parentMenu ?? props.siderMenuData;
  const findMenus = (
    key: string,
    menus?: OperateMenuType[],
  ): OperateMenuType | undefined => {
    for (const menu of menus ?? []) {
      if (menu.key === key) {
        return menu;
      } else {
        const find = findMenus(key, menu.children);
        if (find) {
          return find;
        }
      }
    }
  };
  const onOperateMenuClick = async (item: MenuItemType, key: string) => {
    const menu = findMenus(key, item.menus);
    if (menu && menu.beforeLoad) {
      await menu.beforeLoad();
    }
    props.onMenuClick?.apply(this, [item, key]);
  };
  const onSelectClick = async (item: MenuItemType) => {
    if (item.beforeLoad) {
      await item.beforeLoad();
    }
    props.onSelect?.apply(this, [item]);
  };
  return (
    <Layout className={'main_layout'}>
      <Layout className={'body'}>
        <Sider className={'sider'} width={250}>
          <div className={'title'}>
            {parentMenu.key != props.siderMenuData.key && (
              <span className={'backup'} onClick={() => onSelectClick(parentMenu)}>
                <ImUndo2 size={16} />
              </span>
            )}
            <div className={'label'} onClick={() => onSelectClick(parentMenu)}>
              <span style={{ marginRight: 6 }}>{parentMenu.icon}</span>
              <Typography.Text ellipsis>{parentMenu.label}</Typography.Text>
            </div>
            {parentMenu.menus && parentMenu.menus.length > 0 && (
              <Dropdown
                menu={{
                  items: parentMenu.menus,
                  onClick: ({ key }) => {
                    onOperateMenuClick(props.selectMenu, key);
                  },
                }}
                dropdownRender={(menu) => (
                  <div>{menu && <Button type="link">{menu}</Button>}</div>
                )}
                placement="bottom"
                trigger={['click', 'contextMenu']}>
                <RiMore2Fill fontSize={22} style={{ cursor: 'pointer' }} />
              </Dropdown>
            )}
          </div>
          <div className={'container'} id="templateMenu">
            <CustomMenu
              item={parentMenu}
              collapsed={false}
              selectMenu={props.selectMenu}
              onSelect={(item) => {
                onSelectClick(item);
              }}
              onMenuClick={onOperateMenuClick}
            />
          </div>
        </Sider>
        <Content className={'content'}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default MinLayout;
