import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { createRef, useEffect, useState } from 'react';
import { MenuItem, loadApplicationsMenu, loadDirs, loadFormsMenu } from '../menus';

interface IProps {
  transfer: ITransfer;
  current: model.Store;
  finished: () => void;
}

const getDirTrees = (transfer: ITransfer): MenuItem[] => {
  const tree = [
    loadDirs(transfer.directory.target.directory, (item) => (item.selectable = true)),
  ];
  return tree;
};

const getWorkTrees = (transfer: ITransfer): MenuItem[] => {
  const tree = [loadApplicationsMenu(transfer.directory.target.directory)];
  return tree;
};

const getFormTrees = (transfer: ITransfer): MenuItem[] => {
  const tree = [loadFormsMenu(transfer.directory.target.directory)];
  return tree;
};

export const StoreForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const formRef = createRef<ProFormInstance>();
  const [notInit, setNotInit] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<MenuItem[]>(getDirTrees(transfer));
  const [workTree, setWorkTree] = useState<MenuItem[]>([]);
  const [formTree, setFormTree] = useState<MenuItem[]>(getFormTrees(transfer));
  useEffect(() => {
    if (notInit) {
      transfer.directory.target.directory.loadAllApplication().then(async (apps) => {
        for (let app of apps) {
          await app.loadWorks();
        }
        setWorkTree(getWorkTrees(transfer));
        setNotInit(false);
      });
    }
  });
  const columns: ProFormColumnsType<model.Store>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '存储目录',
      dataIndex: 'directoryId',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
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
            setTreeData(getDirTrees(transfer));
          }
        },
        treeNodeFilterProp: 'label',
        treeData: treeData,
      },
    },
    {
      title: '应用（办事）',
      dataIndex: 'workId',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '应用（办事）为必填项' }],
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
            setWorkTree(getWorkTrees(transfer));
          }
        },
        treeNodeFilterProp: 'label',
        treeData: workTree,
      },
    },
    {
      title: '绑定表单',
      dataIndex: 'formIds',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
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
            setFormTree(getFormTrees(transfer));
          }
        },
        multiple: true,
        treeNodeFilterProp: 'label',
        treeData: formTree,
      },
    },
    {
      title: '是否直接存入平台',
      dataIndex: 'directIs',
      valueType: 'switch',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<model.Store>
      ref={formRef}
      open
      title="存储配置"
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
