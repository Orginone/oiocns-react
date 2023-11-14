import { Modal } from 'antd';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import GenerateThingTable from '../generate/thingTable';
import CustomStore from 'devextreme/data/custom_store';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

interface IFormSelectProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  onSave: (values: schema.XThing[]) => void;
}

const FormSelectModal = ({ form, fields, belong, onSave }: IFormSelectProps) => {
  const editData: { rows: schema.XThing[] } = { rows: [] };
  const modal = Modal.confirm({
    icon: <EntityIcon entityId={form.id} showName />,
    width: '80vw',
    okText: `确认选择`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <GenerateThingTable
        fields={fields}
        height={'70vh'}
        selection={{
          mode: 'multiple',
          allowSelectAll: true,
          selectAllMode: 'page',
          showCheckBoxesMode: 'always',
        }}
        onSelectionChanged={(e) => {
          editData.rows = e.selectedRowsData;
        }}
        filterValue={JSON.parse(form.searchRule ?? '[]')}
        dataSource={
          new CustomStore({
            key: 'id',
            async load(loadOptions) {
              loadOptions.userData = [];
              let request: any = { ...loadOptions };
              return await kernel.loadThing(belong.id, [belong.id], request);
            },
          })
        }
        remoteOperations={true}
      />
    ),
    onOk: () => {
      modal.destroy();
      onSave(editData.rows);
    },
  });
};

export default FormSelectModal;
