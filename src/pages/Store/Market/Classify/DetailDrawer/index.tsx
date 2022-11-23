import React from 'react';
import { Drawer, Row, Col, Tag, Space } from 'antd';
import cls from './index.module.less';

/**
 * @description: 我的商店 基础详情抽屉
 * @return {*}
 */

interface Iporps {
  title: string;
  onClose: () => void;
  open: boolean;
}

const DetailDrawer: React.FC<Iporps> = ({ title, onClose, open }) => {
  const content = (
    <div className={cls['detail-drawer-content']}>
      <Row>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店名称：</Space>神马商店
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店编码：</Space>shenma
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>是否公开：</Space>
          <Tag color="#87d068">公开</Tag>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>应用权属：</Space>
          <Tag color="#2db7f5">创建的</Tag>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店简介：</Space>神马应用,神马都有
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>归属人：</Space>常森
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>创建时间：</Space>2022-09-15
          12:46:39.110
        </Col>
      </Row>
    </div>
  );
  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      closable={false}
      width={400}>
      {content}
    </Drawer>
  );
};
export default DetailDrawer;
