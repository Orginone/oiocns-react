import React from 'react';
import { Modal } from 'antd';
import cls from './index.module.less';
import { CheckCircleOutlined } from '@ant-design/icons';

interface Iprops {
  title: string; // 标题
  open: boolean; // 开关
  onOk: () => void; // 确认
  onCancel: () => void; // 取消
  content?: string; // 展示内容
}

const BuyCustomModal: React.FC<Iprops> = ({ title, open, onOk, onCancel, content }) => {
  return (
    <div className={cls['buy-custom-content']}>
      <Modal
        title={title}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        getContainer={false}>
        <div className={cls['buy-custom-info']}>
          <CheckCircleOutlined className={cls['buy-icon']} />
          {content}?
        </div>
      </Modal>
    </div>
  );
};
export default BuyCustomModal;
