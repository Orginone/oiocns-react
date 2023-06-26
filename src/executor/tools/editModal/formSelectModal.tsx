import { Modal } from 'antd';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import GenerateTable from '../generate/table';
import CustomStore from 'devextreme/data/custom_store';

interface IFormSelectProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  selected?: string[];
  onSave: (values: model.AnyThingModel[]) => void;
}

const FormSelectModal = ({
  form,
  fields,
  belong,
  selected,
  onSave,
}: IFormSelectProps) => {
  const editData: { rows: model.AnyThingModel[] } = { rows: [] };
  const modal = Modal.confirm({
    icon: <></>,
    width: '80vw',
    okText: `确认选择`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <GenerateTable
        form={form}
        fields={fields}
        autoColumn
        height={'70vh'}
        selectedRowKeys={selected ?? []}
        toolbar={{ visible: false }}
        selection={{
          mode: 'multiple',
          allowSelectAll: true,
          selectAllMode: 'page',
          showCheckBoxesMode: 'always',
        }}
        onSelectionChanged={(e) => {
          editData.rows = e.selectedRowsData;
        }}
        dataSource={
          new CustomStore({
            key: 'Id',
            async load(loadOptions) {
              loadOptions.userData = [];
              let request: any = { ...loadOptions };
              const result = await kernel.anystore.loadThing<model.AnyThingModel>(
                belong.id,
                request,
              );
              if (result.success) {
                return result.data;
              }
              return [];
            },
          })
        }
        remoteOperations={true}
      />
    ),
    onOk: () => {
      modal.destroy();
      onSave(editData.rows.filter((r) => selected?.includes(r.Id)));
    },
  });
};

export default FormSelectModal;
