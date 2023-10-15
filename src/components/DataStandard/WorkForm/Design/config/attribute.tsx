import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';
import { getWidget, loadwidgetOptions } from '../../Utils';
import { schema } from '@/ts/base';

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
  const [items, setItems] = useState<schema.XSpeciesItem[]>([]);
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('attr', current.metadata.attributes[index]);
  };
  useEffect(() => {
    const speciesId = current.metadata.attributes[index].property?.speciesId;
    if (speciesId && speciesId.length > 5) {
      current.loadItems([speciesId]).then((data) => {
        setItems(data);
      });
    }
  }, [index]);
  const loadItemConfig = () => {
    const options = [];
    const attribute = current.metadata.attributes[index];
    switch (getWidget(attribute.property?.valueType, attribute.widget)) {
      case '数字框':
        options.push(
          <SimpleItem
            dataField="options.max"
            editorType="dxNumberBox"
            editorOptions={{
              defaultValue: undefined,
            }}
            label={{ text: '最大值' }}
          />,
          <SimpleItem
            dataField="options.min"
            editorType="dxNumberBox"
            label={{ text: '最小值' }}
            editorOptions={{
              defaultValue: undefined,
            }}
          />,
          <SimpleItem dataField="options.format" label={{ text: '显示格式' }} />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxNumberBox"
            label={{ text: '默认值' }}
          />,
        );
        break;
      case '文本框':
      case '多行文本框':
      case '富文本框':
        options.push(
          <SimpleItem
            dataField="options.maxLength"
            editorType="dxNumberBox"
            label={{ text: '最大长度' }}
          />,
          <SimpleItem dataField="options.defaultValue" label={{ text: '默认值' }} />,
        );
        break;
      case '选择框':
      case '多级选择框':
      case '人员搜索框':
        options.push(
          <SimpleItem
            dataField="options.searchEnabled"
            editorType="dxCheckBox"
            label={{ text: '是否允许搜索' }}
          />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxSelectBox"
            label={{ text: '默认值' }}
            editorOptions={{
              displayExpr: 'name',
              valueExpr: 'id',
              items: items,
            }}
          />,
        );
        break;
      case '日期选择框':
        options.push(
          <SimpleItem
            dataField="options.max"
            editorType="dxDateBox"
            label={{ text: '最大值' }}
            editorOptions={{
              type: 'date',
              displayFormat: 'yyyy年MM月dd日',
            }}
          />,
          <SimpleItem
            dataField="options.min"
            editorType="dxDateBox"
            label={{ text: '最小值' }}
            editorOptions={{
              type: 'date',
              displayFormat: 'yyyy年MM月dd日',
            }}
          />,
          <SimpleItem
            dataField="options.displayFormat"
            editorOptions={{ defaultValue: 'yyyy年MM月dd日' }}
            label={{ text: '格式' }}
          />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxDateBox"
            label={{ text: '默认值' }}
            editorOptions={{
              type: 'date',
              displayFormat: 'yyyy年MM月dd日',
            }}
          />,
        );
        break;
      case '时间选择框':
        options.push(
          <SimpleItem
            dataField="options.max"
            editorType="dxDateBox"
            label={{ text: '最大值' }}
            editorOptions={{
              type: 'datetime',
              displayFormat: 'yyyy年MM月dd日 HH:mm:ss',
            }}
          />,
          <SimpleItem
            dataField="options.min"
            editorType="dxDateBox"
            label={{ text: '最小值' }}
            editorOptions={{
              type: 'datetime',
              displayFormat: 'yyyy年MM月dd日 HH:mm:ss',
            }}
          />,
          <SimpleItem
            dataField="options.displayFormat"
            editorOptions={{ defaultValue: 'yyyy年MM月dd日 HH:mm:ss' }}
            label={{ text: '格式' }}
          />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxSelectBox"
            label={{ text: '默认值' }}
            editorOptions={{
              type: 'datetime',
              displayFormat: 'yyyy年MM月dd日 HH:mm:ss',
            }}
          />,
        );
        break;
      case '文件选择框':
        options.push(
          <SimpleItem
            dataField="options.maxLength"
            editorType="dxNumberBox"
            label={{ text: '最大文件数量' }}
          />,
        );
        break;
      default:
        break;
    }
    return options;
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
          items: loadwidgetOptions(current.metadata.attributes[index]),
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
      {loadItemConfig()}
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
