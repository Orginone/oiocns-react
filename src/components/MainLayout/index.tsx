import { Col, Layout, Row, Space } from 'antd';
import React from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType } from 'typings/globelType';

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
  const { className, siderMenuData, children } = props;
  return (
    <Layout className={`${className}`} style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={220}>
        <div className={cls.title}>
          <Space>
            {props.selectMenu.icon}
            <strong>{props.selectMenu.label}</strong>{' '}
          </Space>
        </div>
        <div className={cls.container} id="templateMenu">
          <CustomMenu
            item={siderMenuData}
            selectKey={props.selectMenu.key}
            onSelect={(item) => {
              props.onSelect?.apply(this, [item]);
            }}
            onMenuClick={(item, key) => {
              props.onMenuClick?.apply(this, [item, key]);
            }}
          />
        </div>
      </Sider>
      <Layout className={cls.container}>
        <Row className={cls[`content-top`]} justify="space-between">
          <Col>
            {
              <CustomBreadcrumb
                selectKey={props.selectMenu.key}
                item={siderMenuData}
                onSelect={(item) => {
                  props.onSelect?.apply(this, [item]);
                }}
              />
            }
          </Col>
          <Col className={cls.rightstyle}>
            <Space>{props.rightBar}</Space>
          </Col>
        </Row>
        <Content className={cls.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;