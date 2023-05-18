import React from 'react';
import { Modal } from 'antd';
import OioForm from './OioForm';
import { IForm } from '@/ts/core';

interface IProps {
  open: boolean;
  form: IForm;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = ({ open, form, handleCancel, handleOk }: IProps) => {
  return (
    <Modal
      title={form.metadata.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={1000}>
      <OioForm form={form} formRef={undefined} />
    </Modal>
  );
};

export default ViewFormModal;
