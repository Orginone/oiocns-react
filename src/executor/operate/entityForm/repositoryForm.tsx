import React from 'react';
import { IEntity } from '@/ts/core';
import { schema, kernel } from '@/ts/base';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IDirectory } from '@/ts/core';
import { message } from 'antd';

interface IProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

/*
  新建仓库弹出框
*/
const repositoryForm: React.FC<IProps> = ({ cmd, entity, finished }) => {
  const columns: ProFormColumnsType<schema.XDirectory>[] = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      readonly: false,
      formItemProps: {
        rules: [{ required: true, message: '仓库名称为必填项' }],
      },
    },
    {
      title: '仓库描述',
      dataIndex: 'remark',
      valueType: 'textarea',
      readonly: false,
      colProps: { span: 24 },
    },
  ];

  return (
    <SchemaForm
      open
      title={'新建仓库'}
      width={640}
      columns={columns}
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
        values.typeName = '代码仓库配置';
        let directory = entity as IDirectory;
        try {
          await directory.standard.createRepository(values);
        } catch (error) {
          message.error('创建仓库失败或仓库已存在');
        }
        finished();
      }}></SchemaForm>
  );
};

export default repositoryForm;
