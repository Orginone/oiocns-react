import { useState, useEffect } from 'react';
import { Button, InputNumber } from 'antd';
import cls from './index.module.less';
import React from 'react';
import { IForm } from '@/ts/core';
import FormEditModal from '@/components/Common/FormEdit';
import { loadWidgetsOpts } from './schemaRule';
import { schemaType } from '@/ts/base/schema';
import FormRender from '@/components/Common/FormEdit/FormRender';
import { useForm } from 'form-render';
import { sortObjByKeys } from '@/utils';
import { deepClone } from '@/ts/base/common';

type IProps = {
  current: IForm;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<IProps> = ({ current }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // 默认schema
  const defaultFormSchema: schemaType = {
    displayType: 'row',
    type: 'object',
    labelWidth: 120,
    properties: {},
    column: 1,
  };
  // FormRender实例
  const formIns = useForm();
  // 表单schema
  const [formSchema, setFormSchema] = useState<schemaType>(defaultFormSchema);
  /**
   * 获取表单的schema
   */
  const getCurFormSchema = async (): Promise<schemaType> => {
    // 加载最新的fields
    await current.loadFields(true);
    const rules = current.metadata.rule ? JSON.parse(current.metadata.rule) : {};
    // 配置过的取之前配置的schema作为基础schema，否则取默认的schema
    const schema: schemaType = rules?.schema || deepClone(defaultFormSchema);
    // 之前已存properties
    const preProperties = rules?.schema?.properties || {};
    const prePropertySortIds = Object.keys(preProperties);
    // 为兼容之前可能在表单schema配置有布局等非特性组件，特定义此变量使用
    console.log(current.fields);
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
    console.log('current', current);
    // console.log('schema', schema);
    return schema;
  };
  // 根据schema
  const updateSchema = async () => {
    setFormSchema(await getCurFormSchema());
  };
  // 开始编辑（因初始化已执行过获取最新schema，因此开启编辑只是打开即可）
  const onEditForm = () => {
    setIsEditModalOpen(true);
  };
  // 初始化执行一次获取schema，用于渲染
  useEffect(() => {
    updateSchema();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className={cls.content}>
        <div className={cls.head}>
          {
            <Button
              type="primary"
              size="middle"
              onClick={onEditForm}
              className={cls.designButton}>
              表单设计
            </Button>
          }
        </div>
        {formSchema ? (
          <FormRender
            schema={formSchema}
            form={formIns}
            widgets={{ number: InputNumber }}
          />
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
        formSchema={formSchema}
        updateSchema={updateSchema}
        getCurFormSchema={getCurFormSchema}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
      />
    </div>
  );
};

export default Design;
