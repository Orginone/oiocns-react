import { Button, InputNumber } from 'antd';
import cls from './index.module.less';
import React from 'react';
import { useState } from 'react';
import { IForm } from '@/ts/core';
// import { XAttribute } from '@/ts/base/schema';
// import AttributeConfig from './attributeConfig';
import FormEditModal from '@/components/Common/FormEdit';
import { loadWidgetsOpts } from './schemaRule';
import { schemaType } from '@/ts/base/schema';
import FormRender from '@/components/Common/FormEdit/FormRender';
import { useForm } from 'form-render';
import OioForm from './OioFormNext';
type IProps = {
  current: IForm;
};

// type FormLayout = {
//   layout: 'horizontal' | 'vertical';
//   col: 8 | 12 | 24;
// };

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<IProps> = ({ current }) => {
  // const [showConfig, setShowConfig] = useState<boolean>(false);
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [defaultSchema, setDefaultSchema] = useState<schemaType>({
    displayType: 'row',
    type: 'object',
    labelWidth: 120,
    properties: {},
    column: 1,
  });

  //const [selectedItem, setSelectedItem] = useState<XAttribute>();
  const {
    metadata: { rule },
  } = current;
  const formIns = useForm();
  const rules = rule ? JSON.parse(rule) : {};
  // 表单项选中事件
  // const itemClick = (item: any) => {
  //   setSelectedItem(item);
  //   //setShowConfig(true);
  // };
  const onFinished = () => {
    setEditFormOpen(false);
  };
  const onEditForm = () => {
    setDefaultSchema(currentToSchemaFun());
    setEditFormOpen(true);
  };
  const currentToSchemaFun = () => {
    //如果配置过
    if (rules && JSON.stringify(rules) !== '{}') {
      console.log('获取已保存的scame', current, rules.schema);
      return rules.schema;
    }
    //  else {
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
    // const { col } = rules;
    // schema.column = col === 24 ? 1 : col === 12 ? 2 : col === 8 ? 3 : 1;
    return schema;
    // }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div className={cls.content}>
        <div className={cls.head}>
          {rules.schema && (
            <Button
              type="primary"
              size="middle"
              onClick={onEditForm}
              className={cls.designButton}>
              表单设计
            </Button>
          )}
        </div>

        {rules.schema ? (
          <>
            <FormRender
              schema={rules.schema}
              form={formIns}
              widgets={{ number: InputNumber }}
            />
          </>
        ) : (
          <div className={cls.designWrap}>
            使用
            <Button
              type="primary"
              size="middle"
              onClick={onEditForm}
              className={cls.designButton}>
              表单设计器
            </Button>
            来定义你的表单
          </div>
        )}
      </div>
      {/* {showConfig && !current.isInherited && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setShowConfig(false);
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )} */}
      <FormEditModal
        current={current}
        defaultSchema={defaultSchema}
        finished={onFinished}
        editFormOpen={editFormOpen}
      />
    </div>
  );
};

export default Design;
