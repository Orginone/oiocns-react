import SchemaForm from '@/components/SchemaForm';
import { Transfer } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { ITransfer } from '@/ts/core/';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface IProps {
  formType: string;
  current: IDirectory | ITransfer;
  finished: (link?: ITransfer) => void;
}

const TransferForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  switch (formType) {
    case 'updateTransferConfig':
      initialValue = current.metadata;
      break;
  }
  const formRef = createRef<ProFormInstance>();
  const columns: ProFormColumnsType<Transfer>[] = [
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
      title: '是否自循环',
      dataIndex: 'isSelfCirculation',
      valueType: 'switch',
      initialValue: false,
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
            value={formRef.current?.getFieldValue('judge')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              formRef.current?.setFieldValue('judge', code);
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
    <SchemaForm<Transfer>
      formRef={formRef}
      open
      title="迁移配置定义"
      width={640}
      columns={columns}
      initialValues={initialValue}
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
        switch (formType) {
          case 'newTransferConfig': {
            values.typeName = '迁移配置';
            let directory = current as IDirectory;
            let request = await directory.createTransfer(values);
            finished(request as ITransfer);
            break;
          }
          case 'updateTransferConfig': {
            let transfer = current as ITransfer;
            transfer.update({ ...initialValue, ...values });
            finished(transfer);
            break;
          }
        }
      }}
    />
  );
};

export default TransferForm;
