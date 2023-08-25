import { kernel, model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import FormRender, { useForm } from 'form-render';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import moment from 'moment';
import MyDivider from '@/executor/config/operateModal/labelsModal/FormEdit/widgets/Divider';
import MySpace from '@/executor/config/operateModal/labelsModal/FormEdit/widgets/Space';
import { Tabs } from 'antd';
interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  useformRule?: boolean;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, changedData?: Object) => void;
  ruleService?: WorkFormRulesType;
}

const FormRenders: React.FC<IProps> = (props) => {
  const formIns: any = useForm();
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];

  if (!props.data.fields[form.id]) return <></>;
  // const fields = props.data.fields[form.id];
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

    if (props.allowEdit) {
      //初始化数据
      props?.ruleService?.setFormChangeCallback(form.id, (data: any) => {
        const timeFormatRegex = /^\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{1,2}$/;
        //如果是时间格式需要转换
        if (data) {
          const keys = Object.keys(data);
          for (const key of keys) {
            const value = data[key];
            if (timeFormatRegex.test(value)) {
              data[key] = moment(value).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          formIns.setValues(data);
        }
      });
    } else {
      formIns.setValues(data);
    }
  }, []);
  if (!data) return <></>;
  const watch = {
    // # 为全局
    '#': (val: any) => {
      console.log('表单的实时数据为：', val);
      Object.keys(val).forEach((k) => {
        data[k] = val[k];
        props.data.primary[k] = val[k];
      });
      formData.after = [data];
      props.onChanged?.apply(this, [form.id, formData]);
      setData({ ...data });
    },
  };
  return props.forms.map((formResult) => {
    const rule = formResult.rule && JSON.parse(formResult.rule);
    if (!rule) {
      return <></>;
    }
    return (
      // eslint-disable-next-line react/jsx-key
      <FormRender
        form={formIns}
        schema={rule.schema}
        disabled={!props.allowEdit}
        watch={watch}
        widgets={{ MyDivider: MyDivider, MySpace: MySpace }}
        //beforeFinish={beforeFinish}
      />
    );
  });
};

const FormRendersTabs: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((form) => {
      return {
        key: form.id,
        label: form.name,
        children: <FormRenders {...props} forms={[form]} />,
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
export default FormRendersTabs;
