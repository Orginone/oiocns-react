import React, { useState } from 'react';
import SchemaForm from '@/components/SchemaForm';
import { DictModel, FileItemShare } from '@/ts/base/model';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { IBelong, IDict } from '@/ts/core';
import { Avatar, Button, Space, Image, Upload, message, UploadProps } from 'antd';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';
import orgCtrl from '@/ts/controller';

interface Iprops {
  title: string;
  open: boolean;
  space: IBelong;
  dict: IDict | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}
/*
  特性编辑模态框
*/
const DictModal = (props: Iprops) => {
  if (!props.open) return <></>;
  const { title, open, dict, handleCancel, handleOk } = props;
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
  const columns: ProFormColumnsType<DictModel>[] = [
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
      title: '字典名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典名称为必填项' }],
      },
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '字典代码为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<DictModel>
      title={title + '字典'}
      open={open}
      width={640}
      layoutType="ModalForm"
      initialValues={dict?.metadata || {}}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (dict) {
            setAvatar(parseAvatar(dict.metadata.icon));
          }
        } else {
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      onFinish={async (values) => {
        values.icon = JSON.stringify(avatar);
        if (title.includes('新增')) {
          handleOk((await props.space.createDict(values)) !== undefined);
        } else if (dict) {
          handleOk(await dict.update(values));
        }
      }}
      columns={columns}
    />
  );
};

export default DictModal;
