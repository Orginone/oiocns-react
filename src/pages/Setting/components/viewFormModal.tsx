import React from 'react';
import { XOperation } from '@/ts/base/schema';
import { Modal } from 'antd';
import OioForm from './render';

interface FormDesignProps {
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = (props: FormDesignProps) => {
  const { open, data, handleCancel, handleOk } = props;

  return (
    <Modal
      title={data?.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={900}>
      <OioForm operationId={data?.id as string} />
    </Modal>
  );
};

export default ViewFormModal;
