import React from 'react';
import { Drawer, Row, Col, Tag, Space, Typography } from 'antd';
import cls from './index.module.less';

/**
 * @description: 我的商店 基础详情抽屉
 * @return {*}
 */

interface Iporps {
  title: string; // 标题
  onClose: () => void; // 关闭的回调
  open: boolean; // 是否打开
  nodeDetail: any; // 详情信息
}

const { Paragraph } = Typography;

const DetailDrawer: React.FC<Iporps> = ({ title, onClose, open, nodeDetail }) => {
  /**
   * @description: 详情内容
   * @return {*}
   */
  const content = (
    <div className={cls['detail-drawer-content']}>
      <Row>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店名称：</Space>
          {nodeDetail?.name}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店编码：</Space>
          <Paragraph copyable>{nodeDetail?.code}</Paragraph>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>是否公开：</Space>
          {nodeDetail?.public === true ? (
            <Tag color="#87d068">公开</Tag>
          ) : (
            <Tag color="#f50">私有</Tag>
          )}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>应用权属：</Space>
          {nodeDetail?.belongId === nodeDetail?.createUser ? (
            <Tag color="#2db7f5">创建的</Tag>
          ) : (
            <Tag color="#87d068">加入的</Tag>
          )}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店简介：</Space>
          <Paragraph
            className={cls['detail-drawer-remark']}
            ellipsis={{
              rows: 3,
              expandable: true,
              onEllipsis: (ellipsis) => {
                console.log('Ellipsis changed:', ellipsis);
              },
            }}>
            {nodeDetail?.remark}
          </Paragraph>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>归属人：</Space>
          {nodeDetail?.createUser}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>创建时间：</Space>
          {nodeDetail?.createTime}
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
