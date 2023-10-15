import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React from 'react';

interface IAttributeProps {
  index: number;
  current: IForm;
  notifyEmitter: Emitter;
}

const AttributeConfig: React.FC<IAttributeProps> = ({
  current,
  notifyEmitter,
  index,
}) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('attr', current.metadata.attributes[index]);
  };
  return (
    <Form
      height={'calc(100vh - 130px)'}
      scrollingEnabled
      formData={current.metadata.attributes[index]}
      onFieldDataChanged={notityAttrChanged}>
      <GroupItem caption={'特性参数'} />
      <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
      <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
      <SimpleItem
        dataField="widget"
        editorType="dxSelectBox"
        label={{ text: '组件' }}
        editorOptions={{
          items: ['文本', '多行文本'],
        }}
      />
      <SimpleItem
        dataField="options.readOnly"
        editorType="dxCheckBox"
        label={{ text: '只读' }}
      />
      <SimpleItem
        dataField="options.visible"
        editorType="dxCheckBox"
        label={{ text: '显示' }}
      />
      <SimpleItem
        dataField="options.isRequired"
        editorType="dxCheckBox"
        label={{ text: '必填' }}
      />
      <SimpleItem dataField="options.defaultValue" label={{ text: '默认值' }} />
      <SimpleItem
        dataField="remark"
        editorType="dxTextArea"
        isRequired={true}
        label={{ text: '描述' }}
        editorOptions={{
          height: 100,
        }}
      />
    </Form>
  );
};

export default AttributeConfig;
