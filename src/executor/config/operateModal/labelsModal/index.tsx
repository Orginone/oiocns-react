import React, { useEffect, useState, useRef } from 'react';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import FormEditModal, { onSave } from './FormEdit';
import { schemaType } from '@/ts/base/schema';
import { loadWidgetsOpts } from '@/components/Common/FormDesign/schemaRule';

interface IProps {
  current: IForm;
  finished: () => void;
}
const LabelModl: React.FC<IProps> = ({ current, finished }: IProps) => {
  const [defaultSchema, setDefaultSchema] = useState<schemaType>({
    displayType: 'row',
    type: 'object',
    labelWidth: 120,
    properties: {},
    column: 1,
  });
  // let {
  //   metadata: { rule },
  // } = current;
  //const rules = rule ? JSON.parse(rule) : {};
  let onSave = useRef({} as onSave);
  const onFinished = () => {
    // setEditFormOpen(false);
  };
  const currentToSchemaFun = () => {
    //如果配置过
    // if (rules && JSON.stringify(rules) !== '{}') {
    //   return rules.schema;
    // } else {
    //没有配置过
    const schema: schemaType = {
      displayType: 'row',
      type: 'object',
      properties: {},
      labelWidth: 120,
      column: 1,
    };
    let result = current.fields.reduce((result, item: any) => {
      const { valueType } = item;
      let title, type, widget, format, enums, enumNames;
      title = item.name;
      type = loadWidgetsOpts(valueType)[0].value;
      widget = loadWidgetsOpts(valueType)[0].value;
      if (widget === 'textarea') {
        format = 'textarea';
        widget = '';
      }
      if (widget === 'string') {
        format = '';
        widget = '';
      }
      if (valueType === '时间型') {
        format = 'dateTime';
        widget = null;
      }
      if (valueType === '附件型') {
        widget = 'upload';
        format = null;
      }
      if (valueType === '选择型' || valueType === '分类型') {
        enums = item.lookups.map((item: { value: any }) => {
          return item.value;
        });
        enumNames = item.lookups.map((item: { text: any }) => {
          return item.text;
        });
      }
      return {
        ...result,
        [item!.id]: {
          title,
          type,
          widget,
          enum: enums,
          enumNames,
          format,
          valueType,
        },
      };
    }, {});
    schema.properties = {
      ...result,
    };
    return schema;
    // }
  };
  useEffect(() => {
    const schema = currentToSchemaFun();
    setDefaultSchema(schema);
  }, []);
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={() => {
        finished();
        onSave.current.saveSchema();
      }}>
      <FormEditModal
        current={current}
        defaultSchema={defaultSchema}
        finished={onFinished}
        editFormOpen={true}
        onSave={onSave}
      />
    </FullScreenModal>
  );
};

export default LabelModl;
