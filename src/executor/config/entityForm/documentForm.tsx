import SchemaForm from '@/components/SchemaForm';
import { documentType } from '@/ts/base/model';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import { IDirectory } from '@/ts/core';
interface IProps {
  formType: string;
  current: IDirectory;
  finished: () => void;
}

const CodeBuildForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  const columns: ProFormColumnsType<documentType>[] = [
    {
      title: '文件名称',
      dataIndex: 'name',
      colProps: { span: 24 },
      formItemProps() {
        return {
          rules: [{ required: true, message: '文件名称' }],
        };
      },
      fieldProps: {
        placeholder: '文件名称',
      },
    },
  ];
  return (
    <SchemaForm<documentType>
      open
      title="新建文档"
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
        const blob = new Blob(['<p></p>'], { type: 'text/plain' });
        const file = new window.File([blob], values.name + '.md');
        let directory = current;
        console.log(directory);
        await directory.createFile(file);
        finished();
      }}
    />
  );
};

export default CodeBuildForm;
