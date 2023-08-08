import { Col, Row, Button } from 'antd';
import cls from './index.module.less';
import React from 'react';
import { useState } from 'react';
import { ProForm } from '@ant-design/pro-components';
import OperateItem from './OperateItem';
import { IForm } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';
import AttributeConfig from './attributeConfig';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import FormEditModal from '@/components/Common/FormDesign/FormEdit';
import { loadWidgetsOpts } from './schemaRule';
import { schemaType } from '@/ts/base/schema';
type IProps = {
  current: IForm;
};

type FormLayout = {
  layout: 'horizontal' | 'vertical';
  col: 8 | 12 | 24;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<IProps> = ({ current }) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [defaultSchema, setDefaultSchema] = useState<schemaType>({
    displayType: 'row',
    type: 'object',
    labelWidth: 120,
    properties: {},
    column: 1,
  });
  const [formLayout] = useState<FormLayout>(
    current.metadata.rule
      ? JSON.parse(current.metadata.rule)
      : {
          type: 'object',
          properties: {},
          labelWidth: 120,
          layout: 'horizontal',
          col: 12,
        },
  );
  const [selectedItem, setSelectedItem] = useState<XAttribute>();
  // 表单项选中事件
  const itemClick = (item: any) => {
    setSelectedItem(item);
    setShowConfig(true);
  };

  // 项配置改变
  const formValuesChange = (changedValues: any) => {
    if (selectedItem) {
      selectedItem.rule = selectedItem.rule || '{}';
      const rule = { ...JSON.parse(selectedItem.rule), ...changedValues };
      setSelectedItem({
        ...selectedItem,
        rule: JSON.stringify(rule),
      });
      current.updateAttribute({ ...selectedItem, ...rule, rule: JSON.stringify(rule) });
      tforceUpdate();
    }
  };

  const loadItems = () => {
    return current.attributes
      ?.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      })
      .map((item) => {
        return (
          <Col span={formLayout.col} key={item.id}>
            <OperateItem
              item={item}
              belong={current.directory.target.space}
              onClick={() => {
                itemClick(item);
              }}
            />
          </Col>
        );
      });
  };

  const onFinished = () => {
    setEditFormOpen(false);
  };
  const onEditForm = () => {
    setDefaultSchema(currentToSchemaFun(current));
    setEditFormOpen(true);
  };

  const currentToSchemaFun = (currentValue: IForm) => {
    const {
      metadata: { rule },
    } = currentValue;
    const rules = rule ? JSON.parse(rule) : {};

    //如果配置过
    if (rules && JSON.stringify(rules) !== '{}') {
      return rules.schema;
    } else {
      //没有配置过
      const schema: schemaType = {
        displayType: 'row',
        type: 'object',
        properties: {},
        labelWidth: 120,
        column: 1,
      };
      let result = current.attributes.reduce((result, item: any) => {
        const rule = JSON.parse(item.rule || '{}');
        if (!rule.type) {
          rule.type = loadWidgetsOpts(item.property!.valueType)[0].value;
        }
        //const title = item.name;
        let title, type, widget, format, enums, enumNames;
        title = item.name;
        type = loadWidgetsOpts(item.property!.valueType)[0].value;
        widget = loadWidgetsOpts(item.property!.valueType)[1].value;
        if (widget === 'textarea') {
          format = 'textarea';
          widget = '';
        }
        if (widget === 'dateTime') {
          format = 'dateTime';
          widget = null;
        }

        return {
          ...result,
          [item.property!.id]: {
            title,
            type,
            widget,
            enum: enums,
            enumNames,
            format,
          },
        };
      }, {});
      schema.properties = {
        ...result,
      };
      const { col } = rules;
      schema.column = col === 24 ? 1 : col === 12 ? 2 : col === 8 ? 3 : 1;
      return schema;
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div className={cls.content}>
        <div className={cls.head}>
          <Button
            type="primary"
            size="middle"
            onClick={onEditForm}
            className={cls.designButton}>
            表单设计
          </Button>
        </div>
        <ProForm
          key={tkey}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            resetButtonProps: {
              style: { display: 'none' },
            },
            submitButtonProps: {
              style: { display: 'none' },
            },
          }}
          layout={formLayout.layout}
          labelAlign="left"
          labelWrap={true}
          labelCol={{
            xs: { span: 10 },
            sm: { span: 10 },
          }}>
          <Row gutter={24}>{loadItems()}</Row>
        </ProForm>
      </div>
      {showConfig && !current.isInherited && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setShowConfig(false);
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )}
      <FormEditModal
        current={current}
        defaultSchema={defaultSchema}
        finished={onFinished}
        editFormOpen={editFormOpen}
        itemClick={(e: any) => {
          itemClick(e);
        }}
      />
    </div>
  );
};

export default Design;
