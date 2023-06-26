import { ProForm } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import React, { useMemo, useRef } from 'react';
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
  const colNum = 3; //单行展示数量
  if (fieldsValue) {
    formRef?.current?.setFieldsValue(fieldsValue);
  }

  const fillArr = useMemo(() => {
    const fileTypeItems = fields.filter((v) => v.valueType == '附件型') ?? [];
    const leg = (fields.length - fileTypeItems.length) % colNum;

    const legArr: any[] = [];
    if (leg === 0) {
      return fileTypeItems;
    }
    for (let i = 0; i < colNum - leg; i++) {
      legArr.push({ id: 0 });
    }
    // 返回数据为 填充+最后的附件类
    return [...legArr, ...fileTypeItems];
  }, [fields.length]);

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
            if (field.valueType === '附件型') {
              return <></>;
            }
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
                <OioFormItem field={field} belong={belong} />
              </Descriptions.Item>
            );
          })}
          {/* 处理额外填充 及 附件展示 */}
          {fillArr.map((item, index) => {
            if (item.id) {
              // 附件处理
              return (
                <Descriptions.Item
                  label={item.name}
                  key={item.id}
                  span={3}
                  contentStyle={{ width: '33%' }}>
                  <OioFormItem
                    field={item}
                    belong={belong}
                    disabled={disabled}
                    value={fieldsValue ? fieldsValue[item.id] : undefined}
                    onFilesValueChange={(key, files: any) => {
                      formRef?.current?.setFieldValue(
                        key,
                        JSON.stringify(files.map((v: { data: any }) => v.data)),
                      );
                      onValuesChange &&
                        onValuesChange(
                          { key: files },
                          formRef?.current.getFieldsValue(true),
                        );
                    }}
                  />
                </Descriptions.Item>
              );
            }
            // 空白填充
            return (
              <Descriptions.Item
                key={'res' + index}
                span={1}
                contentStyle={{ width: '33%' }}>
                <span></span>
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </ProForm>
    </>
  );
};

export default OioForm;
