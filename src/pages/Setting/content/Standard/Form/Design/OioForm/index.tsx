import { kernel, pageAll } from '@/ts/base';
import { XOperation, XOperationItem } from '@/ts/base/schema';
import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import OioFormItem from './FormItems';
import { ISpace } from '@/ts/core';

type IProps = {
  space: ISpace;
  operation: XOperation;
  operationItems?: XOperationItem[];
  submitter?: any;
  onValuesChange?: (changedValues: any, values: Record<string, any>) => void;
  onFinished?: Function;
  fieldsValue?: any;
  formRef: any;
  disabled?: boolean;
};

/**
 * 奥集能表单
 */
const OioForm: React.FC<IProps> = ({
  space,
  operation,
  operationItems,
  submitter,
  onValuesChange,
  onFinished,
  fieldsValue,
  formRef,
  disabled,
}) => {
  const [items, setItems] = useState<XOperationItem[]>([]);
  let config: any = { col: 12, layout: 'horizontal' };
  if (operation.remark != '') {
    config = JSON.parse(operation.remark);
  }
  useEffect(() => {
    if (fieldsValue) {
      formRef?.current?.setFieldsValue(fieldsValue);
    }
  }, [fieldsValue]);

  useEffect(() => {
    if (operationItems) {
      setItems(operationItems);
    } else {
      const queryItems = async () => {
        const operateItemRes = await kernel.queryOperationItems({
          id: operation.id,
          spaceId: space.id,
          page: pageAll(),
        });
        setItems(operateItemRes.data.result || []);
      };
      queryItems();
    }
  }, [operation]);

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
        {items.length > 0 ? (
          items.map((item: XOperationItem) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} space={space} />
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
