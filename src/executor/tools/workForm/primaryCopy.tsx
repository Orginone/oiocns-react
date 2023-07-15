import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs, Button } from 'antd';
import FormRender, { useForm } from 'form-render';
interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData) => void;
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
const FormPreview2: React.FC<IProps> = (props) => {
  const formIns: any = useForm();
  const onFinish = (formData: any, errors: any) => {
    console.log('formData:', formData, 'errors', errors);
  };
  if (props.forms.length < 1) return <></>;
  // const loadItems = () => {
  //   return props.forms.map((form) => {
  //     return {
  //       key: form.id,
  //       label: form.name,
  //       children: <FormRender {...props} forms={[form]} />,
  //     };
  //   });
  // };
  const rule = props.forms.rule && JSON.parse(props.forms.rule);
  return (
    <div>
      <FormRender form={formIns} schema={rule.schema} onFinish={onFinish} />
      <Button type="primary" onClick={formIns.submit}>
        提交
      </Button>
    </div>
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

export default FormPreview2;
