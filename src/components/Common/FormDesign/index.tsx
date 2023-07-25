import { Col, Row, Button, Select } from 'antd';
import cls from './index.module.less';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ProForm } from '@ant-design/pro-components';
import OperateItem from './OperateItem';
import { IForm } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';
import AttributeConfig from './attributeConfig';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import FormEditModal from '@/components/Common/FormDesign/FormEdit';
import { Rule } from 'antd/es/form';
import { loadWidgetsOpts } from './schemaRule';
import {
  schemaType
} from '@/ts/base/schema';
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
  const [defaultSchema, setDefaultSchema] = useState<schemaType>(
    {
      displayType: 'row',
      type: 'object',
      labelWidth: 120,
      properties: {},
      column: 1,
    }
  )
  //const [defaultValue, setDefaultValue] = useState({});
  const [formLayout, setFormLayout] = useState<FormLayout>(
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

  // 布局改变
  const layoutChange = (value: any) => {
    const newFormLayout = { ...formLayout, ...value };
    setFormLayout(newFormLayout);
    current.metadata.rule = current.metadata.rule || '{}';
    console.log("1", current.metadata)
    console.log("2", current.metadata)
    console.log('3', newFormLayout)
    current.update({
      ...current.metadata,
      rule: JSON.stringify({
        ...JSON.parse(current.metadata.rule),
        ...newFormLayout,
      }),
    });
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
    setEditFormOpen(false)
  }
  const onEditForm = () => {
    setDefaultSchema(currentToSchemaFun(current))

    // if (current.metadata.rule && JSON.parse(current?.metadata?.rule).schema) {
    //   let schema = JSON.parse(current?.metadata?.rule).schema;
    //   setDefaultSchema(schema)
    // } else {
    //   setDefaultSchema(currentToSchemaFun(current))
    // }

    setEditFormOpen(true)
  }
  const getType = (type: string) => {
    switch (type) {
      case 'string':
        return 'string'
        break

    }
  };

  const currentToSchemaFun = (currentValue: IForm) => {
    const { metadata: { rule } } = currentValue;
    const rules = rule ? JSON.parse(rule) : {};
    if(rules){
      return rules.schema;
    }else{
      const schema: schemaType = {
        displayType: 'row',
        type: 'object',
        properties: {},
        labelWidth: 120,
        column: 1,
      };
      let result = current.attributes.reduce((result, item: any) => {
        const rule = JSON.parse(item.rule || '{}');
        // 规则校验
        let rules: Rule[] = [];
        if (rule.rules ) {
          if (typeof rule.rules === 'string') {
            rules = [...rules, { message: '所填内容不符合要求', pattern: rule.rules }];
          } else if (rule.rules instanceof Array) {
            for (const r of rule.rules) {
              rules = [...rules, { message: '所填内容不符合要求', pattern: r }];
            }
          }
        }
        if (rule.required === true) {
          rules = [...rules, { required: true, message: `${rule.title}为必填项` }];
        }
       
        if (!rule.widget) {
          rule.widget = loadWidgetsOpts(item.property!.valueType)[0].value;
          console.log("@@",rule.widget)
        }
        
        return {
          ...result,
          [item.property!.info]: {
            title: item.name,
            type: rule.widget === "text" ||  rule.widget === "datetime"?'string':rule.widget,
            widget:rule.widget,
            "format":rule.widget === "datetime"? "date":"",
            ...item
          }
        }
      }, {})
  
      schema.properties = {
        ...result,
      };
  
      
      const { col } = rules;
      schema.column = col === 24 ? 1 : col === 12 ? 2 : col === 8 ? 3 : 1;
      return schema;
    }
   
  }
  return (
    <div style={{ display: 'flex' }}>

      <div className={cls.content}>
        <div className={cls.head}>
          <Button type="primary" size='middle' onClick={onEditForm} className={cls.designButton}>
            表单设计
          </Button>

          {/* <Select
            defaultValue={formLayout.col}
            style={{ width: '120px' }}
            options={[
              { value: 24, label: '一行一列' },
              { value: 12, label: '一行两列' },
              { value: 8, label: '一行三列' },
            ]}
            onChange={(value) => {
              layoutChange({ col: value });
            }}
          />
          <Select
            defaultValue={formLayout.layout}
            style={{ width: '80px' }}
            options={[
              { value: 'horizontal', label: '水平' },
              { value: 'vertical', label: '垂直' },
            ]}
            onChange={(value) => {
              layoutChange({ layout: value });
            }}
          /> */}
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
