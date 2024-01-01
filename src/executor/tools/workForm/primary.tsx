import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';
import WorkFormViewer from '@/components/DataStandard/WorkForm/Viewer';
import { useEffectOnce } from 'react-use';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  changedFields: model.MappingData[];
  data: model.InstanceDataModel;
  getFormData: (form: schema.XForm) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, field: string, value: any) => void;
}

const PrimaryForm: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];
  const [fields, setFields] = useState<model.FieldModel[]>();
  const [data, setData] = useState<schema.XThing>();
  const [formData, setFormData] = useState<model.FormEditData>();
  useEffectOnce(() => {
    const fData = props.getFormData(form);
    const afterData = fData.after.at(0);
    setFields(props.data.fields[form.id]);
    setFormData(fData);
    if (afterData) {
      setData(afterData);
    } else {
      kernel.createThing(props.belong.id, [], form.name).then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
  });
  if (!fields || !formData || !data) return <></>;
  return (
    <WorkFormViewer
      form={form}
      fields={fields}
      data={data}
      changedFields={props.changedFields.filter((a) => a.formId == form.id)}
      rules={[...(props.data.rules ?? []), ...(formData.rules ?? [])]}
      belong={props.belong}
      readonly={!props.allowEdit}
      onValuesChange={(field, value, data) => {
        if (props.allowEdit) {
          if (value === undefined || value === null) {
            delete props.data.primary[field];
          } else {
            props.data.primary[field] = value;
          }
          data.name = form.name;
          formData.after = [data];
          props.onChanged?.apply(this, [form.id, formData, field, value]);
        }
      }}
    />
  );
};

const PrimaryForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    const items = [];
    for (const form of props.forms) {
      if (
        props.data.rules?.find(
          (a) => a.destId == form.id && a.typeName == 'visible' && a.value == false,
        )
      ) {
        continue;
      }
      items.push({
        key: form.id,
        label: form.name,
        children: <PrimaryForm {...props} forms={[form]} />,
      });
    }
    return items;
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
