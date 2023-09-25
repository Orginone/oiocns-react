import { useState, useEffect } from 'react';
import React from 'react';
import { IForm } from '@/ts/core';
import FormEditModal from '@/components/Common/FormEdit';
import { loadWidgetsOpts } from './schemaRule';
import { SchemaType } from '@/ts/base/model';
import { sortObjByKeys } from '@/utils';
import { deepClone } from '@/ts/base/common';

type IProps = {
  current: IForm;
  isOpen: boolean;
  setIsOpen: (ble: boolean) => void;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<IProps> = ({ current, isOpen, setIsOpen }) => {
  // 默认schema
  const defaultFormSchema: SchemaType = {
    displayType: 'row',
    type: 'object',
    labelWidth: 120,
    properties: {},
    column: 1,
  };

  const [formSchema, setFormSchema] = useState<SchemaType>(defaultFormSchema);
  /**
   * 获取表单的schema
   */
  const getCurFormSchema = async (): Promise<SchemaType> => {
    const rules = current.metadata.rule ? JSON.parse(current.metadata.rule) : {};
    // 配置过的取之前配置的schema作为基础schema，否则取默认的schema
    const schema: SchemaType = rules?.schema || deepClone(defaultFormSchema);
    // 之前已存properties
    const preProperties = rules?.schema?.properties || {};
    const prePropertySortIds = Object.keys(preProperties);
    // 为兼容之前可能在表单schema配置有布局等非特性组件，特定义此变量使用
    const useFields = [
      ...current.fields,
      ...prePropertySortIds.filter((id) => isNaN(+id)).map((item) => ({ id: item })),
    ];
    // 组装待用properties
    const tplProperties: Record<string, object> = useFields.reduce((pre, cur: any) => {
      const { valueType, id } = cur;
      // 非特性组件
      if (isNaN(+id)) {
        return {
          ...pre,
          [id]: preProperties?.[id],
        };
      } else {
        let title, type, widget, format, enums, enumNames;
        title = cur.name;
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
        if (['选择型', '分类型'].includes(valueType)) {
          enums = cur.lookups.map((item: { value: any }) => item.value);
          enumNames = cur.lookups.map((item: { text: any }) => item.text);
        }
        return {
          ...pre,
          [id]: preProperties?.[id] || {
            title,
            type,
            widget,
            enum: enums,
            enumNames,
            format,
            valueType,
          },
        };
      }
    }, {});
    // 最终使用的properties
    const useProperties = sortObjByKeys<Record<string, object>>(
      tplProperties,
      prePropertySortIds,
    );
    // 布局等非特性组件（可能会嵌套特性，需要从外层删除对应特性回显）
    Object.keys(useProperties).forEach((id) => {
      if (isNaN(+id) && (useProperties[id] as any)?.properties) {
        // 可能是嵌套有特性的布局组件，如果对应特性已删除，其内部特性也需要删除
        Object.keys((useProperties[id] as any).properties).forEach(
          (key) => delete useProperties[key],
        );
      }
    });
    schema.properties = useProperties as Record<string, object>;
    return schema;
  };
  // 根据schema
  const updateSchema = async () => {
    setFormSchema(await getCurFormSchema());
  };
  // 初始化执行一次获取schema，用于渲染
  useEffect(() => {
    updateSchema();
  }, []);

  return (
    <FormEditModal
      current={current}
      formSchema={formSchema}
      updateSchema={updateSchema}
      getCurFormSchema={getCurFormSchema}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default Design;
