import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { IApplication, IWork } from '@/ts/core';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';
import { WorkDefineModel } from '@/ts/base/model';
import UploadItem from '../../tools/uploadItem';

interface Iprops {
  open: boolean;
  application: IApplication;
  current?: IWork;
  handleOk: (success: boolean) => void;
  handleCancel: () => void;
}

/*
  业务标准编辑模态框
*/
const WorkModal = ({ open, handleOk, handleCancel, application, current }: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<WorkDefineModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'应用'}
            icon={current?.metadata?.icon || ''}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={application.directory}
          />
        );
      },
    },
    {
      title: '事项名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '事项名称为必填项' }],
      },
    },
    {
      title: '事项编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '事项编号为必填项' }],
      },
    },
    {
      title: '选择共享组织',
      dataIndex: 'shareId',
      valueType: 'select',
      formItemProps: { rules: [{ required: true, message: '请选择共享组织' }] },
      fieldProps: {
        options: application.directory.target.space.shareTarget.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        }),
      },
    },
    {
      title: '允许新增实体',
      dataIndex: 'allowAdd',
      valueType: 'switch',
      initialValue: true,
    },
    {
      title: '允许变更实体',
      dataIndex: 'allowEdit',
      valueType: 'switch',
      initialValue: true,
    },
    {
      title: '允许选择实体',
      dataIndex: 'allowSelect',
      valueType: 'switch',
      initialValue: true,
    },
    {
      title: '备注',
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
      key={'workDefineModal'}
      formRef={formRef}
      open={open}
      width={640}
      layoutType="ModalForm"
      title={current ? `编辑[${current.name}]办事` : '新建办事'}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            formRef.current?.setFieldsValue(current.metadata);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      onFinish={async (model: any) => {
        model.rule = JSON.stringify({
          allowAdd: model.allowAdd,
          allowEdit: model.allowEdit,
          allowSelect: model.allowSelect,
        });
        if (current) {
          handleOk(await current.updateDefine(model));
        } else {
          handleOk((await application.createWork(model)) != undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default WorkModal;
