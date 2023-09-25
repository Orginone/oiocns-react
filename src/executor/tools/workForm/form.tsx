import { kernel, model, schema } from '../../../ts/base';
import { IBelong, IDepartment } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import FormRender, { useForm } from 'form-render';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import moment from 'moment';
import MyDivider from '@/components/Common/FormEdit/widgets/Divider';
import MySpace from '@/components/Common/FormEdit/widgets/Space';
import { InputNumber, Tabs } from 'antd';
import ProFormPerson from '@/components/Common/FormEdit/widgets/ProFormPerson';
import ProFormDept from '@/components/Common/FormEdit/widgets/ProFormDept';
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
  if (props.forms?.length < 1) return <></>;
  const form = props.forms?.[0];
  const formIns: any = useForm();

  // const fields = props.data.fields[form.id];
  const formData = props.getFormData(form.id);
  const [data, setData] = useState(
    formData?.after?.length > 0 ? formData.after[0] : undefined,
  );
  useEffect(() => {
    // 无边编辑权限时，也无需获取id
    if (props.allowEdit && !data) {
      kernel.createThing(props.belong.userId, [], '').then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
    if (props.allowEdit) {
      //TODO:默认收集选中主表id：目前未做多主表切换动态修改选中id
      props?.ruleService && (props.ruleService.currentMainFormId = form.id);
      //初始化数据
      props?.ruleService?.collectData<{ formId: string; callback: (data: any) => void }>(
        'formCallBack',
        {
          formId: form.id,
          callback: (data: any) => {
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
          },
        },
      );
    } else {
      formIns.setValues(data);
    }
  }, []);
  if (!data) return <></>;

  const watch = {
    // # 为全局
    '#': (val: any) => {
      Object.keys(val).forEach((k) => {
        data[k] = val[k];
        props.data.primary[k] = val[k];
      });
      val.after = [data];
      // 数据提交bug处理
      formData.after = [data];

      props.onChanged?.apply(this, [form.id, formData]);
      setData({ ...data });
    },
  };

  const handleSchemaData: any = (schema: any) => {
    //TODO:；待优化此部分功能---根据组件类型区别传入的参数
    const properties = schema.properties;
    const buildDepartments = (departments: IDepartment[]) => {
      const data: any[] = [];
      for (const item of departments) {
        data.push({
          key: item.id,
          label: item.name,
          value: item.id,
          children: buildDepartments(item.children),
        });
      }
      return data;
    };
    // console.log('depts');
    Object.keys(properties).forEach((key) => {
      const content = properties[key];
      content['metadata'] = {
        belongId: props.belong.metadata.id,
        deptTree: buildDepartments(props.belong?.departments),
      };

      // content['metadata'] = props.belong;
    });

    return schema;
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
        schema={handleSchemaData(rule.schema)}
        disabled={!props.allowEdit}
        watch={watch}
        widgets={{
          MyDivider: MyDivider,
          MySpace: MySpace,
          number: InputNumber, //增加对默认 数值型支持
          person: ProFormPerson, //增加对人员列表的支持
          dept: ProFormDept, //增加对部门列表的支持
        }}
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
