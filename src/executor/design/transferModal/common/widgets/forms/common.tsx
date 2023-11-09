import { ProFormColumnsType } from '@ant-design/pro-components';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

export const NameColumn: ProFormColumnsType<any> = {
  title: '名称',
  dataIndex: 'name',
  colProps: { span: 12 },
  formItemProps: {
    rules: [{ required: true, message: '名称为必填项' }],
  },
};

export const CodeColumn: ProFormColumnsType<any> = {
  title: '编码',
  dataIndex: 'code',
  colProps: { span: 12 },
  formItemProps: {
    rules: [{ required: true, message: '编码为必填项' }],
  },
};

export const PreScriptColumn: ProFormColumnsType<any> = {
  title: '前置脚本',
  dataIndex: 'preScript',
  colProps: { span: 24 },
  renderFormItem: (_, __, form) => {
    return (
      <CodeMirror
        value={form.getFieldValue('preScript')}
        height={'100px'}
        extensions={[javascript()]}
        onChange={(code: string) => {
          form.setFieldValue('preScript', code);
        }}
      />
    );
  },
};

export const PostScriptColumn: ProFormColumnsType<any> = {
  title: '后置脚本',
  dataIndex: 'postScript',
  colProps: { span: 24 },
  renderFormItem: (_, __, form) => {
    return (
      <CodeMirror
        value={form.getFieldValue('postScript')}
        height={'100px'}
        extensions={[javascript()]}
        onChange={(code: string) => {
          form.setFieldValue('postScript', code);
        }}
      />
    );
  },
};

export const RemarkColumn: ProFormColumnsType<any> = {
  title: '备注',
  dataIndex: 'remark',
  valueType: 'textarea',
  colProps: { span: 24 },
};
