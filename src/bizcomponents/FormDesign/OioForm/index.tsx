import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import OioFormItem from './FormItems';
import { IForm } from '@/ts/core';

type IProps = {
  form: IForm;
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef: any;
  disabled?: boolean;
};

/**
 * 资产共享云表单
 */
const OioForm: React.FC<IProps> = ({
  form,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
}) => {
  let config: any =
    form.metadata.rule != undefined
      ? JSON.parse(form.metadata.rule)
      : { col: 12, layout: 'horizontal' };
  if (fieldsValue) {
    formRef?.current?.setFieldsValue(fieldsValue);
  }

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
          {form.attributes.map((item) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} belong={form.species.current.space} />
            </Col>
          ))}
        </Row>
      </ProForm>
    </>
  );
};

export default OioForm;
