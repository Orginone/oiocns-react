import { IForm } from '@/ts/core';
import React, { useEffect, useState } from 'react';
import FormConfig from './form';
import FormRuleConfig from './formRule';
import AttributeConfig from './attribute';
import { Emitter } from '@/ts/base/common';
import { Tabs } from 'antd';

interface IAttributeProps {
  current: IForm;
  index: number;
  notifyEmitter: Emitter;
}

const Config: React.FC<IAttributeProps> = (props) => {
  const [activeTabKey, setActiveTabKey] = useState<string>('form');
  useEffect(() => {
    if (props.index > -1) {
      setActiveTabKey('property');
    }
  }, [props.index]);
  const loadItems = () => {
    const items = [
      {
        key: 'form',
        label: '表单设置',
        forceRender: true,
        children: <FormConfig {...props} />,
      },
      {
        key: 'rule',
        label: '规则参数',
        forceRender: true,
        children: <FormRuleConfig {...props} />,
      },
    ];
    if (props.index > -1) {
      items.unshift({
        key: 'property',
        label: '属性参数',
        forceRender: true,
        children: <AttributeConfig {...props} />,
      });
    }
    return items;
  };
  return (
    <Tabs
      items={loadItems()}
      activeKey={activeTabKey}
      onChange={(key) => setActiveTabKey(key)}
    />
  );
};

export default Config;
