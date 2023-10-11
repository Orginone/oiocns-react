import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import { Tabs } from 'antd';
import ReportForms from './report';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  ruleService?: WorkFormRulesType;
  getFormData: (form: schema.XForm) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const PrimaryForm: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];
  if (!props.data.fields[form.id]) return <></>;
  const fields = props.data.fields[form.id];
  const formData = props.getFormData(form);
  const [data, setData] = useState(
    formData.after.length > 0 ? formData.after[0] : undefined,
  );
  useEffect(() => {
    if (!data) {
      kernel.createThing(props.belong.id, [], form.name).then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
    props?.ruleService && (props.ruleService.currentMainFormId = form.id);
  }, []);
  if (!data) return <></>;
  return (
    <OioForm
      key={form.id}
      form={form}
      fields={fields}
      fieldsValue={data}
      ruleService={props.ruleService}
      belong={props.belong}
      disabled={!props.allowEdit}
      submitter={{
        resetButtonProps: {
          style: { display: 'none' },
        },
        render: (_: any, _dom: any) => <></>,
      }}
      onValuesChange={(_val, vals) => {
        if (props.allowEdit && vals) {
          Object.keys(vals).forEach((k) => {
            data[k] = vals[k];
            props.data.primary[k] = vals[k];
          });
          formData.after = [data];
          props.onChanged?.apply(this, [form.id, formData]);
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
      switch (form.typeName) {
        case '报表':
          return {
            key: form.id,
            label: form.name,
            children: <ReportForms {...props} forms={[form]} />,
          };
        default:
          return {
            key: form.id,
            label: form.name,
            children: <PrimaryForm {...props} forms={[form]} />,
          };
      }
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
