import { ProForm } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import React, { useRef } from 'react';
import OioFormItem from './FormItems';
import { IBelong } from '@/ts/core';
import cls from './index.module.less';
import { model, schema } from '@/ts/base';
import { ImInfo } from 'react-icons/im';
type IProps = {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef?: any;
  disabled?: boolean;
  showTitle?: boolean;
};

/**
 * 资产共享云表单
 */
const OioForm: React.FC<IProps> = ({
  form,
  fields,
  belong,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef = useRef(),
  disabled,
  showTitle,
}) => {
  if (fields.length < 1) return <></>;
  let config: any = form.rule ? JSON.parse(form.rule) : { col: 8, layout: 'horizontal' };
  if (fieldsValue) {
    formRef?.current?.setFieldsValue(fieldsValue);
  }
  return (
    <>
      {showTitle && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 16,
            marginBottom: 20,
          }}>
          {form.name}
        </div>
      )}
      <ProForm
        disabled={disabled === true}
        formRef={formRef}
        className={cls.formWrap}
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
        labelAlign="left">
        <Descriptions
          bordered
          size="small"
          className={cls.formRow}
          column={3}
          labelStyle={{ minWidth: '120px', textAlign: 'right' }}>
          {fields.map((field) => {
            return (
              <Descriptions.Item
                key={field.id}
                span={1}
                label={
                  <div style={{ cursor: 'pointer' }} title={field.remark}>
                    <span style={{ marginRight: 6 }}>{field.name}</span>
                    {field.remark && field.remark.length > 0 && <ImInfo />}
                  </div>
                }
                contentStyle={{ width: '33%' }}>
                <OioFormItem
                  field={field}
                  belong={belong}
                  disabled={disabled === true}
                  value={fieldsValue ? fieldsValue[field.id] : undefined}
                />
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </ProForm>
    </>
  );
};

export default OioForm;
