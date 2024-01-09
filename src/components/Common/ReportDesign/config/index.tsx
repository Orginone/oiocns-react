import { IForm } from '@/ts/core';
import React from 'react';
import ReportConfig from './report';
import ReportRuleConfig from './reportRule';
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
      {props.index == -1 && <ReportConfig {...props} />}
      {props.index == -2 && <ReportRuleConfig {...props} />}
    </div>
  );
};

export default Config;
