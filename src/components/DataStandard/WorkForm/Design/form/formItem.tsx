import { schema } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import { IForm, TargetType } from '@/ts/core';
import HtmlEditItem from './customItem/htmlItem';
import TreeSelectItem from './customItem/treeItem';
import SelectFilesItem from './customItem/fileItem';
import MemberBoxProps from './customItem/memberBox';
import CurrentTargetItem from './customItem/currentTarget';
import SearchTargetItem from './customItem/searchTarget';
import { getWidget } from '../../Utils';
import { DateBox, NumberBox, SelectBox, TextArea, TextBox } from 'devextreme-react';
import React, { useEffect, useState } from 'react';

const FormItem: React.FC<{
  current: IForm;
  notityEmitter: Emitter;
  attr: schema.XAttribute;
}> = ({ attr, current, notityEmitter }) => {
  const target = current.directory.target;
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
    visible: attribute.options.hideField != true,
  };
  if (attribute.options.isRequired) {
    mixOptions.label = mixOptions.label + '*';
  }
  switch (getWidget(attribute.property?.valueType, attribute.widget)) {
    case '数字框':
      return <NumberBox {...mixOptions} />;
    case '文本框':
      return <TextBox {...mixOptions} />;
    case '多行文本框':
      return <TextArea {...mixOptions} minHeight={100} autoResizeEnabled />;
    case '富文本框':
      return <HtmlEditItem {...mixOptions} />;
    case '选择框':
      return (
        <SelectBox
          {...mixOptions}
          searchMode="contains"
          searchExpr={'name'}
          dataSource={items}
          displayExpr={'name'}
          valueExpr={'id'}
        />
      );
    case '多级选择框':
      return <TreeSelectItem {...mixOptions} speciesItems={items} />;
    case '操作人':
      return <CurrentTargetItem {...mixOptions} target={target.user.metadata} />;
    case '操作组织':
      return <CurrentTargetItem {...mixOptions} target={target.space.metadata} />;
    case '人员搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Person} />;
    case '单位搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Company} />;
    case '群组搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Cohort} />;
    case '组织群搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Group} />;
    case '成员选择框':
      return <MemberBoxProps {...mixOptions} target={target.space.metadata} />;
    case '日期选择框':
      return <DateBox {...mixOptions} type={'date'} />;
    case '时间选择框':
      return <DateBox {...mixOptions} type={'datetime'} />;
    case '文件选择框':
      return <SelectFilesItem {...mixOptions} />;
    default:
      return <TextArea {...mixOptions} />;
  }
};

export default FormItem;
