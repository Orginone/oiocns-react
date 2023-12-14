import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React from 'react';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const FormConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  return (
    <>
      <Form
        scrollingEnabled
        height={'calc(100vh - 130px)'}
        formData={current.metadata}
        onFieldDataChanged={notityAttrChanged}>
        <GroupItem caption={'报表参数'} />
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem
          dataField="remark"
          editorType="dxTextArea"
          isRequired={true}
          label={{ text: '报表描述' }}
          editorOptions={{
            height: 100,
          }}
        />
      </Form>
    </>
  );
};

export default FormConfig;
