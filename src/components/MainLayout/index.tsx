import { Button, Col, Divider, Dropdown, Layout, Row, Space, Typography } from 'antd';
import React from 'react';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { ImUndo2 } from 'react-icons/im';
import { Resizable } from 'devextreme-react';
import { LeftBarIcon, RightBarIcon } from '@/components/Common/GlobalComps/customIcon';
import useStorage from '@/hooks/useStorage';
import EntityPreview from './preview';
import { RiMore2Fill } from 'react-icons/ri';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MainLayoutType = {
  previewFlag?: string;
  leftShow?: boolean;
  rightShow?: boolean;
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
  const [leftSider, setLeftSider] = useStorage<boolean>('leftSider', false);
  const [rightSider, setRightSider] = useStorage<boolean>('rightSider', true);
  const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '40%');
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
  const previewCtx = React.useMemo(() => {
    return <EntityPreview flag={props.previewFlag} />;
  }, [props]);
  return (
    <Layout className={'main_layout'}>
      <Row className={'header'} justify="space-between">
        <Col>
          <CustomBreadcrumb
            selectKey={props.selectMenu.key}
            item={props.siderMenuData}
            onSelect={(item) => {
              onSelectClick(item);
            }}></CustomBreadcrumb>
        </Col>
        <Col>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            {props.leftShow === undefined && (
              <Typography.Link
                title={'切换主测栏'}
                style={{ fontSize: 18 }}
                onClick={() => setLeftSider(!leftSider)}>
                <LeftBarIcon size={18} width={4} selected={leftSider} />
              </Typography.Link>
            )}
            {props.rightShow === undefined && (
              <Typography.Link
                title={'切换辅助侧栏'}
                style={{ fontSize: 18 }}
                onClick={() => setRightSider(!rightSider)}>
                <RightBarIcon size={18} width={8} selected={rightSider} />
              </Typography.Link>
            )}
            {props.rightBar}
          </Space>
        </Col>
      </Row>
      <Layout className={'body'}>
        {(props.leftShow ?? leftSider) && (
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
        )}
        {props.rightShow !== false && (props.rightShow || rightSider) ? (
          <>
            <Resizable
              handles={'right'}
              width={mainWidth}
              onResize={(e) => setMainWidth(e.width)}>
              <Sider className={'content'} width={'100%'}>
                {props.children}
              </Sider>
            </Resizable>
            <Content className={'content'}>{previewCtx}</Content>
          </>
        ) : (
          <Content className={'content'}>{props.children}</Content>
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
