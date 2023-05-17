import { XAttribute, XForm } from '@/ts/base/schema';
import { ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import OioField from './OioField';

type IProps = {
  form: XForm;
  attrs: XAttribute[];
  fieldsValue?: any;
};

/**
 * 资产共享云--万物卡片
 */
const CardDescriptions: React.FC<IProps> = ({ form, attrs, fieldsValue }) => {
  let config: any = { col: 12, layout: 'horizontal' };
  if (form.rule) {
    config = JSON.parse(form.rule);
  }

  return (
    <ProDescriptions column={24 / config.col} bordered title={form.name}>
      {(form.attributes || [])
        .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
        .map((item: XAttribute) => {
          const attr = attrs.find((i) => i.id === item.id);
          const rule = JSON.parse(item.rule);
          let propertyName = 'T' + item.linkPropertys![0].code;
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
