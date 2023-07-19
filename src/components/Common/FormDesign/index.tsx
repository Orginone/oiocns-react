import { Col, Row, Select } from 'antd';
import cls from './index.module.less';
import React from 'react';
import { useState } from 'react';
import { ProForm } from '@ant-design/pro-components';
import OperateItem from './OperateItem';
import { IForm } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';
import AttributeConfig from './attributeConfig';
import useObjectUpdate from '@/hooks/useObjectUpdate';

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

  return (
    <div style={{ display: 'flex' }}>
      <div className={cls.content}>
        <div className={cls.head}>
          <label style={{ padding: '6px' }}>整体布局：</label>
          <Select
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
          />
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
    </div>
  );
};

export default Design;
