import { Modal } from 'antd';
import React from 'react';
import { model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import GenerateThingTable from '../generate/thingTable';
import CustomStore from 'devextreme/data/custom_store';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

interface IFormSelectProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  multiple?: Boolean;
  onSave: (values: schema.XThing[]) => void;
}

const FormSelectModal = ({
  form,
  fields,
  belong,
  multiple = true,
  onSave,
}: IFormSelectProps) => {
  const editData: { rows: schema.XThing[] } = { rows: [] };
  const dataRange = form.options?.workDataRange;
  const filterExp: any[] = JSON.parse(dataRange?.filterExp ?? '[]');
  const labels = dataRange?.labels ?? [];
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
          mode: multiple ? 'multiple' : 'single', // multiple / single
          allowSelectAll: true,
          selectAllMode: 'page',
          showCheckBoxesMode: 'always',
        }}
        scrolling={{
          mode: 'infinite',
          showScrollbar: 'onHover',
        }}
        pager={{ visible: false }}
        onSelectionChanged={(e) => {
          editData.rows = e.selectedRowsData;
        }}
        filterValue={filterExp}
        dataSource={
          new CustomStore({
            key: 'id',
            async load(loadOptions) {
              loadOptions.userData = labels.map((a) => a.value);
              let request: any = { ...loadOptions };
              const res = await belong.resource.thingColl.loadResult(request);
              if (res.success && !Array.isArray(res.data)) {
                res.data = [];
              }
              return res;
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
