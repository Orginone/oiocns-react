import { IDirectory, IForm, IProperty } from '@/ts/core';
import { XAttribute, XProperty } from '@/ts/base/schema';
import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { ImCheckmark, ImCross } from 'react-icons/im';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
interface IProps {
  attr: XAttribute;
  form: IForm;
  modalType: string;
  onFinish: () => void;
}

type TreeNode = {
  key: string;
  title: string;
  value: string;
  item: IDirectory | IProperty;
  children: TreeNode[];
};

const PropertyConfig = (props: IProps) => {
  const [selectedItem, setSelectedItem] = useState<any>();
  const [propertyTree, setPropertyTree] = useState<TreeNode[]>([]);
  // 属性树
  function buildPropertyTree(classes: IDirectory[]) {
    const treeNode: TreeNode[] = [];
    for (const prop of classes) {
      const children: TreeNode[] = buildPropertyTree(
        prop.children.map((i) => i as IDirectory),
      );
      if (props.modalType === '关联属性') {
        prop.propertys.forEach((item) => {
          children.push({
            key: item.id,
            title: item.name,
            value: item.id,
            item: item,
            children: [],
          });
        });
      }
      treeNode.push({
        key: prop.id,
        title: prop.name,
        value: prop.id,
        item: prop,
        children: children,
      });
    }
    return treeNode;
  }
  useEffect(() => {
    setPropertyTree(buildPropertyTree([props.form.directory.target.space.directory]));
  }, []);
  return (
    <Card
      title="属性选择框"
      className={cls.attrConfig}
      extra={[
        <Typography.Link
          key={'111'}
          onClick={async () => {
            if (props.modalType === '复制属性') {
              if (props.attr.property) {
                const property = await (selectedItem as IDirectory).createProperty({
                  ...props.attr.property,
                  sourceId: props.attr.belongId,
                });
                if (property) {
                  await props.form.updateAttribute(props.attr, property.metadata);
                }
              }
            } else {
              await props.form.updateAttribute(props.attr, selectedItem as XProperty);
            }
            props.onFinish.apply(this, []);
          }}
        >
          {selectedItem && <ImCheckmark fontSize={20} style={{ marginRight: 20 }} />}
        </Typography.Link>,
        <Typography.Link key={'222'} onClick={props.onFinish}>
          <ImCross fontSize={18} />
        </Typography.Link>,
      ]}
    >
      <CustomTree
        defaultExpandAll={true}
        onSelect={(_, info) => {
          const data = (info.node as any).item;
          if ('propertys' in data) {
            if ('复制属性' === props.modalType) {
              setSelectedItem(data);
            } else {
              setSelectedItem(undefined);
            }
          } else {
            setSelectedItem(data);
          }
        }}
        treeData={propertyTree}
      />
    </Card>
  );
};

export default PropertyConfig;
