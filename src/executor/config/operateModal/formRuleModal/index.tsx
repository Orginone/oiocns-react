import React, { useEffect, useRef, useState } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import DefaultRules from '@/ts/core/work/rules/lib/rules.json';
import SchemaForm from '@/components/SchemaForm';
import { IForm } from '@/ts/core';
import { XFormRule } from '@/ts/base/schema';
import { getColumns } from './config';
import dayjs from 'dayjs';
interface Iprops {
  open: boolean;
  current?: any;
  handleCancel: () => void;
  handleOk: ({
    success,
    type,
    data,
  }: {
    success: boolean;
    type: 'create' | 'updata';
    data: any;
  }) => void;
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

  const handleChange = (val: { [key: string]: any }, _vals: { [key: string]: any }) => {
    switch (Object.keys(val)[0]) {
      case 'templateId':
        {
          const info = DefaultRules.find((v) => v.id === val['templateId'])!;
          formRef.current?.setFieldsValue({
            errMsg: info.errorMsg,
            remark: info.remark,
            targetId: info.targetId,
            linkAttrs: info.linkAttrs.map((it: any) => {
              return {
                val: it.val,
                id: it.id,
                name: it.name,
              };
            }),
          });
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
  const handleSubt = (values: { [key: string]: any }) => {
    const { templateId, linkAttrs } = values;

    try {
      const info = DefaultRules.find((v) => v.id === templateId)!;
      if (info.creatFun) {
        return {
          ...values,
          ruleType: info.ruleType,
          content: eval(info?.creatFun)(linkAttrs),
        };
      } else if (info.content) {
        return { ...values, ruleType: info.ruleType, content: info.content };
      }
    } catch (e) {
      return values;
    }
  };
  return (
    <SchemaForm<XFormRule>
      formRef={formRef}
      title={current ? `编辑[${current.name}]规则` : '新增规则'}
      open={open}
      width={800}
      layoutType="ModalForm"
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
        if (current) {
          values = { ...current, ...handleSubt(values) };
          handleOk({ success: true, type: 'updata', data: values });
        } else {
          handleOk({ success: true, type: 'create', data: handleSubt(values) });
        }
      }}></SchemaForm>
  );
};

export default FormRuleModal;
