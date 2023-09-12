import SchemaForm from '@/components/SchemaForm';
import { ILink } from '@/ts/core/thing/link';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import { model } from '../../../../../ts/base';

interface IProps {
  link: ILink;
  current: model.RequestNode;
  finished: () => void;
}

const RequestForm: React.FC<IProps> = ({ link, current, finished }) => {
  const columns: ProFormColumnsType<model.RequestNode>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
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
    <SchemaForm<model.RequestNode>
      open
      title="请求定义"
      width={640}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      initialValues={current}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
          link.command.emitter('node', 'delete', current);
        }
      }}
      onFinish={async (values) => {
        const node = { ...current, ...values };
        await link.updNode(node);
        link.command.emitter('node', 'update', node);
        finished();
      }}
    />
  );
};

export default RequestForm;
