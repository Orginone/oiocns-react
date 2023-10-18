import { ShareIconItem } from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Radio, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  target: 'source' | 'target';
}

export const getAttrs = (
  transfer: ITransfer,
  current: model.Mapping,
  target: 'source' | 'target',
) => {
  const formId = current[target];
  const used = new Set(current.mappings.map((item) => item[target]));
  if (formId) {
    const form = transfer.forms[formId];
    return form?.attributes.filter((field) => !used.has(field.id)) ?? [];
  }
  return [];
};

const Fields: React.FC<IProps> = ({ transfer, current, target }) => {
  const [attrs, setAttrs] = useState(getAttrs(transfer, current, target));
  const [value, setValue] = useState('');
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd) => {
      if (type != 'fields') return;
      switch (cmd) {
        case 'clear':
          setValue('');
          break;
        case 'refresh':
          setAttrs(getAttrs(transfer, current, target));
          break;
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  });
  const formId = current[target];
  return (
    <div style={{ flex: 1 }} className={cls['flex-column']}>
      <ShareIconItem
        share={{ name: formId ? transfer.forms[formId]?.name : '', typeName: '映射' }}
        showName
      />
      <div className={cls.fields}>
        <Radio.Group value={value} buttonStyle="outline">
          <Space direction="vertical">
            {attrs.map((item) => (
              <Radio
                key={item.id}
                value={item.id}
                onChange={(e) => {
                  setValue(e.target.value);
                  transfer.command.emitter('fields', 'choose', [target, item]);
                }}>
                <div className={cls.tagName}>
                  <Tag color="cyan">{item.property?.valueType}</Tag>
                  {item.name + ' ' + item.property?.info}
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Fields;
