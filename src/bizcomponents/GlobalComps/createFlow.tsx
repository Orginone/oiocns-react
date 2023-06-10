import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { Avatar, Button, Space, Upload, UploadProps, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import { IWorkDefine, IFlowClass } from '@/ts/core';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';
import { FileItemShare, WorkDefineModel } from '@/ts/base/model';
import { AiOutlineBank } from 'react-icons/ai';
import orgCtrl from '@/ts/controller';

interface Iprops {
  open: boolean;
  current?: IWorkDefine;
  workItem: IFlowClass;
  handleOk: (success: boolean) => void;
  handleCancel: () => void;
}

/*
  业务标准编辑模态框
*/
const WorkDefineModal = ({ open, handleOk, handleCancel, workItem, current }: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<FileItemShare>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
    },
    async customRequest(options) {
      const file = options.file as File;
      const docDir = await orgCtrl.user.filesys?.home?.create('头像');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<WorkDefineModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <Space>
            <Avatar
              size={64}
              style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
              src={
                avatar ? (
                  <Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />
                ) : (
                  <AiOutlineBank style={{ fontSize: 16 }} />
                )
              }
            />
            <Upload {...uploadProps}>
              <Button type="link">上传图标</Button>
            </Upload>
            {avatar ? (
              <Button type="link" onClick={() => setAvatar(undefined)}>
                清除图标
              </Button>
            ) : (
              ''
            )}
          </Space>
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
      initialValues={current?.metadata || {}}
      title={current ? `编辑[${current.name}]办事` : '新建办事'}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            setAvatar(current.share.avatar);
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
          model.icon = JSON.stringify(avatar);
          handleOk(await current.updateDefine(model));
        } else {
          handleOk((await workItem.createWorkDefine(model)) != undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default WorkDefineModal;
