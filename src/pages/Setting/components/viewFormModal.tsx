import React from 'react';
import { FRGeneratorProps } from 'fr-generator';
import { XOperation } from '@/ts/base/schema';
import FormRender, { useForm } from 'form-render';
import { Modal } from 'antd';

interface FormDesignProps extends FRGeneratorProps {
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
  const form = useForm();
  let schema = {};
  if (data?.remark) {
    schema = JSON.parse(data?.remark);
  }
  return (
    <Modal
      title={data?.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      cancelText={'关闭'}
      width={900}>
      <FormRender form={form} schema={schema} />
    </Modal>
  );
};

export default ViewFormModal;
