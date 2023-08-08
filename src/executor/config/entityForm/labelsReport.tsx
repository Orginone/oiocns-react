import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { FormModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import UploadItem from '../../tools/uploadItem';
import { IReport } from '@/ts/core/thing/report';
import { EntityColumns } from './entityColumns';

interface Iprops {
  formType: string;
  current: IDirectory | IReport;
  finished: () => void;
}
/*
  编辑
*/
const LabelsReport = (props: Iprops) => {
  let title = '';
  let directory: IDirectory;
  let report: IReport | undefined;
  const readonly = props.formType === 'remark';
  let initialValue: any = props.current.metadata;
  switch (props.formType) {
    case 'new':
      title = '新建报表';
      initialValue = {};
      directory = props.current as IDirectory;
      break;
    case 'update':
      report = props.current as IReport;
      directory = report.directory;
      title = '更新报表';
      break;
    case 'remark':
      report = props.current as IReport;
      directory = report.directory;
      title = '查看报表';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<FormModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            readonly={readonly}
            typeName={'报表'}
            icon={initialValue.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
  ];
  if (readonly) {
    columns.push(...EntityColumns(props.current!.metadata));
  }
  columns.push({
    title: '备注信息',
    dataIndex: 'remark',
    valueType: 'textarea',
    colProps: { span: 24 },
    readonly: readonly,
    formItemProps: {
      rules: [{ required: true, message: '备注信息为必填项' }],
    },
  });
  return (
    <SchemaForm<FormModel>
      open
      title={title}
      width={640}
      columns={columns}
      initialValues={initialValue}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          props.finished();
        }
      }}
      onFinish={async (values) => {
        values.typeName = '报表';
        switch (props.formType) {
          case 'update':
            await report!.update(values);
            break;
          case 'new':
            await directory.createReport(values);
            break;
        }
        props.finished();
      }}></SchemaForm>
  );
};

export default LabelsReport;
