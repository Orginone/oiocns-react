import { Col, Layout, MenuProps, Row } from 'antd';
import React from 'react';

import { IRouteConfig } from '@/routes/config';

import BreadCrumb from '../BreadCrumb';
import ContentMenu from '../ContentMenu';
import cls from './index.module.less';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { Content } = Layout;

/**
 * 内容区模板类
 */
type ContentTemplateType = {
  className?: string; //wrap calss
  content?: React.ReactNode; // 内容区
  sider?: React.ReactNode; // 左侧
  contentTop?: React.ReactNode; // 内容区顶部
  contentTopLeft?: React.ReactNode; // 内容区顶部左侧
  contentTopRight?: React.ReactNode; // 内容区顶部右侧
  hideBreadCrumb?: boolean; // 是否隐藏面包屑
  children?: React.ReactNode; // 子组件
  route?: IRouteConfig; // 路由
  siderMenuData?: MenuProps[`items`];
  menuClick?: MenuClickEventHandler;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const ContentTemplate: React.FC<ContentTemplateType> = (props) => {
  const {
    className,
    content,
    sider,
    siderMenuData,
    menuClick,
    // contentTop,
    contentTopLeft,
    contentTopRight,
    hideBreadCrumb = false,
    children,
  } = props;
  // TODO 布局样式、侧边展开和收缩 侧边栏顶部([icon/名称] 需传入展示)
  return (
    <Layout className={`${className}`} style={{ height: '100%' }}>
      {(sider || siderMenuData) && (
        <ContentMenu data={siderMenuData} menuClick={menuClick}>
          {sider && sider}
        </ContentMenu>
      )}

      <Layout className={cls.container}>
        {(!hideBreadCrumb || contentTopRight) && (
          <Row className={cls[`content-top`]}>
            <Col>{!hideBreadCrumb ? <BreadCrumb /> : contentTopLeft}</Col>
            <Col>{contentTopRight}</Col>
          </Row>
        )}
        {/* <div className={cls.contenttop}>{contentTop}</div>
        <div className={cls.contenttop}>
          <div>{contentTopLeft}</div>
          <div>{contentTopRight}</div>
        </div> */}
        <Content className={cls.content}>{content || children}</Content>
      </Layout>
    </Layout>
  );
};

export default ContentTemplate;
