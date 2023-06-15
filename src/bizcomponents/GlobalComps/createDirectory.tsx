import React, { useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { DirectoryModel, FileItemShare } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: IDirectory | undefined) => void;
  current: IDirectory;
}
/*
  编辑
*/
const CreateDirectoryModal = (props: Iprops) => {
  const [avatar, setAvatar] = useState<FileItemShare>();
  if (!props.open) return <></>;
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
      if (file) {
        const result = await orgCtrl.user.directory.createFile(file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<DirectoryModel>[] = [
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
      title: '制定组织',
      dataIndex: 'shareId',
      valueType: 'select',
      hideInForm: true,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      fieldProps: {
        options: [
          {
            value: props.current.target.id,
            label: props.current.target.name,
          },
        ],
      },
    },
    {
      title: '定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '目录定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<DirectoryModel>
      title={
        props.title.includes('编辑') ? `编辑[${props.current.name}]类别` : props.title
      }
      columns={columns}
      open={props.open}
      width={640}
      initialValues={
        props.title.includes('编辑')
          ? props.current.metadata
          : {
              shareId: props.current.target.id,
            }
      }
      onOpenChange={(open: boolean) => {
        if (open) {
          if (props.title.includes('编辑')) {
            setAvatar(parseAvatar(props.current.metadata.icon));
          }
        } else {
          setAvatar(undefined);
          props.handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        values.icon = JSON.stringify(avatar);
        if (props.title.includes('编辑')) {
          await props.current.update(values);
          props.handleOk(props.current);
        } else {
          props.handleOk(await props.current.create(values));
        }
      }}></SchemaForm>
  );
};

export default CreateDirectoryModal;
