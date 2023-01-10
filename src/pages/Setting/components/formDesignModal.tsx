import { OperationModel } from '@/ts/base/model';
import { XOperation } from '@/ts/base/schema';
import { ITarget } from '@/ts/core';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { Modal } from 'antd';
import Generator, { FRGeneratorProps } from 'fr-generator';
import React from 'react';

interface FormDesignProps extends FRGeneratorProps {
  title: string;
  open: boolean;
  data: XOperation;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpeciesItem;
  target?: ITarget;
}

/*
  表单设计模态框
*/
const FormDesignModal = (props: FormDesignProps) => {
  let { title, open, data, handleCancel, handleOk, current } = props;
  data = data as XOperation;
  let schema = undefined;
  if (data?.remark) {
    schema = JSON.parse(data?.remark);
  }
  const save = async () => {
    const body: OperationModel = {
      id: data?.id,
      name: data?.name as string,
      code: data?.code as string,
      public: data?.public as boolean,
      remark: data?.remark as string,
      belongId: data?.belongId as string,
      speciesId: '',
      speciesCode: '',
    };
    const result = await current.updateOperation(body);
    handleOk(result);
  };
  return (
    <Modal
      title={title}
      open={open}
      onOk={async () => save()}
      onCancel={handleCancel}
      width={1280}>
      <div style={{ paddingTop: '14px' }}>
        <Generator
          defaultValue={schema}
          onSchemaChange={(schema) => {
            if (schema) {
              data = { ...data, ...{ remark: JSON.stringify(schema) as string } };
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default FormDesignModal;
