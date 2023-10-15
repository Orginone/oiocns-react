import { schema } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import TreeSelectItem from './customItem/treeItem';
import SelectFilesItem from './customItem/fileItem';
import { DateBox, NumberBox, SelectBox, TextArea, TextBox } from 'devextreme-react';
import React, { useEffect, useState } from 'react';

const FormItem: React.FC<{
  current: IForm;
  notityEmitter: Emitter;
  attr: schema.XAttribute;
}> = ({ attr, current, notityEmitter }) => {
  const [items, setItems] = useState<schema.XSpeciesItem[]>([]);
  const [attribute, setAttribute] = useState(attr);
  useEffect(() => {
    const id = notityEmitter.subscribe((_, type, data) => {
      if (type === 'attr' && data.id === attr.id) {
        setAttribute({ ...data, value: data.options.defaultValue });
      }
    });
    return () => {
      notityEmitter.unsubscribe(id);
    };
  }, []);
  useEffect(() => {
    if (attribute.property && attribute.property.speciesId) {
      current.loadItems([attribute.property.speciesId]).then((data) => {
        setItems(data);
      });
    }
  }, [attribute.property?.speciesId]);
  attribute.options = attribute.options || {};
  const mixOptions: any = {
    height: 36,
    width: '100%',
    name: attribute.id,
    showClearButton: true,
    label: attribute.name,
    hint: attribute.remark,
    showMaskMode: 'always',
    labelMode: 'floating',
    labelLocation: 'left',
    ...attribute.options,
  };
  if (attribute.options.isRequired) {
    mixOptions.label = mixOptions.label + '*';
  }
  if (attribute.property) {
    switch (attribute.property!.valueType) {
      case '数值型':
        return <NumberBox {...mixOptions} />;
      case '描述型':
        switch (attribute.widget) {
          case '多行文本':
            return <TextArea {...mixOptions} height={100} autoResizeEnabled />;
          default:
            return <TextBox {...mixOptions} />;
        }
      case '选择型':
        return (
          <SelectBox
            {...mixOptions}
            searchEnabled
            searchMode="contains"
            searchExpr={'name'}
            dataSource={items}
            displayExpr={'name'}
            valueExpr={'id'}
          />
        );
      case '分类型':
        return <TreeSelectItem {...mixOptions} speciesItems={items} />;
      case '用户型':
        return <SelectBox {...mixOptions} items={[]} />;
      case '日期型':
        return <DateBox {...mixOptions} type={'date'} displayFormat={'yyyy年MM月dd日'} />;
      case '时间型':
        return (
          <DateBox
            {...mixOptions}
            type={'datetime'}
            displayFormat={'yyyy年MM月dd日 HH:mm:ss'}
          />
        );
      case '附件型':
        return <SelectFilesItem {...mixOptions} />;
      default:
        return <TextArea {...mixOptions} />;
    }
  }
  return (
    <TextBox
      {...mixOptions}
      showMaskMode="always"
      readOnly
      value={'错误的属性'}
      isValid={false}
    />
  );
};

export default FormItem;
