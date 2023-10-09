import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import SchemaForm from '@/components/SchemaForm';
import { MenuItem, expand, loadTransfersMenu } from '../menus';
import { message } from 'antd';

interface IProps {
  transfer: ITransfer;
  current: model.SubTransfer;
  finished: () => void;
}

const getTransferTrees = (transfer: ITransfer): MenuItem[] => {
  const tree = [loadTransfersMenu(transfer.directory.target.directory)];
  return tree;
};

const getExpandKeys = (treeData: MenuItem[]) => {
  return expand(treeData, ['迁移配置']);
};

export const SubTransferForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const formRef = useRef<ProFormInstance>();
  const [transferTree, setTransferTree] = useState<MenuItem[]>(
    getTransferTrees(transfer),
  );
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'node' && cmd == 'update') {
        formRef.current?.setFieldsValue(args);
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  });
  const columns: ProFormColumnsType<model.SubTransfer>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '绑定子图',
      dataIndex: 'nextId',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '子图为必填项' }],
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
            setTransferTree(getTransferTrees(transfer));
          }
        },
        treeDefaultExpandedKeys: getExpandKeys(transferTree),
        treeNodeFilterProp: 'label',
        treeData: transferTree,
      },
    },
    {
      title: '前置脚本',
      dataIndex: 'preScripts',
      valueType: 'select',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <CodeMirror
            value={formRef.current?.getFieldValue('preScripts')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              formRef.current?.setFieldValue('preScripts', code);
            }}
          />
        );
      },
    },
    {
      title: '后置脚本',
      dataIndex: 'postScripts',
      valueType: 'select',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <CodeMirror
            value={formRef.current?.getFieldValue('postScripts')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              formRef.current?.setFieldValue('postScripts', code);
            }}
          />
        );
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
    <SchemaForm<model.SubTransfer>
      open
      formRef={formRef}
      title="子图定义"
      width={800}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      initialValues={current}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        const node = { ...current, ...values };
        if (node.nextId == transfer.id) {
          message.error('无法嵌入当前配置！');
          return;
        }
        await transfer.updNode(node);
        finished();
      }}
    />
  );
};

export default SubTransferForm;
