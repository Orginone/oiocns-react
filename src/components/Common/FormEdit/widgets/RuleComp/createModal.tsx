import React, { useEffect, useRef, useState } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import DefaultRules from '@/ts/core/work/rules/lib/rules.json';
import SchemaForm from '@/components/SchemaForm';
import { XFormRule } from '@/ts/base/schema';
import { getColumns } from './config';
import dayjs from 'dayjs';
import { schema } from '@/ts/base';
interface Iprops {
  open: boolean;
  setOpen: any;
  fields: schema.XAttribute[];
  defaultValue?: any; //修改数据
}

/*
  规则编辑模态框
*/
const FormRuleModal = (props: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const { setOpen, fields, open, handleCancel, defaultValue } = props;
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
      title={defaultValue ? `编辑[${defaultValue.name}]规则` : '新增规则'}
      open={open}
      style={{padding:'10px'}}
      layoutType="Form"
      columns={getColumns(fields, DefaultRules)}
      rowProps={{
        gutter: [24, 0],
      }}
      onValuesChange={handleChange}
      modalProps={{ maskClosable: false }}
      key={defaultValue?.code ?? defaultCode}
      // initialValues={current?.name ? current : { code: defaultCode }}
      initialValues={defaultValue}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          setOpen();
        }
      }}
      onFinish={async (values) => {
        // console.log('提交数据',values, handleSubt(values));
        // if (current) {
        //   values = { ...current, ...handleSubt(values) };
        //   console.log('提交结果2', values);
        //   handleOk({ success: true, type: 'updata', data: values });
        // } else {
        //   handleOk({ success: true, type: 'create', data: handleSubt(values) });
        // }
      }}></SchemaForm>
  );
};

export default FormRuleModal;
