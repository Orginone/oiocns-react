import { ProForm } from '@ant-design/pro-components';
import { Col, Descriptions, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import OioFormItem from './FormItems';
import { IWorkDefine } from '@/ts/core';
import { XAttribute, XForm } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
type IProps = {
  form: XForm;
  define: IWorkDefine;
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
  define,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
  noRule,
}) => {
  const [attributes, setAttributes] = useState<XAttribute[]>([]);
  let config: any = form.rule ? JSON.parse(form.rule) : { col: 8, layout: 'horizontal' };
  useEffect(() => {
    orgCtrl.work.loadAttributes(form.id, define.workItem.belongId).then((value) => {
      setAttributes(value);
      if (fieldsValue) {
        formRef?.current?.setFieldsValue(fieldsValue);
      }
    });
  }, []);
  const fillArr = useMemo(() => {
    let leg = attributes.length % 3;
    const legArr = [];
    if (leg === 0) {
      return [];
    }
    for (let i = 0; i < 3 - leg; i++) {
      legArr.push(true);
    }

    return legArr;
  }, [attributes.length]);
  return (
    <>
      <div className={cls.formTitle}>{form.name}</div>
      <ProForm
        disabled={disabled === true}
        formRef={formRef}
        size={'large'}
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
          labelStyle={{ minWidth: '150px' }}>
          {attributes.map((item) => (
            <Descriptions.Item
              label={item.name}
              key={item.id}
              span={1}
              contentStyle={{ width: '33%' }}>
              <OioFormItem
                item={item}
                belong={define.workItem.current.space}
                noRule={noRule}
              />
            </Descriptions.Item>
          ))}
          {fillArr.map((_, index) => (
            <Descriptions.Item
              key={'res' + index}
              span={1}
              contentStyle={{ width: '33%' }}>
              <span></span>
            </Descriptions.Item>
          ))}
        </Descriptions>
        {/* <Row gutter={24} className={cls.formRow}>
          {attributes.map((item) => (
            <Col span={config.col} key={item.id} className={cls.formCol}>
              <OioFormItem
                item={item}
                belong={define.workItem.current.space}
                noRule={noRule}
              />
            </Col>
          ))}
        </Row> */}
      </ProForm>
    </>
  );
};

export default OioForm;
