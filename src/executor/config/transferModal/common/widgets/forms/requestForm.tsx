import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useRef } from 'react';

interface IProps {
  transfer: ITransfer;
  current: model.Request;
  finished: () => void;
}

export const RequestForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const formRef = useRef<ProFormInstance>();
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
  const columns: ProFormColumnsType<model.Request>[] = [
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
    <SchemaForm<model.Request>
      open
      formRef={formRef}
      title="请求定义"
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
        await transfer.updNode(node);
        finished();
      }}
    />
  );
};
