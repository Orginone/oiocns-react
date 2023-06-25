import { Modal } from 'antd';
import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { generateUuid } from '@/ts/base/common';
import { formatDate } from '@/utils';
import React from 'react';
import { schema } from '@/ts/base';
import { IBelong } from '@/ts/core';

interface IFormEditProps {
  form: schema.XForm;
  belong: IBelong;
  create: boolean;
  initialValues?: any;
  onSave: (values: any) => void;
}

const FormEditModal = ({
  form,
  belong,
  create,
  initialValues,
  onSave,
}: IFormEditProps) => {
  const editData: any = {};
  const modal = Modal.confirm({
    icon: <></>,
    width: '80vw',
    okText: `确认${create ? '新增' : '变更'}`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <OioForm
        showTitle
        form={form}
        belong={belong}
        fieldsValue={initialValues || {}}
        onValuesChange={(_, values) => {
          Object.keys(values).forEach((k) => {
            editData[k] = values[k];
          });
        }}
      />
    ),
    onOk: () => {
      modal.destroy();
      if (create) {
        onSave({
          ...editData,
          Status: '正常',
          Creater: belong.userId,
          Id: 'uuid' + generateUuid(),
          CreateTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
          ModifiedTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
        });
      } else {
        onSave(editData);
      }
    },
  });
};

export default FormEditModal;
