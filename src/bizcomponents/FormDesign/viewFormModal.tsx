import React from 'react';
import { XForm } from '@/ts/base/schema';
import { Modal } from 'antd';
import OioForm from './OioForm';
import { IBelong } from '@/ts/core';

interface IProps {
  open: boolean;
  data: XForm | undefined;
  belong: IBelong;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = ({ open, data, handleCancel, handleOk, belong }: IProps) => {
  return (
    <Modal
      title={data?.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={1000}>
      <OioForm form={data as XForm} formRef={undefined} belong={belong} />
    </Modal>
  );
};

export default ViewFormModal;
