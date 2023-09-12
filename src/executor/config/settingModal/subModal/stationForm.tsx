import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IStation, ICompany } from '@/ts/core';
import { TargetModel } from '@/ts/base/model';
import UploadItem from '@/executor/tools/uploadItem';

interface IProps {
  current: ICompany | IStation;
  finished: (success: boolean) => void;
}
/*
  编辑
*/
const IdentityForm: React.FC<IProps> = ({ current, finished }) => {
  const isEdit = !('groups' in current);
  const columns: ProFormColumnsType<TargetModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'岗位'}
            icon={isEdit ? current.metadata.icon : ''}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={isEdit ? current.space.directory : current.directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
    {
      title: '简称',
      dataIndex: 'teamName',
    },
    {
      title: '标识',
      dataIndex: 'teamCode',
    },
    {
      title: '岗位简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '岗位简介为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<TargetModel>
      open
      title={isEdit ? '编辑岗位' : '新建岗位'}
      width={640}
      columns={columns}
      initialValues={isEdit ? current.metadata : {}}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished(false);
        }
      }}
      onFinish={async (values) => {
        if (isEdit) {
          await current.update(values);
        } else {
          await current.createStation(values);
        }
        finished(true);
      }}></SchemaForm>
  );
};

export default IdentityForm;
