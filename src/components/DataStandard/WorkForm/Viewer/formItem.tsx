import { model } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import HtmlEditItem from './customItem/htmlItem';
import TreeSelectItem from './customItem/treeItem';
import SelectFilesItem from './customItem/fileItem';
import MemberBoxProps from './customItem/memberBox';
import SearchTargetItem from './customItem/searchTarget';
import CurrentTargetItem from './customItem/currentTarget';
import { getItemWidth, getWidget } from '../Utils';
import { DateBox, NumberBox, SelectBox, TextArea, TextBox } from 'devextreme-react';
import React, { useEffect } from 'react';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { formatDate } from '@/utils';
import { IBelong, TargetType } from '@/ts/core';

interface IFormItemProps {
  data: any;
  numStr: string;
  notifyEmitter: Emitter;
  field: model.FieldModel;
  readOnly?: boolean;
  belong: IBelong;
  onValuesChange?: (changedValues: any, data: any) => void;
}

const FormItem: React.FC<IFormItemProps> = (props) => {
  const getValid = () => {
    if (props.field.options?.isRequired) {
      const value = props.data[props.field.id];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.length < 1)
      ) {
        return false;
      }
    }
    return true;
  };
  const [isValid, setIsValid] = React.useState(getValid());
  useEffect(() => {
    const id = props.notifyEmitter.subscribe((_, type, data) => {});
    return () => {
      props.notifyEmitter.unsubscribe(id);
    };
  }, []);
  props.field.options = props.field.options || {};
  if (props.readOnly) {
    props.field.options.readOnly = true;
  }
  const mixOptions: any = {
    height: 36,
    name: props.field.id,
    showClearButton: true,
    label: props.field.name,
    hint: props.field.remark,
    showMaskMode: 'always',
    labelMode: 'floating',
    labelLocation: 'left',
    ...props.field.options,
    visible: props.field.options?.hideField != true,
    defaultValue: props.data[props.field.id] ?? props.field.options?.defaultValue,
    onValueChanged: (e: ValueChangedEvent) => {
      if (e.value !== props.data[props.field.id]) {
        if (e.value === undefined || e.value === null) {
          delete props.data[props.field.id];
        } else {
          props.data[props.field.id] = e.value;
        }
        setIsValid(getValid());
        const changedValues: any = {};
        changedValues[props.field.id] = e.value;
        props.onValuesChange?.apply(this, [changedValues, props.data]);
      }
    },
    width: getItemWidth(props.numStr),
  };
  if (props.field.options.isRequired) {
    /** 增加是否有defaultValue值的判断 */
    mixOptions.isValid = mixOptions.defaultValue ? 'true' : isValid;
    mixOptions.label = mixOptions.label + '*';
  }

  switch (getWidget(props.field.valueType, props.field.widget)) {
    case '数字框':
      return <NumberBox {...mixOptions} />;
    case '文本框':
      return <TextBox {...mixOptions} />;
    case '多行文本框':
      return (
        <TextArea {...mixOptions} minHeight={100} autoResizeEnabled width={'100%'} />
      );
    case '富文本框':
      return <HtmlEditItem {...mixOptions} />;
    case '选择框':
      return (
        <SelectBox
          {...mixOptions}
          searchEnabled
          searchMode="contains"
          searchExpr={'text'}
          dataSource={props.field.lookups}
          displayExpr={'text'}
          valueExpr={'value'}
        />
      );
    case '多级选择框':
      return <TreeSelectItem {...mixOptions} speciesItems={props.field.lookups} />;
    case '操作人':
      return <CurrentTargetItem {...mixOptions} target={props.belong.user.metadata} />;
    case '操作组织':
      return <CurrentTargetItem {...mixOptions} target={props.belong.metadata} />;
    case '人员搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Person} />;
    case '单位搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Company} />;
    case '群组搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Cohort} />;
    case '组织群搜索框':
      return <SearchTargetItem {...mixOptions} typeName={TargetType.Group} />;
    case '成员选择框':
      return <MemberBoxProps {...mixOptions} target={props.belong.metadata} />;
    case '日期选择框':
      return (
        <DateBox
          {...mixOptions}
          type={'date'}
          displayFormat={'yyyy年MM月dd日'}
          onValueChanged={(e) => {
            mixOptions.onValueChanged.apply(this, [
              {
                ...e,
                value: e.value ? formatDate(e.value, 'yyyy-MM-dd') : undefined,
              },
            ]);
          }}
        />
      );
    case '时间选择框':
      return (
        <DateBox
          {...mixOptions}
          type={'datetime'}
          displayFormat={'yyyy年MM月dd日 HH:mm:ss'}
          onValueChanged={(e) => {
            mixOptions.onValueChanged.apply(this, [
              {
                ...e,
                value: e.value ? formatDate(e.value, 'yyyy-MM-dd hh:mm:ss') : undefined,
              },
            ]);
          }}
        />
      );
    case '文件选择框':
      return <SelectFilesItem {...mixOptions} />;
    default:
      return <TextArea {...mixOptions} />;
  }
};

export default FormItem;
