import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs,Button } from 'antd';
import FormRender, { useForm } from 'form-render';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  formRule?: WorkFormRulesType;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, changedData?: Object) => void;
}

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
      kernel.anystore.createThing(props.belong.userId, '').then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
  }, []);
  if (!data) return <></>;
  return (
    <OioForm
      key={form.id}
      form={form}
      fields={fields}
      fieldsValue={data}
      ruseService={props.formRule}
      belong={props.belong}
      disabled={!props.allowEdit}
      submitter={{
        resetButtonProps: {
          style: { display: 'none' },
        },
        render: (_: any, _dom: any) => <></>,
      }}
      onValuesChange={(_val, vals) => {
        if (props.allowEdit) {
          Object.keys(vals).forEach((k) => {
            data[k] = vals[k];
            props.data.primary[k] = vals[k];
          });
          formData.after = [data];
          props.onChanged?.apply(this, [form.id, formData, _val]);
          setData({ ...data });
        }
      }}
    />
  );
};
const FormPreview: React.FC<IProps> = (props) => {
  const formIns:any = useForm();
  const onFinish = (formData:any, errors:any) => {
    console.log('formData:', formData, 'errors', errors);
  };
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  // const loadItems = () => {
  //   return props.forms.map((form) => {
  //     return {
  //       key: form.id,
  //       label: form.name,
  //       children: <FormRender {...props} forms={[form]} />,
  //     };
  //   });
  // };

  return (
    props.forms.map((formResult) => {
      const rule = formResult.rule && JSON.parse(formResult.rule);
      if(rule.schema){
        return <div>
            <FormRender form={formIns} schema={rule.schema} onFinish={onFinish}/>
            <Button type="primary" onClick={formIns.submit}>
              提交
            </Button>
        </div>
      }
    })
  );
};

// const PrimaryForms: React.FC<IProps> = (props) => {

//   if (props.forms.length < 1) return <></>;
//   const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
//   const loadItems = () => {
//     return props.forms.map((form) => {
//       return {
//         key: form.id,
//         label: form.name,
//         children: <FormRender {...props} forms={[form]} />,
//       };
//     });
//   };
//   return (
//     <Tabs
//       items={loadItems()}
//       activeKey={activeTabKey}
//       onChange={(key) => setActiveTabKey(key)}
//     />
//   );
// };

export default FormPreview;
