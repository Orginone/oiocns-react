import { Col, Layout, MenuProps, Row, Space } from 'antd';
import React, { useState } from 'react';

import { IRouteConfig } from '@/routes/config';

import BreadCrumbBox from '../BreadCrumb';
import ContentMenu from '../ContentMenu';
import { TOOBAR_TYPE, toobarTypeAndNameMaps } from '@/constants/content_template';
import RightToobar from '@/bizcomponents/RightToobar';
import cls from './index.module.less';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { Content } = Layout;

/**
 * 内容区模板类
 */
type ContentTemplateType = {
  className?: string; //wrap calss
  content?: React.ReactNode; // 内容区
  sider?: React.ReactNode | React.ReactDOM; // 左侧
  contentTop?: React.ReactNode; // 内容区顶部
  contentTopLeft?: React.ReactNode; // 内容区顶部左侧
  contentTopRight?: React.ReactNode; // 内容区顶部右侧
  hideBreadCrumb?: boolean; // 是否隐藏面包屑
  hideTooBar?: boolean; //是否隐藏右侧内容
  children?: React.ReactNode; // 子组件
  route?: IRouteConfig; // 路由
  siderMenuData?: MenuProps[`items`];
  menuClick?: MenuClickEventHandler;
  menuSelect?: MenuProps[`onSelect`];
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
    menuSelect,
    children,
    contentTopLeft,
    contentTopRight,
    hideBreadCrumb = false,
    hideTooBar = false,
  } = props;
  // TODO 布局样式、侧边展开和收缩 侧边栏顶部([icon/名称] 需传入展示)

  const [open, setOpen] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<TOOBAR_TYPE>(TOOBAR_TYPE.STORAGE);

  return (
    <Layout className={`${className}`} style={{ height: '100%' }}>
      {(sider || siderMenuData) && (
        <ContentMenu data={siderMenuData} menuClick={menuClick} menuSelect={menuSelect}>
          {sider && sider}
        </ContentMenu>
      )}

      <Layout className={cls.container}>
        {(!hideBreadCrumb || contentTopRight || hideTooBar) && (
          // 面包屑与操作区
          <Row className={cls[`content-top`]} justify="space-between">
            {!hideBreadCrumb ? (
              <Col>{<BreadCrumbBox>{contentTopLeft}</BreadCrumbBox>}</Col>
            ) : (
              <Col>{contentTopLeft}</Col>
            )}
            <Col>{contentTopRight}</Col>
            <Col className={cls.rightstyle}>
              <Space>
                <a
                  onClick={() => {
                    setCurrentType(TOOBAR_TYPE.SHARE);
                    setOpen(true);
                  }}>
                  {toobarTypeAndNameMaps[TOOBAR_TYPE.SHARE]}
                </a>
                <a
                  onClick={() => {
                    setCurrentType(TOOBAR_TYPE.COMMEMNT);
                    setOpen(true);
                  }}>
                  {toobarTypeAndNameMaps[TOOBAR_TYPE.COMMEMNT]}
                </a>
                <a
                  onClick={() => {
                    setCurrentType(TOOBAR_TYPE.STORAGE);
                    setOpen(true);
                  }}>
                  {toobarTypeAndNameMaps[TOOBAR_TYPE.STORAGE]}
                </a>
              </Space>
            </Col>
          </Row>
        )}
        <Content className={cls.content}>{content || children}</Content>
        <RightToobar
          onClose={() => {
            setOpen(false);
          }}
          title={toobarTypeAndNameMaps[currentType]}
          type={currentType}
          open={open}
        />
      </Layout>
    </Layout>
  );
};

export default ContentTemplate;
