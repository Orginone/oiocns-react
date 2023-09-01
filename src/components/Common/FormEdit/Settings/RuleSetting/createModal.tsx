import React, { useEffect, useRef, useState } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import DefaultRules from '@/ts/core/work/rules/lib/rules.json';
import SchemaForm from '@/components/SchemaForm';
import { XFormRule } from '@/ts/base/schema';
import { getColumns } from './config';
import dayjs from 'dayjs';
import { schema } from '@/ts/base';
interface Iprops {
  setOpen: any;
  targetId?: string; //当前选中的特性
  fields: schema.XAttribute[];
  defaultValue?: any; //修改数据
  loading: boolean;
  handleOk: (type: 'updata' | 'create' | 'delete', data: Record<string, any>) => void;
}

/*
  规则编辑模态框
*/
const FormRuleModal = (props: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const { setOpen, fields, handleOk, defaultValue, loading, targetId } = props;
  const [defaultCode, setDefaultCode] = useState<string>('');
  useEffect(() => {
    setDefaultCode(dayjs().unix() + '');
  }, []);

  const handleChange = (val: { [key: string]: any }, _vals: { [key: string]: any }) => {
    switch (Object.keys(val)[0]) {
      case 'templateId':
        {
          const info = DefaultRules.find((v) => v.id === val['templateId'])!;
          const params: any = {
            errMsg: info.errorMsg,
            remark: info.remark,
            linkAttrs: info.linkAttrs.map((it: any) => {
              return {
                val: it.val,
                id: it.id,
                name: it.name,
              };
            }),
          };
          if (info.targetId) {
            params.targetId = info.targetId;
          }
          formRef.current?.setFieldsValue(params);
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
  const handleSubt: any = (values: { [key: string]: any }) => {
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
      loading={loading}
      title={defaultValue ? `编辑[${defaultValue.name}]规则` : '新增规则'}
      style={{ padding: '10px', minwidth: '200px' }}
      layoutType="Form"
      columns={getColumns(fields, DefaultRules)}
      rowProps={{
        gutter: [24, 0],
      }}
      onValuesChange={handleChange}
      modalprops={{ maskClosable: false }}
      key={targetId ?? defaultValue?.code ?? defaultCode}
      // initialValues={current?.name ? current : { code: defaultCode }}
      initialValues={defaultValue?.code ? defaultValue : targetId ? { targetId } : {}}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          setOpen(false);
        }
      }}
      onFinish={async (values) => {
        // console.log('提交数据', values, handleSubt(values));
        if (defaultValue?.code) {
          values = { ...defaultValue, ...handleSubt(values) };
          handleOk('updata', values);
        } else {
          handleOk('create', handleSubt(values));
        }
      }}
      open={false}></SchemaForm>
  );
};

export default FormRuleModal;
