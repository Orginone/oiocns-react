import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import { IApplication, IWork } from '@/ts/core';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';
import { WorkDefineModel } from '@/ts/base/model';
import UploadItem from '../../tools/uploadItem';

interface Iprops {
  formType: string;
  current: IWork | IApplication;
  finished: () => void;
}

/*
  业务标准编辑模态框
*/
const WorkForm = ({ finished, formType, current }: Iprops) => {
  let title = '';
  const readonly = formType === 'remarkDir';
  let initialValue: any = current.metadata;
  switch (formType) {
    case 'newWork':
      title = '新建办事';
      initialValue = { shareId: current.directory.target.id };
      break;
    case 'updateWork':
      title = '更新办事';
      break;
    case 'remarkWork':
      title = '查看办事';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<WorkDefineModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'办事'}
            readonly={readonly}
            icon={current?.metadata?.icon || ''}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={current.directory}
          />
        );
      },
    },
    {
      title: '事项名称',
      readonly: readonly,
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '事项名称为必填项' }],
      },
    },
    {
      title: '事项编号',
      readonly: readonly,
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '事项编号为必填项' }],
      },
    },
    {
      title: '选择共享组织',
      readonly: readonly,
      dataIndex: 'shareId',
      valueType: 'select',
      formItemProps: { rules: [{ required: true, message: '请选择共享组织' }] },
      fieldProps: {
        options: [
          {
            label: current.directory.target.name,
            value: current.directory.target.id,
          },
        ],
      },
    },
    {
      title: '备注',
      readonly: readonly,
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '分类定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<model.WorkDefineModel>
      open
      key={'workDefineModal'}
      width={640}
      layoutType="ModalForm"
      initialValues={initialValue}
      title={title}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      onFinish={async (values: any) => {
        switch (formType) {
          case 'updateWork':
            await (current as IWork).update(values);
            break;
          case 'newWork':
            await (current as IApplication).createWork(values);
            break;
        }
        finished();
      }}
      columns={columns}
    />
  );
};

export default WorkForm;
