import { ProForm } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import React, { useMemo, useRef } from 'react';
import OioFormItem from './FormItems';
import { IFormView } from '@/ts/core';
import cls from './index.module.less';
type IProps = {
  form: IFormView;
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
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef = useRef(),
  disabled,
  noRule,
}) => {
  let config: any = form.metadata.rule
    ? JSON.parse(form.metadata.rule)
    : { col: 8, layout: 'horizontal' };
  const colNum = 3; //单行展示数量
  if (fieldsValue) {
    formRef?.current?.setFieldsValue(fieldsValue);
  }

  const fillArr = useMemo(() => {
    const fileTypeItems =
      form.attributes.filter((v) => v.property!.valueType == '附件型') ?? [];
    const leg = (form.attributes.length - fileTypeItems.length) % colNum;

    const legArr: any[] = [];
    if (leg === 0) {
      return fileTypeItems;
    }
    for (let i = 0; i < colNum - leg; i++) {
      legArr.push({ id: 0 });
    }
    // 返回数据为 填充+最后的附件类
    return [...legArr, ...fileTypeItems];
  }, [form.attributes.length]);

  return (
    <>
      <div className={cls.formTitle}>{form.name}</div>
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
          {form.attributes.map((item) => {
            if (item.property!.valueType === '附件型') {
              return <></>;
            }
            return (
              <Descriptions.Item
                label={item.name}
                key={item.id}
                span={1}
                contentStyle={{ width: '33%' }}>
                <OioFormItem item={item} belong={form.target.space} noRule={noRule} />
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
                    item={item}
                    belong={form.target.space}
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
                    noRule={noRule}
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
