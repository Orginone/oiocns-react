import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect } from 'react';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const FormConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  useEffect(() => {
    if (!current.metadata.options) {
      current.metadata.options = { itemWidth: 300 };
    }
    current.metadata.options.allowAdd = current.metadata.options.allowAdd ?? true;
    current.metadata.options.allowEdit = current.metadata.options.allowEdit ?? true;
    current.metadata.options.allowSelect = current.metadata.options.allowSelect ?? true;
    current.metadata.options.dataRange = current.metadata.options.dataRange ?? {
      labels: [],
    };
    current.metadata.options.workDataRange = current.metadata.options.workDataRange ?? {
      labels: [],
    };
  }, [current]);
  return (
    <>
      <Form
        scrollingEnabled
        height={'calc(100vh - 130px)'}
        formData={current.metadata}
        onFieldDataChanged={notityAttrChanged}>
        <GroupItem />
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem
          dataField="options.itemWidth"
          editorType="dxNumberBox"
          label={{ text: '特性宽度' }}
          editorOptions={{
            min: 200,
            max: 800,
            step: 10,
            format: '#(px)',
            defaultValue: 300,
            showClearButton: true,
            showSpinButtons: true,
          }}
        />
        <SimpleItem
          dataField="options.allowAdd"
          editorType="dxCheckBox"
          label={{ text: '允许新增' }}
        />
        <SimpleItem
          dataField="options.allowEdit"
          editorType="dxCheckBox"
          label={{ text: '允许编辑' }}
        />
        <SimpleItem
          dataField="options.allowSelect"
          editorType="dxCheckBox"
          label={{ text: '允许选择' }}
        />
        <SimpleItem
          dataField="remark"
          editorType="dxTextArea"
          isRequired={true}
          label={{ text: '表单描述' }}
          editorOptions={{
            height: 100,
          }}
        />
      </Form>
    </>
  );
};

export default FormConfig;
