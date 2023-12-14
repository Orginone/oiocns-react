import { IForm } from '@/ts/core';
import React from 'react';
import FormConfig from './form';
import FormRuleConfig from './formRule';
import AttributeConfig from './attribute';
import { Emitter } from '@/ts/base/common';

interface IAttributeProps {
  current: IForm;
  index: number;
  notifyEmitter: Emitter;
}

const Config: React.FC<IAttributeProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', padding: 16 }}>
      {props.index > -1 && <AttributeConfig {...props} />}
      {props.index == -1 && <FormConfig {...props} />}
      {props.index == -2 && <FormRuleConfig {...props} />}
    </div>
  );
};

export default Config;
