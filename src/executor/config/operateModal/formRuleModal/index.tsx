import React, { useEffect, useRef, useState } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import DefaultRules from '@/ts/core/work/rules/base/rules.json';
import SchemaForm from '@/components/SchemaForm';
import { IForm } from '@/ts/core';
import { XFormRule } from '@/ts/base/schema';
import { getColumns } from './config';
import dayjs from 'dayjs';
interface Iprops {
  open: boolean;
  current?: any;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  form: IForm;
}

/*
  规则编辑模态框
*/
const FormRuleModal = (props: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const { open, handleOk, form, current, handleCancel } = props;
  const [defaultCode, setDefaultCode] = useState<string>('');
  useEffect(() => {
    setDefaultCode(dayjs().unix() + '');
  }, []);

  // 若无自动生产的编码则不展示
  if (!defaultCode) {
    return <></>;
  }
  const handleChange = (val: { [key: string]: any }, _vals: { [key: string]: any }) => {
    switch (Object.keys(val)[0]) {
      case 'commonTemp':
        {
          // const info = DefaultRules.find((v) => v.name === val['commonTemp']);
          // formRef.current?.setFieldsValue({
          //   errMsg: info.errorMsg,
          //   remark: info.remark,
          //   attrs: info.attrs.map((v: string) => {
          //     return {
          //       val: v,
          //       attrId: '',
          //     };
          //   }),
          // });
        }
        break;
      case 'modalType':
        {
          // formRef.current?.resetFields();
        }
        break;
      default:
        break;
    }
  };
  const handleSubt = (values: any) => {
    return values;
    // const { commonTemp, attrs } = values;
    // try {
    //   // const info = SystemRules.SystemRules.find((v) => v.name === commonTemp);
    //   // return { ...values, content: info.creatFun(attrs) };
    // } catch (e) {
    //   return values;
    // }
  };
  return (
    <SchemaForm<XFormRule>
      formRef={formRef}
      title={current ? `编辑[${current.name}]规则` : '新增规则'}
      open={open}
      width={800}
      layoutType="ModalForm"
      // columns={getColumns(form.attributes, SystemRules.SystemRules)}
      columns={getColumns(form.attributes, DefaultRules)}
      rowProps={{
        gutter: [24, 0],
      }}
      onValuesChange={handleChange}
      modalProps={{ maskClosable: false }}
      initialValues={current?.name ? current : { code: defaultCode }}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values) => {
        console.log('提交数据', current, values);

        if (current) {
          values = { ...current, ...handleSubt(values) };
          // dbCtrl
          //   .updateByObj(
          //     { name: current.name, code: current.code, id: current.id },
          //     values,
          //   )
          //   .then((Res) => {
          console.log('提交结果', values);
          //   if (Res.success) {
          false && handleOk(true);
          //   }
          // });
        } else {
          // dbCtrl.delByObj('gz_list', { name: '333' });
          // dbCtrl
          //   .insertData({
          //     ...handleSubt(values),
          //     formId: form.id,
          //   } as XFormRule)
          //   .then((Res) => {
          //   if (Res.success) {
          //     handleOk(true);
          //   }
          // });
        }
      }}></SchemaForm>
  );
};

export default FormRuleModal;
