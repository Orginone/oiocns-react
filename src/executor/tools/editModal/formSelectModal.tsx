import { Modal } from 'antd';
import React from 'react';
import { kernel, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import GenerateTable from '../generate/table';
import CustomStore from 'devextreme/data/custom_store';

interface IFormSelectProps {
  form: schema.XForm;
  belong: IBelong;
  selected?: string[];
  onSave: (values: any[]) => void;
}

const FormSelectModal = ({ form, belong, selected, onSave }: IFormSelectProps) => {
  console.log(selected);
  const editData: { rows: any[] } = { rows: [] };
  const modal = Modal.confirm({
    icon: <></>,
    width: '80vw',
    okText: `确认选择`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <GenerateTable
        form={form}
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
              const result = await kernel.anystore.loadThing<any>(belong.id, request);
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
