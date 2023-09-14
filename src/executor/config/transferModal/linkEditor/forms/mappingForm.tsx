import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { IDirectory } from '@/ts/core';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { MenuItem, expand, loadFormsMenu } from '../..';

interface IProps {
  transfer: ITransfer;
  current: model.MappingNode;
  finished: () => void;
}

const getExpandKeys = (treeData: MenuItem[]) => {
  return expand(treeData, ['事项配置', '实体配置']);
};

const MappingForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const formRef = useRef<ProFormInstance>();
  const [treeData, setTreeData] = useState<MenuItem[]>([
    loadFormsMenu(transfer.directory),
  ]);
  const selector = (
    title: string,
    dataIndex: string,
  ): ProFormColumnsType<model.MappingNode> => {
    return {
      title: title,
      dataIndex: dataIndex,
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: title + '为必填项' }],
      },
      fieldProps: {
        fieldNames: {
          label: 'label',
          value: 'key',
          children: 'children',
        },
        showSearch: true,
        loadData: async (node: MenuItem): Promise<void> => {
          if (!node.isLeaf) {
            let forms = await (node.item as IDirectory).forms;
            if (forms.length > 0) {
              setTreeData([loadFormsMenu(transfer.directory)]);
            }
          }
        },
        treeNodeFilterProp: 'label',
        treeDefaultExpandedKeys: getExpandKeys(treeData),
        treeData: treeData,
      },
    };
  };
  const columns: ProFormColumnsType<model.MappingNode>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
  ];
  columns.push(selector('源表单', 'source'), selector('目标表单', 'target'));
  columns.push({
    title: '备注',
    dataIndex: 'remark',
    valueType: 'textarea',
    colProps: { span: 24 },
  });
  return (
    <SchemaForm<model.MappingNode>
      ref={formRef}
      open
      title="映射配置"
      width={640}
      columns={columns}
      initialValues={current}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        await transfer.updNode({ ...current, ...values });
        finished();
      }}
    />
  );
};

export { MappingForm };
