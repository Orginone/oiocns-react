import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const createThing = async (userId: string) => {
  const res = await kernel.anystore.createThing<model.AnyThingModel[]>(userId, 1);
  if (res.success && res.data && res.data.length > 0) {
    return res.data[0];
  }
  return undefined;
};

const PrimaryForm: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];
  if (!props.data.fields[form.id]) return <></>;
  const fields = props.data.fields[form.id];
  const formData = props.getFormData(form.id);
  const [data, setData] = useState(
    formData.after.length > 0 ? formData.after[0] : undefined,
  );
  useEffect(() => {
    if (!data) {
      createThing(props.belong.userId).then((value) => setData(value));
    }
  }, []);
  if (!data) return <></>;
  return (
    <OioForm
      key={form.id}
      form={form}
      fields={fields}
      fieldsValue={data}
      belong={props.belong}
      disabled={!props.allowEdit}
      submitter={{
        resetButtonProps: {
          style: { display: 'none' },
        },
        render: (_: any, _dom: any) => <></>,
      }}
      onValuesChange={(a) => {
        if (props.allowEdit) {
          Object.keys(a).forEach((k) => {
            data[k] = a[k];
            props.data.primary[k] = a[k];
          });
          formData.after = [data];
          props.onChanged?.apply(this, [form.id, formData]);
          setData({ ...data });
        }
      }}
    />
  );
};

const PrimaryForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((form) => {
      return {
        key: form.id,
        label: form.name,
        children: <PrimaryForm {...props} forms={[form]} />,
      };
    });
  };
  return (
    <Tabs
      items={loadItems()}
      activeKey={activeTabKey}
      onChange={(key) => setActiveTabKey(key)}
    />
  );
};

export default PrimaryForms;
