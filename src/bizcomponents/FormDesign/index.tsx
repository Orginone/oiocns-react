import { Col, Row, Select } from 'antd';
import cls from './index.module.less';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ProForm, ProFormTreeSelect } from '@ant-design/pro-components';
import OperateItem from './OperateItem';
import CustomTree from '@/components/CustomTree';
import { IForm, IPropClass, SpeciesType } from '@/ts/core';
import { XAttribute, XProperty } from '@/ts/base/schema';
import { model } from '@/ts/base';
import AttributeConfig from './attributeConfig';

type IProps = {
  current: IForm;
};

type FormLayout = {
  layout: 'horizontal' | 'vertical';
  col: 8 | 12 | 24;
};

type TreeNode = {
  key: string;
  title: string;
  value: string;
  item: IPropClass | XProperty;
  children: TreeNode[];
  checkable: boolean;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<IProps> = ({ current }) => {
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
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [propertyTree, setPropertyTree] = useState<TreeNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<XAttribute>();
  const isInherited = current.species.isInherited;
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
    }
  };

  // 属性树
  function buildPropertyTree(props: IPropClass[]) {
    const treeNode: TreeNode[] = [];
    for (const prop of props) {
      const children: TreeNode[] = buildPropertyTree(
        prop.children.map((i) => i as IPropClass),
      );
      prop.propertys.forEach((item) => {
        children.push({
          key: item.id,
          title: item.name,
          value: item.id,
          item: item,
          children: [],
          checkable: true,
        });
      });
      treeNode.push({
        key: prop.metadata.id,
        title: prop.metadata.name,
        value: prop.metadata.id,
        item: prop,
        checkable: false,
        children: children,
      });
    }
    return treeNode;
  }

  const loadItems = () => {
    return current.attributes
      .sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      })
      .map((item) => {
        let propId = '0';
        if (item.linkPropertys && item.linkPropertys.length > 0) {
          propId = item.linkPropertys[0].id;
        }
        return (
          <Col span={formLayout.col} key={item.id}>
            {isInherited ? (
              <ProFormTreeSelect
                name={item.name}
                label={item.name}
                labelAlign="right"
                fieldProps={{
                  defaultValue: propId,
                  treeData: propertyTree,
                  multiple: false,
                  treeExpandedKeys: [propId],
                  onSelect: async (_, x) => {
                    await current.updateAttribute(item, x.item);
                    setSelectedItem(item);
                  },
                }}
              />
            ) : (
              <OperateItem
                item={item}
                belong={current.species.current.space}
                onClick={() => {
                  itemClick(item);
                }}
              />
            )}
          </Col>
        );
      });
  };

  useEffect(() => {
    const propClasses: IPropClass[] = [];
    for (const item of current.species.current.space.species) {
      switch (item.metadata.typeName) {
        case SpeciesType.Store:
          propClasses.push(item as IPropClass);
          break;
      }
    }
    setPropertyTree(buildPropertyTree(propClasses));
    setSelectKeys(
      current.attributes
        .filter((i) => i.propId && i.propId.length > 0)
        .map((i) => i.propId),
    );
  }, []);
  return (
    <div style={{ display: 'flex' }}>
      {!isInherited && (
        <div className={cls.sider}>
          <CustomTree
            checkable={true}
            defaultExpandAll={true}
            checkedKeys={selectKeys}
            onCheck={async (keys, info) => {
              setSelectKeys(keys as string[]);
              const prop = (info.node as any).item;
              if (info.checked) {
                await current.createAttribute(
                  {
                    name: prop.name,
                    code: prop.code,
                    rule: '{}',
                    remark: prop.remark,
                  } as model.AttributeModel,
                  prop,
                );
              } else {
                const attr = current.attributes.find((i) => i.propId === prop.id);
                if (attr) {
                  await current.deleteAttribute(attr);
                }
              }
            }}
            treeData={propertyTree}
          />
        </div>
      )}
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
      {showConfig && !isInherited && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setShowConfig(false);
          }}
          superAuth={current.species.current.space.superAuth!.metadata}
        />
      )}
    </div>
  );
};

export default Design;
