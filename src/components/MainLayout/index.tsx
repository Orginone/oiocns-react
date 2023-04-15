import { Col, Divider, Dropdown, Layout, Row, Space, Typography, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType, TabItemType } from 'typings/globelType';
import {
  EllipsisOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MainLayoutType = {
  className?: string; //wrap calss
  children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType;
  rightBar?: React.ReactNode;
  headerMenu?: MenuItemType;
  selectMenu: MenuItemType;
  tabs?: TabItemType[];
  checkedList: any[];
  tabKey?: string;
  title: {
    label: string;
    icon: React.ReactNode;
  };
  onTabChanged: (tabKey: string) => void;
  onCheckedChange: Function;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
  searchRightRegion?: any;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const MainLayout: React.FC<MainLayoutType> = (props) => {
  const {
    className,
    siderMenuData,
    children,
    tabs,
    checkedList,
    tabKey,
    onTabChanged,
    onCheckedChange,
  } = props;
  console.log(props);
  
  const [tabKey_, setTabKey_] = useState<string>(tabKey || '1');
  useEffect(() => {
    setTabKey_(tabKey || '1');
    if (tabs) {
      onTabChanged(tabKey || '1');
    }
  }, [tabKey]);

  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className={`${className}`} style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={250} collapsed={collapsed}>
        <div className={cls.title}>
          <span style={{ fontSize: 16, margin: 6 }}>{props.title.icon}</span>
          {!collapsed && <strong>{props.title.label}</strong>}
        </div>

        <div className={cls.container} id="templateMenu">
          {!tabs && (
            <CustomMenu
              item={siderMenuData}
              selectMenu={props.selectMenu}
              onSelect={(item) => {
                props.onSelect?.apply(this, [item]);
              }}
              onMenuClick={(item, key) => {
                props.onMenuClick?.apply(this, [item, key]);
              }}
              onCheckedChange={onCheckedChange}
              checkedList={checkedList}
              searchRightRegion={props.searchRightRegion}
            />
          )}
          {tabs && (
            <Tabs
              centered
              activeKey={tabKey_}
              onChange={(key: any) => {
                setTabKey_(key);
                onTabChanged(key);
                // setSelectTab(menuData.find((a) => a.key == key));
              }}
              items={tabs.map((a) => {
                return {
                  key: a.key,
                  label: a.label,
                  children: (
                    <CustomMenu
                      item={a.menu}
                      selectMenu={props.selectMenu}
                      // menuStyle={
                      //   a.label == GroupMenuType.Books ? undefined : cls.customMenu
                      // }
                      onSelect={(item) => {
                        props.onSelect?.apply(this, [item]);
                      }}
                      onMenuClick={(item, key) => {
                        props.onMenuClick?.apply(this, [item, key]);
                      }}
                      onCheckedChange={onCheckedChange}
                      checkedList={checkedList}
                      searchRightRegion={props.searchRightRegion}
                    />
                  ),
                };
              })}
            />
          )}
        </div>
      </Sider>
      <Layout className={cls.container}>
        <Row className={cls[`content-top`]} justify="space-between">
          <Col>
            {tabs && tabs?.filter((tab) => tab.key == tabKey_)[0]?.menu && (
              <CustomBreadcrumb
                key={tabKey_}
                leftBar={
                  <Typography.Link
                    style={{ fontSize: 16 }}
                    onClick={() => {
                      setCollapsed(!collapsed);
                    }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </Typography.Link>
                }
                selectKey={props.selectMenu.key}
                item={tabs?.filter((tab) => tab.key == tabKey_)[0]?.menu}
                onSelect={(item) => {
                  props.onSelect?.apply(this, [item]);
                }}
              />
            )}
            {!tabs && (
              <CustomBreadcrumb
                leftBar={
                  <Typography.Link
                    style={{ fontSize: 16 }}
                    onClick={() => {
                      setCollapsed(!collapsed);
                    }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </Typography.Link>
                }
                selectKey={props.selectMenu.key}
                item={siderMenuData}
                onSelect={(item) => {
                  props.onSelect?.apply(this, [item]);
                }}
              />
            )}
          </Col>
          <Col className={cls.rightstyle}>
            <Space wrap split={<Divider type="vertical" />} size={2}>
              {props.rightBar}
              {props.selectMenu.menus && (
                <Dropdown
                  menu={{
                    items: props.selectMenu.menus,
                    onClick: ({ key }) => {
                      props.onMenuClick?.apply(this, [props.selectMenu, key]);
                    },
                  }}
                  placement="bottom"
                  trigger={['click', 'contextMenu']}>
                  <EllipsisOutlined
                    title={'右键操作'}
                    style={{ fontSize: 18 }}
                    rotate={90}
                  />
                </Dropdown>
              )}
            </Space>
          </Col>
        </Row>
        <Content className={cls.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
