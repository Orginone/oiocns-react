import { Modal } from 'antd';
import OioForm from '@/components/Common/FormDesign/OioFormNext';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import FormPreview2 from '../workForm/primaryCopy'
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

  const rule = form.rule && JSON.parse(form.rule);
  const modal = Modal.confirm({
    icon: <></>,
    width: '80vw',
    okText: `确认${create ? '新增' : '变更'}`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <>
        <OioForm
          showTitle
          form={form}
          fields={fields}
          belong={belong}
          fieldsValue={initialValues || {}}
          onValuesChange={(_, values) => {
            Object.keys(values).forEach((k) => {
              editData[k] = values[k];
            });
          }}
        />
       {/* <FormPreview2 forms={form}  /> */}
      </>

    ),
    onOk: () => {
      if (create) {
        kernel.createThing(belong.userId, '').then((res) => {
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
