import {
  Col,
  Divider,
  Dropdown,
  Layout,
  Row,
  Space,
  Typography,
  Tabs,
  Button,
} from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType } from 'typings/globelType';
import {
  EllipsisOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { findMenuItemByKey } from '@/utils/tools';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MainLayoutType = {
  className?: string; //wrap calss
  children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType[];
  rightBar?: React.ReactNode;
  headerMenu?: MenuItemType;
  selectMenu: MenuItemType;
  title: {
    label: string;
    icon: React.ReactNode;
  };
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const MainLayout: React.FC<MainLayoutType> = (props) => {
  const { className, siderMenuData, children } = props;
  const [collapsed, setCollapsed] = useState(false);
  if (props.siderMenuData.length < 1) return <></>;
  var activeKey = props.siderMenuData[0].key;
  for (let i = 1; i < props.siderMenuData.length; i++) {
    if (findMenuItemByKey([props.siderMenuData[i]], props.selectMenu.key)) {
      activeKey = props.siderMenuData[i].key;
    }
  }
  const outside =
    props.selectMenu.menus?.filter((item) => item.model === 'outside') ?? [];
  const inside = props.selectMenu.menus?.filter((item) => item.model != 'outside') ?? [];
  return (
    <Layout className={`${className}`} style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={250} collapsed={collapsed}>
        <div className={cls.title}>
          <span style={{ fontSize: 20, margin: '0 6px' }}>{props.title.icon}</span>
          {!collapsed && <strong>{props.title.label}</strong>}
        </div>
        <div className={cls.container} id="templateMenu">
          {siderMenuData.length > 0 && (
            <Tabs
              centered
              activeKey={activeKey}
              onChange={(key: any) => {
                siderMenuData.forEach((item) => {
                  if (item.key === key && item.children.length > 0) {
                    props.onSelect?.apply(this, [item.children[0]]);
                  }
                });
              }}
              items={siderMenuData.map((a) => {
                return {
                  key: a.key,
                  label: a.label,
                  children: (
                    <CustomMenu
                      item={a}
                      selectMenu={props.selectMenu}
                      onSelect={(item) => {
                        props.onSelect?.apply(this, [item]);
                      }}
                      onMenuClick={(item, key) => {
                        props.onMenuClick?.apply(this, [item, key]);
                      }}
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
              }}></CustomBreadcrumb>
          </Col>
          <Col className={cls.rightstyle}>
            <Space wrap split={<Divider type="vertical" />} size={2}>
              {props.rightBar}
              {outside.length > 0 &&
                outside.map((item) => {
                  return (
                    <Typography.Link
                      key={item.key}
                      title={item.label}
                      style={{ fontSize: 18 }}
                      onClick={() => {
                        props.onMenuClick?.apply(this, [props.selectMenu, item.key]);
                      }}>
                      {item.icon}
                    </Typography.Link>
                  );
                })}
              {inside.length > 0 && (
                <Dropdown
                  menu={{
                    items: inside,
                    onClick: ({ key }) => {
                      props.onMenuClick?.apply(this, [props.selectMenu, key]);
                    },
                  }}
                  dropdownRender={(menu) => (
                    <div>{menu && <Button type="link">{menu}</Button>}</div>
                  )}
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
