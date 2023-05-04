import { XOperation, XOperationItem } from '@/ts/base/schema';
import { ProDescriptions } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import OioField from './OioField';

type CardDescriptionsProps = {
  operation: XOperation;
  fieldsValue?: any;
  space: ISpace;
};

/**
 * 奥集能--万物卡片
 */
const CardDescriptions: React.FC<CardDescriptionsProps> = ({
  space,
  operation,
  fieldsValue,
}) => {
  const [items, setItems] = useState<XOperationItem[]>(operation.items || []);
  let config: any = { col: 12, layout: 'horizontal' };
  if (operation?.remark) {
    config = JSON.parse(operation.remark);
  }

  useEffect(() => {
    if (items.length == 0) {
      const queryItems = async () => {
        // 表单项
        const operateItemRes = await kernel.queryOperationItems({
          id: operation.id,
          spaceId: space.id,
          page: pageAll(),
        });
        const operateItems = (operateItemRes.data.result || []) as XOperationItem[];
        setItems(operateItems);
      };
      queryItems();
    }
  }, [operation?.id]);

  return (
    <ProDescriptions column={24 / config.col} bordered title={operation.name}>
      {items
        .filter((i: XOperationItem) => i.attrId)
        .map((item: any) => {
          const rule = JSON.parse(item.rule);
          return (
            <ProDescriptions.Item
              key={item.id}
              label={item.name}
              tooltip={rule.description}>
              <OioField item={item} value={fieldsValue['T' + item.attrId]} />
            </ProDescriptions.Item>
          );
        })}
    </ProDescriptions>
  );
};

export default CardDescriptions;
