import { Modal } from 'antd';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import WorkFormViewer from '@/components/DataStandard/WorkForm/Viewer';

interface IFormEditProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  create: boolean;
  initialValues?: any;
  onSave: (values: any) => void;
}

const FormEditModal = ({
  form,
  fields,
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
      <div
        style={{ maxHeight: '70vh', width: '100%', overflowY: 'scroll', minHeight: 600 }}>
        <WorkFormViewer
          form={form}
          rules={[]}
          changedFields={[]}
          fields={fields}
          data={initialValues || {}}
          belong={belong}
          onValuesChange={(fields, values) => {
            editData[fields] = values;
          }}
        />
      </div>
    ),
    onOk: () => {
      if (create) {
        kernel.createThing(belong.id, [], '').then((res) => {
          if (res.success && res.data) {
            onSave({ ...res.data, ...editData });
            modal.destroy();
          }
        });
      } else {
        onSave(editData);
        modal.destroy();
      }
    },
  });
};

export default FormEditModal;
