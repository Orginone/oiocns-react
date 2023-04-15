import { Col, Divider, Dropdown, Layout, Row, Space, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType, TabItemType } from 'typings/globelType';
import chatCtrl from '@/ts/controller/chat';

import {
  EllipsisOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { IconFont } from '../IconFont';
import { GroupMenuType } from '@/pages/Chats/config/menuType';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type IProps = {
  className?: string; //wrap calss
  showTopBar: boolean; //是否显示面包屑
  children?: React.ReactNode; // 子组件
  menuData: TabItemType[];
  tabKey: string;
  onTabChanged: (tabKey: string) => void;
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
const ChatLayout: React.FC<IProps> = (props) => {
  const { className, menuData, children, tabKey, onTabChanged } = props;
  const [tabKey_, setTabKey_] = useState<string>(tabKey);
  useEffect(() => {
    setTabKey_(tabKey);
  }, [tabKey]);
  useEffect(() => {
    setTabKey_(chatCtrl.tabIndex);
    onTabChanged(chatCtrl.tabIndex);
  }, [chatCtrl.tabIndex]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectTab, setSelectTab] = useState<TabItemType>();

  return (
    <Layout className={`${className}`} style={{ height: '100%', position: 'relative' }}>
      <Sider className={cls.sider} width={250} collapsed={collapsed}>
        <div className={cls.title}>
          <span style={{ fontSize: 16, margin: 6 }}>
            <IconFont type={'icon-message'} />
          </span>
          {!collapsed && <strong>沟通</strong>}
        </div>
        <div className={cls.container} id="templateMenu">
          <Tabs
            centered
            activeKey={tabKey_}
            onChange={(key) => {
              onTabChanged(key);
              // setSelectTab(menuData.find((a) => a.key == key));
            }}
            items={menuData.map((a) => {
              return {
                key: a.key,
                label: a.label,
                children: (
                  <CustomMenu
                    item={a.menu}
                    selectMenu={props.selectMenu}
                    menuStyle={
                      a.label == GroupMenuType.Books ? undefined : cls.customMenu
                    }
                    onSelect={(item) => {
                      props.onSelect?.apply(this, [item]);
                    }}
                    onMenuClick={(item, key) => {
                      props.onMenuClick?.apply(this, [item, key]);
                    }}
                    onCheckedChange={() => {}}
                    checkedList={[]}
                  />
                ),
              };
            })}
          />
        </div>
      </Sider>
      <Layout className={cls.container}>
        {props.showTopBar && selectTab && (
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
                item={selectTab.menu}
                onSelect={(item) => {
                  props.onSelect?.apply(this, [item]);
                }}
              />
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
        )}
        <Content className={cls.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ChatLayout;
