import { Col, Divider, Dropdown, Layout, Row, Space, Typography, Tabs } from 'antd';
import React, { useState } from 'react';
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
  rightBar?: React.ReactNode;
  selectMenu: MenuItemType[];
  tabs: TabItemType[];
  tabKey?: string;
  onSelect?: (items: MenuItemType[]) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const MainTabLayout: React.FC<MainLayoutType> = (props) => {
  const { className, children, tabs, tabKey } = props;
  const [tabKey_, setTabKey_] = useState<string>(tabKey || '1');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={`${className}`} style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={250} collapsed={collapsed}>
        {props.selectMenu.length == 1 && (
          <div className={cls.title}>
            <span style={{ fontSize: 16, margin: 6 }}>{props.selectMenu[0].icon}</span>
            {!collapsed && <strong>{props.selectMenu[0].label}</strong>}
          </div>
        )}
        <div className={cls.container} id="templateMenu">
          <Tabs
            centered
            activeKey={tabKey_}
            onChange={(key: any) => {
              setTabKey_(key);
            }}
            items={tabs.map((a) => {
              return {
                key: a.key,
                label: a.label,
                children: (
                  <CustomMenu
                    item={a.menu}
                    selectMenu={
                      props.selectMenu.length > 0 ? props.selectMenu[0] : a.menu[0]
                    }
                    // menuStyle={
                    //   a.label == GroupMenuType.Books ? undefined : cls.customMenu
                    // }
                    onSelect={(item) => {
                      props.onSelect?.apply(this, [[item]]);
                    }}
                    onMenuClick={(item, key) => {
                      props.onMenuClick?.apply(this, [item, key]);
                    }}
                    onCheckedChange={props.onSelect}
                    checkedList={props.selectMenu}
                  />
                ),
              };
            })}
          />
        </div>
      </Sider>
      <Layout className={cls.container}>
        <Row className={cls[`content-top`]} justify="space-between">
          <Col>
            {tabs.filter((tab) => tab.key == tabKey_)[0]?.menu &&
              props.selectMenu.length == 1 && (
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
                  selectKey={props.selectMenu[0].key}
                  item={tabs?.filter((tab) => tab.key == tabKey_)[0]?.menu}
                  onSelect={(item) => {
                    props.onSelect?.apply(this, [[item]]);
                  }}
                />
              )}
          </Col>
          <Col className={cls.rightstyle}>
            {props.selectMenu.length == 1 && (
              <Space wrap split={<Divider type="vertical" />} size={2}>
                {props.rightBar}
                {props.selectMenu[0].menus && (
                  <Dropdown
                    menu={{
                      items: props.selectMenu[0].menus,
                      onClick: ({ key }) => {
                        props.onMenuClick?.apply(this, [props.selectMenu[0], key]);
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
            )}
          </Col>
        </Row>
        <Content className={cls.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainTabLayout;