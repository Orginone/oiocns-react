import { XAttribute, XForm, XFormItem } from '@/ts/base/schema';
import { ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import OioField from './OioField';

type IProps = {
  form: XForm;
  attrs: XAttribute[];
  fieldsValue?: any;
};

/**
 * 奥集能--万物卡片
 */
const CardDescriptions: React.FC<IProps> = ({ form, attrs, fieldsValue }) => {
  let config: any = { col: 12, layout: 'horizontal' };
  if (form.remark) {
    config = JSON.parse(form.remark);
  }

  return (
    <ProDescriptions column={24 / config.col} bordered title={form.name}>
      {(form.items || [])
        .filter((i: XFormItem) => i.attrId)
        .map((item: XFormItem) => {
          const attr = attrs.find((i) => i.id === item.attrId);
          const rule = JSON.parse(item.rule);
          let propertyName = 'T' + item.attrId;
          if (attr?.property) {
            propertyName = attr.property.code;
          }
          return (
            <ProDescriptions.Item
              key={item.id}
              label={item.name}
              tooltip={rule.description}>
              <OioField item={item} value={fieldsValue[propertyName]} />
            </ProDescriptions.Item>
          );
        })}
    </ProDescriptions>
  );
};

export default CardDescriptions;
