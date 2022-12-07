import React from 'react';
import { Modal, Button, Card, Descriptions } from 'antd';
import cls from './index.module.less';

/**
 * @description: 应用详情弹窗
 * @return {*}
 */

interface Iprops {
  title: string;
  open: boolean;
  onClose: () => void;
  data: any;
  width?: number;
}

const ProductDetailModal: React.FC<Iprops> = ({ title, open, onClose, width, data }) => {
  console.log('应用详情属性', data);
  const content = (
    <Card bordered={false}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="应用名称" span={2}>
          {data?.caption}
        </Descriptions.Item>
        <Descriptions.Item label="售卖价格" span={2}>
          {data?.price ? <>{`${data?.price}元`}</> : '免费'}
        </Descriptions.Item>
        <Descriptions.Item label="售卖权属">{data?.sellAuth}</Descriptions.Item>
        <Descriptions.Item label="使用期限">-- 天</Descriptions.Item>
        <Descriptions.Item label="应用类型">{data?.product?.typeName}</Descriptions.Item>
        <Descriptions.Item label="归属">--</Descriptions.Item>
        <Descriptions.Item label="发起人">--</Descriptions.Item>
        <Descriptions.Item label="创建时间">{data?.createTime}</Descriptions.Item>
        <Descriptions.Item label="应用描述" span={2}>
          {data?.product?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
  /**
   * @description: 自定义弹窗页脚
   * @return {*}
   */
  const footer = (
    <Button type="primary" onClick={onClose}>
      关闭
    </Button>
  );
  return (
    <div className={cls['product-detail']}>
      <Modal
        title={title}
        open={open}
        onOk={onClose}
        onCancel={onClose}
        getContainer={false}
        width={width ?? 600}
        footer={footer}>
        {content}
      </Modal>
    </div>
  );
};
export default ProductDetailModal;
