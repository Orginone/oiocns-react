import { kernel } from '@/ts/base';
import { XOperationItem } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import OioFormItem from './FormItems';
import SpeciesTabs from './SpeciesTabs';

type OioFormProps = {
  operationId: string;
  operationItems?: XOperationItem[];
  onValuesChange?: (values: any) => void;
};

/**
 * 奥集能表单
 */
const OioForm: React.FC<OioFormProps> = ({
  operationId,
  operationItems,
  onValuesChange,
}) => {
  const [items, setItems] = useState<XOperationItem[]>([]);
  useEffect(() => {
    const queryItems = async () => {
      // 表单项
      if (operationItems && operationItems.length > 0) {
        setItems(operationItems);
      } else {
        const operateItemRes = await kernel.queryOperationItems({
          id: operationId as string,
          spaceId: userCtrl.space.id,
          page: { offset: 0, limit: 100000, filter: '' },
        });
        setItems((operateItemRes.data.result || []) as XOperationItem[]);
      }
    };
    queryItems();
  }, [operationId]);
  return (
    <ProForm
      submitter={{
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
      }}
      onValuesChange={onValuesChange}
      layout="horizontal"
      labelAlign="left"
      labelWrap={true}
      labelCol={{
        xs: { span: 10 },
        sm: { span: 10 },
      }}>
      <Row gutter={24}>
        {items.map((item: any) => (
          <Col span={12} key={item.id}>
            <OioFormItem item={item} />
          </Col>
        ))}
        {operationItems && operationItems.length > 0 && (
          <Col span={24}>
            <SpeciesTabs operationItems={operationItems} />
          </Col>
        )}
      </Row>
    </ProForm>
  );
};

export default OioForm;
