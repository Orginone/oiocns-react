import { kernel } from '@/ts/base';
import { XOperation, XOperationItem } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import OioFormItem from '../FromItem/FormItems';

type OioFormProps = {
  operation: XOperation;
  operationItems?: any[];
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
const OioForm: React.FC<OioFormProps> = ({
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
  // const formRef = useRef<ProFormInstance<any>>();
  let config: any = { col: 12, layout: 'horizontal' };
  if (operation?.remark) {
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
        // 表单项
        const operateItemRes = await kernel.queryOperationItems({
          id: operation.id,
          spaceId: orgCtrl.user.id,
          page: { offset: 0, limit: 100000, filter: '' },
        });
        const operateItems = (operateItemRes.data.result || []) as XOperationItem[];
        setItems(operateItems);
      };
      queryItems();
    }
  }, [operation?.id]);

  return (
    <ProForm
      disabled={disabled === true}
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
      formRef={formRef}
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
        {items
          .filter((i: XOperationItem) => i.attrId)
          .map((item: any) => (
            <Col span={config.col} key={item.id}>
              <OioFormItem item={item} />
            </Col>
          ))}
      </Row>
    </ProForm>
  );
};

export default OioForm;
