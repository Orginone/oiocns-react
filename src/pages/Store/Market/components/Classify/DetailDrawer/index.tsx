import React from 'react';
import { Drawer, Row, Col, Tag, Space, Typography, Avatar, Image } from 'antd';
import cls from './index.module.less';
import { XMarket } from '@/ts/base/schema';
import marketCtrl from '@/ts/controller/store/marketCtrl';

/**
 * @description: 我的商店 基础详情抽屉
 * @return {*}
 */

interface Iporps {
  title: string; // 标题
  onClose: () => void; // 关闭的回调
  open: boolean; // 是否打开
  nodeDetail: XMarket; // 详情信息
}

const DetailDrawer: React.FC<Iporps> = (props) => {
  const { title, onClose, open, nodeDetail } = props;
  const avatar = JSON.parse(nodeDetail.photo || '{}');
  /**
   * @description: 详情内容
   * @return {*}
   */
  const content = (
    <div className={cls['detail-drawer-content']}>
      <Row>
        <Col span={24}>
          <Avatar
            size={64}
            style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
            src={<Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />}
          />
          {nodeDetail.name}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店编码：</Space>
          <Typography.Paragraph copyable>{nodeDetail.code}</Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>是否公开：</Space>
          {nodeDetail.public === true ? (
            <Tag color="#87d068">公开</Tag>
          ) : (
            <Tag color="#f50">私有</Tag>
          )}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>应用权属：</Space>
          {nodeDetail.belongId === marketCtrl.target.id ? (
            <Tag color="#2db7f5">创建的</Tag>
          ) : (
            <Tag color="#87d068">加入的</Tag>
          )}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>商店简介：</Space>
          <Typography.Paragraph
            className={cls['detail-drawer-remark']}
            ellipsis={{
              rows: 3,
              expandable: true,
              onEllipsis: (ellipsis) => {
                console.log('Ellipsis changed:', ellipsis);
              },
            }}>
            {nodeDetail.remark}
          </Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>归属人：</Space>
          {nodeDetail.createUser}
        </Col>
        <Col span={24}>
          <Space className={cls['detail-drawer-item']}>创建时间：</Space>
          {nodeDetail.createTime}
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
