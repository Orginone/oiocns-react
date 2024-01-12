import { Layout, Menu } from 'antd';
import React from 'react';
import { MenuItemType } from 'typings/globelType';
import EntityPreview from '../../components/MainLayout/preview';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type BudgetLayoutType = {
  previewFlag?: string;
  siderMenuData: MenuItemType;
  rightBar?: React.ReactNode;
  selectMenu: MenuItemType;
  rootMenu: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const BudgetLayout: React.FC<BudgetLayoutType> = (props) => {
  const findMenus = (key: string, menus?: MenuItemType[]): MenuItemType | undefined => {
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
  const onSelectClick = async (item: MenuItemType) => {
    if (item.beforeLoad) {
      await item.beforeLoad();
    }
    props.onSelect?.apply(this, [item]);
  };
  const previewCtx = React.useMemo(() => {
    return <EntityPreview flag={props.previewFlag} />;
  }, [props]);
  return (
    <Layout className={'main_layout'}>
      <Layout className={'body'}>
        <Sider className={'sider'} width={250}>
          <div style={{ padding: 8 }} className={'container'}>
            <Menu
              onClick={(info) => {
                const item = findMenus(info.key, [props.rootMenu]);
                if (item && props.onSelect) {
                  props.onSelect(item);
                }
              }}
              onSelect={(info) => {
                const item = findMenus(info.key, [props.rootMenu]);
                if (item && props.onSelect) {
                  props.onSelect(item);
                }
              }}
              mode="vertical"
              triggerSubMenuAction="hover"
              items={props.rootMenu.children}
            />
          </div>
        </Sider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% - 250px)',
          }}>
          <div style={{ backgroundColor: '#eee', padding: 6 }}>
            <CustomBreadcrumb
              selectKey={props.selectMenu.key}
              item={props.siderMenuData}
              onSelect={(item) => {
                onSelectClick(item);
              }}></CustomBreadcrumb>
          </div>
          <Content className={'content'}>{previewCtx}</Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default BudgetLayout;
