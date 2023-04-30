import { Col, Divider, Dropdown, Layout, Row, Space, Typography, Button } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType } from 'typings/globelType';
import {
  AiOutlineEllipsis,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai';
import { ImArrowLeft2 } from 'react-icons/im';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import MenuIcon from "@/bizcomponents/GlobalComps/MenuIcon"
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MainLayoutType = {
  className?: string; //wrap calss
  children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType;
  rightBar?: React.ReactNode;
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
const MainLayout: React.FC<MainLayoutType> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const parentMenu = props.selectMenu.parentMenu ?? props.siderMenuData;
  const outside =
    props.selectMenu.menus?.filter((item) => item.model === 'outside') ?? [];
  const inside = props.selectMenu.menus?.filter((item) => item.model != 'outside') ?? [];
  return (
    <Layout
      className={`${props.className}`}
      style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={250} collapsed={collapsed}>
        <div
          className={cls.title}
          title={parentMenu.label}
          onClick={() => {
            props.onSelect?.apply(this, [parentMenu]);
          }}>
          {parentMenu.key != props.siderMenuData.key && (
            <div className={cls.backup}>
              <ImArrowLeft2 fontSize={20} />
            </div>
          )}
          {!collapsed && (
            <>
              <span style={{ fontSize: 20, margin: '0 6px' }}>{parentMenu.icon}</span>
              <strong>{parentMenu.label}</strong>
            </>
          )}
        </div>
        <div className={cls.container} id="templateMenu">
          <CustomMenu
            item={parentMenu}
            selectMenu={props.selectMenu}
            onSelect={(item) => {
              props.onSelect?.apply(this, [item]);
            }}
            onMenuClick={(item, key) => {
              props.onMenuClick?.apply(this, [item, key]);
            }}
          />
        </div>
        <div
          className={cls.exit}
          onClick={() => {
            sessionStorage.clear();
            location.reload();
          }}>
            <MenuIcon menuinfo={orgCtrl.MenuList("loginout")} />
          <span>退出登录</span>
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
                  {collapsed ? (
                    <AiOutlineMenuUnfold fontSize={16} />
                  ) : (
                    <AiOutlineMenuFold fontSize={16} />
                  )}
                </Typography.Link>
              }
              selectKey={props.selectMenu.key}
              item={props.siderMenuData}
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
                  <AiOutlineEllipsis
                    title={'右键操作'}
                    style={{ fontSize: 18 }}
                    rotate={90}
                  />
                </Dropdown>
              )}
            </Space>
          </Col>
        </Row>
        <Content className={cls.content}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
