import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model, schema } from '@/ts/base';
import { XAttribute } from '@/ts/base/schema';
import { ITransfer } from '@/ts/core';
import { Radio, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  target: 'source' | 'target';
}

const Fields: React.FC<IProps> = ({ transfer, current, target }) => {
  const [attrs, setAttrs] = useState<XAttribute[]>([]);
  const [value, setValue] = useState<string>();
  useEffect(() => {
    const subscribeId = transfer.subscribe(() => {
      const used = new Set(current.mappings.map((item) => item[target]));
      const form = transfer.findMetadata<schema.XForm>(current[target]);
      if (form) {
        setAttrs(form.attributes.filter((field) => !used.has(field.id)));
      }
    });
    const id = transfer.command.subscribe((type, cmd) => {
      if (type == 'fields') {
        switch (cmd) {
          case 'clear':
            setValue(undefined);
            break;
        }
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
      transfer.unsubscribe(subscribeId);
    };
  }, [transfer]);
  return (
    <div className={cls['flex-column']}>
      <EntityIcon entity={transfer.findMetadata(current[target])} showName />
      <div className={cls['fields']}>
        <Radio.Group value={value} buttonStyle="outline">
          <Space direction="vertical">
            {attrs
              .sort((f, s) => f.property?.info.localeCompare(s.property?.info ?? '') ?? 0)
              .map((item) => (
                <Radio
                  className={cls['field']}
                  value={item.id}
                  onChange={(e) => {
                    setValue(e.target.value);
                    transfer.command.emitter('fields', 'choose', [target, item]);
                  }}>
                  <Space>
                    <Tag color="cyan">{item.property?.valueType}</Tag>
                    {item.name + ' ' + item.property?.info}
                  </Space>
                </Radio>
              ))}
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Fields;
