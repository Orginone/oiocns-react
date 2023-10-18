import SchemaForm from '@/components/SchemaForm';
import ElementTreeManager from '@/executor/design/pageBuilder/core/ElementTreeManager';
import { schema } from '@/ts/base';
import { IDirectory } from '@/ts/core';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import { IPageTemplate } from '@/ts/core/thing/standard/page';

interface IProps {
  formType: string;
  current: IDirectory | IPageTemplate;
  finished: (template?: IPageTemplate) => void;
}

const PageTemplateForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  switch (formType) {
    case 'updatePageTemplate':
      initialValue = current.metadata;
      break;
  }
  const columns: ProFormColumnsType<schema.XPageTemplate>[] = [
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
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '备注为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<schema.XPageTemplate>
      open
      title="页面模板定义"
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
          case 'newPageTemplate': {
            values.typeName = '页面模板';
            values.rootElement = ElementTreeManager.createRoot();
            let directory = current as IDirectory;
            let request = await directory.standard.createTemplate(values);
            finished(request as IPageTemplate);
            break;
          }
          case 'updatePageTemplate': {
            let template = current as IPageTemplate;
            template.update({ ...initialValue, ...values });
            finished(template);
            break;
          }
        }
      }}
    />
  );
};

export default PageTemplateForm;
