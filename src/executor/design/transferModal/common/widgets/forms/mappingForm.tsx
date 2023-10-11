import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { IDirectory, ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { createRef, useState } from 'react';
import { MenuItem, expand, loadFormsMenu } from '../menus';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  finished: () => void;
}

const getExpandKeys = (treeData: MenuItem[]) => {
  return expand(treeData, ['事项配置', '实体配置']);
};

const MappingForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const formRef = createRef<ProFormInstance>();
  const [treeData, setTreeData] = useState<MenuItem[]>([
    loadFormsMenu(transfer.directory),
  ]);
  const selector = (
    title: string,
    dataIndex: string,
  ): ProFormColumnsType<model.Mapping> => {
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
            let forms = await (node.item as IDirectory).standard.forms;
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
  const columns: ProFormColumnsType<model.Mapping>[] = [
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
    selector('源表单', 'source'),
    selector('目标表单', 'target'),
    {
      title: '前置脚本',
      dataIndex: 'preScripts',
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
    <SchemaForm<model.Mapping>
      formRef={formRef}
      open
      title="映射定义"
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
