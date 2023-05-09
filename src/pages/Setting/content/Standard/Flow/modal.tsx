import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { Avatar, Button, Space, Upload, UploadProps, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import { IFlowDefine, IWorkItem } from '@/ts/core';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';
import { FileItemShare, WorkDefineModel } from '@/ts/base/model';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';
import orgCtrl from '@/ts/controller';

interface Iprops {
  open: boolean;
  current?: IFlowDefine;
  item: IWorkItem;
  handleOk: () => void;
  handleCancel: () => void;
}

/*
  业务标准编辑模态框
*/
const WorkDefineModal = ({ open, handleOk, handleCancel, item, current }: Iprops) => {
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
      title: '是否创建实体',
      dataIndex: 'isCreate',
      valueType: 'select',
      colProps: { span: 24 },
      fieldProps: {
        options: [
          {
            value: true,
            label: '是',
          },
          {
            value: false,
            label: '否',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '是否创建实体为必填项' }],
      },
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
      title={`${current ? '编辑' : '新建'}办事`}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (current) {
            setAvatar(parseAvatar(current?.metadata.icon));
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
      onFinish={async (model) => {
        if (current) {
          model.id = current.metadata.id;
          if (await current.updateDefine(model)) {
            handleOk();
          }
        } else if ((await item.createWorkDefine(model)) != undefined) {
          handleOk();
        }
      }}
      columns={columns}
    />
  );
};

export default WorkDefineModal;
