import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { Input, message } from 'antd';
import React, { useEffect, useRef } from 'react';
import {
  CodeColumn,
  NameColumn,
  PostScriptColumn,
  PreScriptColumn,
  RemarkColumn,
} from './common';

interface IProps {
  transfer: ITransfer;
  current: model.SubTransfer;
  finished: () => void;
}

export const SubTransferForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const form = useRef<ProFormInstance>();
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'data' && cmd == 'fileCollect') {
        const { prop, files } = args;
        if (files && files.length > 0) {
          const meta = files[0].metadata;
          transfer.loadTransfers([meta.id]).then(() => {
            form.current?.setFieldValue(prop, meta.id);
          });
        }
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  });
  const columns: ProFormColumnsType<model.SubTransfer>[] = [
    NameColumn,
    CodeColumn,
    {
      title: '绑定子图',
      dataIndex: 'transferId',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '子图为必填项' }],
      },
      renderFormItem: (_, __, form) => {
        const item = transfer.transfers[form.getFieldValue('transferId')];
        return (
          <Input
            value={item?.name}
            onClick={() => {
              transfer.command.emitter('data', 'file', {
                prop: 'transferId',
                accepts: ['迁移配置'],
              });
            }}
          />
        );
      },
    },
    {
      title: '是否自循环',
      dataIndex: 'isSelfCirculation',
      colProps: { span: 12 },
      valueType: 'switch',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '循环退出判断',
      dataIndex: 'judge',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <CodeMirror
            value={form.current?.getFieldValue('judge')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              form.current?.setFieldValue('judge', code);
            }}
          />
        );
      },
    },
    PreScriptColumn,
    PostScriptColumn,
    RemarkColumn,
  ];
  return (
    <SchemaForm<model.SubTransfer>
      open
      formRef={form}
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
        const combine = { ...current, ...values };
        if (await transfer.hasRefLoop(combine)) {
          message.error('子图存在循环引用！');
        } else if (combine.isSelfCirculation && !combine.judge) {
          message.error('自循环节点必须填写退出判断！');
        } else {
          Object.assign(current, values);
          finished();
        }
      }}
    />
  );
};

export default SubTransferForm;
