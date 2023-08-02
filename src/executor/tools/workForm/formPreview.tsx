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
  useformRule?: boolean;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, changedData?: Object) => void;
}

// const PrimaryForm: React.FC<IProps> = (props) => {
//   if (props.forms.length < 1) return <></>;
//   const form = props.forms[0];
//   if (!props.data.fields[form.id]) return <></>;
//   const fields = props.data.fields[form.id];
//   const formData = props.getFormData(form.id);
//   const [data, setData] = useState(
//     formData.after.length > 0 ? formData.after[0] : undefined,
//   );
//   useEffect(() => {
//     if (!data) {
//       kernel.anystore.createThing(props.belong.userId, '').then((res) => {
//         if (res.success && res.data) {
//           setData(res.data);
//         }
//       });
//     }
//   }, []);
//   if (!data) return <></>;
//   return (
//     <OioForm
//       key={form.id}
//       form={form}
//       fields={fields}
//       fieldsValue={data}
//       belong={props.belong}
//       disabled={!props.allowEdit}
//       submitter={{
//         resetButtonProps: {
//           style: { display: 'none' },
//         },
//         render: (_: any, _dom: any) => <></>,
//       }}
//       onValuesChange={(_val, vals) => {
//         if (props.allowEdit) {
//           Object.keys(vals).forEach((k) => {
//             data[k] = vals[k];
//             props.data.primary[k] = vals[k];
//           });
//           formData.after = [data];
//           props.onChanged?.apply(this, [form.id, formData, _val]);
//           setData({ ...data });
//         }
//       }}
//     />
//   );
// };
const FormPreview: React.FC<IProps> = (props) => {
  const formIns: any = useForm();
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
        debugger;
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
  }, []);
  if (!data) return <></>;
  const onFinish = (formData: any, errors: any) => {
    console.log('formData:', formData, 'errors', errors);
    Object.keys(formData).forEach((k) => {
      data[k] = formData[k];
      props.data.primary[k] = formData[k];
    });
    formData.after = [data];
    props.onChanged?.apply(this, [form.id, formData]);
    setData({ ...data });
  };
  return (
    props.forms.map((formResult) => {
      const rule = formResult.rule && JSON.parse(formResult.rule);
      if (rule?.schema) {
        console.log("%", rule.schema)
        return <div>
          <FormRender form={formIns} schema={rule.schema} onFinish={onFinish}  disabled={!props.allowEdit}/>
          <Button type="primary" onClick={formIns.submit}>
            提交22
          </Button>
        </div>
      }
    })
  );
};
// const FormPreview: React.FC<IProps> = (props) => {

//   const form = props.forms[0];
//   if (!props.data.fields[form.id]) return <></>;
//   const formData = props.getFormData(form.id);
//   const [data, setData] = useState(
//     formData.after.length > 0 ? formData.after[0] : undefined,
//   );

//   if (props.forms.length < 1) return <></>;

//   const onFinish = (formData:any, errors:any) => {
//     console.log('formData:', formData, 'errors', errors);
//     Object.keys(formData).forEach((k) => {
//       data[k] = formData[k];
//       props.data.primary[k] = formData[k];
//     });
//     formData.after = [data];
//     props.onChanged?.apply(this, [form.id, formData]);
//     setData({ ...data });
//   };
//   return (
//     props.forms.map((formResult) => {
//       const rule = formResult.rule && JSON.parse(formResult.rule);
//       if(rule?.schema){
//         console.log("%",rule.schema)
//         return <div>
//             <FormRender form= {formIns} schema={rule.schema} onFinish={onFinish} />
//             <Button type="primary" onClick={formIns.submit}>
//               提交
//             </Button>
//         </div>
//       }else{
//         return <PrimaryForm {...props}/>
//       }
//     })
//   );
// };



export default FormPreview;
