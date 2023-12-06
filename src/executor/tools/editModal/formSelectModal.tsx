import { Modal } from 'antd';
import React, { useState } from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import GenerateThingTable from '../generate/thingTable';
import CustomStore from 'devextreme/data/custom_store';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IWork, IWorkTask } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import ThingView from '@/executor/open/form/detail';

interface IFormSelectProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  onSave: (values: schema.XThing[]) => void;
  finished: () => void;
  formList: IWork | IWorkTask;
}

const FormSelectModal = ({
  form,
  fields,
  belong,
  onSave,
  formList,
  finished,
}: IFormSelectProps) => {
  const editData: { rows: schema.XThing[] } = { rows: [] };
  console.log(form, formList, fields, belong);
  const FormBrower: React.FC = () => {
    //根据变量判断是否隐藏或者显示
    const [data, setData] = useState(false);
    const [select, setSelcet] = useState();
    const [form2, setform2] = useState(
      formList.forms.find((val) => {
        return form.id == val.id;
      }),
    );
    return (
      <div>
        {data ? (
          <FullScreenModal
            centered
            open={true}
            fullScreen
            width={'80vw'}
            title={formList.name}
            bodyHeight={'80vh'}
            icon={<EntityIcon entityId={formList.id} />}
            destroyOnClose
            onCancel={() => {
              finished();
              setData(false);
            }}>
            <ThingView
              form={form2}
              fields={fields}
              thingData={select}
              onBack={() => {
                setData(false);
                setSelcet(undefined);
              }}
            />
          </FullScreenModal>
        ) : (
          <GenerateThingTable
            fields={fields}
            onRowDblClick={(e: any) => {
              const a = formList.forms.find((val) => {
                return form.id == val.id;
              });
              setform2(a);
              setData(true);
              setSelcet(e.data);
            }}
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
        )}
      </div>
    );
  };
  const modal = Modal.confirm({
    icon: <EntityIcon entityId={form.id} showName />,
    width: '80vw',
    okText: `确认选择`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
      <>
        <FormBrower />
      </>
    ),
    onOk: () => {
      modal.destroy();
      onSave(editData.rows);
    },
  });
};

export default FormSelectModal;
