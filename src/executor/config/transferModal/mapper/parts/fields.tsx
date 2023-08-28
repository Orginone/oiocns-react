import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';
import { IMapping } from '@/ts/core/thing/config';
import { XAttribute } from '@/ts/base/schema';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Radio, Space, Tag } from 'antd';

interface IProps {
  current: IMapping;
  targetForm: 'sourceForm' | 'targetForm';
  targetAttrs: 'sourceAttrs' | 'targetAttrs';
  targetAttr: 'source' | 'target';
}

const Fields: React.FC<IProps> = ({ current, targetForm, targetAttrs, targetAttr }) => {
  const [selected, setSelected] = useState<XAttribute>();
  const [attrs, setAttrs] = useState<XAttribute[]>(current.metadata[targetAttrs]);
  useEffect(() => {
    const id = current.subscribe(() => {
      setSelected(undefined)
      setAttrs([...current.metadata[targetAttrs]]);
    });
    return () => {
      current.unsubscribe(id);
    };
  }, [current]);
  return (
    <div className={cls['flex-column']}>
      <div>
        <EntityIcon entity={current.metadata[targetForm]} showName />
      </div>
      <div className={cls['fields']}>
        <Radio.Group
          value={selected}
          buttonStyle="outline"
          onChange={(e) => setSelected(e.target.value)}>
          <Space direction="vertical">
            {attrs.map((attr, index) => (
              <Radio
                className={cls['field']}
                value={attr}
                onClick={() => {
                  current[targetAttr] = { index, attr };
                  current.changCallback();
                }}>
                <Space>
                  <Tag color="cyan">{attr.property?.valueType}</Tag>
                  {attr.name}
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
