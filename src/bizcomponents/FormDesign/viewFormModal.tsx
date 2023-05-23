import React from 'react';
import { Modal } from 'antd';
import OioForm from './OioForm';
import { XForm } from '@/ts/base/schema';
import { IWorkDefine } from '@/ts/core';

interface IProps {
  open: boolean;
  form: XForm;
  define: IWorkDefine;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = ({ open, form, define, handleCancel, handleOk }: IProps) => {
  return (
    <Modal
      title={form.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={1000}>
      <OioForm form={form} formRef={undefined} define={define} />
    </Modal>
  );
};

export default ViewFormModal;
