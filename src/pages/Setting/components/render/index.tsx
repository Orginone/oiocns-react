import { kernel } from '@/ts/base';
import { XOperation, XOperationItem } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { ProForm } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import OioFormItem from './FormItems';
import SpeciesTabs from './SpeciesTabs';

type OioFormProps = {
  operation: XOperation;
  onValuesChange?: (values: any) => void;
};

/**
 * 奥集能表单
 */
const OioForm: React.FC<OioFormProps> = ({ operation, onValuesChange }) => {
  const [items, setItems] = useState<XOperationItem[]>([]);
  const config = JSON.parse(operation.remark);
  console.log('config===', config);
  useEffect(() => {
    const queryItems = async () => {
      // 表单项
      const operateItemRes = await kernel.queryOperationItems({
        id: operation.id,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const operateItems = (operateItemRes.data.result || []) as XOperationItem[];
      setItems(operateItems);
    };
    queryItems();
  }, [operation.id]);

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
        {items.filter((i: XOperationItem) => !i.attrId).length > 0 && (
          <Col span={24}>
            <SpeciesTabs
              operationItems={items.filter((i: XOperationItem) => !i.attrId)}
            />
          </Col>
        )}
      </Row>
    </ProForm>
  );
};

export default OioForm;
