import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem } from 'devextreme-react/form';
import React from 'react';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const FormRuleConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  return (
    <Form
      scrollingEnabled
      height={'calc(100vh - 130px)'}
      formData={current.metadata}
      onFieldDataChanged={notityAttrChanged}>
      <GroupItem caption={'规则参数'} />
    </Form>
  );
};

export default FormRuleConfig;
