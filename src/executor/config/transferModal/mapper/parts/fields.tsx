import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { XAttribute } from '@/ts/base/schema';
import { IForm } from '@/ts/core';
import { ShareIdSet, ShareSet } from '@/ts/core/public/entity';
import { ILink } from '@/ts/core/thing/link';
import { Radio, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';

interface IProps {
  link: ILink;
  current: model.MappingNode;
  target: 'source' | 'target';
}

const Fields: React.FC<IProps> = ({ link, current, target }) => {
  const id = current.data[target];
  const [attrs, setAttrs] = useState<XAttribute[]>([]);
  const [initial, setInitial] = useState<boolean>(true);
  useEffect(() => {
    const subscribeId = link.subscribe(() => {
      const used = new Set(current.data.mappings.map((item) => item[target]));
      if (ShareSet.has(id)) {
        const form = ShareSet.get(id) as IForm;
        if (initial) {
          form.loadContent().then(() => {
            setAttrs(form.attributes.filter((field) => !used.has(field.id)));
            setInitial(false);
            link.command.emitter('fields', 'refresh');
          });
        } else {
          setAttrs(form.attributes.filter((field) => !used.has(field.id)));
        }
      }
    });
    return () => {
      link.unsubscribe(subscribeId);
    };
  }, [link]);
  return (
    <div className={cls['flex-column']}>
      <div>
        <EntityIcon entity={ShareIdSet.get(id)} showName />
      </div>
      <div className={cls['fields']}>
        <Radio.Group buttonStyle="outline">
          <Space direction="vertical">
            {attrs
              .sort((f, s) => f.property?.info.localeCompare(s.property?.info ?? '') ?? 0)
              .map((item, index) => (
                <Radio
                  className={cls['field']}
                  value={item}
                  onClick={() => {
                    link.changCallback();
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
