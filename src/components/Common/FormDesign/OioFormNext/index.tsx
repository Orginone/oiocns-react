import { ProForm } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import React, { useRef, useEffect } from 'react';
import OioFormItem from './FormItems';
import { IBelong } from '@/ts/core';
import cls from './index.module.less';
import { model, schema } from '@/ts/base';
import { ImInfo } from 'react-icons/im';
import FormRules from '@/ts/core/work/rules/formRules';
type IProps = {
  form: schema.XForm & { ruleServices: any };
  fields: model.FieldModel[];
  belong: IBelong;
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef?: any;
  disabled?: boolean;
  showTitle?: boolean;
  useRule?: boolean;
};
interface DataType {
  [key: string]: any;
}
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
  useRule = false,
}) => {
  if (fields.length < 1) return <></>;
  const {
    col: configCol = 8,
    layout: configLayout = 'horizontal',
    list: configRules,
  } = JSON.parse(form.rule ?? '{}');
  useEffect(() => {
    if (!useRule) {
      return;
    }
    form.ruleServices = new FormRules(configRules, form.belongId);
  }, [form, useRule]);
  useEffect(() => {
    form?.ruleServices?.renderRules('Start', {}, fields, (data: DataType) => {
      console.log('初始化时结果', data);
      formRef?.current?.setFieldsValue(data);
      onValuesChange && onValuesChange({}, data);
    });
  }, []);
  const colNum = 24 / configCol; //单行展示数量 默认3
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
        onValuesChange={(val, vals) => {
          form?.ruleServices?.renderRules('Running', vals, fields, (data: DataType) => {
            console.log('变化时返回结果', data);
            formRef?.current?.setFieldsValue(data);
            onValuesChange && onValuesChange({}, data);
          });
          onValuesChange && onValuesChange(val, vals);
        }}
        layout={configLayout}
        labelAlign="left">
        <Descriptions
          bordered
          size="small"
          className={cls.formRow}
          column={colNum}
          labelStyle={{ minWidth: '200px', textAlign: 'right' }}>
          {fields.map((field) => {
            //增加对必填，隐藏的展示响应
            const { required = false, hidden = false } = JSON.parse(field.rule ?? '{}');
            if (hidden) {
              return <></>;
            }
            return (
              <Descriptions.Item
                key={field.id}
                span={1}
                style={{ padding: '2px 10px' }}
                label={
                  <div
                    style={{ cursor: 'pointer' }}
                    title={field.remark}
                    className={required ? cls.Required : ''}>
                    <span style={{ marginRight: 6 }}>{field.name}</span>
                    {field.remark && field.remark.length > 0 && <ImInfo />}
                  </div>
                }
                contentStyle={{ width: `${100 / colNum}%` }}>
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
