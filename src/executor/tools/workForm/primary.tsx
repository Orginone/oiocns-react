// import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import { Tabs } from 'antd';
import WorkFormViewer from '@/components/DataStandard/WorkForm/Viewer';

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
    <WorkFormViewer
      form={form}
      fields={fields}
      data={data}
      belong={props.belong}
      readonly={!props.allowEdit}
      onValuesChange={(changed) => {
        if (props.allowEdit && changed) {
          Object.keys(changed).forEach((k) => {
            if (changed[k] === undefined || changed[k] === null) {
              delete data[k];
              delete props.data.primary[k];
            } else {
              data[k] = changed[k];
              props.data.primary[k] = changed[k];
            }
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
