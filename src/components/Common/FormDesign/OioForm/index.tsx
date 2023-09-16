import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import OioFormItem from './FormItems';
import { IBelong } from '@/ts/core';
import { XForm } from '@/ts/base/schema';

type IProps = {
  form: XForm;
  belong: IBelong;
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef?: any;
  disabled?: boolean;
  noRule?: boolean; //所有数据均可修改，且不验证规则
};

/**
 * 资产共享云表单
 */
const OioForm: React.FC<IProps> = ({
  form,
  belong,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
  noRule,
}) => {
  let config: any = form.rule ? JSON.parse(form.rule) : { col: 8, layout: 'horizontal' };
  useEffect(() => {
    if (fieldsValue) {
      formRef?.current?.setFieldsValue(fieldsValue);
    }
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
          {form.attributes.map((item) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} disabled belong={belong} noRule={noRule} />
            </Col>
          ))}
        </Row>
      </ProForm>
    </>
  );
};

export default OioForm;
