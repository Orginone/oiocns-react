import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import OioFormItem from './FormItems';
import { XForm, XFormItem } from '@/ts/base/schema';
import { IBelong } from '@/ts/core/target/base/belong';

type IProps = {
  belong: IBelong;
  form: XForm;
  formItems?: XFormItem[];
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
  belong,
  form,
  formItems,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
}) => {
  let config: any = { col: 12, layout: 'horizontal' };
  let items = formItems ? formItems : form.items;
  if (form.remark?.length > 0) {
    config = JSON.parse(form.remark);
  }
  useEffect(() => {
    if (fieldsValue) {
      formRef?.current?.setFieldsValue(fieldsValue);
    }
  }, [fieldsValue]);

  return (
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
        {items && items.length > 0 ? (
          items.map((item: XFormItem) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} belong={belong} />
            </Col>
          ))
        ) : (
          <>请先完成设计表单!</>
        )}
      </Row>
    </ProForm>
  );
};

export default OioForm;
