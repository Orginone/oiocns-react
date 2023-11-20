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
        <GroupItem caption={'表单参数'} />
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem
          dataField="labels"
          label={{ text: '根标签集' }}
          editorType="dxTagBox"
          editorOptions={{
            displayExpr: 'name',
            valueExpr: 'id',
            dataSource: current.metadata.attributes.filter((i) => i && i.propId),
          }}
        />
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
