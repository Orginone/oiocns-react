import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import OioFormItem from './FormItems';
import { IWorkDefine } from '@/ts/core';
import { XAttribute, XForm } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';

type IProps = {
  form: XForm;
  define: IWorkDefine;
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef?: any;
  disabled?: boolean;
};

/**
 * 资产共享云表单
 */
const OioForm: React.FC<IProps> = ({
  form,
  define,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
}) => {
  const [attributes, setAttributes] = useState<XAttribute[]>([]);
  let config: any = form.rule ? JSON.parse(form.rule) : { col: 12, layout: 'horizontal' };
  useEffect(() => {
    orgCtrl.work.loadAttributes(form.id, define.workItem.belongId).then((value) => {
      setAttributes(value);
      if (fieldsValue) {
        formRef?.current?.setFieldsValue(fieldsValue);
      }
    });
  }, []);
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: 16,
          marginBottom: 20,
        }}>
        {form.name}
      </div>
      <ProForm
        disabled={disabled === true}
        formRef={formRef}
        initialValues={fieldsValue}
        submitter={
          submitter || {
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            resetButtonProps: {
              style: { display: 'none' },
            },
            submitButtonProps: {
              style: { display: 'none' },
            },
          }
        }
        onFinish={async (values) => {
          await formRef.current?.validateFields();
          onFinished?.call(this, values);
        }}
        onValuesChange={onValuesChange}
        layout={config.layout}
        labelAlign="left"
        labelWrap={true}
        labelCol={{
          xs: { span: 10 },
          sm: { span: 10 },
        }}>
        <Row gutter={24}>
          {attributes.map((item) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} belong={define.workItem.current.space} />
            </Col>
          ))}
        </Row>
      </ProForm>
    </>
  );
};

export default OioForm;
