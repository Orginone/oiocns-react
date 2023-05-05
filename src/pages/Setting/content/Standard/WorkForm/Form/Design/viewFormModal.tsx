import React from 'react';
import { XOperation } from '@/ts/base/schema';
import { Modal } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import OioForm from '@/pages/Setting/content/Standard/Form/Design/OioForm';

interface IProps {
  open: boolean;
  data: XOperation | undefined;
  species: ISpeciesItem;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = ({ open, data, handleCancel, handleOk, species }: IProps) => {
  return (
    <Modal
      title={data?.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={1000}>
      <OioForm
        operation={data as XOperation}
        formRef={undefined}
        space={species.team.space}
      />
    </Modal>
  );
};

export default ViewFormModal;
