import { ProForm } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import React, { useRef, useEffect } from 'react';
import OioFormItem from './FormItems';
import { IBelong } from '@/ts/core';
import cls from './index.module.less';
import { model, schema } from '@/ts/base';
import { ImInfo } from '@/icons/im';
import { RuleTriggers } from '@/ts/core/public';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import { generateUuid } from '@/ts/base/common';
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
  ruleService?: WorkFormRulesType;
};
/**
 * 资产共享云表单
 */
const OioForm: React.FC<IProps> = ({
  form,
  fields,
  belong,
  submitter,
  ruleService,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef = useRef(),
  disabled,
  showTitle,
}) => {
  if (fields.length < 1) return <></>;
  const { col: configCol = 8, layout: configLayout = 'horizontal' } = JSON.parse(
    form.rule ?? '{}',
  );

  const colNum = 24 / configCol; //单行展示数量 默认3
  if (fieldsValue) {
    formRef?.current?.setFieldsValue(fieldsValue);
  }
  useEffect(() => {
    /* 向规则服务里，加入修改表单数值的回调方法 */
    ruleService?.collectData<{ formId: string; callback: (data: any) => void }>(
      'formCallBack',
      {
        formId: form.id,
        callback: (data: any) => {
          onValuesChange &&
            onValuesChange(data, { ...formRef?.current?.getFieldsValue(), ...data });
          formRef?.current?.setFieldsValue(data);
        },
      },
    );
  }, [form.id]);
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
          ruleService?.waitingTask(
            RuleTriggers.Running,
            { id: form.id, data: vals },
            val,
          );
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
            const { required = false, hidden = false } = JSON.parse(field.rule ?? '{}');
            if (hidden === true || hidden === 'true') {
              return <></>;
            }
            return (
              <Descriptions.Item
                key={generateUuid()}
                span={1}
                style={{ padding: '2px 10px' }}
                label={
                  <div
                    style={{ cursor: 'pointer' }}
                    title={field.remark}
                    className={
                      required === true || required == 'true' ? cls.Required : ''
                    }>
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
                  onFilesValueChange={(key, value) => {
                    fieldsValue[key] = JSON.stringify(value);
                  }}
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
